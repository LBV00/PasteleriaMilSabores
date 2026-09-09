"use strict";

const REGIONES_COMUNAS = {
    RM: ["La Reina", "Las Condes", "Providencia", "Santiago", "Maipú", "Puente Alto"],
    VALPO: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
    BIOBIO: ["Concepción", "Talcahuano", "Chiguayante", "Los Ángeles"]
};

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function mostrarError(campo, mensaje) {
    let idError = `${campo.id}-error`;
    let error = document.getElementById(idError);

    if (!error) {
        error = document.createElement("span");
        error.id = idError;
        error.className = "form-error";
        campo.insertAdjacentElement("afterend", error);
    }

    error.textContent = mensaje;
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", idError);
}

function limpiarError(campo) {
    const error = document.getElementById(`${campo.id}-error`);
    if (error) error.textContent = "";

    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    campo.setAttribute("aria-invalid", "false");
}

function validarCorreo(correo) {
    const normalizado = correo.trim().toLowerCase();
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formato.test(normalizado) &&
        DOMINIOS_PERMITIDOS.some(dominio => normalizado.endsWith(dominio));
}

function validarRun(run) {
    const limpio = run.trim().toUpperCase().replace(/\s/g, "");
    if (!/^\d{6,8}[0-9K]$/.test(limpio)) return false;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return esperado === dv;
}

function validarFormulario(formulario) {
    let valido = true;

    formulario.querySelectorAll("[required]").forEach(campo => {
        if (!campo.value.trim()) {
            mostrarError(campo, "Este campo es obligatorio.");
            valido = false;
        }
    });

    formulario.querySelectorAll("input[type='email']").forEach(campo => {
        if (campo.value.trim() && !validarCorreo(campo.value)) {
            mostrarError(campo, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
            valido = false;
        }
    });

    formulario.querySelectorAll("[maxlength]").forEach(campo => {
        if (campo.value.length > Number(campo.maxLength)) {
            mostrarError(campo, `No puede superar ${campo.maxLength} caracteres.`);
            valido = false;
        }
    });

    formulario.querySelectorAll("[minlength]").forEach(campo => {
        if (campo.value && campo.value.length < Number(campo.minLength)) {
            mostrarError(campo, `Debe tener al menos ${campo.minLength} caracteres.`);
            valido = false;
        }
    });

    formulario.querySelectorAll("input[type='number']").forEach(campo => {
        if (campo.value !== "") {
            const numero = Number(campo.value);
            if (Number.isNaN(numero)) {
                mostrarError(campo, "Ingresa un número válido.");
                valido = false;
            }

            if (campo.min !== "" && numero < Number(campo.min)) {
                mostrarError(campo, `El valor mínimo es ${campo.min}.`);
                valido = false;
            }

            if (campo.step === "1" && !Number.isInteger(numero)) {
                mostrarError(campo, "Este campo solo acepta números enteros.");
                valido = false;
            }
        }
    });

    /* Validar RUN chileno (acepta id="run" o id="usr-run") */
    const run =
        formulario.querySelector("#run") ||
        formulario.querySelector("#usr-run");

    if (run && run.value.trim() && !validarRun(run.value)) {
        mostrarError(run, "RUN inválido. Ingresa sin puntos ni guion, por ejemplo 19011022K.");
        valido = false;
    }

    /* Validar contraseña de registro (id="password") */
    const password =
        formulario.querySelector("#password") ||
        formulario.querySelector("#login-pass");

    if (password && password.value && (password.value.length < 4 || password.value.length > 10)) {
        mostrarError(password, "La contraseña debe tener entre 4 y 10 caracteres.");
        valido = false;
    }

    /* Validar confirmación de contraseña (id="confirmarPassword") */
    const confirmarPassword = formulario.querySelector("#confirmarPassword");
    if (confirmarPassword && confirmarPassword.value !== undefined) {
        if (password && confirmarPassword.value !== password.value) {
            mostrarError(confirmarPassword, "Las contraseñas no coinciden.");
            valido = false;
        } else if (confirmarPassword.value.trim() === "" && confirmarPassword.required) {
            mostrarError(confirmarPassword, "Este campo es obligatorio.");
            valido = false;
        }
    }

    /* Validar fecha de nacimiento real */
    const fechaNac = formulario.querySelector("#fechaNacimiento");
    if (fechaNac && fechaNac.value) {
        const nacimiento = new Date(fechaNac.value);
        const hoy = new Date();
        const minFecha = new Date("1900-01-01");
        const maxFecha = new Date();
        maxFecha.setFullYear(hoy.getFullYear() - 5);

        if (nacimiento < minFecha || nacimiento > maxFecha) {
            mostrarError(fechaNac, "Ingresa una fecha de nacimiento válida (debes tener al menos 5 años).");
            valido = false;
        }
    }

    const stock = formulario.querySelector("#prod-stock");
    const critico = formulario.querySelector("#prod-critico");
    if (stock && critico && stock.value !== "" && critico.value !== "") {
        if (Number(critico.value) > Number(stock.value)) {
            mostrarError(critico, "El stock crítico no puede ser mayor que el stock actual.");
            valido = false;
        }
    }

    return valido;
}

function mostrarMensajeFormulario(formulario, texto, exito = false) {
    let mensaje = formulario.querySelector(".form-feedback");
    if (!mensaje) {
        mensaje = document.createElement("div");
        mensaje.className = "form-feedback mt-3";
        formulario.appendChild(mensaje);
    }
    mensaje.textContent = texto;
    mensaje.className = `form-feedback mt-3 fw-bold ${exito ? "form-success" : "text-danger"}`;
}

function configurarCamposEnVivo(formulario) {
    formulario.querySelectorAll("input, select, textarea").forEach(campo => {
        campo.addEventListener("blur", () => {
            if (!campo.value.trim() && campo.required) {
                mostrarError(campo, "Este campo es obligatorio.");
            } else {
                limpiarError(campo);
            }
        });

        campo.addEventListener("input", () => {
            if (campo.classList.contains("is-invalid") && campo.value.trim()) {
                limpiarError(campo);
            }
        });
    });
}

function escapeAdmin(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
