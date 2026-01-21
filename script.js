 let permitido = false;

document.addEventListener('click', desbloquearAudio, { once: true }); document.addEventListener('touchstart', desbloquearAudio, { once: true });

function desbloquearAudio() { const u = new SpeechSynthesisUtterance(''); speechSynthesis.speak(u); speechSynthesis.cancel(); permitido = true; }

function hablar(texto) { if (!permitido) return;

speechSynthesis.cancel(); const voz = new SpeechSynthesisUtterance(texto); voz.lang = 'es-ES'; voz.rate = 0.85; speechSynthesis.speak(voz); }

function mostrarSeccion(id) { document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto')); document.getElementById(id).classList.remove('oculto'); }

// ===== JUEGO DE COLORES =====

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

  colorCorrecto = colores[Math.floor(Math.random() * colores.length)];
  instruccion.textContent = 'Pulsa el color: ' + colorCorrecto;
  resultado.textContent = '';

  colores.forEach(color => {
    const btn = document.createElement('button');
    btn.style.background = colorHex[color];
    btn.style.height = '80px';
    btn.style.borderRadius = '16px';
    btn.style.border = '2px solid #333';
    btn.style.width = '100%';
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
