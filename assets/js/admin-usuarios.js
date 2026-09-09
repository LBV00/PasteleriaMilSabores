"use strict";

function configurarAdminUsuarios() {
    const cuerpo = document.getElementById("usuarios-cuerpo");
    const vacio = document.getElementById("usuarios-vacio");
    if (!cuerpo) return;

    const render = () => {
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("mil_sabores_usuarios")) || [];
        } catch {
            usuarios = [];
        }

        if (!usuarios.length) {
            cuerpo.innerHTML = "";
            vacio.textContent = "No existen usuarios registrados todavía.";
            return;
        }

        vacio.textContent = "";
        cuerpo.innerHTML = usuarios.map((u, indice) => `
            <tr>
                <td>${escapeAdmin(u.run)}</td>
                <td>${escapeAdmin(u.nombre)} ${escapeAdmin(u.apellidos)}</td>
                <td>${escapeAdmin(u.email)}</td>
                <td>${escapeAdmin(u.region)}</td>
                <td>${escapeAdmin(u.comuna)}</td>
                <td>
                    <select class="form-select form-select-sm rol-usuario" data-indice="${indice}">
                        ${["Administrador","Cliente","Vendedor"].map(rol =>
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

        cuerpo.querySelectorAll(".rol-usuario").forEach(select => {
            select.addEventListener("change", () => {
                usuarios[Number(select.dataset.indice)].rol = select.value;
                localStorage.setItem("mil_sabores_usuarios", JSON.stringify(usuarios));
            });
        });

        cuerpo.querySelectorAll(".btn-eliminar-usuario").forEach(btn => {
            btn.addEventListener("click", () => {
                usuarios.splice(Number(btn.dataset.indice), 1);
                localStorage.setItem("mil_sabores_usuarios", JSON.stringify(usuarios));
                render();
            });
        });
    };

    render();
}
