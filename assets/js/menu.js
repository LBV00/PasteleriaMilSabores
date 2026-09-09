"use strict";


function configurarMenuAccesible() {

    document
        .querySelectorAll(
            ".navbar-toggler"
        )
        .forEach(boton => {

            const objetivoId =
                boton.getAttribute(
                    "data-bs-target"
                );

            if (!objetivoId) {
                return;
            }


            const objetivo =
                document.querySelector(
                    objetivoId
                );

            if (!objetivo) {
                return;
            }


            objetivo.addEventListener(
                "shown.bs.collapse",
                () => {

                    boton.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }
            );


            objetivo.addEventListener(
                "hidden.bs.collapse",
                () => {

                    boton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


    if (
        typeof actualizarContadorCarrito ===
        "function"
    ) {

        actualizarContadorCarrito();

    }

}