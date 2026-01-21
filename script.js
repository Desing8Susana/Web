 let permitido = false;

document.addEventListener('click', desbloquearAudio, { once: true }); document.addEventListener('touchstart', desbloquearAudio, { once: true });

function desbloquearAudio() { const u = new SpeechSynthesisUtterance(''); speechSynthesis.speak(u); speechSynthesis.cancel(); permitido = true; }

function hablar(texto) { if (!permitido) return;

speechSynthesis.cancel(); const voz = new SpeechSynthesisUtterance(texto); voz.lang = 'es-ES'; voz.rate = 0.85; speechSynthesis.speak(voz); }

function mostrarSeccion(id) { document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto')); document.getElementById(id).classList.remove('oculto'); }
