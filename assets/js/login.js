"use strict";

function configurarLogin() {
    const form = document.getElementById("form-login");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario(form)) {
            mostrarMensajeFormulario(form, "Revisa los datos ingresados.");
            return;
        }

        sessionStorage.setItem("mil_sabores_sesion", document.getElementById("login-email").value.trim());
        mostrarMensajeFormulario(form, "Inicio de sesión válido para la demostración frontend.", true);
    });

    configurarCamposEnVivo(form);
}
