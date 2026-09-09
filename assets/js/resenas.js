"use strict";

function obtenerResenas() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_RESENAS)) || {};
    } catch {
        return {};
    }
}

function renderResenas(productoId) {
    const contenedor = document.getElementById("contenedor-resenas");
    if (!contenedor) return;

    const resenas = obtenerResenas()[productoId] || [];
    contenedor.innerHTML = resenas.length
        ? resenas.map(r => `
            <article class="card border-0 shadow-sm p-3">
                <strong>${escaparHTML(r.autor)} · ${"⭐".repeat(Number(r.estrellas))}</strong>
                <p class="mb-0 mt-1">${escaparHTML(r.texto)}</p>
            </article>`).join("")
        : `<p class="text-muted">Todavía no hay reseñas. Sé el primero en opinar.</p>`;
}

function configurarResenas() {
    const form = document.getElementById("form-resena");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario(form)) return;

        const id = new URLSearchParams(window.location.search).get("id") || "TC001";
        const resenas = obtenerResenas();
        if (!resenas[id]) resenas[id] = [];

        resenas[id].push({
            autor: document.getElementById("resena-autor").value.trim(),
            estrellas: document.getElementById("resena-estrellas").value,
            texto: document.getElementById("resena-texto").value.trim()
        });

        localStorage.setItem(STORAGE_RESENAS, JSON.stringify(resenas));
        form.reset();
        mostrarMensajeFormulario(form, "Reseña publicada correctamente.", true);
        renderResenas(id);
    });
}
