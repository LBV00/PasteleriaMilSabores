import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CompraExitosa from '../src/pages/CompraExitosa.jsx'
import { crearPedido } from '../src/services/pedidosService.js'

describe('Página CompraExitosa', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const datosEntrega = {
        nombre: 'Ignacio Fuentes',
        email: 'ignacio@correo.cl',
        telefono: '+56976543210',
        direccion: 'Pasaje Las Lilas 123',
        comuna: 'La Florida',
        region: 'Región Metropolitana',
        indicaciones: 'Casa con reja negra',
    }

    const productosCarrito = [
        { id: 1, nombre: 'Torta de milhojas', precio: 18000, cantidad: 1 },
        { id: 2, nombre: 'Empanadas dulces', precio: 1500, cantidad: 4 },
    ]

    function renderizarCompraExitosa(initialEntries = ['/compra-exitosa']) {
        return render(
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/compra-exitosa" element={<CompraExitosa />} />
                    <Route path="/productos" element={<div>Vista Catálogo</div>} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('renderiza la confirmación de compra completa cuando existe un pedido válido', () => {
        const resultado = crearPedido(datosEntrega, productosCarrito)
        const pedidoId = resultado.pedido.id

        renderizarCompraExitosa([
            { pathname: '/compra-exitosa', state: { pedidoId } },
        ])

        expect(
            screen.getByRole('heading', { level: 1, name: 'Pedido confirmado' })
        ).toBeInTheDocument()
        expect(screen.getByText(pedidoId)).toBeInTheDocument()

        expect(screen.getByText('Torta de milhojas')).toBeInTheDocument()
        expect(screen.getByText('Empanadas dulces')).toBeInTheDocument()
        expect(screen.getByText('Total pagado:')).toBeInTheDocument()

        expect(screen.getByText('Ignacio Fuentes')).toBeInTheDocument()
        expect(screen.getByText('ignacio@correo.cl')).toBeInTheDocument()
        expect(screen.getByText('+56976543210')).toBeInTheDocument()
        expect(screen.getByText('Pasaje Las Lilas 123')).toBeInTheDocument()
        expect(screen.getByText(/La Florida/i)).toBeInTheDocument()
        expect(screen.getByText(/Casa con reja negra/i)).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Volver al catálogo' })
        ).toBeInTheDocument()
    })

    it('muestra pantalla de advertencia y protege el acceso si no hay pedido registrado', () => {

        renderizarCompraExitosa(['/compra-exitosa'])

        expect(
            screen.getByRole('heading', { level: 1, name: 'No encontramos tu pedido' })
        ).toBeInTheDocument()
        expect(
            screen.getByText(/No se encontró ningún pedido válido o la sesión ha caducado\./i)
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Volver al catálogo' })
        ).toBeInTheDocument()
    })
})
