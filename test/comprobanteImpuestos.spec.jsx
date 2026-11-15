import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CompraExitosa from '../src/pages/CompraExitosa.jsx'
import Checkout from '../src/pages/Checkout.jsx'
import { crearPedido } from '../src/services/pedidosService.js'

describe('Comprobante de Compra y Desglose de Impuestos en Vistas', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const datosEntrega = {
        nombre: 'Matías Fernandez',
        email: 'matias@example.cl',
        telefono: '+56988776655',
        direccion: 'Av. Libertador Bernardo OHiggins 1050',
        comuna: 'Santiago',
        region: 'Región Metropolitana',
        indicaciones: 'Oficina 402',
    }

    // Torta chocolate $15.990 x 1, Cheesecake $4.990 x 2 = Total: $25.970
    // Neto: 25970 / 1.19 = 21823.52... -> 21824
    // IVA: 25970 - 21824 = 4146
    const productosCarrito = [
        { id: 1, nombre: 'Torta de chocolate', precio: 15990, cantidad: 1 },
        { id: 2, nombre: 'Cheesecake', precio: 4990, cantidad: 2 },
    ]

    it('el comprobante en CompraExitosa muestra el encabezado, datos del cliente y desglose completo de IVA 19%', () => {
        const resultado = crearPedido(datosEntrega, productosCarrito)
        const pedidoId = resultado.pedido.id

        render(
            <MemoryRouter initialEntries={[{ pathname: '/compra-exitosa', state: { pedidoId } }]}>
                <Routes>
                    <Route path="/compra-exitosa" element={<CompraExitosa />} />
                </Routes>
            </MemoryRouter>
        )

        // Nombre de la tienda
        expect(screen.getByRole('heading', { level: 1, name: 'Pastelería Mil Sabores' })).toBeInTheDocument()

        // Número de orden y estado
        expect(screen.getByText(pedidoId)).toBeInTheDocument()
        expect(screen.getAllByText(/CONFIRMADO/i).length).toBeGreaterThan(0)

        // Datos del cliente
        expect(screen.getByText(/Matías Fernandez/)).toBeInTheDocument()
        expect(screen.getByText(/matias@example\.cl/)).toBeInTheDocument()
        expect(screen.getByText(/\+56988776655/)).toBeInTheDocument()
        expect(screen.getByText(/Av\. Libertador Bernardo OHiggins 1050/)).toBeInTheDocument()

        // Productos
        expect(screen.getByText('Torta de chocolate')).toBeInTheDocument()
        expect(screen.getByText('Cheesecake')).toBeInTheDocument()

        // Desglose tributario
        expect(screen.getByText('Subtotal (IVA incluido):')).toBeInTheDocument()
        expect(screen.getByText('Monto Neto:')).toBeInTheDocument()
        expect(screen.getByText('IVA (19% chileno):')).toBeInTheDocument()
        expect(screen.getByText('Total pagado:')).toBeInTheDocument()

        // Valores monetarios (independiente del espacio generado por Intl en distintas plataformas)
        expect(screen.getAllByText(/\$?\s*25\.970/).length).toBeGreaterThan(0)
        expect(screen.getByText(/\$?\s*21\.824/)).toBeInTheDocument()
        expect(screen.getByText(/\$?\s*4\.146/)).toBeInTheDocument()

        // Aclaración académica
        expect(screen.getByText(/representación académica simulada/i)).toBeInTheDocument()
        expect(screen.getByText(/No corresponde a una boleta electrónica tributaria oficial/i)).toBeInTheDocument()
    })

    it('el botón de imprimir comprobante invoca window.print()', () => {
        const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
        const resultado = crearPedido(datosEntrega, productosCarrito)

        render(
            <MemoryRouter initialEntries={[{ pathname: '/compra-exitosa', state: { pedidoId: resultado.pedido.id } }]}>
                <Routes>
                    <Route path="/compra-exitosa" element={<CompraExitosa />} />
                </Routes>
            </MemoryRouter>
        )

        const botonImprimir = screen.getByRole('button', { name: /Imprimir comprobante/i })
        expect(botonImprimir).toBeInTheDocument()

        fireEvent.click(botonImprimir)
        expect(printSpy).toHaveBeenCalledTimes(1)
    })

    it('la página Checkout muestra el desglose del Neto e IVA del 19% antes de comprar', () => {
        localStorage.setItem('milSabores_carrito', JSON.stringify(productosCarrito))

        render(
            <MemoryRouter initialEntries={['/checkout']}>
                <Routes>
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByRole('heading', { level: 2, name: 'Resumen del pedido' })).toBeInTheDocument()
        expect(screen.getByText('Precio Neto')).toBeInTheDocument()
        expect(screen.getByText('IVA del 19% (incluido)')).toBeInTheDocument()
        expect(screen.getByText(/\$?\s*21\.824/)).toBeInTheDocument()
        expect(screen.getByText(/\$?\s*4\.146/)).toBeInTheDocument()
        expect(screen.getByText('Total a pagar')).toBeInTheDocument()
    })
})
