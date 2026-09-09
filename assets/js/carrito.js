"use strict";

function agregarAlCarrito(id, cantidad = 1, personalizacion = "") {
    const producto = obtenerProductos().find(p => p.id === id);
    if (!producto) {
        alert("No se encontró el producto.");
        return;
    }

    const carrito = obtenerCarrito();
    const existente = carrito.find(item =>
        item.id === id && item.personalizacion === personalizacion
    );
    const nuevaCantidad = (existente ? existente.cantidad : 0) + Number(cantidad);

    if (nuevaCantidad > Number(producto.stock)) {
        alert(`Solo quedan ${producto.stock} unidades disponibles de ${producto.nombre}.`);
        return;
    }

    if (existente) {
        existente.cantidad = nuevaCantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: Number(cantidad),
            personalizacion
        });
    }

    guardarCarrito(carrito);
    alert("Producto añadido al carrito.");
}

function renderCarrito() {
    const contenedor = document.getElementById("contenedor-items-carro");
    if (!contenedor) return;

    const carrito = obtenerCarrito();
    if (!carrito.length) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <h2 class="h4">Tu carrito está vacío</h2>
                <p class="text-muted">Agrega alguna de nuestras especialidades.</p>
                <a href="productos.html" class="btn btn-danger">Ver productos</a>
            </div>`;
        actualizarTotalCarrito();
        return;
    }

    contenedor.innerHTML = carrito.map((item, indice) => `
        <article class="border-bottom py-3">
            <div class="d-flex justify-content-between gap-3 align-items-center">
                <div>
                    <h2 class="h5 mb-1">${escaparHTML(item.nombre)}</h2>
                    <p class="small text-muted mb-1">${item.personalizacion ? `Mensaje: ${escaparHTML(item.personalizacion)}` : "Sin personalización"}</p>
                    <p class="mb-0 fw-bold">${formatoPrecio(item.precio)} x ${item.cantidad}</p>
                </div>
                <button type="button" class="btn btn-outline-danger btn-eliminar-item" data-indice="${indice}">
                    Eliminar
                </button>
            </div>
        </article>
    `).join("");

    contenedor.querySelectorAll(".btn-eliminar-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const nuevoCarrito = obtenerCarrito().filter((_, i) => i !== Number(btn.dataset.indice));
            guardarCarrito(nuevoCarrito);
            renderCarrito();
        });
    });

    actualizarTotalCarrito();
}

function actualizarTotalCarrito() {
    const totalElemento = document.getElementById("cart-total-pago");
    if (!totalElemento) return;

    const subtotal = obtenerCarrito().reduce((total, item) =>
        total + Number(item.precio) * Number(item.cantidad), 0
    );

    const descuentoAplicado = sessionStorage.getItem("mil_sabores_cupon") === "FELICES50";
    const total = descuentoAplicado ? subtotal * 0.5 : subtotal;
    totalElemento.textContent = formatoPrecio(total);
}

function configurarCupon() {
    const boton = document.getElementById("btn-aplicar-cupon");
    const input = document.getElementById("cupon-descuento");
    const mensaje = document.getElementById("cupon-mensaje");
    if (!boton || !input || !mensaje) return;

    boton.addEventListener("click", () => {
        const codigo = input.value.trim().toUpperCase();
        if (codigo === "FELICES50") {
            sessionStorage.setItem("mil_sabores_cupon", "FELICES50");
            mensaje.textContent = "Cupón válido: 50% de descuento aplicado.";
            mensaje.className = "form-text mt-2 text-success fw-bold";
        } else {
            sessionStorage.removeItem("mil_sabores_cupon");
            mensaje.textContent = "El código ingresado no es válido.";
            mensaje.className = "form-text mt-2 text-danger fw-bold";
        }
        actualizarTotalCarrito();
    });
}

function configurarPago() {
    const boton = document.getElementById("btn-pagar");
    if (!boton) return;

    boton.addEventListener("click", () => {
        if (!obtenerCarrito().length) {
            alert("No puedes realizar una compra con el carrito vacío.");
            return;
        }

        alert("Compra registrada correctamente en esta demostración frontend.");
        guardarCarrito([]);
        sessionStorage.removeItem("mil_sabores_cupon");
        renderCarrito();
    });
}
