import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from '../src/pages/Login.jsx'

describe('Página Login', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    function renderizarLogin(initialRoute = '/login') {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>Página Principal</div>} />
                    <Route path="/admin" element={<div>Panel de Administración</div>} />
                    <Route path="/registro" element={<div>Página de Registro</div>} />
                    <Route path="/productos" element={<div>Catálogo de Productos</div>} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('renderiza el formulario con todos los campos y enlaces necesarios', () => {
        renderizarLogin()

        expect(
            screen.getByRole('heading', { level: 1, name: 'Bienvenido de nuevo' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Iniciar sesión' })
        ).toBeInTheDocument()
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Ingresar' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Regístrate aquí' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Explorar productos' })
        ).toBeInTheDocument()
    })

    it('muestra mensaje de error cuando las credenciales no existen o son incorrectas', () => {
        renderizarLogin()

        const inputEmail = screen.getByLabelText('Correo electrónico')
        const inputPassword = screen.getByLabelText('Contraseña')
        const botonIngresar = screen.getByRole('button', { name: 'Ingresar' })

        fireEvent.change(inputEmail, { target: { value: 'noexiste@correo.com' } })
        fireEvent.change(inputPassword, { target: { value: 'clave123' } })
        fireEvent.click(botonIngresar)

        expect(
            screen.getByText('Correo electrónico o contraseña incorrectos.')
        ).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('alert-danger')
    })

    it('inicia sesión correctamente para un cliente y redirige a la página principal', async () => {

        const usuarios = [
            {
                id: 1,
                nombre: 'Cliente Prueba',
                email: 'cliente@correo.com',
                password: 'password123',
                rol: 'cliente',
            },
        ]
        localStorage.setItem('milSabores_usuarios', JSON.stringify(usuarios))

        renderizarLogin()

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'CLIENTE@correo.com' },
        })
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'password123' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

        expect(
            screen.getByText('Inicio de sesión correcto.')
        ).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('alert-success')

        await waitFor(
            () => {
                expect(screen.getByText('Página Principal')).toBeInTheDocument()
            },
            { timeout: 1500 }
        )
    })

    it('inicia sesión correctamente para un administrador y redirige a /admin', async () => {

        const usuarios = [
            {
                id: 2,
                nombre: 'Admin Prueba',
                email: 'admin@correo.com',
                password: 'adminpassword',
                rol: 'admin',
            },
        ]
        localStorage.setItem('milSabores_usuarios', JSON.stringify(usuarios))

        renderizarLogin()

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'admin@correo.com' },
        })
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'adminpassword' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

        expect(
            screen.getByText('Inicio de sesión correcto.')
        ).toBeInTheDocument()

        await waitFor(
            () => {
                expect(
                    screen.getByText('Panel de Administración')
                ).toBeInTheDocument()
            },
            { timeout: 1500 }
        )
    })
})
