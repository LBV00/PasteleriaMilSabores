"use strict";

function configurarAdminUsuarios() {
    const cuerpo   = document.getElementById("usuarios-cuerpo");
    const vacio    = document.getElementById("usuarios-vacio");
    const formNuevo = document.getElementById("form-nuevo-usuario");

    if (!cuerpo) return;


    /* =====================================================
       RENDER — Listar todos los usuarios
       ===================================================== */

    const render = () => {
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("mil_sabores_usuarios")) || [];
        } catch {
            usuarios = [];
        }

        if (!usuarios.length) {
            cuerpo.innerHTML = "";
            if (vacio) vacio.textContent = "No existen usuarios registrados todavía.";
            return;
        }

        if (vacio) vacio.textContent = "";

        cuerpo.innerHTML = usuarios.map((u, indice) => `
            <tr>
                <td>${escapeAdmin(u.run || "—")}</td>
                <td>${escapeAdmin(u.nombre || "")} ${escapeAdmin(u.apellidos || "")}</td>
                <td>${escapeAdmin(u.email || "")}</td>
                <td>${escapeAdmin(u.region || "—")}</td>
                <td>${escapeAdmin(u.comuna || "—")}</td>
                <td>
                    <select class="form-select form-select-sm rol-usuario" data-indice="${indice}">
                        ${["Administrador", "Cliente", "Vendedor"].map(rol =>
                            `<option value="${rol}" ${u.rol === rol ? "selected" : ""}>${rol}</option>`
                        ).join("")}
                    </select>
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-usuario" data-indice="${indice}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join("");

        /* Cambio de rol */
        cuerpo.querySelectorAll(".rol-usuario").forEach(select => {
            select.addEventListener("change", () => {
                let lista = [];
                try {
                    lista = JSON.parse(localStorage.getItem("mil_sabores_usuarios")) || [];
                } catch { lista = []; }

                lista[Number(select.dataset.indice)].rol = select.value;
                localStorage.setItem("mil_sabores_usuarios", JSON.stringify(lista));
            });
        });

        /* Eliminar usuario */
        cuerpo.querySelectorAll(".btn-eliminar-usuario").forEach(btn => {
            btn.addEventListener("click", () => {
                let lista = [];
                try {
                    lista = JSON.parse(localStorage.getItem("mil_sabores_usuarios")) || [];
                } catch { lista = []; }

                lista.splice(Number(btn.dataset.indice), 1);
                localStorage.setItem("mil_sabores_usuarios", JSON.stringify(lista));
                render();
            });
        });
    };


    /* =====================================================
       CREAR USUARIO desde el formulario del admin
       ===================================================== */

    if (formNuevo) {

        formNuevo.addEventListener("submit", event => {
            event.preventDefault();

            /* Validar con form-utils si está disponible */
            if (typeof validarFormulario === "function") {
                if (!validarFormulario(formNuevo)) {
                    if (typeof mostrarMensajeFormulario === "function") {
                        mostrarMensajeFormulario(formNuevo, "Revisa los campos marcados.");
                    }
                    return;
                }
            }

            const nombre    = document.getElementById("usr-nombre").value.trim();
            const apellidos = document.getElementById("usr-apellidos").value.trim();
            const run       = document.getElementById("usr-run").value.trim().toUpperCase();
            const email     = document.getElementById("usr-email").value.trim().toLowerCase();
            const password  = document.getElementById("usr-password").value;
            const rol       = document.getElementById("usr-rol").value;

            /* Validaciones adicionales */
            if (!nombre || !apellidos || !run || !email || !password || !rol) {
                if (typeof mostrarMensajeFormulario === "function") {
                    mostrarMensajeFormulario(formNuevo, "Completa todos los campos obligatorios.");
                }
                return;
            }

            if (typeof validarRun === "function" && !validarRun(run)) {
                if (typeof mostrarMensajeFormulario === "function") {
                    mostrarMensajeFormulario(formNuevo, "El RUN ingresado no es válido.");
                }
                return;
            }

            if (typeof validarCorreo === "function" && !validarCorreo(email)) {
                if (typeof mostrarMensajeFormulario === "function") {
                    mostrarMensajeFormulario(formNuevo, "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                }
                return;
            }

            if (password.length < 4 || password.length > 10) {
                if (typeof mostrarMensajeFormulario === "function") {
                    mostrarMensajeFormulario(formNuevo, "La contraseña debe tener entre 4 y 10 caracteres.");
                }
                return;
            }

            /* Cargar lista actual */
            let usuarios = [];
            try {
                usuarios = JSON.parse(localStorage.getItem("mil_sabores_usuarios")) || [];
            } catch { usuarios = []; }

            /* Verificar duplicados */
            const existe = usuarios.some(
                u => u.email === email || u.run === run
            );

            if (existe) {
                if (typeof mostrarMensajeFormulario === "function") {
                    mostrarMensajeFormulario(formNuevo, "Ya existe un usuario con ese RUN o correo.");
                }
                return;
            }

            /* Guardar nuevo usuario */
            usuarios.push({
                run,
                nombre,
                apellidos,
                email,
                password,
                rol,
                region:  "",
                comuna:  "",
                direccion: ""
            });

            localStorage.setItem("mil_sabores_usuarios", JSON.stringify(usuarios));

            formNuevo.reset();

            /* Limpiar clases de validación */
            formNuevo.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
                el.classList.remove("is-valid", "is-invalid");
            });

            if (typeof mostrarMensajeFormulario === "function") {
                mostrarMensajeFormulario(formNuevo, `Usuario "${nombre} ${apellidos}" creado correctamente.`, true);
            }

            render();
        });


        /* Validación en vivo */
        if (typeof configurarCamposEnVivo === "function") {
            configurarCamposEnVivo(formNuevo);
        }

    }


    /* Renderizar la lista al cargar */
    render();
}
