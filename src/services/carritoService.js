import { getPrecioEfectivo, obtenerProductoPorId } from './productosService.js'

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

/**
 * Obtiene el stock disponible para un producto buscando en el objeto o en el catálogo.
 * @param {object} producto
 * @returns {number|undefined}
 */
export function obtenerStockProducto(producto) {
    if (typeof producto?.stock === 'number' && Number.isFinite(producto.stock)) {
        return producto.stock
    }

    if (producto?.id !== undefined) {
        const enCatalogo = obtenerProductoPorId(producto.id)
        if (enCatalogo && typeof enCatalogo.stock === 'number') {
            return enCatalogo.stock
        }
    }

    return undefined
}

export function agregarAlCarrito(producto, cantidad = 1) {
    if (!producto || typeof producto !== 'object') return false

    const cantAgregar = Number.isInteger(cantidad) && cantidad > 0 ? cantidad : 1
    const stockDisponible = obtenerStockProducto(producto)

    // Si tiene stock registrado y es 0, no se puede agregar
    if (stockDisponible !== undefined && stockDisponible <= 0) {
        return false
    }

    const carrito = listarCarrito()
    const existente = carrito.find((item) => item.id === producto.id)
    const cantidadActual = existente ? existente.cantidad : 0
    const nuevaCantidad = cantidadActual + cantAgregar

    // Validación de stock: no permitir superar el stock disponible
    if (stockDisponible !== undefined && nuevaCantidad > stockDisponible) {
        return false
    }

    const precio = getPrecioEfectivo(producto)
    const stock = stockDisponible !== undefined ? stockDisponible : producto.stock

    const itemNormalizado = {
        ...producto,
        precio,
        stock,
        cantidad: nuevaCantidad,
    }

    const actualizado = existente
        ? carrito.map((item) =>
            item.id === producto.id
                ? { ...item, ...itemNormalizado, cantidad: nuevaCantidad }
                : item
        )
        : [...carrito, itemNormalizado]

    return guardarCarrito(actualizado)
}

export function actualizarCantidad(id, cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
        return false
    }

    const carrito = listarCarrito()
    const itemExistente = carrito.find((item) => item.id === id)

    if (!itemExistente) {
        return false
    }

    const stockDisponible = obtenerStockProducto(itemExistente)

    // Validar que la nueva cantidad no supere el stock
    if (stockDisponible !== undefined && cantidad > stockDisponible) {
        return false
    }

    const actualizado = carrito.map((item) =>
        item.id === id ? { ...item, cantidad, stock: stockDisponible ?? item.stock } : item
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
