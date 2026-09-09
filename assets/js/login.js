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


            const usuarios =
                JSON.parse(
                    localStorage.getItem(
                        "mil_sabores_usuarios"
                    ) || "[]"
                );


            const usuario =
                usuarios.find(
                    u =>
                        u.email ===
                        correo.value
                            .trim()
                            .toLowerCase()
                );


            /*
             * Si existe el usuario, iniciamos sesión.
             * Para esta evaluación la autenticación
             * se maneja como demostración frontend.
             */

            sessionStorage.setItem(
                "mil_sabores_sesion",
                correo.value
                    .trim()
                    .toLowerCase()
            );


            if (
                typeof mostrarMensajeFormulario ===
                "function"
            ) {

                mostrarMensajeFormulario(
                    form,
                    usuario
                        ? "Inicio de sesión correcto."
                        : "Sesión iniciada correctamente para la demostración frontend.",
                    true
                );

            } else {

                alert(
                    "Inicio de sesión correcto."
                );

            }

        }
    );


    if (
        typeof configurarCamposEnVivo ===
        "function"
    ) {

        configurarCamposEnVivo(form);

    }

}