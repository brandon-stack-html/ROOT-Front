/* ============================================================================
   voice-parser.js — Parser transcripción → ítems del catálogo (Sprint 14)

   API pública (window.VoiceParser):
     parse(transcripcion)  → array de ítems candidatos

   Estructura de salida:
   [
     { sku, nombre, cantidad, precio, mods: [{tipo, valor}], confianza, noEncontrado }
   ]

   Confianza ≥ 0.6 → encontrado. < 0.6 → noEncontrado = true.
   ============================================================================ */
(function (global) {
  'use strict';

  // ── Catálogo de referencia ────────────────────────────────────────────────
  // Fuente de verdad para el fuzzy match. Incluye aliases para mejorar detección.
  var CATALOGO = [
    { sku: 'BPA-001', nombre: 'Bandeja Paisa',      precio: 32000, aliases: ['bandeja', 'paisa', 'bandeja paisa'] },
    { sku: 'AJB-001', nombre: 'Ajiaco Bogotano',    precio: 28000, aliases: ['ajiaco', 'bogotano', 'ajiaco bogotano'] },
    { sku: 'CHN-001', nombre: 'Changua',             precio: 12000, aliases: ['changua', 'caldo de changua'] },
    { sku: 'SOP-001', nombre: 'Sopa de Mondongo',   precio: 22000, aliases: ['mondongo', 'sopa mondongo', 'sopa de mondongo'] },
    { sku: 'SOB-001', nombre: 'Sobrebarriga',        precio: 34000, aliases: ['sobrebarriga', 'sobre barriga'] },
    { sku: 'SAN-001', nombre: 'Sancocho',            precio: 25000, aliases: ['sancocho', 'sancocho de gallina', 'gallina'] },
    { sku: 'LOM-001', nombre: 'Lomo al Trapo',      precio: 45000, aliases: ['lomo', 'lomo al trapo', 'lomo trapo'] },
    { sku: 'POL-001', nombre: 'Pollo a la Plancha', precio: 22000, aliases: ['pollo', 'plancha', 'pollo plancha'] },
    { sku: 'TRU-001', nombre: 'Trucha en Salsa',    precio: 38000, aliases: ['trucha', 'trucha salsa'] },
    { sku: 'COS-001', nombre: 'Costillas BBQ',      precio: 45000, aliases: ['costillas', 'bbq', 'costillas bbq', 'costilla'] },
    { sku: 'MEN-001', nombre: 'Menú del Día',        precio: 19500, aliases: ['menu', 'menu del dia', 'almuerzo', 'ejecutivo'] },
    { sku: 'LIM-001', nombre: 'Limonada Natural',   precio: 7500,  aliases: ['limonada', 'limonada natural', 'limon'] },
    { sku: 'JUG-001', nombre: 'Jugo Natural',        precio: 8000,  aliases: ['jugo', 'jugo natural', 'jugo mora', 'maracuya', 'mora', 'naranja', 'lulo'] },
    { sku: 'GAS-001', nombre: 'Gaseosa',             precio: 5000,  aliases: ['gaseosa', 'cola', 'postobón', 'postobon', 'coca', 'pepsi'] },
    { sku: 'AGA-001', nombre: 'Agua Panela',         precio: 4500,  aliases: ['agua panela', 'aguapanela', 'agua de panela'] },
    { sku: 'TIN-001', nombre: 'Café Tinto',          precio: 3500,  aliases: ['tinto', 'cafe', 'café', 'cafe tinto'] },
    { sku: 'VIN-001', nombre: 'Vino Tinto Copa',    precio: 22000, aliases: ['vino', 'vino tinto', 'copa de vino', 'copa'] },
    { sku: 'POA-001', nombre: 'Postre del Día',     precio: 9000,  aliases: ['postre', 'postre del dia', 'dulce'] },
  ];

  // ── Diccionario de números en palabras ────────────────────────────────────
  var NUMEROS = {
    un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
    media: 0.5, medio: 0.5,
  };

  // ── Normalizar texto ──────────────────────────────────────────────────────
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // quitar tildes
      .replace(/[^a-z0-9\s]/g, ' ')                    // quitar puntuación
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ── Reemplazar números en palabras por dígitos ────────────────────────────
  function tokenizarNumeros(texto) {
    var partes = texto.split(' ');
    return partes.map(function (p) {
      return NUMEROS[p] !== undefined ? String(NUMEROS[p]) : p;
    }).join(' ');
  }

  // ── Segmentar por separadores de ítems ────────────────────────────────────
  var SEPARADORES = /\s+(y|con|mas|tambien|ademas|,)\s+/g;

  function segmentar(texto) {
    return texto.split(SEPARADORES)
      .filter(function (s) { return s && !['y','con','mas','tambien','ademas',','].includes(s.trim()); })
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 1; });
  }

  // ── Levenshtein normalizado ───────────────────────────────────────────────
  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [i];
      for (var j = 1; j <= n; j++) {
        dp[i][j] = i === 0 ? j :
          (a[i-1] === b[j-1]
            ? dp[i-1][j-1]
            : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]));
      }
    }
    return dp[m][n];
  }

  function fuzzyScore(query, candidate) {
    if (!query || !candidate) return 0;
    // Coincidencia exacta → máxima confianza
    if (candidate === query) return 1;
    // Substring → alta confianza
    if (candidate.includes(query) || query.includes(candidate)) return 0.85;
    // Levenshtein normalizado
    var maxLen = Math.max(query.length, candidate.length);
    if (maxLen === 0) return 1;
    return 1 - levenshtein(query, candidate) / maxLen;
  }

  // ── Buscar producto en catálogo ───────────────────────────────────────────
  var UMBRAL_CONFIANZA = 0.6;

  function buscarProducto(frase) {
    var best = null;
    var bestScore = 0;

    CATALOGO.forEach(function (prod) {
      var candidatos = [normalizar(prod.nombre)].concat(prod.aliases.map(normalizar));
      candidatos.forEach(function (c) {
        var score = fuzzyScore(frase, c);
        if (score > bestScore) {
          bestScore = score;
          best = prod;
        }
      });
    });

    return { producto: bestScore >= UMBRAL_CONFIANZA ? best : null, confianza: bestScore };
  }

  // ── Extraer modificadores ─────────────────────────────────────────────────
  var MOD_PATTERNS = [
    { tipo: 'remover', regex: /\bsin\s+(el\s+|la\s+|los\s+|las\s+)?(\w+(?:\s+\w+)?)/g },
    { tipo: 'extra',   regex: /\bextra\s+(\w+(?:\s+\w+)?)/g },
    { tipo: 'extra',   regex: /\bdoble\s+(\w+(?:\s+\w+)?)/g },
    { tipo: 'agregar', regex: /\bcon\s+(\w+(?:\s+\w+)?)/g },
  ];

  function extraerMods(frase) {
    var mods = [];
    MOD_PATTERNS.forEach(function (pat) {
      var re = new RegExp(pat.regex.source, 'g');
      var m;
      while ((m = re.exec(frase)) !== null) {
        var valor = m[m.length - 1].trim();
        if (valor.length > 1) mods.push({ tipo: pat.tipo, valor: valor });
      }
    });
    return mods;
  }

  // ── Extraer cantidad de la frase ──────────────────────────────────────────
  function extraerCantidad(frase) {
    // Número al inicio: "2 bandejas" o "dos bandejas"
    var m = frase.match(/^(\d+(?:\.\d+)?)\s+/);
    if (m) return { cantidad: parseFloat(m[1]), resto: frase.slice(m[0].length).trim() };
    // Número al final (menos común)
    m = frase.match(/\s+(\d+(?:\.\d+)?)$/);
    if (m) return { cantidad: parseFloat(m[1]), resto: frase.slice(0, -m[0].length).trim() };
    return { cantidad: 1, resto: frase };
  }

  // ── Parser principal ──────────────────────────────────────────────────────
  function parse(transcripcion) {
    if (!transcripcion || !transcripcion.trim()) return [];

    var normalizado = normalizar(transcripcion);
    var conNumeros  = tokenizarNumeros(normalizado);
    var frases      = segmentar(conNumeros);

    return frases.map(function (frase) {
      var ext      = extraerCantidad(frase);
      var cantidad = ext.cantidad;
      var resto    = ext.resto;

      var mods     = extraerMods(resto);
      var match    = buscarProducto(resto);

      if (match.producto) {
        return {
          sku:          match.producto.sku,
          nombre:       match.producto.nombre,
          cantidad:     cantidad,
          precio:       match.producto.precio,
          mods:         mods,
          confianza:    Math.round(match.confianza * 100) / 100,
          noEncontrado: false,
          textoOriginal: frase,
        };
      } else {
        return {
          sku:          null,
          nombre:       null,
          cantidad:     cantidad,
          precio:       0,
          mods:         mods,
          confianza:    Math.round(match.confianza * 100) / 100,
          noEncontrado: true,
          textoOriginal: frase,
        };
      }
    }).filter(function (it) { return it !== null; });
  }

  global.VoiceParser = { parse: parse, CATALOGO: CATALOGO };

})(window);
