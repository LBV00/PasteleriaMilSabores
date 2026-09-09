"use strict";


function configurarContacto() {

    const form =
        document.getElementById(
            "form-contacto"
        );

    if (!form) {
        return;
    }


    const mensaje =
        document.getElementById(
            "mensaje"
        );


    const contador =
        document.getElementById(
            "char-counter"
        );


    if (mensaje && contador) {

        const actualizarContador =
            () => {

                contador.textContent =
                    `${mensaje.value.length} / 500 caracteres`;

            };


        mensaje.addEventListener(
            "input",
            actualizarContador
        );


        actualizarContador();

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                typeof validarFormulario ===
                "function"
            ) {

                if (
                    !validarFormulario(form)
                ) {

                    mostrarMensajeFormulario(
                        form,
                        "No se envió el mensaje. Revisa los campos."
                    );

                    return;
                }

            }


            if (
                typeof mostrarMensajeFormulario ===
                "function"
            ) {

                mostrarMensajeFormulario(
                    form,
                    "Mensaje enviado correctamente.",
                    true
                );

            } else {

                alert(
                    "Mensaje enviado correctamente."
                );

            }


            form.reset();


            if (
                mensaje &&
                contador
            ) {

                contador.textContent =
                    "0 / 500 caracteres";

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