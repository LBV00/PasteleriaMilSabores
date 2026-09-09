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
       --------------------------------------------------------- */
    const enlaceAdmin =
        document.getElementById("nav-admin-link");

    const emailSesion  = sessionStorage.getItem("mil_sabores_sesion");
    const rolActual    = sessionStorage.getItem("mil_sabores_rol");
    const haySession   = emailSesion !== null;
    const esAdminActivo = haySession && rolActual === "admin";

    if (enlaceAdmin) {
        enlaceAdmin.style.display =
            esAdminActivo ? "" : "none";
    }


    /* ---------------------------------------------------------
       Actualizar acciones del header según estado de sesión:
       • Sin sesión  → mostrar "Iniciar Sesión" y "Crear Cuenta"
       • Con sesión  → mostrar email + botón "Cerrar Sesión"
       El contenedor debe tener id="header-actions".
       --------------------------------------------------------- */
    const contenedorAcciones =
        document.getElementById("header-actions");

    if (!contenedorAcciones) {
        return;
    }

    if (!haySession) {

        /* Sin sesión: estado por defecto (ya existe en el HTML) */
        return;

    }

    /* Con sesión: reemplazar botones por saludo + cerrar sesión */
    const nombre =
        emailSesion.split("@")[0];

    contenedorAcciones.innerHTML = `
        <span
            class="text-white small d-none d-lg-inline"
            title="${emailSesion}"
        >
            Hola, <strong>${nombre}</strong>
            ${ esAdminActivo ? "🎂" : "" }
        </span>

        <button
            id="btn-cerrar-sesion"
            class="btn btn-outline-light btn-sm"
            type="button"
        >
            Cerrar Sesión
        </button>

        <a
            class="text-white text-decoration-none fw-bold"
            href="carrito-vista.html"
        >
            🛒 Carrito
            (<span
                class="badge bg-danger rounded-pill"
                id="cart-count"
            >0</span>)
        </a>
    `;

    /* Re-actualizar el contador (el span fue recreado) */
    if (
        typeof actualizarContadorCarrito ===
        "function"
    ) {
        actualizarContadorCarrito();
    }


    document
        .getElementById("btn-cerrar-sesion")
        .addEventListener("click", () => {

            sessionStorage.removeItem("mil_sabores_sesion");
            sessionStorage.removeItem("mil_sabores_rol");

            window.location.href = "index.html";

        });

}