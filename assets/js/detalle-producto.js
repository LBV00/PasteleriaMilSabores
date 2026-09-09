"use strict";


function renderDetalle() {

    const contenedor =
        document.getElementById(
            "detalle-producto"
        );

    if (!contenedor) {
        return;
    }


    const id =
        new URLSearchParams(
            window.location.search
        ).get("id");


    const productos =
        obtenerProductos();


    const producto =
        productos.find(
            p => p.id === id
        ) || productos[0];


    if (!producto) {

        contenedor.innerHTML = `

            <div class="alert alert-danger">
                No se encontró el producto.
            </div>

        `;

        return;
    }


    const sinStock =
        Number(producto.stock) <= 0;


    contenedor.innerHTML = `

        <div class="row align-items-center g-5">

            <div class="col-md-6">

                <img
                    src="${escaparHTML(producto.imagen)}"
                    alt="${escaparHTML(producto.nombre)}"
                    class="img-fluid rounded-4 shadow-lg w-100"
                >

            </div>


            <div class="col-md-6">

                <span class="badge text-bg-light mb-3">
                    ${escaparHTML(producto.categoria)}
                </span>

                <h1 class="heading-pacific text-dark-brown">
                    ${escaparHTML(producto.nombre)}
                </h1>

                <p class="fs-3 fw-bold text-danger">
                    ${
                        Number(producto.precio) === 0
                            ? "FREE"
                            : formatoPrecio(producto.precio)
                    }
                </p>

                <p class="text-muted">
                    ${escaparHTML(producto.descripcion)}
                </p>

                <p class="${
                    sinStock
                        ? "text-danger"
                        : "text-success"
                } fw-bold">

                    ${
                        sinStock
                            ? "Producto sin stock"
                            : `Stock disponible: ${producto.stock}`
                    }

                </p>


                <div class="mb-3">

                    <label
                        for="detalle-cantidad"
                        class="form-label fw-bold"
                    >
                        Cantidad
                    </label>

                    <input
                        type="number"
                        id="detalle-cantidad"
                        class="form-control"
                        value="1"
                        min="1"
                        max="${producto.stock}"
                        ${sinStock ? "disabled" : ""}
                    >

                </div>


                <div class="mb-3">

                    <label
                        for="detalle-personalizado"
                        class="form-label fw-bold"
                    >
                        Mensaje personalizado
                    </label>

                    <textarea
                        id="detalle-personalizado"
                        class="form-control"
                        rows="3"
                        maxlength="100"
                        placeholder="Escribe un mensaje para tu producto..."
                        ${sinStock ? "disabled" : ""}
                    ></textarea>

                </div>


                <button
                    type="button"
                    id="btn-detalle-agregar"
                    class="btn btn-danger btn-lg w-100"
                    ${sinStock ? "disabled" : ""}
                >
                    ${
                        sinStock
                            ? "Agotado"
                            : "Añadir al carrito"
                    }
                </button>


                <a
                    href="productos.html"
                    class="btn btn-outline-secondary w-100 mt-2"
                >
                    Volver a productos
                </a>

            </div>

        </div>

    `;


    const boton =
        document.getElementById(
            "btn-detalle-agregar"
        );


    if (boton && !sinStock) {

        boton.addEventListener(
            "click",
            () => {

                const cantidad =
                    Number(
                        document.getElementById(
                            "detalle-cantidad"
                        ).value
                    );


                const personalizacion =
                    document.getElementById(
                        "detalle-personalizado"
                    ).value.trim();


                if (
                    cantidad < 1 ||
                    cantidad > Number(producto.stock)
                ) {

                    alert(
                        "La cantidad seleccionada no es válida."
                    );

                    return;
                }


                agregarAlCarrito(
                    producto.id,
                    cantidad,
                    personalizacion
                );

            }
        );

    }

}