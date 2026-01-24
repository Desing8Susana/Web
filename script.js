/* ===============================
   DESBLOQUEO DE AUDIO (MÓVIL)
================================ */
let permitido = false;

document.addEventListener('click', desbloquearAudio, { once: true });
document.addEventListener('touchstart', desbloquearAudio, { once: true });

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
  document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
}

/* ===============================
   JUEGO DE COLORES
================================ */
const colores = ['Rojo', 'Azul', 'Verde', 'Amarillo'];
const colorHex = {
  Rojo: '#f44336',
  Azul: '#2196f3',
  Verde: '#4caf50',
  Amarillo: '#ffeb3b'
};

let colorCorrecto = '';

function iniciarJuego() {
  const grid = document.getElementById('coloresGrid');
  const instruccion = document.getElementById('instruccion');
  const resultado = document.getElementById('resultado');

  if (!grid || !instruccion || !resultado) return;

  grid.innerHTML = '';
  resultado.textContent = '';

  colorCorrecto = colores[Math.floor(Math.random() * colores.length)];
  instruccion.textContent = 'Pulsa el color: ' + colorCorrecto;

  colores.forEach(color => {
    const btn = document.createElement('button');
    btn.style.background = colorHex[color];
    btn.style.height = '80px';
    btn.style.width = '100%';
    btn.style.borderRadius = '16px';
    btn.style.border = '2px solid #333';
    btn.style.cursor = 'pointer';

    btn.onclick = () => {
      if (color === colorCorrecto) {
        resultado.textContent = '¡Correcto! 🎉';
        hablar('Correcto');
        iniciarJuego();
      } else {
        resultado.textContent = 'Intenta otra vez';
        hablar('Intenta otra vez');
      }
    };

    grid.appendChild(btn);
  });
}

/* ===============================
   JUEGO DE CARTAS (MEMORY)
   10 CARTAS / 5 PAREJAS
================================ */
const cartasJuego = ['🍎', '🍌', '🍇', '🍉', '🥝', '🍎', '🍌', '🍇', '🍉', '🥝'];
let cartasVolteadas = [];
let bloqueado = false;

function iniciarCartas() {
  const contenedor = document.getElementById('cartasGrid');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  cartasVolteadas = [];
  bloqueado = false;

  const mezcladas = [...cartasJuego].sort(() => Math.random() - 0.5);

  mezcladas.forEach(simbolo => {
    const carta = document.createElement('button');
    carta.className = 'picto';
    carta.textContent = '❓';
    carta.dataset.valor = simbolo;

    carta.onclick = () => voltearCarta(carta);

    contenedor.appendChild(carta);
  });
}

function voltearCarta(carta) {
  if (bloqueado || carta.textContent !== '❓') return;

  carta.textContent = carta.dataset.valor;
  cartasVolteadas.push(carta);

  if (cartasVolteadas.length === 2) {
    comprobarPareja();
  }
}

function comprobarPareja() {
  bloqueado = true;

  const [c1, c2] = cartasVolteadas;

  if (c1.dataset.valor === c2.dataset.valor) {
    hablar('Muy bien');
    cartasVolteadas = [];
    bloqueado = false;
  } else {
    setTimeout(() => {
      c1.textContent = '❓';
      c2.textContent = '❓';
      cartasVolteadas = [];
      bloqueado = false;
      hablar('Inténtalo otra vez');
    }, 800);
  }
}

/* ===============================
   CUENTO INTERACTIVO
================================ */
const cuento = [
  {
    texto: "Hoy Vega quiere ir al parque",
    opciones: [
      { picto: "🏞️", texto: "Ir al parque", siguiente: 1 },
      { picto: "🏠", texto: "Quedarse en casa", siguiente: 2 }
    ]
  },
  {
    texto: "Vega se encuentra con un perro",
    opciones: [
      { picto: "🐶", texto: "Saludar al perro", siguiente: 3 },
      { picto: "🙈", texto: "Ignorar", siguiente: 4 }
    ]
  },
  {
    texto: "Vega decide quedarse en casa y juega con sus juguetes",
    opciones: [
      { picto: "💧", texto: "Jugar con agua", siguiente: null },
      { picto: "🎨", texto: "Pintar", siguiente: null }
    ]
  },
  {
    texto: "El perro mueve la cola y Vega está feliz",
    opciones: [
      { picto: "😀", texto: "Reír", siguiente: null },
      { picto: "⚽", texto: "Jugar al balón", siguiente: null }
    ]
  },
  {
    texto: "Vega ignora al perro y sigue caminando",
    opciones: [
      { picto: "🚶", texto: "Seguir caminando", siguiente: null },
      { picto: "🥓", texto: "Comer fuet", siguiente: null } // CAMBIO HECHO
    ]
  }
];

let paginaActual = 0;

function iniciarCuento() {
  paginaActual = 0;
  mostrarPagina(paginaActual);
}

function mostrarPagina(indice) {
  const contenedorTexto = document.getElementById('cuentoTexto');
  const contenedorOpciones = document.getElementById('cuentoOpciones');

  if (!contenedorTexto || !contenedorOpciones) return;

  const pagina = cuento[indice];
  contenedorTexto.textContent = pagina.texto;
  hablar(pagina.texto);

  contenedorOpciones.innerHTML = '';

  pagina.opciones.forEach(opcion => {
    const btn = document.createElement('button');
    btn.className = 'picto';
    btn.textContent = opcion.picto;
    const span = document.createElement('span');
    span.textContent = opcion.texto;
    btn.appendChild(span);

    btn.onclick = () => {
      if (opcion.siguiente !== null) {
        paginaActual = opcion.siguiente;
        mostrarPagina(paginaActual);
      } else {
        contenedorTexto.textContent = "✅ Fin del cuento";
        hablar("Fin del cuento");
        contenedorOpciones.innerHTML = '';
      }
    };

    contenedorOpciones.appendChild(btn);
  });
}
