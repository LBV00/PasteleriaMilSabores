"use strict";


function configurarLogin() {

    const form =
        document.getElementById(
            "form-login"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const correo =
                document.getElementById(
                    "correo"
                );

            const password =
                document.getElementById(
                    "password"
                );


            if (
                !correo ||
                !password
            ) {
                return;
            }


            if (
                typeof validarFormulario ===
                "function"
            ) {

                if (!validarFormulario(form)) {

                    mostrarMensajeFormulario(
                        form,
                        "Revisa los datos ingresados."
                    );

                    return;
                }

            } else {

                if (
                    !correo.value.trim() ||
                    !password.value.trim()
                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }

            }


            /* -----------------------------------------------
               Usar auth.js si está disponible; de lo contrario
               mantener el comportamiento anterior (demo).
               ----------------------------------------------- */
            let resultado;

            if (typeof iniciarSesion === "function") {

                resultado = iniciarSesion(
                    correo.value,
                    password.value.trim()
                );

            } else {

                /* Fallback: comportamiento heredado */
                sessionStorage.setItem(
                    "mil_sabores_sesion",
                    correo.value.trim().toLowerCase()
                );

                resultado = {
                    ok:      true,
                    rol:     "cliente",
                    mensaje: "Sesión iniciada correctamente para la demostración frontend."
                };

            }


            if (
                typeof mostrarMensajeFormulario ===
                "function"
            ) {

                mostrarMensajeFormulario(
                    form,
                    resultado.mensaje,
                    true
                );

            } else {

                alert(resultado.mensaje);

            }


            /* Redirigir según rol después de un breve instante */
            setTimeout(() => {

                if (resultado.rol === "admin") {
                    window.location.href = "admin-home.html";
                } else {
                    window.location.href = "index.html";
                }

            }, 1200);

        }
    );


    if (
        typeof configurarCamposEnVivo ===
        "function"
    ) {

        configurarCamposEnVivo(form);

    }

}