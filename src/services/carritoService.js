import { getPrecioEfectivo } from './productosService.js'

const CLAVE_CARRITO = 'milSabores_carrito'

export function listarCarrito() {
    try {
        const guardados = localStorage.getItem(CLAVE_CARRITO)

        if (guardados === null) {
            return []
        }

        const carrito = JSON.parse(guardados)
        return Array.isArray(carrito) ? carrito : []
    } catch (error) {
        console.error('No se pudo leer el carrito:', error)
        return []
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
        return true
    } catch (error) {
        console.error('No se pudo guardar el carrito:', error)
        return false
    }
}

export function agregarAlCarrito(producto) {
    const carrito = listarCarrito()
    const existente = carrito.find((item) => item.id === producto.id)

    const precio = getPrecioEfectivo(producto)

    const actualizado = existente
        ? carrito.map((item) =>
            item.id === producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
        )
        : [...carrito, { ...producto, precio, cantidad: 1 }]

    return guardarCarrito(actualizado)
}

export function actualizarCantidad(id, cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
        return false
    }

    const carrito = listarCarrito()
    const existe = carrito.some((item) => item.id === id)

    if (!existe) {
        return false
    }

    const actualizado = carrito.map((item) =>
        item.id === id ? { ...item, cantidad } : item
    )

    return guardarCarrito(actualizado)
}

export function eliminarDelCarrito(id) {
    const carrito = listarCarrito()
    const actualizado = carrito.filter((item) => item.id !== id)

    if (actualizado.length === carrito.length) {
        return false
    }

    return guardarCarrito(actualizado)
}

export function vaciarCarrito() {
    return guardarCarrito([])
}
