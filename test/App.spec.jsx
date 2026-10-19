import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'

describe('Componente App y Enrutador', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('renderiza la barra de navegación, contenido principal y pie de página en la ruta /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        )

        const marcas = screen.getAllByText('Pastelería Mil Sabores')
        expect(marcas.length).toBeGreaterThanOrEqual(2)

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Endulzamos tus momentos especiales',
            })
        ).toBeInTheDocument()

        const elementosFooter = screen.getAllByText('Pastelería Mil Sabores')
        expect(elementosFooter.length).toBeGreaterThanOrEqual(2)
    })

    it('protege la ruta /admin redirigiendo a /login si no hay sesión activa', () => {
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <App />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 2, name: 'Iniciar sesión' })
        ).toBeInTheDocument()
    })
})
