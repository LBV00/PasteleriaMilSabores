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
               Llamar a iniciarSesion() de auth.js.
               Si el usuario no existe o la contraseña es
               incorrecta, mostrar error y NO redirigir.
               ----------------------------------------------- */
            let resultado;

            if (typeof iniciarSesion === "function") {

                resultado = iniciarSesion(
                    correo.value,
                    password.value.trim()
                );

            } else {

                /* Fallback si auth.js no está cargado */
                resultado = {
                    ok:      false,
                    rol:     null,
                    mensaje: "Error de configuración: módulo de autenticación no disponible."
                };

            }


            /* Si el login falló, mostrar error y detener */
            if (!resultado.ok) {

                if (
                    typeof mostrarMensajeFormulario ===
                    "function"
                ) {

                    mostrarMensajeFormulario(
                        form,
                        resultado.mensaje
                    );

                } else {

                    alert(resultado.mensaje);

                }

                return;

            }


            /* Login correcto: mostrar mensaje de éxito */
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