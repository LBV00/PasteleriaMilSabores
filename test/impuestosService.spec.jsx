import { describe, it, expect } from 'vitest'
import {
    calcularImpuestos,
    calcularDesgloseItem,
    formatearMonedaCLP,
    TASA_IVA_CHILE,
} from '../src/services/impuestosService.js'

describe('Servicio de Impuestos (IVA 19% chileno)', () => {
    it('debe tener configurada la tasa oficial de IVA de Chile en 19% (0.19)', () => {
        expect(TASA_IVA_CHILE).toBe(0.19)
    })

    it('calcula correctamente el neto e IVA para $11.900 (caso exacto de ejemplo)', () => {
        const resultado = calcularImpuestos(11900)

        // 11900 / 1.19 = 10000
        expect(resultado.neto).toBe(10000)
        // 11900 - 10000 = 1900
        expect(resultado.iva).toBe(1900)
        expect(resultado.total).toBe(11900)
        expect(resultado.porcentaje).toBe(19)
        // La suma de neto + IVA debe ser idéntica al total
        expect(resultado.neto + resultado.iva).toBe(resultado.total)
    })

    it('calcula correctamente con redondeo a enteros en pesos chilenos para montos decimales', () => {
        // $15.990: 15990 / 1.19 = 13436.9747... -> redondea a 13437
        const resultado = calcularImpuestos(15990)

        expect(resultado.total).toBe(15990)
        expect(resultado.neto).toBe(13437)
        expect(resultado.iva).toBe(2553)
        expect(resultado.neto + resultado.iva).toBe(15990)
    })

    it('evita el cobro doble de IVA interpretando que el precio final ya incluye el impuesto', () => {
        const precioCatalogo = 4990
        const desglose = calcularImpuestos(precioCatalogo)

        // El cliente paga exactamente el precio de catálogo, no se le suma otro 19%
        expect(desglose.total).toBe(precioCatalogo)
        expect(desglose.neto).toBeLessThan(precioCatalogo)
        expect(desglose.iva).toBeGreaterThan(0)
        expect(desglose.neto + desglose.iva).toBe(precioCatalogo)
    })

    it('maneja valores límite como cero y negativos retornando valores válidos', () => {
        const cero = calcularImpuestos(0)
        expect(cero.total).toBe(0)
        expect(cero.neto).toBe(0)
        expect(cero.iva).toBe(0)

        const negativo = calcularImpuestos(-500)
        expect(negativo.total).toBe(0)
        expect(negativo.neto).toBe(0)
        expect(negativo.iva).toBe(0)
    })

    it('desglosa correctamente impuestos por ítem y cantidad unitaria', () => {
        // 3 unidades a $2.990 c/u = $8.970
        // Neto: 8970 / 1.19 = 7537.81... -> 7538
        // IVA: 8970 - 7538 = 1432
        const desglose = calcularDesgloseItem(2990, 3)

        expect(desglose.precioUnitario).toBe(2990)
        expect(desglose.cantidad).toBe(3)
        expect(desglose.total).toBe(8970)
        expect(desglose.neto).toBe(7538)
        expect(desglose.iva).toBe(1432)
        expect(desglose.neto + desglose.iva).toBe(desglose.total)
    })

    it('formatea correctamente los valores a pesos chilenos (CLP)', () => {
        const texto = formatearMonedaCLP(11900)
        expect(texto).toMatch(/\$|CLP/)
        expect(texto).toContain('11.900')
    })
})
