import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../src/components/organisms/Navbar.jsx'

describe('Componente Navbar', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('muestra los enlaces para visitantes sin sesión iniciada', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByText('Pastelería Mil Sabores')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Productos' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Registrarse' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
    })

    it('muestra el enlace de administración y botón de cerrar sesión para usuarios admin', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({ id: 10, nombre: 'Admin Master', rol: 'admin' })
        )

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole('link', { name: 'Administración' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
    })

    it('permite cerrar sesión al hacer clic en el botón correspondiente', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({ id: 20, nombre: 'Cliente Feliz', rol: 'cliente' })
        )

        const reloadMock = vi.fn()
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...window.location, reload: reloadMock },
        })

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        const botonCerrar = screen.getByRole('button', { name: 'Cerrar sesión' })
        fireEvent.click(botonCerrar)

        expect(localStorage.getItem('milSabores_sesion')).toBeNull()
        expect(reloadMock).toHaveBeenCalled()
    })
})
