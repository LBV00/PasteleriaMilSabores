"use strict";


/* =========================================================
   TARJETA DE PRODUCTO
   ========================================================= */

function tarjetaProducto(producto) {

    const sinStock = Number(producto.stock) <= 0;

    return `
        <article class="col">

            <div class="card producto-card border-0 shadow-sm rounded-4 h-100">

                <img
                    src="${escaparHTML(producto.imagen)}"
                    alt="${escaparHTML(producto.nombre)}"
                    class="card-img-top"
                >

                <div class="card-body p-4 d-flex flex-column">

                    <span class="badge text-bg-light mb-2 align-self-start">
                        ${escaparHTML(producto.categoria)}
                    </span>

                    <h3 class="h5 fw-bold text-dark-brown">
                        ${escaparHTML(producto.nombre)}
                    </h3>

                    <p class="small text-muted">
                        ${escaparHTML(
                            producto.descripcion ||
                            "Delicia artesanal de Mil Sabores."
                        )}
                    </p>

                    <p class="fs-5 fw-bold text-danger mb-1">
                        ${
                            Number(producto.precio) === 0
                                ? "FREE"
                                : formatoPrecio(producto.precio)
                        }
                    </p>

                    <p class="small ${
                        sinStock
                            ? "text-danger"
                            : "text-success"
                    } fw-bold">

                        ${
                            sinStock
                                ? "Sin stock"
                                : `Stock disponible: ${producto.stock}`
                        }

                    </p>

                    <div class="d-flex gap-2 mt-auto">

                        <a
                            class="btn btn-outline-primary flex-fill"
                            href="detalle-producto.html?id=${encodeURIComponent(producto.id)}"
                        >
                            Ver detalle
                        </a>

                        <button
                            type="button"
                            class="btn btn-danger btn-agregar flex-fill"
                            data-id="${escaparHTML(producto.id)}"
                            ${sinStock ? "disabled" : ""}
                        >
                            ${sinStock ? "Agotado" : "Añadir"}
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   FILTRAR PRODUCTOS
   ========================================================= */

function productoCoincideConFiltro(producto, filtro) {

    if (filtro === "TODOS") {
        return true;
    }

    if (filtro === "TORTAS") {
        return (
            producto.categoria === "TC" ||
            producto.categoria === "TT"
        );
    }

    if (filtro === "KUCHENES") {

        return (
            producto.nombre
                .toLowerCase()
                .includes("kuchen")
        );
    }

    if (filtro === "CUPCAKES") {

        return (
            producto.nombre
                .toLowerCase()
                .includes("cupcake")
        );
    }

    if (filtro === "POSTRES") {

        return producto.categoria === "PI";
    }

    return producto.categoria === filtro;
}


/* =========================================================
   RENDERIZAR PRODUCTOS
   ========================================================= */

function renderProductos(filtro = "TODOS") {

    const contenedor =
        document.getElementById("productos-destacados");

    if (!contenedor) {
        return;
    }

    let productos = obtenerProductos();

    productos = productos.filter(producto =>
        productoCoincideConFiltro(producto, filtro)
    );


    /*
     * En el HOME mostramos solamente las primeras 4
     * especialidades.
     *
     * En productos.html mostramos todos.
     */
    const esInicio =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname.endsWith("/");

    if (esInicio && filtro === "TODOS") {

        productos = productos.slice(0, 4);

    }


    if (!productos.length) {

        contenedor.innerHTML = `
            <div class="col-12">

                <div class="alert alert-info text-center">

                    No hay productos disponibles
                    en esta categoría.

                </div>

            </div>
        `;

        return;
    }


    contenedor.innerHTML =
        productos
            .map(tarjetaProducto)
            .join("");


    contenedor
        .querySelectorAll(".btn-agregar")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    agregarAlCarrito(
                        btn.dataset.id,
                        1
                    );

                }
            );

        });
}


/* =========================================================
   BOTONES DE FILTRO
   ========================================================= */

function filtrarProductos(categoria) {

    document
        .querySelectorAll("[onclick^='filtrarProductos']")
        .forEach(btn => {

            const onclick =
                btn.getAttribute("onclick") || "";

            btn.classList.toggle(
                "active",
                onclick.includes(
                    `'${categoria}'`
                )
            );

        });


    renderProductos(categoria);
}