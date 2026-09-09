"use strict";

function configurarAdminProductos() {
    const form = document.getElementById("form-producto");
    if (!form) return;

    let editandoId = null;

    const obtenerProductosAdmin = () => {
        try {
            return JSON.parse(localStorage.getItem("mil_sabores_productos")) || [];
        } catch {
            return [];
        }
    };

    const guardar = productos =>
        localStorage.setItem("mil_sabores_productos", JSON.stringify(productos));

    const render = () => {
        const cuerpo = document.getElementById("inventario-cuerpo");
        const productos = obtenerProductosAdmin();

        cuerpo.innerHTML = productos.map(p => `
            <tr>
                <td>${escapeAdmin(p.id)}</td>
                <td>${escapeAdmin(p.nombre)}</td>
                <td>${escapeAdmin(p.categoria)}</td>
                <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                <td>
                    ${p.stock}
                    ${p.stockCritico !== "" && Number(p.stock) <= Number(p.stockCritico)
                        ? '<span class="alerta-stock d-block mt-1">Stock crítico</span>'
                        : '<span class="stock-ok d-block mt-1">Disponible</span>'}
                </td>
                <td class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-editar" data-id="${escapeAdmin(p.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-borrar" data-id="${escapeAdmin(p.id)}">Eliminar</button>
                </td>
            </tr>
        `).join("");

        cuerpo.querySelectorAll(".btn-editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const producto = obtenerProductosAdmin().find(p => p.id === btn.dataset.id);
                if (!producto) return;

                editandoId = producto.id;
                document.getElementById("prod-codigo").value = producto.id;
                document.getElementById("prod-nombre").value = producto.nombre;
                document.getElementById("prod-categoria").value = producto.categoria;
                document.getElementById("prod-descripcion").value = producto.descripcion || "";
                document.getElementById("prod-precio").value = producto.precio;
                document.getElementById("prod-stock").value = producto.stock;
                document.getElementById("prod-critico").value = producto.stockCritico ?? "";
                document.getElementById("prod-imagen").value = producto.imagen || "";
                document.getElementById("form-titulo").textContent = "Editar Producto";
                form.querySelector("button[type='submit']").textContent = "Actualizar Producto";
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });

        cuerpo.querySelectorAll(".btn-borrar").forEach(btn => {
            btn.addEventListener("click", () => {
                const productosNuevos = obtenerProductosAdmin().filter(p => p.id !== btn.dataset.id);
                guardar(productosNuevos);
                render();
                if (typeof renderProductos === "function") renderProductos("TODOS");
            });
        });
    };

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario(form)) {
            mostrarMensajeFormulario(form, "Revisa los campos del producto.");
            return;
        }

        const productos = obtenerProductosAdmin();
        const producto = {
            id: document.getElementById("prod-codigo").value.trim().toUpperCase(),
            nombre: document.getElementById("prod-nombre").value.trim(),
            categoria: document.getElementById("prod-categoria").value,
            descripcion: document.getElementById("prod-descripcion").value.trim(),
            precio: Number(document.getElementById("prod-precio").value),
            stock: Number(document.getElementById("prod-stock").value),
            stockCritico: document.getElementById("prod-critico").value === "" ? "" : Number(document.getElementById("prod-critico").value),
            imagen: document.getElementById("prod-imagen").value.trim() ||
                "https://picsum.photos/600/400?random=" + Date.now()
        };

        if (!editandoId && productos.some(p => p.id === producto.id)) {
            mostrarMensajeFormulario(form, "El código de producto ya existe.");
            return;
        }

        const indice = productos.findIndex(p => p.id === editandoId);
        if (indice >= 0) {
            productos[indice] = producto;
        } else {
            productos.push(producto);
        }

        guardar(productos);
        form.reset();
        editandoId = null;
        document.getElementById("form-titulo").textContent = "Registrar Nuevo Pastel";
        form.querySelector("button[type='submit']").textContent = "Guardar Producto";
        mostrarMensajeFormulario(form, "Producto guardado correctamente.", true);
        render();
    });

    render();
    configurarCamposEnVivo(form);
}
