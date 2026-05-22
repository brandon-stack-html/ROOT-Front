# Diagramas de flujo — por rol de usuario

> Diagramas Mermaid de los flujos de la app. GitHub los renderiza nativo en markdown.
> Para la descripción narrativa, ver [`flujos.md`](./flujos.md).

---

## 1. Cliente / Comensal — Storefront

### 1.1 Tienda online (compra)

```mermaid
flowchart LR
    A[tienda.html<br/>landing comercial] --> B[tienda-catalogo.html<br/>catálogo]
    B --> C[producto.html<br/>detalle producto]
    C --> D[checkout.html<br/>datos + pago]
    D --> E[confirmacion.html<br/>comprobante]
```

### 1.2 Carta digital (QR en mesa)

```mermaid
flowchart LR
    A[carta.html<br/>menú del local] --> B[producto.html?from=qr<br/>detalle del plato]
```

---

## 2. Autenticación — transversal a todos los empleados

```mermaid
flowchart TD
    L[login.html] --> S[selector-sucursal.html]
    S --> M{Rol del usuario}
    M -->|Cajero| POS[pos/apertura.html]
    M -->|Mesero| MES[mesero/sala.html]
    M -->|Cocinero| KDS[kds/main.html]
    M -->|Admin| BO[backoffice/dashboard.html]

    L -.olvidé contraseña.-> R[recuperar.html]
    R --> RS[restablecer.html]
    RS --> L

    L -.crear cuenta.-> REG[registro.html]
    REG --> ROK[registro-ok.html]
    ROK --> L
```

---

## 3. Cajero — POS Web

```mermaid
flowchart LR
    A[apertura.html<br/>abrir caja] --> B[mapa.html<br/>mapa de mesas]
    B --> C[pedido.html?mesa=N<br/>tomar pedido]
    C --> B
    B --> D[historico.html<br/>pedidos del turno]
    D --> E[z-report.html<br/>cierre Z]
```

---

## 4. Mesero — App móvil

### 4.1 Flujo principal (tomar y cobrar pedido)

```mermaid
flowchart TD
    L[login.html] --> S[sala.html<br/>elegir sala]
    S --> M[mapa.html<br/>mapa de mesas]
    M --> D[detalle.html?mesa=N<br/>pedido de la mesa]
    D --> C[catalogo.html?mesa=N<br/>agregar productos]
    C --> D
    C -.modo voz.-> AC[audio-confirmar.html<br/>confirmar dictado]
    AC --> D
    D --> CO[cobro.html?mesa=N<br/>cobrar mesa]
    CO --> M
    M <-.alternativa.-> COM[comandas.html<br/>vista lista]
```

### 4.2 Gestión personal del mesero

```mermaid
flowchart LR
    P[perfil.html] --> N[nomina.html]
    P --> AH[adelantos-historial.html]
    AH --> AS[adelanto-solicitar.html]
    P --> PH[pagos-historial.html]
```

---

## 5. Cocinero — KDS

```mermaid
flowchart LR
    M[main.html<br/>cola de comandas] <--> C[config.html<br/>ajustes pantalla]
```

---

## 6. Administrador / Dueño — Backoffice

> El backoffice no es lineal: el sidebar (`_layout.html`) da acceso paralelo a 8 áreas. Cada área tiene su flujo interno.

### 6.1 Mapa general del sidebar

```mermaid
flowchart LR
    DASH[dashboard.html<br/>hub] --> CAT[Catálogo]
    DASH --> INV[Inventario]
    DASH --> OP[Operación]
    DASH --> CRM[CRM y usuarios]
    DASH --> FIN[Finanzas]
    DASH --> NOM[Nómina]
    DASH --> SIS[Sistema]

    CAT --> POS_LINK[pos/mapa.html]
    CAT --> KDS_LINK[kds/main.html]
```

### 6.2 Catálogo de productos

```mermaid
flowchart LR
    A[catalogo.html] --> B[producto.html?nuevo=1<br/>alta/edición]
    A --> C[categorias.html]
    A --> D[fichas.html<br/>recetas]
```

### 6.3 Inventario y proveedores

```mermaid
flowchart LR
    I[inventario.html] --> C[conteo.html<br/>conteo físico]
    P[proveedores.html]
```

### 6.4 Operación diaria

```mermaid
flowchart LR
    C[caja.html<br/>cierres por turno] --> H[pos/historico.html?turno=T-NNN]
    M[mesas.html<br/>config mapa]
    S[sucursales.html]
```

### 6.5 CRM y usuarios

```mermaid
flowchart LR
    CL[clientes.html]
    U[usuarios.html] --> UE[usuarios.html?edit=ID&tab=nomina]
    R[roles.html]
```

### 6.6 Finanzas y contabilidad

```mermaid
flowchart LR
    G[gastos.html]
    C[contabilidad.html]
    R[reportes.html]
    F[facturacion-dian.html<br/>DIAN Colombia]
```

### 6.7 Nómina y adelantos

```mermaid
flowchart TD
    N[nomina.html<br/>liquidación periodo] --> NE[nomina-empleado.html]
    NE --> NI[nomina-imprimible.html<br/>desprendible]
    N --> A[adelantos.html<br/>solicitudes]
    A --> AD[adelanto-detalle.html?id=ID<br/>aprobar/rechazar]
```

### 6.8 Sistema

```mermaid
flowchart LR
    I[integraciones.html]
    C[configuracion.html]
    N[notificaciones.html]
```

---

## Vista global — todos los roles juntos

```mermaid
flowchart TD
    subgraph PUB[Público]
        ST[storefront/tienda.html<br/>cliente compra]
        CT[storefront/carta.html<br/>cliente lee QR]
    end

    subgraph AUTH[Auth — empleados]
        LOG[auth/login.html]
    end

    subgraph ROLES[Una vez autenticado]
        POS[pos/<br/>Cajero]
        MES[mesero/<br/>Mesero]
        KDS[kds/<br/>Cocinero]
        BO[backoffice/<br/>Admin]
    end

    LOG --> POS
    LOG --> MES
    LOG --> KDS
    LOG --> BO

    BO -.audita.-> POS
    BO -.audita.-> KDS
    MES -.dispara comandas.-> KDS
    POS -.dispara comandas.-> KDS
```
