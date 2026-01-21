function mostrarSeccion(id) { const secciones = document.querySelectorAll('.seccion'); secciones.forEach(sec => sec.classList.add('oculto')); document.getElementById(id).classList.remove('oculto'); }


function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.speak(mensaje);
}
