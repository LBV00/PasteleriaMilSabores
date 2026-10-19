import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Checkout from '../src/pages/Checkout.jsx'
import * as pedidosService from '../src/services/pedidosService.js'

describe('Página Checkout', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const productosPrueba = [
        { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 2 },
        { id: 2, nombre: 'Cheesecake', precio: 4990, cantidad: 1 },
    ]

    function renderizarCheckout(initialRoute = '/checkout') {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/carrito" element={<div>Vista Carrito</div>} />
                    <Route path="/productos" element={<div>Vista Catálogo</div>} />
                    <Route path="/compra-exitosa" element={<div>Vista Compra Exitosa</div>} />
                    <Route path="/compra-fallida" element={<div>Vista Compra Fallida</div>} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('muestra advertencia cuando el carrito está vacío y no permite continuar', () => {

        renderizarCheckout()

        expect(
            screen.getByText(/Tu carrito está vacío\. No puedes proceder al checkout sin productos\./i)
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Ver productos' })
        ).toBeInTheDocument()
    })

    it('renderiza el formulario de entrega, el resumen de compra y los totales', () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosPrueba))

        renderizarCheckout()

        expect(
            screen.getByRole('heading', { level: 1, name: 'Datos de entrega' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Información de despacho' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Resumen del pedido' })
        ).toBeInTheDocument()

        expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
        expect(screen.getByLabelText('Teléfono de contacto')).toBeInTheDocument()
        expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument()
        expect(screen.getByLabelText('Comuna')).toBeInTheDocument()
        expect(screen.getByLabelText('Región')).toBeInTheDocument()

        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(screen.getByText('Total a pagar')).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Volver al carrito' })
        ).toBeInTheDocument()
    })

    it('muestra errores de validación cuando se envían campos obligatorios vacíos', () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosPrueba))

        renderizarCheckout()

        const botonConfirmar = screen.getByRole('button', {
            name: 'Confirmar y realizar pedido',
        })
        fireEvent.click(botonConfirmar)

        expect(
            screen.getByText('Por favor corrige los campos destacados en el formulario.')
        ).toBeInTheDocument()
        expect(
            screen.getByText('El nombre completo es obligatorio.')
        ).toBeInTheDocument()
        expect(
            screen.getByText('El correo electrónico es obligatorio.')
        ).toBeInTheDocument()
        expect(
            screen.getByText('El teléfono de contacto es obligatorio.')
        ).toBeInTheDocument()
    })

    it('muestra errores específicos ante correo o teléfono inválidos', () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosPrueba))

        renderizarCheckout()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Francisca Morales' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'formatoInvalidoSinArroba' },
        })
        fireEvent.change(screen.getByLabelText('Teléfono de contacto'), {
            target: { value: '123' },
        })
        fireEvent.change(screen.getByLabelText(/Dirección/i), {
            target: { value: 'Av. Siempre Viva 742' },
        })
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Santiago' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar y realizar pedido' }))

        expect(
            screen.getByText('Ingresa un correo electrónico válido.')
        ).toBeInTheDocument()
        expect(
            screen.getByText(/Ingresa un número telefónico válido/i)
        ).toBeInTheDocument()
    })

    it('crea el pedido correctamente y navega a la pantalla de compra exitosa', async () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosPrueba))

        renderizarCheckout()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Francisca Morales' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'francisca@example.com' },
        })
        fireEvent.change(screen.getByLabelText('Teléfono de contacto'), {
            target: { value: '+56912345678' },
        })
        fireEvent.change(screen.getByLabelText(/Dirección/i), {
            target: { value: 'Av. Las Condes 1000' },
        })
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Las Condes' },
        })
        fireEvent.change(screen.getByLabelText('Región'), {
            target: { value: 'Región Metropolitana' },
        })

        const botonConfirmar = screen.getByRole('button', {
            name: 'Confirmar y realizar pedido',
        })
        fireEvent.click(botonConfirmar)

        await waitFor(() => {
            expect(screen.getByText('Vista Compra Exitosa')).toBeInTheDocument()
        })
    })

    it('navega a la pantalla de compra fallida si ocurre un error al registrar el pedido', async () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosPrueba))

        vi.spyOn(pedidosService, 'crearPedido').mockReturnValue({
            ok: false,
            error: 'Fallo al guardar en la base de datos local.',
        })

        renderizarCheckout()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Usuario Fallido' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'fallo@example.com' },
        })
        fireEvent.change(screen.getByLabelText('Teléfono de contacto'), {
            target: { value: '+56987654321' },
        })
        fireEvent.change(screen.getByLabelText(/Dirección/i), {
            target: { value: 'Calle Falsa 123' },
        })
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Macul' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar y realizar pedido' }))

        await waitFor(() => {
            expect(screen.getByText('Vista Compra Fallida')).toBeInTheDocument()
        })
    })

    it('previene pedidos duplicados deshabilitando el botón mientras se procesa', async () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosPrueba))

        let resolverPedido
        const crearPedidoSpy = vi.spyOn(pedidosService, 'crearPedido').mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolverPedido = resolve
                })
        )

        renderizarCheckout()

        fireEvent.change(screen.getByLabelText('Nombre del producto' in screen ? 'Nombre del producto' : 'Nombre completo'), {
            target: { value: 'Doble Clic' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'doble@example.com' },
        })
        fireEvent.change(screen.getByLabelText('Teléfono de contacto'), {
            target: { value: '+56911223344' },
        })
        fireEvent.change(screen.getByLabelText(/Dirección/i), {
            target: { value: 'Calle Central 555' },
        })
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Providencia' },
        })

        const botonConfirmar = screen.getByRole('button', {
            name: 'Confirmar y realizar pedido',
        })
        fireEvent.click(botonConfirmar)

        expect(botonConfirmar).toBeDisabled()
        expect(screen.getByText('Procesando pedido...')).toBeInTheDocument()

        fireEvent.click(botonConfirmar)
        expect(crearPedidoSpy).toHaveBeenCalledTimes(1)

        resolverPedido({ ok: true, pedido: { id: 'PED-123' } })
    })
})
