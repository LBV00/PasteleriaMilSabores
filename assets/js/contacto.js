"use strict";

function configurarContacto() {
    const form = document.getElementById("form-contacto");
    if (!form) return;

    const mensaje = document.getElementById("cont-mensaje");
    const contador = document.getElementById("char-counter");

    const actualizarContador = () => {
        contador.textContent = `${mensaje.value.length} / 500 caracteres`;
    };

    mensaje.addEventListener("input", actualizarContador);
    actualizarContador();

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario(form)) {
            mostrarMensajeFormulario(form, "No se envió el mensaje. Revisa los campos.");
            return;
        }

        mostrarMensajeFormulario(form, "Mensaje enviado correctamente.", true);
        form.reset();
        actualizarContador();
    });

    configurarCamposEnVivo(form);
}
