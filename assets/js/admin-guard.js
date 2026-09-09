"use strict";

/* =========================================================
   ADMIN-GUARD.JS — Protección de páginas administrativas
   =========================================================
   Incluir este script como el PRIMER <script> en cualquier
   página admin (admin-home, admin-productos, admin-usuarios).
   Redirige a login.html si el usuario no es administrador.
   ========================================================= */

(function protegerPaginaAdmin() {

    const rol   = sessionStorage.getItem("mil_sabores_rol");
    const email = sessionStorage.getItem("mil_sabores_sesion");

    const esAdminActivo =
        email !== null &&
        rol   === "admin";

    if (!esAdminActivo) {
        /*
         * Reemplazamos la URL para que el botón "atrás"
         * del navegador no regrese a la página admin.
         */
        window.location.replace("login.html");
    }

}());
