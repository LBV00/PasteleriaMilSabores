import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Admin from '../src/pages/Admin.jsx'
import { PRODUCTOS_INICIALES } from '../src/services/productosService.js'

describe('Página Admin', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
        window.scrollTo = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renderiza el panel de control, métricas y tabla con productos iniciales', () => {
        render(<Admin />)

        expect(
            screen.getByRole('heading', { level: 1, name: 'Administrar productos' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: 'Productos registrados' })
        ).toBeInTheDocument()
        expect(screen.getByText(String(PRODUCTOS_INICIALES.length))).toBeInTheDocument()
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()
        expect(screen.getByText('Galletas artesanales')).toBeInTheDocument()
    })

    it('muestra error de validación cuando el formulario está incompleto o con precio inválido', () => {
        render(<Admin />)

        const botonAgregar = screen.getByRole('button', {
            name: 'Agregar producto',
        })
        const form = botonAgregar.closest('form')

        fireEvent.submit(form)

        expect(
            screen.getByText(
                'Completa todos los campos y escribe un precio entero mayor que cero.'
            )
        ).toBeInTheDocument()

        fireEvent.change(screen.getByLabelText('Nombre del producto'), {
            target: { value: 'Alfajor' },
        })
        fireEvent.change(screen.getByLabelText('Precio (CLP)'), {
            target: { value: '-100' },
        })
        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Alfajor de maicena' },
        })
        fireEvent.submit(form)

        expect(
            screen.getByText(
                'Completa todos los campos y escribe un precio entero mayor que cero.'
            )
        ).toBeInTheDocument()
    })

    it('permite dar de alta un producto correctamente y actualizar la lista', () => {
        render(<Admin />)

        fireEvent.change(screen.getByLabelText('Nombre del producto'), {
            target: { value: 'Brazo de reina artesanal' },
        })
        fireEvent.change(screen.getByLabelText('Categoría'), {
            target: { value: 'Pasteles' },
        })
        fireEvent.change(screen.getByLabelText('Precio (CLP)'), {
            target: { value: '4500' },
        })
        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Relleno de dulce de leche casero' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }))

        expect(
            screen.getByText('Producto agregado correctamente.')
        ).toBeInTheDocument()
        expect(screen.getByText('Brazo de reina artesanal')).toBeInTheDocument()
        expect(screen.getByText(String(PRODUCTOS_INICIALES.length + 1))).toBeInTheDocument()
    })

    it('permite entrar en modo edición, cancelar la edición o guardar los cambios', () => {
        render(<Admin />)

        const botonesEditar = screen.getAllByRole('button', { name: 'Editar' })
        fireEvent.click(botonesEditar[0])

        expect(
            screen.getByRole('heading', { level: 2, name: 'Editar producto' })
        ).toBeInTheDocument()

        const inputNombre = screen.getByLabelText('Nombre del producto')
        expect(inputNombre.value).toBe('Torta de chocolate')

        const botonCancelar = screen.getByRole('button', {
            name: 'Cancelar edición',
        })
        fireEvent.click(botonCancelar)

        expect(
            screen.getByRole('heading', { level: 2, name: 'Agregar producto' })
        ).toBeInTheDocument()
        expect(inputNombre.value).toBe('')

        const botonesEditarNuevos = screen.getAllByRole('button', {
            name: 'Editar',
        })
        fireEvent.click(botonesEditarNuevos[0])

        fireEvent.change(screen.getByLabelText('Nombre del producto'), {
            target: { value: 'Torta de chocolate suprema' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

        expect(
            screen.getByText('Producto actualizado correctamente.')
        ).toBeInTheDocument()
        expect(screen.getByText('Torta de chocolate suprema')).toBeInTheDocument()
    })

    it('permite filtrar la tabla de productos mediante el buscador', () => {
        render(<Admin />)

        const inputBusqueda = screen.getByLabelText('Buscar producto')

        fireEvent.change(inputBusqueda, { target: { value: 'Galletas' } })
        expect(screen.getByText('Galletas artesanales')).toBeInTheDocument()
        expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()

        fireEvent.change(inputBusqueda, { target: { value: 'Inexistente' } })
        expect(
            screen.getByText('No encontramos productos con esa búsqueda.')
        ).toBeInTheDocument()
    })

    it('permite eliminar un producto cuando el usuario confirma la acción', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        render(<Admin />)

        const botonesEliminar = screen.getAllByRole('button', { name: 'Eliminar' })
        fireEvent.click(botonesEliminar[0])

        expect(window.confirm).toHaveBeenCalled()
        expect(
            screen.getByText('Producto eliminado correctamente.')
        ).toBeInTheDocument()
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
        expect(screen.getByText(String(PRODUCTOS_INICIALES.length - 1))).toBeInTheDocument()
    })

    it('no elimina el producto si el usuario cancela en el diálogo de confirmación', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)

        render(<Admin />)

        const botonesEliminar = screen.getAllByRole('button', { name: 'Eliminar' })
        fireEvent.click(botonesEliminar[0])

        expect(window.confirm).toHaveBeenCalled()
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.getByText(String(PRODUCTOS_INICIALES.length))).toBeInTheDocument()
    })

    it('muestra el checkbox de oferta en el formulario', () => {
        render(<Admin />)

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        expect(checkbox).toBeInTheDocument()
        expect(checkbox.checked).toBe(false)
    })

    it('muestra el campo de precio de oferta al activar el checkbox de oferta', () => {
        render(<Admin />)

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        expect(screen.queryByLabelText('Precio de oferta (CLP)')).not.toBeInTheDocument()

        fireEvent.click(checkbox)

        expect(screen.getByLabelText('Precio de oferta (CLP)')).toBeInTheDocument()
    })

    it('muestra error si se activa oferta pero no se ingresa precio de oferta', () => {
        render(<Admin />)

        fireEvent.change(screen.getByLabelText('Nombre del producto'), {
            target: { value: 'Alfajor' },
        })
        fireEvent.change(screen.getByLabelText('Precio (CLP)'), {
            target: { value: '3000' },
        })
        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Alfajor de maicena' },
        })

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        fireEvent.click(checkbox)

        fireEvent.submit(screen.getByRole('button', { name: 'Agregar producto' }).closest('form'))

        expect(
            screen.getByText(
                'El precio de oferta debe ser un entero positivo y menor al precio normal.'
            )
        ).toBeInTheDocument()
    })

    it('muestra error si el precio de oferta es mayor o igual al precio normal', () => {
        render(<Admin />)

        fireEvent.change(screen.getByLabelText('Nombre del producto'), {
            target: { value: 'Alfajor' },
        })
        fireEvent.change(screen.getByLabelText('Precio (CLP)'), {
            target: { value: '3000' },
        })
        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Alfajor de maicena' },
        })

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        fireEvent.click(checkbox)

        fireEvent.change(screen.getByLabelText('Precio de oferta (CLP)'), {
            target: { value: '3000' }, 
        })

        fireEvent.submit(screen.getByRole('button', { name: 'Agregar producto' }).closest('form'))

        expect(
            screen.getByText(
                'El precio de oferta debe ser un entero positivo y menor al precio normal.'
            )
        ).toBeInTheDocument()
    })

    it('permite agregar un producto en oferta correctamente', () => {
        render(<Admin />)

        fireEvent.change(screen.getByLabelText('Nombre del producto'), {
            target: { value: 'Torta de frutos rojos' },
        })
        fireEvent.change(screen.getByLabelText('Categoría'), {
            target: { value: 'Tortas' },
        })
        fireEvent.change(screen.getByLabelText('Precio (CLP)'), {
            target: { value: '12000' },
        })
        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Deliciosa torta de frutos rojos' },
        })

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        fireEvent.click(checkbox)

        fireEvent.change(screen.getByLabelText('Precio de oferta (CLP)'), {
            target: { value: '9000' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }))

        expect(
            screen.getByText('Producto agregado correctamente.')
        ).toBeInTheDocument()
        expect(screen.getByText('Torta de frutos rojos')).toBeInTheDocument()
    })

    it('al editar, el formulario pre-rellena el estado de oferta del producto', () => {
        render(<Admin />)

        const botonesEditar = screen.getAllByRole('button', { name: 'Editar' })

        fireEvent.click(botonesEditar[1])

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        expect(checkbox.checked).toBe(true)
        expect(screen.getByLabelText('Precio de oferta (CLP)').value).toBe('3490')
    })

    it('permite retirar un producto de oferta desmarcando el checkbox y guardando', () => {
        render(<Admin />)

        const botonesEditar = screen.getAllByRole('button', { name: 'Editar' })
        fireEvent.click(botonesEditar[1])

        const checkbox = screen.getByRole('checkbox', { name: 'Poner en oferta' })
        expect(checkbox.checked).toBe(true)

        fireEvent.click(checkbox)
        expect(checkbox.checked).toBe(false)

        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

        expect(
            screen.getByText('Producto actualizado correctamente.')
        ).toBeInTheDocument()
    })
})
