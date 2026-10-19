import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nosotros from '../src/pages/Nosotros.jsx'

describe('Página Nosotros', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renderiza el título principal de la página', () => {
        render(
            <MemoryRouter>
                <Nosotros />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Quiénes somos' })
        ).toBeInTheDocument()
    })

    it('contiene la historia del negocio', () => {
        render(
            <MemoryRouter>
                <Nosotros />
            </MemoryRouter>
        )

        expect(screen.getByText(/Endulzando vidas desde 2008/i)).toBeInTheDocument()
        expect(screen.getByText(/Margarita/i)).toBeInTheDocument()
    })

    it('muestra los tres valores del negocio', () => {
        render(
            <MemoryRouter>
                <Nosotros />
            </MemoryRouter>
        )

        expect(screen.getByText('Ingredientes de calidad')).toBeInTheDocument()
        expect(screen.getByText('Elaboración artesanal')).toBeInTheDocument()
        expect(screen.getByText('Compromiso con el sabor')).toBeInTheDocument()
    })

    it('tiene un enlace para ver el catálogo de productos', () => {
        render(
            <MemoryRouter>
                <Nosotros />
            </MemoryRouter>
        )

        const enlaces = screen.getAllByRole('link', { name: /Ver catálogo/i })
        expect(enlaces.length).toBeGreaterThan(0)
    })

    it('no contiene datos de contacto reales ni direcciones físicas', () => {
        render(
            <MemoryRouter>
                <Nosotros />
            </MemoryRouter>
        )

        expect(screen.queryByText(/\+56/)).not.toBeInTheDocument()
        expect(screen.queryByText(/@milsabores/i)).not.toBeInTheDocument()
    })
})
