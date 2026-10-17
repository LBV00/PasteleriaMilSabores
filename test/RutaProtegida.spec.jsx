import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from '../src/components/organisms/RutaProtegida.jsx'

describe('Componente RutaProtegida', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('redirige a /login cuando no existe sesión activa', () => {
        render(
            <MemoryRouter initialEntries={['/privado']}>
                <Routes>
                    <Route
                        path="/privado"
                        element={
                            <RutaProtegida>
                                <div>Zona Segura</div>
                            </RutaProtegida>
                        }
                    />
                    <Route path="/login" element={<div>Vista de Login</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Vista de Login')).toBeInTheDocument()
        expect(screen.queryByText('Zona Segura')).not.toBeInTheDocument()
    })

    it('redirige a / cuando la ruta requiere rol admin y el usuario es cliente', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({ id: 1, nombre: 'Ana', rol: 'cliente' })
        )

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <RutaProtegida soloAdmin>
                                <div>Panel de Administración</div>
                            </RutaProtegida>
                        }
                    />
                    <Route path="/" element={<div>Página Principal</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Página Principal')).toBeInTheDocument()
        expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument()
    })

    it('permite el acceso si la ruta requiere admin y el usuario es admin', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({ id: 2, nombre: 'Administrador', rol: 'admin' })
        )

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <RutaProtegida soloAdmin>
                                <div>Panel de Administración</div>
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
    })

    it('permite el acceso a un cliente común si soloAdmin es false', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({ id: 3, nombre: 'Carlos', rol: 'cliente' })
        )

        render(
            <MemoryRouter initialEntries={['/perfil']}>
                <Routes>
                    <Route
                        path="/perfil"
                        element={
                            <RutaProtegida>
                                <div>Perfil del Usuario</div>
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Perfil del Usuario')).toBeInTheDocument()
    })
})
