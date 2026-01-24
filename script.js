/* ===============================
   DESBLOQUEO DE AUDIO
================================ */
let permitido = false;
document.addEventListener('click', desbloquearAudio, { once: true });
document.addEventListener('touchstart', desbloquearAudio, { once: true });
document.addEventListener('keydown', desbloquearAudio, { once: true });

function desbloquearAudio() {
  const u = new SpeechSynthesisUtterance('');
  speechSynthesis.speak(u);
  speechSynthesis.cancel();
  permitido = true;
}

function hablar(texto) {
  if (!permitido) return;
  speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = 'es-ES';
  voz.rate = 0.85;
  speechSynthesis.speak(voz);
}

/* ===============================
   NAVEGACIÓN ENTRE SECCIONES
================================ */
function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(s =>
    s.classList.add('oculto')
  );
  document.getElementById(id).classList.remove('oculto');
}

/* ===============================
   JUEGO DE COLORES
================================ */
const colores = ['Rojo', 'Azul', 'Verde', 'Amarillo'];
const colorHex = {
  Rojo:'#f44336', Azul:'#2196f3', Verde:'#4caf50', Amarillo:'#ffeb3b'
};
let colorCorrecto = '';

function iniciarJuego() {
  const grid = document.getElementById('coloresGrid');
  const instruccion = document.getElementById('instruccion');
  const resultado = document.getElementById('resultado');
  if(!grid || !instruccion || !resultado) return;

  grid.innerHTML = '';
  resultado.textContent = '';

  colorCorrecto = colores[Math.floor(Math.random()*colores.length)];
  instruccion.textContent = 'Pulsa el color: ' + colorCorrecto;

  colores.forEach(color=>{
    const btn = document.createElement('button');
    btn.style.background=colorHex[color];
    btn.style.height='80px';
    btn.style.width='100%';
    btn.style.borderRadius='16px';
    btn.style.border='2px solid #333';
    btn.style.cursor='pointer';

    btn.onclick = ()=>{
      if(color===colorCorrecto){
        resultado.textContent='¡Correcto! 🎉';
        hablar('Correcto');
        iniciarJuego();
      } else {
        resultado.textContent='Intenta otra vez';
        hablar('Intenta otra vez');
      }
    };
    grid.appendChild(btn);
  });
}

/* ===============================
   JUEGO DE CARTAS (10 cartas)
================================ */
const cartasJuego = ['🍎','🍌','🍇','🍍','🥝','🍎','🍌','🍇','🍍','🥝'];
let cartasVolteadas = [];
let bloqueado = false;

function iniciarCartas() {
  const contenedor = document.getElementById('cartasGrid');
  if(!contenedor) return;

  contenedor.innerHTML='';
  cartasVolteadas=[];
  bloqueado=false;

  const mezcladas = [...cartasJuego].sort(()=>Math.random()-0.5);

  mezcladas.forEach(simbolo=>{
    const carta=document.createElement('button');
    carta.className='picto';
    carta.textContent='❓';
    carta.dataset.valor=simbolo;
    carta.onclick=()=> voltearCarta(carta);
    contenedor.appendChild(carta);
  });
}

function voltearCarta(carta){
  if(bloqueado || carta.textContent!=='❓') return;

  carta.textContent=carta.dataset.valor;
  cartasVolteadas.push(carta);

  if(cartasVolteadas.length===2) comprobarPareja();
}

function comprobarPareja(){
  bloqueado=true;
  const [c1,c2]=cartasVolteadas;

  if(c1.dataset.valor===c2.dataset.valor){
    hablar('Muy bien');
    cartasVolteadas=[];
    bloqueado=false;
  } else {
    setTimeout(()=>{
      c1.textContent='❓';
      c2.textContent='❓';
      cartasVolteadas=[];
      bloqueado=false;
      hablar('Inténtalo otra vez');
    },800);
  }
}

/* ===============================
   CUENTO INTERACTIVO
================================ */
const cuento = {
  inicio: {
    texto:"Hola Vega! ¿Qué quieres hacer hoy?",
    opciones:[
      {texto:"Camina un rato", destino:"caminar"},
      {texto:"Comer fuet", destino:"comer"},
      {texto:"Galletas", destino:"galletas"}
    ]
  },
  caminar: { texto:"¡Qué bien! Ahora elige otra cosa:", opciones:[
    {texto:"Manualidades", destino:"manualidades"},
    {texto:"Comer fuet", destino:"comer"}
  ]},
  comer: { texto:"¡Delicioso! Ahora puedes:", opciones:[
    {texto:"Camina un rato", destino:"caminar"},
    {texto:"Manualidades", destino:"manualidades"}
  ]},
  galletas: { texto:"¡Ñam! Después puedes:", opciones:[
    {texto:"Manualidades", destino:"manualidades"},
    {texto:"Camina un rato", destino:"caminar"}
  ]},
  manualidades: { texto:"Después de manualidades, elige la cena:", opciones:[
    {texto:"Pizza", destino:"pizza"},
    {texto:"Sopa", destino:"sopa"}
  ]},
  pizza: { texto:"¡A comer pizza! Fin del cuento.", opciones:[] },
  sopa: { texto:"¡A comer sopa! Fin del cuento.", opciones:[] }
};

function iniciarCuento(){ mostrarPagina('inicio'); }

function mostrarPagina(pag){
  const contenedor=document.getElementById('cuentoGrid');
  if(!contenedor) return;

  contenedor.innerHTML='';
  const p=document.createElement('p');
  p.textContent=cuento[pag].texto;
  contenedor.appendChild(p);
  hablar(cuento[pag].texto);

  cuento[pag].opciones.forEach(op=>{
    const btn=document.createElement('button');
    btn.className='picto';
    btn.textContent=op.texto;
    btn.onclick=()=> mostrarPagina(op.destino);
    contenedor.appendChild(btn);
  });
}
