import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from '../src/pages/Login.jsx'
import RutaProtegida from '../src/components/organisms/RutaProtegida.jsx'
import {
    iniciarSesion,
    obtenerSesion,
    cerrarSesion,
} from '../src/services/usuariosService.js'

describe('Gestión de Roles y Redirección Automática', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    function renderizarApp(initialRoute = '/login') {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>Página Principal de la Tienda</div>} />
                    <Route
                        path="/admin"
                        element={
                            <RutaProtegida soloAdmin>
                                <div>Dashboard Administrativo Protegido</div>
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )
    }

    it('las credenciales de demostración por defecto permiten iniciar sesión al administrador y al cliente', () => {
        // Cuenta demo admin
        const resAdmin = iniciarSesion('admin@pasteleria.cl', 'admin123')
        expect(resAdmin.ok).toBe(true)
        expect(resAdmin.usuario.rol).toBe('admin')

        cerrarSesion()

        // Cuenta demo cliente
        const resCliente = iniciarSesion('cliente@pasteleria.cl', 'cliente123')
        expect(resCliente.ok).toBe(true)
        expect(resCliente.usuario.rol).toBe('cliente')
    })

    it('el administrador inicia sesión en /login y es redirigido automáticamente a /admin', async () => {
        renderizarApp('/login')

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'admin@pasteleria.cl' },
        })
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'admin123' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

        expect(screen.getByText('Inicio de sesión correcto.')).toBeInTheDocument()

        await waitFor(
            () => {
                expect(screen.getByText('Dashboard Administrativo Protegido')).toBeInTheDocument()
            },
            { timeout: 1500 }
        )
    })

    it('el cliente inicia sesión en /login y es redirigido a la página principal de la tienda /', async () => {
        renderizarApp('/login')

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'cliente@pasteleria.cl' },
        })
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'cliente123' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

        expect(screen.getByText('Inicio de sesión correcto.')).toBeInTheDocument()

        await waitFor(
            () => {
                expect(screen.getByText('Página Principal de la Tienda')).toBeInTheDocument()
            },
            { timeout: 1500 }
        )
    })

    it('un cliente autenticado no puede acceder al dashboard administrativo y es redirigido a /', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({
                id: 9002,
                nombre: 'Cliente Frecuente',
                email: 'cliente@pasteleria.cl',
                rol: 'cliente',
            })
        )

        renderizarApp('/admin')

        // Debe redirigir a la página principal y no mostrar el dashboard administrativo
        expect(screen.getByText('Página Principal de la Tienda')).toBeInTheDocument()
        expect(screen.queryByText('Dashboard Administrativo Protegido')).not.toBeInTheDocument()
    })

    it('un usuario sin sesión activa no puede acceder al dashboard y es redirigido a /login', () => {
        renderizarApp('/admin')

        expect(screen.getByRole('heading', { level: 1, name: 'Bienvenido de nuevo' })).toBeInTheDocument()
        expect(screen.queryByText('Dashboard Administrativo Protegido')).not.toBeInTheDocument()
    })

    it('al cerrar sesión se destruye el estado y se impide el acceso posterior al dashboard', () => {
        // Sesión activa de admin
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({
                id: 9001,
                nombre: 'Administrador',
                email: 'admin@pasteleria.cl',
                rol: 'admin',
            })
        )

        expect(obtenerSesion()?.rol).toBe('admin')

        // Cerrar sesión
        const cerrado = cerrarSesion()
        expect(cerrado).toBe(true)
        expect(obtenerSesion()).toBeNull()

        // Si intenta entrar al admin tras cerrar sesión
        renderizarApp('/admin')

        expect(screen.queryByText('Dashboard Administrativo Protegido')).not.toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 1, name: 'Bienvenido de nuevo' })).toBeInTheDocument()
    })
})
