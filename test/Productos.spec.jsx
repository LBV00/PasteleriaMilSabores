import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Productos from '../src/pages/Productos.jsx'

describe('Página Productos', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renderiza el título del catálogo y los productos iniciales', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Nuestro caa' })
        ).toBeInTheDocument()
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    })

    it('permite buscar productos por nombre', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        const inputBusqueda = screen.getByLabelText('Buscar por nombre')
        fireEvent.change(inputBusqueda, { target: { value: 'cheesecake' } })

        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay resultados y permite limpiar filtros', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        const inputBusqueda = screen.getByLabelText('Buscar por nombre')
        fireEvent.change(inputBusqueda, { target: { value: 'producto no existente' } })

        expect(screen.getByText('No encontramos productos')).toBeInTheDocument()

        const botonLimpiar = screen.getByRole('button', { name: 'Limpiar filtros' })
        fireEvent.click(botonLimpiar)

        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
    })

    it('permite agregar un producto al carrito mostrando mensaje de confirmación', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        const botonesAgregar = screen.getAllByRole('button', {
            name: 'Agregar al carrito',
        })
        fireEvent.click(botonesAgregar[0])

        expect(
            screen.getByText(/Torta de chocolate agregado al carrito\./i)
        ).toBeInTheDocument()
    })

    it('permite filtrar por categorías como Panadería y Especiales mostrando productos chilenos', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        const selectCategoria = screen.getByLabelText('Filtrar por categoría')

        fireEvent.change(selectCategoria, { target: { value: 'Panadería' } })
        expect(screen.getByText('Croissant de mantequilla')).toBeInTheDocument()
        expect(screen.getByText('Berlín de manjar')).toBeInTheDocument()
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()

        fireEvent.change(selectCategoria, { target: { value: 'Especiales' } })
        expect(screen.getByText('Alfajores de maicena')).toBeInTheDocument()
        expect(screen.getByText('Brazo de reina')).toBeInTheDocument()
        expect(screen.getByText('Empolvados chilenos')).toBeInTheDocument()
    })

    it('todas las imágenes de los productos tienen rutas válidas dentro de /images/productos/', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        const imagenes = screen.getAllByRole('img')
        expect(imagenes.length).toBeGreaterThanOrEqual(24)

        imagenes.forEach((img) => {
            expect(img.getAttribute('src')).toMatch(/^\/images\/productos\/[a-z0-9-]+\.jpg$/i)
            expect(img.getAttribute('alt')).toBeTruthy()
        })
    })

    it('permite buscar y agregar al carrito un producto nuevo (Alfajores de maicena)', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        )

        const inputBusqueda = screen.getByLabelText('Buscar por nombre')
        fireEvent.change(inputBusqueda, { target: { value: 'alfajores' } })

        expect(screen.getByText('Alfajores de maicena')).toBeInTheDocument()

        const botonAgregar = screen.getByRole('button', { name: 'Agregar al carrito' })
        fireEvent.click(botonAgregar)

        expect(
            screen.getByText(/Alfajores de maicena agregado al carrito\./i)
        ).toBeInTheDocument()
    })
})
