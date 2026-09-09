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


    /* ---------------------------------------------------------
       Mostrar u ocultar el enlace "Panel Admin" en el menú
       según si el usuario activo tiene rol "admin".
       El enlace debe tener el id "nav-admin-link" en el HTML.
       --------------------------------------------------------- */
    const enlaceAdmin =
        document.getElementById("nav-admin-link");

    if (enlaceAdmin) {

        const rolActual =
            sessionStorage.getItem("mil_sabores_rol");

        if (rolActual === "admin") {
            enlaceAdmin.style.display = "";
        } else {
            enlaceAdmin.style.display = "none";
        }

    }

}