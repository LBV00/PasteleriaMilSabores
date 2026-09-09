"use strict";

/* =========================================================
   PRODUCTOS BASE
   ========================================================= */

const PRODUCTOS_BASE = [
    {
        id: "TC001",
        nombre: "Torta Pompadour",
        categoria: "TC",
        descripcion: "Torta cuadrada artesanal con capas suaves y decoración de la casa.",
        precio: 28990,
        stock: 10,
        stockCritico: 3,
        imagen: "assets/img/torta-chocolate.jpg"
    },
    {
        id: "TT001",
        nombre: "Torta Selva Negra",
        categoria: "TT",
        descripcion: "Torta circular de chocolate, crema y frutos rojos.",
        precio: 32990,
        stock: 8,
        stockCritico: 2,
        imagen: "assets/img/torta-frutas.jpg"
    },
    {
        id: "PI001",
        nombre: "Cheesecake Individual",
        categoria: "PI",
        descripcion: "Porción individual cremosa, ideal para acompañar el café.",
        precio: 4990,
        stock: 20,
        stockCritico: 5,
        imagen: "assets/img/cupcake.jpg"
    },
    {
        id: "TC002",
        nombre: "Kuchen de Frutos Rojos",
        categoria: "TC",
        descripcion: "Kuchen artesanal con base crujiente y frutos rojos.",
        precio: 24990,
        stock: 5,
        stockCritico: 3,
        imagen: "assets/img/torta-frutas.jpg"
    },
    {
        id: "TT002",
        nombre: "Torta Tres Leches",
        categoria: "TT",
        descripcion: "Receta tradicional con bizcocho húmedo y crema.",
        precio: 29990,
        stock: 7,
        stockCritico: 2,
        imagen: "assets/img/torta-manjar.jpg"
    },
    {
        id: "PI002",
        nombre: "Brownie Gourmet",
        categoria: "PI",
        descripcion: "Brownie individual de chocolate intenso.",
        precio: 3990,
        stock: 25,
        stockCritico: 5,
        imagen: "assets/img/cupcake.jpg"
    },
    {
        id: "TC003",
        nombre: "Kuchen de Manzana",
        categoria: "TC",
        descripcion: "Kuchen artesanal con finas láminas de manzana caramelizada, canela y base crujiente al estilo sureño.",
        precio: 22990,
        stock: 6,
        stockCritico: 2,
        imagen: "assets/img/kuchen-manzana.png"
    },
    {
        id: "PI003",
        nombre: "Trufas de Chocolate",
        categoria: "PI",
        descripcion: "Caja de 6 trufas artesanales de chocolate amargo con distintos rellenos gourmet.",
        precio: 8990,
        stock: 15,
        stockCritico: 4,
        imagen: "assets/img/trufas-chocolate.png"
    },
    {
        id: "TT003",
        nombre: "Milhojas de Manjar",
        categoria: "TT",
        descripcion: "Torta de hojaldre crujiente con capas de manjar blanco y crema chantilly, esencia de la pastelería chilena.",
        precio: 27990,
        stock: 9,
        stockCritico: 2,
        imagen: "assets/img/milhojas-manjar.png"
    },
    {
        id: "PI004",
        nombre: "Cupcakes de Frutilla",
        categoria: "PI",
        descripcion: "Pack de 4 cupcakes de vainilla con frosting de frutilla y decoración artesanal. Perfectos para celebrar.",
        precio: 7490,
        stock: 18,
        stockCritico: 5,
        imagen: "assets/img/cupcakes-frutilla.png"
    }
];

const STORAGE_PRODUCTOS = "mil_sabores_productos";
const STORAGE_CARRITO = "mil_sabores_carrito";
const STORAGE_USUARIOS = "mil_sabores_usuarios";
const STORAGE_RESENAS = "mil_sabores_resenas";


/* =========================================================
   PRODUCTOS
   ========================================================= */

function obtenerProductos() {

    let productos;

    try {
        const guardados = localStorage.getItem(STORAGE_PRODUCTOS);

        if (!guardados) {
            productos = [...PRODUCTOS_BASE];

        } else {
            productos = JSON.parse(guardados);

            if (!Array.isArray(productos)) {
                productos = [...PRODUCTOS_BASE];
            }
        }

    } catch {
        productos = [...PRODUCTOS_BASE];
    }

    /*
     * Si existían productos antiguos con imágenes de Picsum,
     * los reemplazamos por las imágenes reales de /assets/img.
     */
    productos = productos.map(producto => {

        const base = PRODUCTOS_BASE.find(p => p.id === producto.id);

        if (base) {

            if (
                !producto.imagen ||
                producto.imagen.includes("picsum.photos")
            ) {
                producto.imagen = base.imagen;
            }
        }

        return producto;
    });

    /*
     * Agrega los productos nuevos de PRODUCTOS_BASE que aún no
     * estén en la lista guardada (para que aparezcan al actualizar).
     */
    PRODUCTOS_BASE.forEach(base => {
        const existe = productos.some(p => p.id === base.id);
        if (!existe) {
            productos.push({ ...base });
        }
    });

    localStorage.setItem(
        STORAGE_PRODUCTOS,
        JSON.stringify(productos)
    );

    return productos;
}


function guardarProductos(productos) {

    localStorage.setItem(
        STORAGE_PRODUCTOS,
        JSON.stringify(productos)
    );
}


/* =========================================================
   CARRITO
   ========================================================= */

function obtenerCarrito() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_CARRITO)
        ) || [];

    } catch {

        return [];
    }
}


function guardarCarrito(carrito) {

    localStorage.setItem(
        STORAGE_CARRITO,
        JSON.stringify(carrito)
    );

    actualizarContadorCarrito();
}


function actualizarContadorCarrito() {

    const cantidad = obtenerCarrito().reduce(
        (total, item) =>
            total + Number(item.cantidad || 0),
        0
    );

    document
        .querySelectorAll("#cart-count")
        .forEach(elemento => {
            elemento.textContent = cantidad;
        });
}


/* =========================================================
   FORMATO DE PRECIO
   ========================================================= */

function formatoPrecio(valor) {

    return Number(valor).toLocaleString(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }
    );
}


/* =========================================================
   SEGURIDAD HTML
   ========================================================= */

function escaparHTML(texto) {

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   INICIALIZACIÓN GENERAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    actualizarContadorCarrito();

    if (typeof renderProductos === "function") {
        renderProductos("TODOS");
    }

    if (typeof renderCarrito === "function") {
        renderCarrito();
    }

    if (typeof configurarCupon === "function") {
        configurarCupon();
    }

    if (typeof configurarPago === "function") {
        configurarPago();
    }

    if (typeof renderDetalle === "function") {
        renderDetalle();
    }

    if (typeof configurarLogin === "function") {
        configurarLogin();
    }

    if (typeof configurarRegistro === "function") {
        configurarRegistro();
    }

    if (typeof configurarContacto === "function") {
        configurarContacto();
    }

    if (typeof configurarAdminProductos === "function") {
        configurarAdminProductos();
    }

    if (typeof configurarAdminUsuarios === "function") {
        configurarAdminUsuarios();
    }

    if (typeof configurarMenuAccesible === "function") {
        configurarMenuAccesible();
    }

});