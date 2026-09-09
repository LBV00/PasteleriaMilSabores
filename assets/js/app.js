"use strict";

const PRODUCTOS_BASE = [
    {
        id: "TC001",
        nombre: "Torta Pompadour",
        categoria: "TC",
        descripcion: "Torta cuadrada artesanal con capas suaves y decoración de la casa.",
        precio: 28990,
        stock: 10,
        stockCritico: 3,
        imagen: "https://picsum.photos/600/400?random=11"
    },
    {
        id: "TT001",
        nombre: "Torta Selva Negra",
        categoria: "TT",
        descripcion: "Torta circular de chocolate, crema y frutos rojos.",
        precio: 32990,
        stock: 8,
        stockCritico: 2,
        imagen: "https://picsum.photos/600/400?random=12"
    },
    {
        id: "PI001",
        nombre: "Cheesecake Individual",
        categoria: "PI",
        descripcion: "Porción individual cremosa, ideal para acompañar el café.",
        precio: 4990,
        stock: 20,
        stockCritico: 5,
        imagen: "https://picsum.photos/600/400?random=13"
    },
    {
        id: "TC002",
        nombre: "Kuchen de Frutos Rojos",
        categoria: "TC",
        descripcion: "Kuchen artesanal con base crujiente y frutos rojos.",
        precio: 24990,
        stock: 5,
        stockCritico: 3,
        imagen: "https://picsum.photos/600/400?random=14"
    },
    {
        id: "TT002",
        nombre: "Torta Tres Leches",
        categoria: "TT",
        descripcion: "Receta tradicional con bizcocho húmedo y crema.",
        precio: 29990,
        stock: 7,
        stockCritico: 2,
        imagen: "https://picsum.photos/600/400?random=15"
    },
    {
        id: "PI002",
        nombre: "Brownie Gourmet",
        categoria: "PI",
        descripcion: "Brownie individual de chocolate intenso.",
        precio: 3990,
        stock: 25,
        stockCritico: 5,
        imagen: "https://picsum.photos/600/400?random=16"
    }
];

const STORAGE_PRODUCTOS = "mil_sabores_productos";

const STORAGE_CARRITO = "mil_sabores_carrito";

const STORAGE_USUARIOS = "mil_sabores_usuarios";

const STORAGE_RESENAS = "mil_sabores_resenas";

function obtenerProductos() {
    const guardados = localStorage.getItem(STORAGE_PRODUCTOS);
    if (!guardados) {
        localStorage.setItem(STORAGE_PRODUCTOS, JSON.stringify(PRODUCTOS_BASE));
        return [...PRODUCTOS_BASE];
    }
    try {
        return JSON.parse(guardados);
    } catch {
        localStorage.setItem(STORAGE_PRODUCTOS, JSON.stringify(PRODUCTOS_BASE));
        return [...PRODUCTOS_BASE];
    }
}

function guardarProductos(productos) {
    localStorage.setItem(STORAGE_PRODUCTOS, JSON.stringify(productos));
}

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_CARRITO)) || [];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const cantidad = obtenerCarrito().reduce((total, item) => total + Number(item.cantidad), 0);
    document.querySelectorAll("#cart-count").forEach(el => el.textContent = cantidad);
}

function formatoPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    });
}

function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
