import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    listarProductos,
    obtenerProductoPorId,
    actualizarStock,
    validarStockDisponible,
    descontarStock,
} from '../src/services/productosService.js'
import {
    agregarAlCarrito,
    actualizarCantidad,
    listarCarrito,
} from '../src/services/carritoService.js'
import { crearPedido } from '../src/services/pedidosService.js'

describe('Control de Stock e Inventario', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const datosEntrega = {
        nombre: 'Carolina Perez',
        email: 'carolina@example.com',
        telefono: '+56911223344',
        direccion: 'Calle Los Olivos 123',
        comuna: 'Providencia',
        region: 'Región Metropolitana',
    }

    it('cada producto del catálogo base posee una propiedad stock numérica válida', () => {
        const productos = listarProductos()
        expect(productos.length).toBeGreaterThan(0)

        productos.forEach((p) => {
            expect(typeof p.stock).toBe('number')
            expect(Number.isInteger(p.stock)).toBe(true)
            expect(p.stock).toBeGreaterThanOrEqual(0)
        })
    })

    it('permite agregar al carrito un producto que cuenta con stock disponible', () => {
        // Torta de chocolate tiene stock inicial de 15
        const producto = obtenerProductoPorId(1)
        expect(producto.stock).toBeGreaterThan(0)

        const resultado = agregarAlCarrito(producto)
        expect(resultado).toBe(true)

        const carrito = listarCarrito()
        expect(carrito.length).toBe(1)
        expect(carrito[0].cantidad).toBe(1)
    })

    it('rechaza agregar al carrito un producto agotado (stock = 0)', () => {
        // Rollo de canela (id: 19) tiene stock 0 inicial
        const productoAgotado = obtenerProductoPorId(19)
        expect(productoAgotado.stock).toBe(0)

        const resultado = agregarAlCarrito(productoAgotado)
        expect(resultado).toBe(false)

        const carrito = listarCarrito()
        expect(carrito.length).toBe(0)
    })

    it('no permite que el cliente supere el stock disponible al agregar unidades', () => {
        // Establecer un producto con stock exacto de 3
        actualizarStock(4, 3)
        const producto = obtenerProductoPorId(4)

        expect(agregarAlCarrito(producto, 2)).toBe(true)
        expect(agregarAlCarrito(producto, 1)).toBe(true)
        // Intentar agregar una 4ta unidad debe fallar porque el stock es 3
        expect(agregarAlCarrito(producto, 1)).toBe(false)

        const carrito = listarCarrito()
        expect(carrito[0].cantidad).toBe(3)
    })

    it('permite modificar la cantidad dentro del límite y rechaza superar el stock', () => {
        actualizarStock(5, 4)
        const producto = obtenerProductoPorId(5)
        agregarAlCarrito(producto, 1)

        // Modificar a 3 (dentro del límite)
        expect(actualizarCantidad(5, 3)).toBe(true)
        expect(listarCarrito()[0].cantidad).toBe(3)

        // Modificar a 4 (límite exacto)
        expect(actualizarCantidad(5, 4)).toBe(true)
        expect(listarCarrito()[0].cantidad).toBe(4)

        // Modificar a 5 (supera el stock disponible de 4) -> debe ser rechazado
        expect(actualizarCantidad(5, 5)).toBe(false)
        // La cantidad anterior se preserva
        expect(listarCarrito()[0].cantidad).toBe(4)
    })

    it('rechaza cantidades negativas o iguales a cero al actualizar el carrito', () => {
        const producto = obtenerProductoPorId(1)
        agregarAlCarrito(producto, 1)

        expect(actualizarCantidad(1, 0)).toBe(false)
        expect(actualizarCantidad(1, -1)).toBe(false)
        expect(actualizarCantidad(1, -50)).toBe(false)
        expect(listarCarrito()[0].cantidad).toBe(1)
    })

    it('valida el stock antes de confirmar un pedido y rechaza si excede el inventario', () => {
        actualizarStock(6, 2)

        const productosCarrito = [
            { id: 6, nombre: 'Torta de frutilla', precio: 17990, cantidad: 5 },
        ]

        const validacion = validarStockDisponible(productosCarrito)
        expect(validacion.ok).toBe(false)
        expect(validacion.error).toContain('No hay suficiente stock')

        const resultadoPedido = crearPedido(datosEntrega, productosCarrito)
        expect(resultadoPedido.ok).toBe(false)
        expect(resultadoPedido.error).toContain('No hay suficiente stock')

        // El stock original no debe haber cambiado
        expect(obtenerProductoPorId(6).stock).toBe(2)
    })

    it('una compra válida descuenta el stock correctamente y persiste en LocalStorage', () => {
        // Fijamos stock inicial en 10
        actualizarStock(1, 10)
        actualizarStock(2, 5)

        const productosCarrito = [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 3 },
            { id: 2, nombre: 'Cheesecake', precio: 4990, cantidad: 2 },
        ]

        const res = crearPedido(datosEntrega, productosCarrito)
        expect(res.ok).toBe(true)

        // Comprobamos que el stock se descontó correctamente
        expect(obtenerProductoPorId(1).stock).toBe(7) // 10 - 3
        expect(obtenerProductoPorId(2).stock).toBe(3) // 5 - 2

        // Verificar persistencia directa en LocalStorage
        const guardados = JSON.parse(localStorage.getItem('milSabores_productos'))
        const p1 = guardados.find((p) => p.id === 1)
        const p2 = guardados.find((p) => p.id === 2)
        expect(p1.stock).toBe(7)
        expect(p2.stock).toBe(3)
    })

    it('una compra inválida no descuenta el stock de ningún producto', () => {
        actualizarStock(1, 10)

        // Carrito con un producto existente y datos de entrega inválidos (sin email)
        const res = crearPedido({ ...datosEntrega, email: '' }, [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 4 },
        ])

        expect(res.ok).toBe(false)
        // El stock no se debe tocar
        expect(obtenerProductoPorId(1).stock).toBe(10)
    })

    it('el descuento de stock nunca produce valores negativos', () => {
        actualizarStock(3, 2)
        descontarStock([{ id: 3, cantidad: 10 }])

        // Debe acotarse a 0 y no bajar a -8
        expect(obtenerProductoPorId(3).stock).toBe(0)
    })

    it('el administrador puede actualizar el stock manualmente y este persiste', () => {
        expect(actualizarStock(8, 25)).toBe(true)
        expect(obtenerProductoPorId(8).stock).toBe(25)

        // Rechaza valores no válidos
        expect(actualizarStock(8, -5)).toBe(false)
        expect(actualizarStock(8, 2.5)).toBe(false)
        expect(obtenerProductoPorId(8).stock).toBe(25)
    })
})
