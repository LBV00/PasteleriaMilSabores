import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleProducto from '../src/pages/DetalleProducto.jsx'

function renderConRuta(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/productos/:id" element={<DetalleProducto />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('Página DetalleProducto', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('muestra el detalle de un producto existente', () => {

        renderConRuta('/productos/1')

        expect(
            screen.getByRole('heading', { level: 1, name: 'Torta de chocolate' })
        ).toBeInTheDocument()
        expect(screen.getByText(/Torta de chocolate ideal para celebraciones/)).toBeInTheDocument()

        expect(screen.getAllByText('Tortas').length).toBeGreaterThan(0)
        expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toBeInTheDocument()
    })

    it('muestra la imagen del producto', () => {
        renderConRuta('/productos/1')

        const imagen = screen.getByRole('img', { name: 'Torta de chocolate' })
        expect(imagen).toBeInTheDocument()
    })

    it('muestra mensaje de producto no encontrado para un id inexistente', () => {
        renderConRuta('/productos/99999')

        expect(
            screen.getByRole('heading', { level: 1, name: 'Oops, este producto no existe' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Volver al catálogo' })
        ).toBeInTheDocument()
    })

    it('muestra precio de oferta y precio original tachado para productos en oferta', () => {

        renderConRuta('/productos/2')

        expect(screen.getByRole('heading', { level: 1, name: 'Cheesecake' })).toBeInTheDocument()

        expect(screen.getByText(/3\.490/)).toBeInTheDocument()

        expect(screen.getByText(/4\.990/)).toBeInTheDocument()

        expect(screen.getByText(/Ahorra/i)).toBeInTheDocument()
    })

    it('muestra el precio normal para productos sin oferta', () => {

        renderConRuta('/productos/1')

        expect(screen.getByText(/15\.990/)).toBeInTheDocument()
        expect(screen.queryByText(/Ahorra/i)).not.toBeInTheDocument()
    })

    it('permite agregar el producto al carrito y muestra confirmación', () => {
        renderConRuta('/productos/1')

        const botonAgregar = screen.getByRole('button', { name: 'Agregar al carrito' })
        fireEvent.click(botonAgregar)

        expect(
            screen.getByText(/Torta de chocolate agregado al carrito/i)
        ).toBeInTheDocument()
    })

    it('al agregar un producto en oferta al carrito se usa el precio de oferta', () => {
        renderConRuta('/productos/2')

        const botonAgregar = screen.getByRole('button', { name: 'Agregar al carrito' })
        fireEvent.click(botonAgregar)

        expect(
            screen.getByText(/Cheesecake agregado al carrito/i)
        ).toBeInTheDocument()

        const carrito = JSON.parse(localStorage.getItem('milSabores_carrito'))
        expect(carrito[0].precio).toBe(3490)
    })
})
