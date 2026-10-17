import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CompraFallida from '../src/pages/CompraFallida.jsx'

describe('Página CompraFallida', () => {
    function renderizarCompraFallida(initialEntries = ['/compra-fallida']) {
        return render(
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/compra-fallida" element={<CompraFallida />} />
                    <Route path="/carrito" element={<div>Vista Carrito</div>} />
                    <Route path="/productos" element={<div>Vista Catálogo</div>} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('renderiza el mensaje de error comprensible y las opciones de reintento', () => {
        renderizarCompraFallida([
            {
                pathname: '/compra-fallida',
                state: { error: 'No pudimos procesar tu solicitud debido a un problema temporal.' },
            },
        ])

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'No pudimos completar tu compra',
            })
        ).toBeInTheDocument()
        expect(
            screen.getByText('No pudimos procesar tu solicitud debido a un problema temporal.')
        ).toBeInTheDocument()
        expect(
            screen.getByText(/los productos siguen guardados en tu carrito/i)
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Volver al carrito' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Explorar productos' })
        ).toBeInTheDocument()
    })

    it('muestra mensaje por defecto si no se proporcionó error en state', () => {
        renderizarCompraFallida(['/compra-fallida'])

        expect(
            screen.getByText('No fue posible registrar tu pedido en este momento.')
        ).toBeInTheDocument()
    })
})
