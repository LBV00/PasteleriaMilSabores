"use strict";

/* =========================================================
   AUTH.JS — Módulo de autenticación y roles
   =========================================================
   Credenciales de administrador fijas (demo frontend).
   El usuario admin NO se registra en localStorage;
   existe de forma predefinida en el código.
   ========================================================= */

const ADMIN_EMAIL    = "admin@milsabores.cl";
const ADMIN_PASSWORD = "Admin2026!";

const STORAGE_SESION = "mil_sabores_sesion";
const STORAGE_ROL    = "mil_sabores_rol";


/* ---------------------------------------------------------
   Retorna { email, rol } del usuario en sesión, o null.
   --------------------------------------------------------- */
function obtenerSesion() {

    const email = sessionStorage.getItem(STORAGE_SESION);

    if (!email) {
        return null;
    }

    const rol = sessionStorage.getItem(STORAGE_ROL) || "cliente";

    return { email, rol };

}


/* ---------------------------------------------------------
   Retorna true si hay sesión activa con rol "admin".
   --------------------------------------------------------- */
function esAdmin() {

    const sesion = obtenerSesion();
    return sesion !== null && sesion.rol === "admin";

}


/* ---------------------------------------------------------
   Inicia sesión. Devuelve { ok, rol, mensaje }.
   --------------------------------------------------------- */
function iniciarSesion(emailRaw, password) {

    const email = emailRaw.trim().toLowerCase();

    /* — Verificar administrador predefinido — */
    if (
        email    === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {
        sessionStorage.setItem(STORAGE_SESION, email);
        sessionStorage.setItem(STORAGE_ROL,    "admin");
        return { ok: true, rol: "admin", mensaje: "Bienvenido, administrador." };
    }

    /* — Verificar usuarios registrados en localStorage — */
    let usuarios = [];

    try {
        usuarios = JSON.parse(
            localStorage.getItem("mil_sabores_usuarios") || "[]"
        );
    } catch {
        usuarios = [];
    }

    const usuario = usuarios.find(
        u => u.email === email
    );

    if (usuario) {
        sessionStorage.setItem(STORAGE_SESION, email);
        sessionStorage.setItem(STORAGE_ROL,    "cliente");
        return { ok: true, rol: "cliente", mensaje: "Inicio de sesión correcto." };
    }

    /*
     * Demo frontend: si el correo no coincide con ningún
     * usuario registrado se permite igual (comportamiento
     * heredado), pero se trata como cliente.
     */
    sessionStorage.setItem(STORAGE_SESION, email);
    sessionStorage.setItem(STORAGE_ROL,    "cliente");

    return {
        ok:      true,
        rol:     "cliente",
        mensaje: "Sesión iniciada correctamente para la demostración frontend."
    };

}


/* ---------------------------------------------------------
   Cierra la sesión actual.
   --------------------------------------------------------- */
function cerrarSesion() {

    sessionStorage.removeItem(STORAGE_SESION);
    sessionStorage.removeItem(STORAGE_ROL);

}
