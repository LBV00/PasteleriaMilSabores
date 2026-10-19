import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Badge from '../src/components/atoms/Badge.jsx'
import Button from '../src/components/atoms/Button.jsx'
import Input from '../src/components/atoms/Input.jsx'
import Alert from '../src/components/atoms/Alert.jsx'
import SearchBar from '../src/components/molecules/SearchBar.jsx'
import QuantityControl from '../src/components/molecules/QuantityControl.jsx'
import FormField from '../src/components/molecules/FormField.jsx'

describe('Componentes Atómicos', () => {
    describe('Átomo Badge', () => {
        it('debe renderizar el contenido y aplicar estilos de color', () => {
            render(
                <Badge backgroundColor="#123456" color="#ffffff">
                    Novedad
                </Badge>
            )
            const badge = screen.getByText('Novedad')
            expect(badge).toBeInTheDocument()
            expect(badge).toHaveClass('badge', 'rounded-pill')
        })
    })

    describe('Átomo Button', () => {
        it('debe renderizar el botón y ejecutar onClick al presionarlo', () => {
            const clickMock = vi.fn()
            render(
                <Button variant="primary" size="lg" onClick={clickMock}>
                    Comprar
                </Button>
            )

            const boton = screen.getByRole('button', { name: 'Comprar' })
            expect(boton).toBeInTheDocument()
            expect(boton).toHaveClass('btn', 'btn-lg', 'text-white')

            fireEvent.click(boton)
            expect(clickMock).toHaveBeenCalledTimes(1)
        })

        it('no debe disparar eventos si el botón está deshabilitado', () => {
            const clickMock = vi.fn()
            render(
                <Button disabled onClick={clickMock}>
                    Deshabilitado
                </Button>
            )

            const boton = screen.getByRole('button', { name: 'Deshabilitado' })
            expect(boton).toBeDisabled()
            fireEvent.click(boton)
            expect(clickMock).not.toHaveBeenCalled()
        })
    })

    describe('Átomo Input', () => {
        it('debe aceptar valores y responder a onChange', () => {
            const changeMock = vi.fn()
            render(
                <Input
                    id="campoTest"
                    placeholder="Escribe aquí"
                    onChange={changeMock}
                />
            )

            const input = screen.getByPlaceholderText('Escribe aquí')
            fireEvent.change(input, { target: { value: 'texto nuevo' } })
            expect(changeMock).toHaveBeenCalled()
        })
    })

    describe('Átomo Alert', () => {
        it('debe renderizar mensaje y permitir cerrarlo', () => {
            const cerrarMock = vi.fn()
            render(
                <Alert tipo="success" onCerrar={cerrarMock}>
                    Operación exitosa
                </Alert>
            )

            expect(screen.getByText('Operación exitosa')).toBeInTheDocument()
            const botonCerrar = screen.getByLabelText('Cerrar mensaje')
            fireEvent.click(botonCerrar)
            expect(cerrarMock).toHaveBeenCalled()
        })

        it('no renderiza nada si no hay contenido ni mensaje', () => {
            const { container } = render(<Alert />)
            expect(container).toBeEmptyDOMElement()
        })
    })

    describe('Molécula SearchBar', () => {
        it('debe renderizar etiqueta y responder a cambios de búsqueda', () => {
            const changeMock = vi.fn()
            render(
                <SearchBar
                    id="searchTest"
                    label="Buscar dulce"
                    placeholder="Buscar..."
                    onChange={changeMock}
                />
            )

            expect(screen.getByLabelText('Buscar dulce')).toBeInTheDocument()
            const input = screen.getByPlaceholderText('Buscar...')
            fireEvent.change(input, { target: { value: 'Merengue' } })
            expect(changeMock).toHaveBeenCalled()
        })
    })

    describe('Molécula QuantityControl', () => {
        it('debe responder a botones de incrementar, decrementar y cambio manual', () => {
            const disminuirMock = vi.fn()
            const aumentarMock = vi.fn()
            const cambiarMock = vi.fn()

            render(
                <QuantityControl
                    id="qty-1"
                    cantidad={3}
                    nombreProducto="Torta"
                    onDisminuir={disminuirMock}
                    onAumentar={aumentarMock}
                    onCambiarCantidad={cambiarMock}
                />
            )

            const botonMenos = screen.getByLabelText('Disminuir cantidad de Torta')
            const botonMas = screen.getByLabelText('Aumentar cantidad de Torta')
            const input = screen.getByRole('spinbutton')

            fireEvent.click(botonMenos)
            expect(disminuirMock).toHaveBeenCalledTimes(1)

            fireEvent.click(botonMas)
            expect(aumentarMock).toHaveBeenCalledTimes(1)

            fireEvent.change(input, { target: { value: '5' } })
            expect(cambiarMock).toHaveBeenCalledWith(5)
        })
    })

    describe('Molécula FormField', () => {
        it('debe renderizar campo con etiqueta y texto de ayuda', () => {
            render(
                <FormField
                    id="correo"
                    label="Correo"
                    helpText="Ingresa tu correo oficial"
                />
            )

            expect(screen.getByLabelText('Correo')).toBeInTheDocument()
            expect(screen.getByText('Ingresa tu correo oficial')).toBeInTheDocument()
        })

        it('debe soportar renderizar como textarea y select', () => {
            render(
                <>
                    <FormField id="desc" label="Descripción" as="textarea" />
                    <FormField id="opciones" label="Opciones" as="select">
                        <option value="1">Opción 1</option>
                    </FormField>
                </>
            )

            expect(screen.getByLabelText('Descripción').tagName).toBe('TEXTAREA')
            expect(screen.getByLabelText('Opciones').tagName).toBe('SELECT')
        })
    })
})
