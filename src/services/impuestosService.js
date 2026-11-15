/**
 * Servicio de Impuestos y Facturación para Pastelería Mil Sabores
 * Maneja los cálculos de IVA chileno (19%) bajo el modelo de precios con IVA incluido.
 */

export const TASA_IVA_CHILE = 0.19

/**
 * Calcula el desglose tributario a partir de un precio o monto final (IVA incluido).
 * Fórmula chilena:
 *   Precio Neto = Math.round(Total / 1.19)
 *   IVA (19%)   = Total - Precio Neto
 *   Total       = Precio Neto + IVA
 *
 * @param {number} totalBruto Monto total a pagar con IVA incluido.
 * @param {number} [tasa=0.19] Tasa de impuesto configurable (por defecto 19%).
 * @returns {{ total: number, neto: number, iva: number, tasa: number, porcentaje: number }}
 */
export function calcularImpuestos(totalBruto, tasa = TASA_IVA_CHILE) {
    const total = Math.max(0, Math.round(Number(totalBruto) || 0))
    const neto = Math.round(total / (1 + tasa))
    const iva = total - neto

    return {
        total,
        neto,
        iva,
        tasa,
        porcentaje: Math.round(tasa * 100),
    }
}

/**
 * Calcula el desglose tributario para un ítem unitario y su cantidad.
 *
 * @param {number} precioUnitario Precio final unitario con IVA incluido.
 * @param {number} [cantidad=1] Cantidad de unidades.
 * @param {number} [tasa=0.19] Tasa de impuesto.
 * @returns {{ precioUnitario: number, cantidad: number, total: number, neto: number, iva: number }}
 */
export function calcularDesgloseItem(precioUnitario, cantidad = 1, tasa = TASA_IVA_CHILE) {
    const precio = Math.max(0, Math.round(Number(precioUnitario) || 0))
    const cant = Number.isInteger(cantidad) && cantidad > 0 ? cantidad : 1
    const total = precio * cant
    const neto = Math.round(total / (1 + tasa))
    const iva = total - neto

    return {
        precioUnitario: precio,
        cantidad: cant,
        total,
        neto,
        iva,
    }
}

/**
 * Formatea un valor numérico a pesos chilenos (CLP) sin decimales.
 *
 * @param {number} monto Monto en pesos chilenos.
 * @returns {string} Texto formateado (ej. "$ 11.900").
 */
export function formatearMonedaCLP(monto) {
    return (Number(monto) || 0).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    })
}
