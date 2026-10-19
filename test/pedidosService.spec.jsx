import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    crearPedido,
    obtenerPedidoPorId,
    obtenerUltimoPedido,
    listarPedidos,
    validarDatosEntrega,
} from '../src/services/pedidosService.js'
import { listarCarrito, agregarAlCarrito } from '../src/services/carritoService.js'

describe('Servicio de pedidos (pedidosService)', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const datosEntregaValidos = {
        nombre: 'Valeria Castro',
        email: 'valeria@example.com',
        telefono: '+56987654321',
        direccion: 'Calle Los Alerces 456',
        comuna: 'Ñuñoa',
        region: 'Región Metropolitana',
        indicaciones: 'Dejar en conserjería',
    }

    const productosCarritoValidos = [
        { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 2 },
        { id: 2, nombre: 'Cheesecake', precio: 4990, cantidad: 1 },
    ]

    describe('validarDatosEntrega', () => {
        it('debe validar que los campos obligatorios no estén vacíos', () => {
            const resultado = validarDatosEntrega({})
            expect(resultado.esValido).toBe(false)
            expect(resultado.errores.nombre).toBeDefined()
            expect(resultado.errores.email).toBeDefined()
            expect(resultado.errores.telefono).toBeDefined()
            expect(resultado.errores.direccion).toBeDefined()
            expect(resultado.errores.comuna).toBeDefined()
            expect(resultado.errores.region).toBeDefined()
        })

        it('debe rechazar un correo con formato inválido', () => {
            const resultado = validarDatosEntrega({
                ...datosEntregaValidos,
                email: 'correo-invalido-sin-arroba',
            })
            expect(resultado.esValido).toBe(false)
            expect(resultado.errores.email).toBe('Ingresa un correo electrónico válido.')
        })

        it('debe rechazar un teléfono con formato o longitud inválida', () => {
            const resultadoCorto = validarDatosEntrega({
                ...datosEntregaValidos,
                telefono: '123',
            })
            expect(resultadoCorto.esValido).toBe(false)
            expect(resultadoCorto.errores.telefono).toBeDefined()

            const resultadoLetras = validarDatosEntrega({
                ...datosEntregaValidos,
                telefono: 'telefonoConLetras',
            })
            expect(resultadoLetras.esValido).toBe(false)
        })

        it('debe aceptar datos de entrega válidos', () => {
            const resultado = validarDatosEntrega(datosEntregaValidos)
            expect(resultado.esValido).toBe(true)
            expect(Object.keys(resultado.errores).length).toBe(0)
        })
    })

    describe('crearPedido', () => {
        it('no debe permitir crear un pedido con el carrito vacío', () => {
            const resultado = crearPedido(datosEntregaValidos, [])
            expect(resultado.ok).toBe(false)
            expect(resultado.error).toBe(
                'No se puede crear un pedido con el carrito vacío.'
            )
        })

        it('no debe permitir crear un pedido si los datos de entrega son inválidos', () => {
            const resultado = crearPedido({}, productosCarritoValidos)
            expect(resultado.ok).toBe(false)
            expect(resultado.error).toBe('Los datos de entrega contienen errores.')
        })

        it('debe registrar el pedido exitosamente, calcular totales y vaciar el carrito', () => {

            agregarAlCarrito({ id: 1, nombre: 'Torta de chocolate', precio: 15990 })
            expect(listarCarrito().length).toBe(1)

            const resultado = crearPedido(datosEntregaValidos, productosCarritoValidos)

            expect(resultado.ok).toBe(true)
            expect(resultado.pedido).toBeDefined()
            expect(resultado.pedido.id).toMatch(/^PED-\d+-\d+$/)
            expect(resultado.pedido.estado).toBe('confirmado')

            expect(resultado.pedido.total).toBe(36970)
            expect(resultado.pedido.cantidadTotal).toBe(3)
            expect(resultado.pedido.items.length).toBe(2)

            expect(listarCarrito().length).toBe(0)
        })

        it('no debe vaciar el carrito si ocurre un error al guardar el pedido en almacenamiento', () => {
            agregarAlCarrito({ id: 1, nombre: 'Torta de chocolate', precio: 15990 })
            expect(listarCarrito().length).toBe(1)

            vi.spyOn(console, 'error').mockImplementation(() => {})
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key) => {
                if (key === 'milSabores_pedidos') {
                    throw new Error('Storage quota exceeded')
                }
            })

            const resultado = crearPedido(datosEntregaValidos, productosCarritoValidos)

            expect(resultado.ok).toBe(false)
            expect(resultado.error).toBe(
                'No se pudo registrar el pedido en el almacenamiento.'
            )

            expect(listarCarrito().length).toBe(1)
        })
    })

    describe('obtenerPedidoPorId y obtenerUltimoPedido', () => {
        it('debe recuperar el pedido por su identificador único', () => {
            const res = crearPedido(datosEntregaValidos, productosCarritoValidos)
            const idGenerado = res.pedido.id

            const recuperado = obtenerPedidoPorId(idGenerado)
            expect(recuperado).not.toBeNull()
            expect(recuperado.id).toBe(idGenerado)
            expect(recuperado.cliente.nombre).toBe('Valeria Castro')
        })

        it('debe devolver null si el identificador no existe o es nulo', () => {
            expect(obtenerPedidoPorId('PED-NO-EXISTE')).toBeNull()
            expect(obtenerPedidoPorId(null)).toBeNull()
        })

        it('debe obtener el último pedido registrado', () => {
            const res = crearPedido(datosEntregaValidos, productosCarritoValidos)
            const ultimo = obtenerUltimoPedido()

            expect(ultimo).not.toBeNull()
            expect(ultimo.id).toBe(res.pedido.id)
        })

        it('debe listar todos los pedidos registrados', () => {
            crearPedido(datosEntregaValidos, productosCarritoValidos)
            const todos = listarPedidos()
            expect(Array.isArray(todos)).toBe(true)
            expect(todos.length).toBe(1)
        })
    })
})
