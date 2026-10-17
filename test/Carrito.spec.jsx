import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Carrito from '../src/pages/Carrito.jsx'

describe('Página Carrito', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    function renderizarCarrito() {
        return render(
            <MemoryRouter initialEntries={['/carrito']}>
                <Routes>
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/productos" element={<div>Página de Productos</div>} />
                    <Route path="/checkout" element={<div>Página de Checkout</div>} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('muestra el estado vacío cuando no hay productos en el carrito', () => {
        renderizarCarrito()

        expect(
            screen.getByRole('heading', { level: 2, name: 'Tu carrito está vacío' })
        ).toBeInTheDocument()
        expect(
            screen.getByText('Descubre nuestras tortas, pasteles y dulces favoritos.')
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Explorar productos' })
        ).toBeInTheDocument()
    })

    it('renderiza productos cargados con sus cantidades, precios y resumen de compra', () => {
        const productosEnCarrito = [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 2 },
            { id: 2, nombre: 'Cheesecake', precio: 4990, cantidad: 1 },
        ]
        localStorage.setItem(
            'milSabores_carrito',
            JSON.stringify(productosEnCarrito)
        )

        renderizarCarrito()

        expect(screen.getByText('2 productos diferentes')).toBeInTheDocument()
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Resumen de compra' })
        ).toBeInTheDocument()

        expect(screen.getByText('Cantidad total')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('permite incrementar y decrementar la cantidad actualizando los totales y mensajes', () => {
        const productosEnCarrito = [
            { id: 1, nombre: 'Torta de chocolate', precio: 10000, cantidad: 1 },
        ]
        localStorage.setItem(
            'milSabores_carrito',
            JSON.stringify(productosEnCarrito)
        )

        renderizarCarrito()

        const botonAumentar = screen.getByLabelText(
            'Aumentar cantidad de Torta de chocolate'
        )
        const botonDisminuir = screen.getByLabelText(
            'Disminuir cantidad de Torta de chocolate'
        )

        expect(botonDisminuir).toBeDisabled()

        fireEvent.click(botonAumentar)
        expect(screen.getByText('Cantidad actualizada.')).toBeInTheDocument()

        const inputCantidad = screen.getByRole('spinbutton')
        expect(inputCantidad.value).toBe('2')

        expect(botonDisminuir).not.toBeDisabled()

        fireEvent.click(botonDisminuir)
        expect(inputCantidad.value).toBe('1')
    })

    it('permite cambiar la cantidad escribiendo directamente en el campo numérico', () => {
        const productosEnCarrito = [
            { id: 1, nombre: 'Galletas artesanales', precio: 3000, cantidad: 1 },
        ]
        localStorage.setItem(
            'milSabores_carrito',
            JSON.stringify(productosEnCarrito)
        )

        renderizarCarrito()

        const inputCantidad = screen.getByRole('spinbutton')
        fireEvent.change(inputCantidad, { target: { value: '4' } })

        expect(screen.getByText('Cantidad actualizada.')).toBeInTheDocument()
        expect(inputCantidad.value).toBe('4')
    })

    it('permite eliminar un producto individual del carrito', () => {
        const productosEnCarrito = [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 1 },
            { id: 2, nombre: 'Cheesecake', precio: 4990, cantidad: 1 },
        ]
        localStorage.setItem(
            'milSabores_carrito',
            JSON.stringify(productosEnCarrito)
        )

        renderizarCarrito()

        const botonesQuitar = screen.getAllByRole('button', { name: 'Quitar' })
        fireEvent.click(botonesQuitar[0])

        expect(
            screen.getByText('Producto eliminado del carrito.')
        ).toBeInTheDocument()
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(screen.getByText('1 producto diferente')).toBeInTheDocument()
    })

    it('permite vaciar todo el carrito con el botón correspondiente', () => {
        const productosEnCarrito = [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 2 },
        ]
        localStorage.setItem(
            'milSabores_carrito',
            JSON.stringify(productosEnCarrito)
        )

        renderizarCarrito()

        const botonVaciar = screen.getByRole('button', { name: 'Vaciar carrito' })
        fireEvent.click(botonVaciar)

        expect(screen.getByText('El carrito se ha vaciado.')).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Tu carrito está vacío' })
        ).toBeInTheDocument()
    })

    it('navega hacia el checkout al presionar Continuar compra', () => {
        const productosEnCarrito = [
            { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 1 },
        ]
        localStorage.setItem(
            'milSabores_carrito',
            JSON.stringify(productosEnCarrito)
        )

        renderizarCarrito()

        const botonContinuar = screen.getByRole('button', {
            name: 'Continuar compra',
        })
        fireEvent.click(botonContinuar)

        expect(
            screen.getByText('Página de Checkout')
        ).toBeInTheDocument()
    })
})
