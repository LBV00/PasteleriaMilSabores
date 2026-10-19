import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    listarCarrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
} from '../src/services/carritoService.js'

describe('Servicio de carrito', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('debe devolver un carrito vacío cuando no hay elementos guardados', () => {
        const carrito = listarCarrito()
        expect(carrito).toEqual([])
    })

    it('debe devolver un carrito vacío si los datos guardados son JSON inválido', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        localStorage.setItem('milSabores_carrito', 'invalido{')

        const carrito = listarCarrito()
        expect(carrito).toEqual([])
    })

    it('debe agregar un nuevo producto al carrito con cantidad 1', () => {
        const producto = { id: 1, nombre: 'Torta de chocolate', precio: 15990 }
        const resultado = agregarAlCarrito(producto)

        expect(resultado).toBe(true)
        const carrito = listarCarrito()
        expect(carrito.length).toBe(1)
        expect(carrito[0].cantidad).toBe(1)
        expect(carrito[0].nombre).toBe('Torta de chocolate')
    })

    it('debe incrementar la cantidad al agregar un producto que ya estaba en el carrito', () => {
        const producto = { id: 1, nombre: 'Torta de chocolate', precio: 15990 }
        agregarAlCarrito(producto)
        agregarAlCarrito(producto)

        const carrito = listarCarrito()
        expect(carrito.length).toBe(1)
        expect(carrito[0].cantidad).toBe(2)
    })

    it('debe actualizar la cantidad de un producto existente', () => {
        const producto = { id: 1, nombre: 'Torta de chocolate', precio: 15990 }
        agregarAlCarrito(producto)

        const resultado = actualizarCantidad(1, 5)
        expect(resultado).toBe(true)

        const carrito = listarCarrito()
        expect(carrito[0].cantidad).toBe(5)
    })

    it('debe rechazar actualizar cantidad si el valor es menor a 1 o no es entero', () => {
        const producto = { id: 1, nombre: 'Torta', precio: 1000 }
        agregarAlCarrito(producto)

        expect(actualizarCantidad(1, 0)).toBe(false)
        expect(actualizarCantidad(1, -2)).toBe(false)
        expect(actualizarCantidad(1, 2.5)).toBe(false)
    })

    it('debe devolver false al actualizar cantidad de un producto que no está en el carrito', () => {
        expect(actualizarCantidad(999, 2)).toBe(false)
    })

    it('debe eliminar un producto existente del carrito', () => {
        agregarAlCarrito({ id: 1, nombre: 'Torta', precio: 1000 })
        agregarAlCarrito({ id: 2, nombre: 'Galletas', precio: 500 })

        const resultado = eliminarDelCarrito(1)
        expect(resultado).toBe(true)

        const carrito = listarCarrito()
        expect(carrito.length).toBe(1)
        expect(carrito[0].id).toBe(2)
    })

    it('debe devolver false al eliminar un producto que no existe en el carrito', () => {
        expect(eliminarDelCarrito(999)).toBe(false)
    })

    it('debe vaciar el carrito completamente', () => {
        agregarAlCarrito({ id: 1, nombre: 'Torta', precio: 1000 })
        agregarAlCarrito({ id: 2, nombre: 'Galletas', precio: 500 })

        const resultado = vaciarCarrito()
        expect(resultado).toBe(true)

        const carrito = listarCarrito()
        expect(carrito).toEqual([])
    })

    it('debe manejar errores si localStorage.setItem falla al agregar al carrito', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Almacenamiento lleno')
        })

        const resultado = agregarAlCarrito({ id: 1, nombre: 'Torta', precio: 1000 })
        expect(resultado).toBe(false)
    })

    it('debe almacenar el precio de oferta cuando el producto está en oferta con precio válido', () => {
        const productoEnOferta = {
            id: 10,
            nombre: 'Cheesecake',
            precio: 4990,
            enOferta: true,
            precioOferta: 3490,
        }
        agregarAlCarrito(productoEnOferta)

        const carrito = listarCarrito()
        expect(carrito[0].precio).toBe(3490)
    })

    it('debe almacenar el precio normal si la oferta no es válida (precioOferta >= precio)', () => {
        const producto = {
            id: 11,
            nombre: 'Torta',
            precio: 5000,
            enOferta: true,
            precioOferta: 5000, 
        }
        agregarAlCarrito(producto)

        const carrito = listarCarrito()
        expect(carrito[0].precio).toBe(5000)
    })

    it('el total calculado a partir de items del carrito usa el precio efectivo de oferta', () => {
        const productoOferta = {
            id: 12,
            nombre: 'Galletas',
            precio: 2990,
            enOferta: true,
            precioOferta: 1990,
        }
        agregarAlCarrito(productoOferta)
        actualizarCantidad(12, 3)

        const carrito = listarCarrito()
        const total = carrito.reduce((s, item) => s + item.precio * item.cantidad, 0)

        expect(total).toBe(5970)
    })
})
