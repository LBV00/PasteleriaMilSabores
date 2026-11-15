import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { obtenerPedidoPorId, obtenerUltimoPedido } from '../services/pedidosService.js'
import { calcularImpuestos } from '../services/impuestosService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'

function CompraExitosa() {
    const location = useLocation()
    const [searchParams] = useSearchParams()

    const pedidoId = location.state?.pedidoId || searchParams.get('id')
    const pedido = pedidoId ? obtenerPedidoPorId(pedidoId) : obtenerUltimoPedido()

    function formatearPrecio(precio) {
        return (precio || 0).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })
    }

    function formatearFecha(iso) {
        if (!iso) return ''
        return new Date(iso).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    function manejarImprimir() {
        window.print()
    }

    if (!pedido || !pedido.id) {
        return (
            <main>
                <PageHeader
                    subtitle="Estado de compra"
                    title="No encontramos tu pedido"
                    centered
                />
                <section className="container py-5 text-center">
                    <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: '600px' }}>
                        <Alert tipo="warning" role="alert" className="mb-4">
                            No se encontró ningún pedido válido o la sesión ha caducado.
                        </Alert>
                        <p className="text-secondary mb-4">
                            Para ver el estado de tus compras, visita nuestro catálogo o comunícate con atención al cliente.
                        </p>
                        <div>
                            <Link
                                to="/productos"
                                className="btn btn-lg text-white px-4"
                                style={{ backgroundColor: '#75452f' }}
                            >
                                Volver al catálogo
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    const { neto, iva } = calcularImpuestos(pedido.total)
    const netoFinal = pedido.neto !== undefined ? pedido.neto : neto
    const ivaFinal = pedido.iva !== undefined ? pedido.iva : iva

    return (
        <main>
            <div className="d-print-none">
                <PageHeader
                    subtitle="¡Gracias por tu compra!"
                    title="Pedido confirmado"
                    description="Hemos recibido tu orden y ya nos estamos preparando para endulzar tu día."
                    centered
                />
            </div>

            <section className="container py-4 py-lg-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        {/* Tarjeta imprimible de comprobante de compra */}
                        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4 bg-white" id="comprobanteCompra">
                            {/* Encabezado del comprobante */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom mb-4">
                                <div>
                                    <h1 className="h3 fw-bold mb-1" style={{ color: '#4b2e25' }}>
                                        Pastelería Mil Sabores
                                    </h1>
                                    <p className="text-muted small mb-0">
                                        Comprobante de Detalle de Compra y Despacho
                                    </p>
                                    <span className="text-secondary small d-block mt-2">
                                        Número de pedido: <strong className="text-dark">{pedido.id}</strong>
                                    </span>
                                </div>

                                <div className="text-md-end">
                                    <Badge backgroundColor="#d1e7dd" color="#0f5132" className="px-3 py-2 fs-6">
                                        ✓ {pedido.estado?.toUpperCase() || 'CONFIRMADO'}
                                    </Badge>
                                    <span className="text-secondary small d-block mt-2">
                                        Fecha: {formatearFecha(pedido.fecha)}
                                    </span>
                                </div>
                            </div>

                            {/* Detalle de productos */}
                            <div className="mb-4">
                                <h2 className="h5 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                    Detalle del pedido
                                </h2>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead className="table-light">
                                            <tr className="text-secondary small">
                                                <th>Producto</th>
                                                <th className="text-center">Cantidad</th>
                                                <th className="text-end">Precio unitario (IVA incl.)</th>
                                                <th className="text-end">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.items?.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td className="fw-semibold">{item.nombre}</td>
                                                    <td className="text-center">{item.cantidad}</td>
                                                    <td className="text-end">{formatearPrecio(item.precio)}</td>
                                                    <td className="text-end fw-bold" style={{ color: '#75452f' }}>
                                                        {formatearPrecio(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Desglose Tributario (IVA 19% chileno) */}
                            <div className="row g-4 mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#fff4eb' }}>
                                        <h3 className="h6 fw-bold mb-2" style={{ color: '#4b2e25' }}>
                                            Datos de entrega
                                        </h3>
                                        <div className="small">
                                            <p className="mb-1"><strong>Nombre:</strong> {pedido.cliente?.nombre}</p>
                                            <p className="mb-1"><strong>Correo:</strong> {pedido.cliente?.email}</p>
                                            <p className="mb-1"><strong>Teléfono:</strong> {pedido.cliente?.telefono}</p>
                                            <p className="mb-1"><strong>Dirección:</strong> {pedido.cliente?.direccion}</p>
                                            <p className="mb-1"><strong>Comuna / Región:</strong> {pedido.cliente?.comuna}, {pedido.cliente?.region}</p>
                                            {pedido.cliente?.indicaciones && (
                                                <p className="mb-0"><strong>Indicaciones:</strong> {pedido.cliente.indicaciones}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="card border p-3 h-100 bg-light">
                                        <h3 className="h6 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                            Resumen comercial y tributario
                                        </h3>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-secondary">Subtotal (IVA incluido):</span>
                                            <span className="fw-semibold">{formatearPrecio(pedido.total)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-secondary">Monto Neto:</span>
                                            <span>{formatearPrecio(netoFinal)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-secondary">IVA (19% chileno):</span>
                                            <span>{formatearPrecio(ivaFinal)}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold fs-6">Total pagado:</span>
                                            <span className="fw-bold fs-5" style={{ color: '#75452f' }}>
                                                {formatearPrecio(pedido.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nota de validez simulada */}
                            <div className="alert alert-secondary py-2 px-3 small mb-4">
                                <strong>Nota informativa:</strong> Este comprobante es una representación académica simulada para el proyecto de pastelería con IVA chileno del 19% incluido en los precios finales. No corresponde a una boleta electrónica tributaria oficial emitida ante el Servicio de Impuestos Internos (SII).
                            </div>

                            {/* Botones de acción (ocultos al imprimir) */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-3 border-top d-print-none">
                                <Link
                                    to="/productos"
                                    className="btn btn-outline-dark px-4"
                                >
                                    Volver al catálogo
                                </Link>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={manejarImprimir}
                                    className="px-4 shadow-sm"
                                >
                                    🖨️ Imprimir comprobante
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CompraExitosa
