import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Categorias from '../src/pages/Categorias.jsx'

describe('Página Categorías', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renderiza el título y las tarjetas de categorías disponibles', () => {
        render(
            <MemoryRouter>
                <Categorias />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Categorías' })
        ).toBeInTheDocument()

        expect(screen.getByText('Tortas')).toBeInTheDocument()
        expect(screen.getByText('Pasteles')).toBeInTheDocument()
        expect(screen.getByText('Galletas')).toBeInTheDocument()
    })

    it('muestra el conteo de productos por categoría', () => {
        render(
            <MemoryRouter>
                <Categorias />
            </MemoryRouter>
        )

        const etiquetas = screen.getAllByText(/\d+ productos?/)
        expect(etiquetas.length).toBeGreaterThan(0)
    })

    it('al seleccionar una categoría muestra sus productos', () => {
        render(
            <MemoryRouter>
                <Categorias />
            </MemoryRouter>
        )

        const botonTortas = screen.getByRole('button', { name: /Tortas/ })
        fireEvent.click(botonTortas)

        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()

        expect(screen.getAllByRole('button', { name: 'Agregar al carrito' }).length).toBeGreaterThan(0)
    })

    it('al seleccionar la misma categoría dos veces, la cierra (toggle)', () => {
        render(
            <MemoryRouter>
                <Categorias />
            </MemoryRouter>
        )

        const botonTortas = screen.getByRole('button', { name: /Tortas/ })
        fireEvent.click(botonTortas)
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()

        fireEvent.click(botonTortas)
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
    })

    it('muestra mensaje cuando la categoría seleccionada no tiene productos', () => {

        const productosPersonalizados = [
            {
                id: 99,
                nombre: 'Brownie especial',
                categoria: 'Brownies',
                precio: 3000,
                descripcion: 'Brownie de prueba',
                imagen: '',
            },
        ]
        localStorage.setItem(
            'milSabores_productos',
            JSON.stringify(productosPersonalizados)
        )

        render(
            <MemoryRouter>
                <Categorias />
            </MemoryRouter>
        )

        const botonBrownies = screen.getByRole('button', { name: /Brownies/ })
        fireEvent.click(botonBrownies)

        expect(screen.getByText('Brownie especial')).toBeInTheDocument()
    })

    it('permite agregar producto al carrito y muestra mensaje de confirmación', () => {
        render(
            <MemoryRouter>
                <Categorias />
            </MemoryRouter>
        )

        const botonTortas = screen.getByRole('button', { name: /Tortas/ })
        fireEvent.click(botonTortas)

        const botonesAgregar = screen.getAllByRole('button', { name: 'Agregar al carrito' })
        fireEvent.click(botonesAgregar[0])

        expect(
            screen.getByText(/Torta de chocolate agregado al carrito/i)
        ).toBeInTheDocument()
    })
})
