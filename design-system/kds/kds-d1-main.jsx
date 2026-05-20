// kds-d1-main.jsx — KDS Pantalla principal

const COMANDAS_KDS = [
  {
    mesa:'Mesa 3', num:'018', tiempo:'14:23', urgency:'urgent',
    items: [
      { qty:2, nombre:'Bandeja Paisa',    mod:{ text:'Sin chicharrón', kind:'minus' } },
      { qty:1, nombre:'Ajiaco Bogotano',  mod:{ text:'Extra papa ✓',    kind:'plus' } },
      { qty:2, nombre:'Limonada Natural' },
    ],
  },
  {
    mesa:'Mesa 7', num:'019', tiempo:'09:45', urgency:'warn',
    items: [
      { qty:1, nombre:'Lomo al Trapo', mod:{ text:'Término: 3/4', kind:'neutral' } },
      { qty:1, nombre:'Trucha en Salsa' },
    ],
  },
  {
    mesa:'Mesa 1', num:'020', tiempo:'03:12', urgency:'normal',
    items: [
      { qty:3, nombre:'Pollo a la Plancha' },
      { qty:2, nombre:'Agua con gas' },
    ],
  },
  {
    mesa:'Mostrador', num:'021', tiempo:'00:42', urgency:'nuevo',
    items: [
      { qty:1, nombre:'Sancocho de Gallina' },
      { qty:1, nombre:'Jugo de Mora' },
    ],
  },
];

function KDSD1Main({ t }) {
  const isDark = t === DST.dark;
  const bg = isDark ? '#0A0A0A' : '#F4F4F5';

  return (
    <div style={{ width:'100%', height:'100%', background:bg, fontFamily:ff, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <KDSTopbar t={t}/>

      <div style={{
        flex:1, overflow:'auto',
        padding:'12px',
        display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10,
        alignContent:'flex-start',
      }}>
        {COMANDAS_KDS.map((c, i) => <KDSComandaCard key={i} t={t} {...c}/>)}
      </div>
    </div>
  );
}

Object.assign(window, { KDSD1Main });
