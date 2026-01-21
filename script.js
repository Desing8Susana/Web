function mostrarSeccion(id) { const secciones = document.querySelectorAll('.seccion'); secciones.forEach(sec => sec.classList.add('oculto')); document.getElementById(id).classList.remove('oculto'); }

let permitido = false;

// Desbloqueo inicial (OBLIGATORIO en móvil)
document.addEventListener("click", desbloquearAudio, { once: true });
document.addEventListener("touchstart", desbloquearAudio, { once: true });

function desbloquearAudio() {
  const u = new SpeechSynthesisUtterance("");
  speechSynthesis.speak(u);
  speechSynthesis.cancel();
  permitido = true;
}

function hablar(texto) {
  if (!permitido) return;

  speechSynthesis.cancel();

  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "es-ES";
  voz.rate = 0.85;
  voz.pitch = 1;

  speechSynthesis.speak(voz);
}
