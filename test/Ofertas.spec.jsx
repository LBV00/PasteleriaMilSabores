import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Ofertas from '../src/pages/Ofertas.jsx'

describe('Página Ofertas', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('muestra título y los productos en oferta iniciales (Cheesecake y Galletas)', () => {
        render(
            <MemoryRouter>
                <Ofertas />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Ofertas del momento' })
        ).toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(screen.getByText('Galletas artesanales')).toBeInTheDocument()

        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
    })

    it('muestra el precio de oferta y el precio original tachado', () => {
        render(
            <MemoryRouter>
                <Ofertas />
            </MemoryRouter>
        )

        expect(screen.getByText(/3\.490/)).toBeInTheDocument()

        expect(screen.getByText(/4\.990/)).toBeInTheDocument()
    })

    it('muestra mensaje apropiado cuando no hay ofertas disponibles', () => {

        const sinOfertas = [
            {
                id: 1,
                nombre: 'Torta sin oferta',
                categoria: 'Tortas',
                precio: 15000,
                descripcion: 'Desc',
                imagen: '',
                enOferta: false,
            },
        ]
        localStorage.setItem('milSabores_productos', JSON.stringify(sinOfertas))

        render(
            <MemoryRouter>
                <Ofertas />
            </MemoryRouter>
        )

        expect(
            screen.getByText(/No hay ofertas disponibles en este momento/)
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Ver todos los productos' })
        ).toBeInTheDocument()
    })

    it('permite agregar un producto en oferta al carrito y muestra confirmación con precio de oferta', () => {
        render(
            <MemoryRouter>
                <Ofertas />
            </MemoryRouter>
        )

        const botonesAgregar = screen.getAllByRole('button', {
            name: 'Agregar al carrito',
        })
        fireEvent.click(botonesAgregar[0])

        expect(
            screen.getByText(/agregado al carrito con precio de oferta/i)
        ).toBeInTheDocument()
    })

    it('muestra el porcentaje de descuento en la tarjeta de oferta', () => {
        render(
            <MemoryRouter>
                <Ofertas />
            </MemoryRouter>
        )

        const badgeCheesecake = screen.getByLabelText('Oferta: 30% de descuento')
        expect(badgeCheesecake).toBeInTheDocument()
        const badgeGalletas = screen.getByLabelText('Oferta: 33% de descuento')
        expect(badgeGalletas).toBeInTheDocument()
    })
})
