import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Contacto from '../src/pages/Contacto.jsx'

describe('Página Contacto', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renderiza el formulario con todos sus campos', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Contacto' })
        ).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
        expect(screen.getByLabelText('Asunto')).toBeInTheDocument()
        expect(screen.getByLabelText('Mensaje')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Enviar mensaje' })
        ).toBeInTheDocument()
    })

    it('muestra errores al enviar el formulario vacío', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        fireEvent.submit(
            screen.getByRole('button', { name: 'Enviar mensaje' }).closest('form')
        )

        expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
        expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument()
        expect(screen.getByText('El asunto es obligatorio.')).toBeInTheDocument()
        expect(screen.getByText('El mensaje no puede estar vacío.')).toBeInTheDocument()
    })

    it('muestra error de formato al ingresar un correo inválido', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Ana' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'correo_invalido' },
        })
        fireEvent.change(screen.getByLabelText('Asunto'), {
            target: { value: 'Consulta' },
        })
        fireEvent.change(screen.getByLabelText('Mensaje'), {
            target: { value: 'Mensaje de prueba suficientemente largo' },
        })

        fireEvent.submit(
            screen.getByRole('button', { name: 'Enviar mensaje' }).closest('form')
        )

        expect(
            screen.getByText('Ingresa un correo electrónico válido.')
        ).toBeInTheDocument()
    })

    it('muestra error si el mensaje tiene menos de 10 caracteres', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Ana' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'ana@ejemplo.com' },
        })
        fireEvent.change(screen.getByLabelText('Asunto'), {
            target: { value: 'Consulta' },
        })
        fireEvent.change(screen.getByLabelText('Mensaje'), {
            target: { value: 'Corto' }, 
        })

        fireEvent.submit(
            screen.getByRole('button', { name: 'Enviar mensaje' }).closest('form')
        )

        expect(
            screen.getByText(/al menos 10 caracteres/i)
        ).toBeInTheDocument()
    })

    it('no recarga la página al enviar el formulario (preventDefault)', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        const form = screen
            .getByRole('button', { name: 'Enviar mensaje' })
            .closest('form')

        const mockSubmit = vi.fn((e) => e.preventDefault())
        form.addEventListener('submit', mockSubmit)

        fireEvent.submit(form)

        expect(screen.queryByText('El nombre es obligatorio.')).toBeInTheDocument()
    })

    it('muestra confirmación visual tras un envío válido y sin recargar la página', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'María González' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'maria@ejemplo.com' },
        })
        fireEvent.change(screen.getByLabelText('Asunto'), {
            target: { value: 'Consulta sobre pedidos' },
        })
        fireEvent.change(screen.getByLabelText('Mensaje'), {
            target: { value: 'Me gustaría saber más sobre pedidos personalizados.' },
        })

        fireEvent.submit(
            screen.getByRole('button', { name: 'Enviar mensaje' }).closest('form')
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Mensaje recibido' })
        ).toBeInTheDocument()

        expect(screen.queryByLabelText('Nombre completo')).not.toBeInTheDocument()
    })

    it('permite enviar otro mensaje desde la pantalla de confirmación', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Pedro' },
        })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'pedro@test.com' },
        })
        fireEvent.change(screen.getByLabelText('Asunto'), {
            target: { value: 'Asunto de prueba' },
        })
        fireEvent.change(screen.getByLabelText('Mensaje'), {
            target: { value: 'Un mensaje suficientemente largo para pasar la validación.' },
        })

        fireEvent.submit(
            screen.getByRole('button', { name: 'Enviar mensaje' }).closest('form')
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Mensaje recibido' })
        ).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Enviar otro mensaje' }))

        expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
    })

    it('limpia el error del campo al modificarlo', () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        )

        fireEvent.submit(
            screen.getByRole('button', { name: 'Enviar mensaje' }).closest('form')
        )
        expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()

        fireEvent.change(screen.getByLabelText('Nombre completo'), {
            target: { value: 'Ana' },
        })
        expect(screen.queryByText('El nombre es obligatorio.')).not.toBeInTheDocument()
    })
})
