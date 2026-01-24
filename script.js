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
   CUENTO INTERACTIVO CON PICTOGRAMAS
================================ */
const cuento = {
  inicio: {
    texto:"Hola Vega! ¿Qué quieres hacer hoy?",
    opciones:[
      {texto:"casa", destino:"casa", img:"img/casa.png"},
      {texto:"colegio", destino:"colegio", img:"img/colegio.png"},
    ]
  },
  casa: { texto:"¡Qué bien! Hoy se descansa", opciones:[
    {texto:"Jugar con agua", destino:"Agua", img:"img/agua.png"},
    {texto:"colegio fuet", destino:"colegio", img:"colegio.png"}
  ]},
  colegio: { texto:"¡Genial! Vamos a ver a Diana", opciones:[
    {texto:"aprender", destino:"descansar", img:"img/aprender.png"},
    {texto:"jugar", destino:"jugar", img:"img/jugar.png"}
  ]},
  jugar: { texto:"¡Juguemos en el patio!", opciones:[
    {texto:"Vamos al patio", destino:"descansar", img:"img/recreo.png"},
  ]},
  
  descansar: { texto:"¡Ya viene Mamá vamos a casa!", opciones:[
    {texto:"Casa", destino:"cenar", img:"img/casa.png"},
    {texto:"colegio fuet", destino:"colegio", img:"colegio.png"}
  ]},
  
   cenar: { texto:"¡Que quieres cenar!", opciones:[
    {texto:"Pizza", destino:"pizza", img:"img/pizza.png"},
    {texto:"Sopa", destino:"sopa", img:"img/sopa.png"}
  ]},
 
  Agua: { texto:"Después de jugar con el agua, elige la cena", opciones:[
    {texto:"Pizza", destino:"pizza", img:"img/pizza.png"},
    {texto:"Sopa", destino:"sopa", img:"img/sopa.png"}
  ]},
  pizza: { texto:"¡Que rica la pizza! A dormir.", opciones:[], img:"img/pizza.png" },
  sopa: { texto:"¡Me encanta la sopa! A dormir.", opciones:[], img:"img/sopa.png" }
};

function iniciarCuento(){ mostrarPagina('inicio'); }

function mostrarPagina(pag){
  const contenedor=document.getElementById('cuentoGrid');
  if(!contenedor) return;

  contenedor.innerHTML='';

  // Mostrar el texto del cuento
  const p=document.createElement('p');
  p.textContent=cuento[pag].texto;
  contenedor.appendChild(p);
  hablar(cuento[pag].texto);

  // Mostrar las opciones con imagen y texto
  cuento[pag].opciones.forEach(op=>{
    const btn=document.createElement('button');
    btn.className='picto';

    // Imagen
    const img = document.createElement('img');
    img.src = op.img; // aquí debes tener los archivos en la misma carpeta
    img.alt = op.texto;
    img.style.width = '70px';
    img.style.height = 'auto';
    btn.appendChild(img);

    // Texto debajo
    const span = document.createElement('span');
    span.textContent = op.texto;
    btn.appendChild(span);

    btn.onclick = ()=> mostrarPagina(op.destino);
    contenedor.appendChild(btn);
  });
}