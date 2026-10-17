import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Registro from '../src/pages/Registro.jsx'

describe('Página Registro', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    function renderizarRegistro() {
        return render(
            <MemoryRouter initialEntries={['/registro']}>
                <Routes>
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/login" element={<div>Página de Login</div>} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('renderiza todos los campos del formulario de registro y sus textos descriptivos', () => {
        renderizarRegistro()

        expect(
            screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Registrarme' })
        ).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
        expect(screen.getByLabelText(/^Contraseña/i)).toBeInTheDocument()
        expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Crear mi cuenta' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Inicia sesión' })
        ).toBeInTheDocument()
    })

    it('muestra error de validación cuando se intenta enviar con campos incompletos', () => {
        renderizarRegistro()

        const botonCrear = screen.getByRole('button', { name: 'Crear mi cuenta' })
        fireEvent.submit(botonCrear.closest('form'))

        expect(
            screen.getByText('Completa todos los campos.')
        ).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('alert-danger')
    })

    it('muestra error si la contraseña tiene menos de 6 caracteres', () => {
        renderizarRegistro()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Laura Diaz' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'laura@example.com' },
        })
        fireEvent.change(screen.getByLabelText(/^Contraseña/i), {
            target: { value: '123' },
        })
        fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
            target: { value: '123' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }))

        expect(
            screen.getByText('La contraseña debe tener al menos 6 caracteres.')
        ).toBeInTheDocument()
    })

    it('muestra error si la confirmación no coincide con la contraseña', () => {
        renderizarRegistro()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Carlos Ruiz' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'carlos@example.com' },
        })
        fireEvent.change(screen.getByLabelText(/^Contraseña/i), {
            target: { value: 'password123' },
        })
        fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
            target: { value: 'passwordDiferente' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }))

        expect(
            screen.getByText('Las contraseñas no coinciden.')
        ).toBeInTheDocument()
    })

    it('muestra error cuando el correo electrónico ya se encuentra registrado', () => {

        localStorage.setItem(
            'milSabores_usuarios',
            JSON.stringify([
                {
                    id: 1,
                    nombre: 'Usuario Existente',
                    email: 'existente@correo.com',
                    password: '123456',
                    rol: 'cliente',
                },
            ])
        )

        renderizarRegistro()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Nuevo Usuario' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'EXISTENTE@correo.com' },
        })
        fireEvent.change(screen.getByLabelText(/^Contraseña/i), {
            target: { value: '123456' },
        })
        fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
            target: { value: '123456' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }))

        expect(
            screen.getByText('Ya existe una cuenta con ese correo electrónico.')
        ).toBeInTheDocument()
    })

    it('registra una cuenta exitosamente y redirige a la página de login', async () => {
        renderizarRegistro()

        const inputNombre = screen.getByLabelText('Nombre completo')
        const inputEmail = screen.getByLabelText('Correo electrónico')
        const inputPassword = screen.getByLabelText(/^Contraseña/i)
        const inputConfirmar = screen.getByLabelText('Confirmar contraseña')

        fireEvent.change(inputNombre, { target: { value: 'Marcela Paz' } })
        fireEvent.change(inputEmail, { target: { value: 'marcela@correo.com' } })
        fireEvent.change(inputPassword, { target: { value: 'marcela123' } })
        fireEvent.change(inputConfirmar, { target: { value: 'marcela123' } })

        fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }))

        expect(
            screen.getByText('Cuenta creada correctamente.')
        ).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveClass('alert-success')

        expect(inputNombre.value).toBe('')
        expect(inputEmail.value).toBe('')

        await waitFor(
            () => {
                expect(screen.getByText('Página de Login')).toBeInTheDocument()
            },
            { timeout: 1800 }
        )
    })
})
