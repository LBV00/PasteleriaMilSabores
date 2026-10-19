import { vaciarCarrito } from './carritoService.js'

const CLAVE_PEDIDOS = 'milSabores_pedidos'
const CLAVE_ULTIMO_PEDIDO = 'milSabores_ultimo_pedido'

function obtenerPedidosGuardados() {
    try {
        const datos = localStorage.getItem(CLAVE_PEDIDOS)
        if (datos === null) return []
        const parsed = JSON.parse(datos)
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('No se pudieron leer los pedidos:', error)
        return []
    }
}

function guardarPedidos(pedidos) {
    try {
        localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos))
        return true
    } catch (error) {
        console.error('No se pudieron guardar los pedidos:', error)
        return false
    }
}

function validarEmail(email) {
    if (!email) return false
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email.trim())
}

function validarTelefono(telefono) {
    if (!telefono) return false

    const digitos = telefono.replace(/[\s+-]/g, '')
    return digitos.length >= 8 && digitos.length <= 15 && /^\d+$/.test(digitos)
}

export function validarDatosEntrega(datos) {
    const errores = {}

    if (!datos?.nombre || !datos.nombre.trim()) {
        errores.nombre = 'El nombre completo es obligatorio.'
    }

    if (!datos?.email || !datos.email.trim()) {
        errores.email = 'El correo electrónico es obligatorio.'
    } else if (!validarEmail(datos.email)) {
        errores.email = 'Ingresa un correo electrónico válido.'
    }

    if (!datos?.telefono || !datos.telefono.trim()) {
        errores.telefono = 'El teléfono de contacto es obligatorio.'
    } else if (!validarTelefono(datos.telefono)) {
        errores.telefono = 'Ingresa un número telefónico válido (entre 8 y 15 dígitos).'
    }

    if (!datos?.direccion || !datos.direccion.trim()) {
        errores.direccion = 'La dirección de entrega es obligatoria.'
    }

    if (!datos?.comuna || !datos.comuna.trim()) {
        errores.comuna = 'La comuna es obligatoria.'
    }

    if (!datos?.region || !datos.region.trim()) {
        errores.region = 'La región es obligatoria.'
    }

    return {
        esValido: Object.keys(errores).length === 0,
        errores,
    }
}

export function crearPedido(datosEntrega, productosCarrito) {
    if (!Array.isArray(productosCarrito) || productosCarrito.length === 0) {
        return {
            ok: false,
            error: 'No se puede crear un pedido con el carrito vacío.',
        }
    }

    const validacion = validarDatosEntrega(datosEntrega)
    if (!validacion.esValido) {
        return {
            ok: false,
            error: 'Los datos de entrega contienen errores.',
            errores: validacion.errores,
        }
    }

    const items = productosCarrito.map((item) => {
        const precio = Number(item.precio) || 0
        const cantidad = Number.isInteger(item.cantidad) && item.cantidad > 0 ? item.cantidad : 1

        return {
            id: item.id,
            nombre: item.nombre,
            precio,
            cantidad,
            subtotal: precio * cantidad,
        }
    })

    const total = items.reduce((suma, item) => suma + item.subtotal, 0)
    const cantidadTotal = items.reduce((suma, item) => suma + item.cantidad, 0)

    const nuevoPedido = {
        id: `PED-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        fecha: new Date().toISOString(),
        items,
        total,
        cantidadTotal,
        cliente: {
            nombre: datosEntrega.nombre.trim(),
            email: datosEntrega.email.trim().toLowerCase(),
            telefono: datosEntrega.telefono.trim(),
            direccion: datosEntrega.direccion.trim(),
            comuna: datosEntrega.comuna.trim(),
            region: datosEntrega.region.trim(),
            indicaciones: datosEntrega.indicaciones ? datosEntrega.indicaciones.trim() : '',
        },
        estado: 'confirmado',
    }

    const pedidosExistentes = obtenerPedidosGuardados()
    const guardadoExitoso = guardarPedidos([...pedidosExistentes, nuevoPedido])

    if (!guardadoExitoso) {
        return {
            ok: false,
            error: 'No se pudo registrar el pedido en el almacenamiento.',
        }
    }

    try {
        localStorage.setItem(CLAVE_ULTIMO_PEDIDO, JSON.stringify(nuevoPedido))
    } catch (e) {
        console.error('No se pudo guardar el último pedido en caché:', e)
    }

    vaciarCarrito()

    return {
        ok: true,
        pedido: nuevoPedido,
    }
}

export function obtenerPedidoPorId(id) {
    if (!id) return null

    try {
        const ultimo = localStorage.getItem(CLAVE_ULTIMO_PEDIDO)
        if (ultimo) {
            const parsed = JSON.parse(ultimo)
            if (parsed && parsed.id === id) {
                return parsed
            }
        }
    } catch (e) {
        console.error('Error al leer último pedido:', e)
    }

    const pedidos = obtenerPedidosGuardados()
    return pedidos.find((p) => p.id === id) || null
}

export function obtenerUltimoPedido() {
    try {
        const ultimo = localStorage.getItem(CLAVE_ULTIMO_PEDIDO)
        if (ultimo) {
            return JSON.parse(ultimo)
        }
    } catch (e) {
        console.error('Error al leer último pedido:', e)
    }

    const pedidos = obtenerPedidosGuardados()
    return pedidos.length > 0 ? pedidos[pedidos.length - 1] : null
}

export function listarPedidos() {
    return obtenerPedidosGuardados()
}
