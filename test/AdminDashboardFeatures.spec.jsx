import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Admin from '../src/pages/Admin.jsx'
import { crearPedido } from '../src/services/pedidosService.js'
import { obtenerProductoPorId, actualizarStock } from '../src/services/productosService.js'

describe('Dashboard Administrativo: Pestañas, Inventario, Pedidos e Impuestos', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
        delete window.location
        window.location = { href: '' }
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const datosEntrega = {
        nombre: 'Cliente Pedido Test',
        email: 'pedido@test.com',
        telefono: '+56912345678',
        direccion: 'Calle Principal 100',
        comuna: 'Santiago',
        region: 'Región Metropolitana',
    }

    it('permite navegar a la pestaña de Control de Inventario y filtrar por disponibilidad', () => {
        render(<Admin />)

        const botonInventario = screen.getByRole('button', { name: /Control de Inventario/i })
        fireEvent.click(botonInventario)

        expect(
            screen.getByRole('heading', { level: 2, name: /Control de inventario y stock en tiempo real/i })
        ).toBeInTheDocument()

        // Botones de filtro de stock
        const btnAgotados = screen.getByRole('button', { name: /Agotados/i })
        fireEvent.click(btnAgotados)

        // Rollo de canela tiene stock 0
        expect(screen.getByText('Rollo de canela')).toBeInTheDocument()
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()

        const btnDisponibles = screen.getByRole('button', { name: /Disponibles/i })
        fireEvent.click(btnDisponibles)
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.queryByText('Rollo de canela')).not.toBeInTheDocument()
    })

    it('permite realizar ajustes rápidos de stock (+1, +5, -1) desde la tabla de inventario', () => {
        actualizarStock(1, 10)
        render(<Admin />)

        fireEvent.click(screen.getByRole('button', { name: /Control de Inventario/i }))

        // Torta de chocolate tiene stock 10
        expect(obtenerProductoPorId(1).stock).toBe(10)

        const botonesSumar1 = screen.getAllByTitle('Sumar 1')
        fireEvent.click(botonesSumar1[0]) // primer producto es Torta de chocolate

        expect(screen.getByText(/Stock de "Torta de chocolate" actualizado a 11 unidades\./i)).toBeInTheDocument()
        expect(obtenerProductoPorId(1).stock).toBe(11)

        const botonesSumar5 = screen.getAllByTitle('Sumar 5')
        fireEvent.click(botonesSumar5[0])
        expect(obtenerProductoPorId(1).stock).toBe(16)

        const botonesRestar1 = screen.getAllByTitle('Restar 1')
        fireEvent.click(botonesRestar1[0])
        expect(obtenerProductoPorId(1).stock).toBe(15)
    })

    it('permite modificar el valor de stock directamente escribiendo y presionando Guardar', () => {
        render(<Admin />)

        fireEvent.click(screen.getByRole('button', { name: /Control de Inventario/i }))

        const inputsStock = screen.getAllByPlaceholderText(/\d+/)
        const botonesGuardar = screen.getAllByRole('button', { name: 'Guardar' })

        // Escribir 42 en el stock de Torta de chocolate
        fireEvent.change(inputsStock[0], { target: { value: '42' } })
        fireEvent.click(botonesGuardar[0])

        expect(screen.getByText('Stock actualizado correctamente.')).toBeInTheDocument()
        expect(obtenerProductoPorId(1).stock).toBe(42)
    })

    it('rechaza modificar stock directo con números negativos o inválidos', () => {
        render(<Admin />)

        fireEvent.click(screen.getByRole('button', { name: /Control de Inventario/i }))

        const inputsStock = screen.getAllByPlaceholderText(/\d+/)
        const botonesGuardar = screen.getAllByRole('button', { name: 'Guardar' })

        fireEvent.change(inputsStock[0], { target: { value: '-9' } })
        fireEvent.click(botonesGuardar[0])

        expect(screen.getByText('Ingresa un número entero mayor o igual a cero.')).toBeInTheDocument()
    })

    it('permite buscar productos por nombre dentro del inventario', () => {
        render(<Admin />)

        fireEvent.click(screen.getByRole('button', { name: /Control de Inventario/i }))

        const inputBuscar = screen.getByLabelText('Filtrar por nombre o categoría')
        fireEvent.change(inputBuscar, { target: { value: 'cheesecake' } })

        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
    })

    it('muestra el historial de pedidos e impuestos consolidados en sus respectivas pestañas', () => {
        // Crear un pedido de prueba: 2 Tortas chocolate ($15.990) = $31.980
        crearPedido(datosEntrega, [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 2 },
        ])

        render(<Admin />)

        // Navegar a Pestaña Pedidos
        fireEvent.click(screen.getByRole('button', { name: /Registro de Pedidos/i }))
        expect(screen.getByRole('heading', { level: 2, name: /Historial de pedidos realizados/i })).toBeInTheDocument()
        expect(screen.getByText('Cliente Pedido Test')).toBeInTheDocument()
        expect(screen.getAllByText(/\$?\s*31\.980/).length).toBeGreaterThan(0)

        // Navegar a Pestaña Ventas e Impuestos
        fireEvent.click(screen.getByRole('button', { name: /Ventas e IVA/i }))
        expect(screen.getByRole('heading', { level: 2, name: /Reporte consolidado de ventas e impuestos/i })).toBeInTheDocument()
        expect(screen.getByText('Monto Neto Acumulado')).toBeInTheDocument()
        expect(screen.getByText('IVA 19% Acumulado')).toBeInTheDocument()
        expect(screen.getByText('Total Ventas Facturado')).toBeInTheDocument()
        expect(screen.getByText(/2 unidades vendidas/i)).toBeInTheDocument()
    })

    it('permite cerrar sesión desde el botón administrativo y redirige a la raíz', () => {
        render(<Admin />)

        const botonCerrar = screen.getByRole('button', { name: /Cerrar sesión administrativa/i })
        fireEvent.click(botonCerrar)

        expect(window.location.href).toBe('/')
        expect(localStorage.getItem('milSabores_sesion')).toBeNull()
    })
})
