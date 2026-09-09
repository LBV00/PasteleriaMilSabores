"use strict";

function renderDetalle() {
    const nombre = document.getElementById("detalle-nombre");
    if (!nombre) return;

    const id = new URLSearchParams(window.location.search).get("id") || "TC001";
    const producto = obtenerProductos().find(p => p.id === id) || obtenerProductos()[0];
    if (!producto) return;

    document.getElementById("breadcrumb-nombre-producto").textContent = producto.nombre;
    document.getElementById("detalle-nombre").textContent = producto.nombre;
    document.getElementById("detalle-precio").textContent =
        producto.precio == 0 ? "FREE" : formatoPrecio(producto.precio);
    document.getElementById("detalle-descripcion").textContent = producto.descripcion;
    const imagen = document.getElementById("detalle-imagen");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    const btn = document.getElementById("btn-detalle-agregar");
    btn.disabled = Number(producto.stock) <= 0;
    btn.addEventListener("click", () => {
        const cantidad = Number(document.getElementById("detalle-cantidad").value);
        const personalizacion = document.getElementById("detalle-personalizado").value.trim();
        agregarAlCarrito(producto.id, cantidad, personalizacion);
    });

    renderResenas(producto.id);
}
