"use strict";

function tarjetaProducto(producto) {
    const sinStock = Number(producto.stock) <= 0;
    return `
        <article class="col">
            <div class="card producto-card border-0 shadow-sm rounded-4 h-100">
                <img src="${escaparHTML(producto.imagen)}"
                     alt="${escaparHTML(producto.nombre)}"
                     class="card-img-top">
                <div class="card-body p-4">
                    <span class="badge text-bg-light mb-2 align-self-start">${escaparHTML(producto.categoria)}</span>
                    <h3 class="h5 fw-bold text-dark-brown">${escaparHTML(producto.nombre)}</h3>
                    <p class="small text-muted">${escaparHTML(producto.descripcion || "Delicia artesanal de Mil Sabores.")}</p>
                    <p class="fs-5 fw-bold text-danger">${producto.precio == 0 ? "FREE" : formatoPrecio(producto.precio)}</p>
                    <p class="small ${sinStock ? "text-danger" : "text-success"} fw-bold">
                        ${sinStock ? "Sin stock" : `Stock disponible: ${producto.stock}`}
                    </p>
                    <div class="d-flex gap-2 mt-2">
                        <a class="btn btn-outline-primary flex-fill"
                           href="detalle-producto.html?id=${encodeURIComponent(producto.id)}">
                           Ver detalle
                        </a>
                        <button type="button"
                                class="btn btn-danger btn-agregar flex-fill"
                                data-id="${escaparHTML(producto.id)}"
                                ${sinStock ? "disabled" : ""}>
                            ${sinStock ? "Agotado" : "Añadir"}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderProductos(filtro = "TODOS") {
    const contenedor = document.getElementById("productos-destacados");
    if (!contenedor) return;

    const productos = obtenerProductos().filter(producto =>
        filtro === "TODOS" || producto.categoria === filtro
    );

    contenedor.innerHTML = productos.length
        ? productos.map(tarjetaProducto).join("")
        : `<div class="col-12"><div class="alert alert-info">No hay productos en esta categoría.</div></div>`;

    contenedor.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", () => agregarAlCarrito(btn.dataset.id, 1));
    });
}

function filtrarProductos(categoria) {
    document.querySelectorAll("[onclick^='filtrarProductos']").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("onclick").includes(`'${categoria}'`));
    });
    renderProductos(categoria);
}
