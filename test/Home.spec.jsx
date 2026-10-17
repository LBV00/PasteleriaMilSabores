import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../src/pages/Home.jsx'

describe('Página Home', () => {
    it('renderiza la sección principal, títulos, tarjetas destacadas y enlaces', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Endulzamos tus momentos especiales',
            })
        ).toBeInTheDocument()
        expect(screen.getByText('HECHO CON AMOR')).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ver productos' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Crear una cuenta' })
        ).toBeInTheDocument()

        expect(screen.getByText('Tortas')).toBeInTheDocument()
        expect(screen.getByText('Pasteles')).toBeInTheDocument()
        expect(screen.getByText('Galletas')).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Explorar catálogo completo' })
        ).toBeInTheDocument()
    })
})
