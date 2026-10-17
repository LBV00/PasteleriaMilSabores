import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { obtenerPedidoPorId, obtenerUltimoPedido } from '../services/pedidosService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Badge from '../components/atoms/Badge.jsx'

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

    return (
        <main>
            <PageHeader
                subtitle="¡Gracias por tu compra!"
                title="Pedido confirmado"
                description="Hemos recibido tu orden y ya nos estamos preparando para endulzar tu día."
                centered
            />

            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom mb-4">
                                <div>
                                    <span className="text-secondary small d-block">Número de pedido</span>
                                    <h2 className="h4 fw-bold mb-0" style={{ color: '#4b2e25' }}>
                                        {pedido.id}
                                    </h2>
                                </div>
                                <div className="text-md-end">
                                    <Badge backgroundColor="#d1e7dd" color="#0f5132" className="px-3 py-2 fs-6">
                                        ✓ {pedido.estado?.toUpperCase() || 'CONFIRMADO'}
                                    </Badge>
                                    <span className="text-secondary small d-block mt-1">
                                        {formatearFecha(pedido.fecha)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                    Detalle del pedido
                                </h3>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr className="text-secondary small">
                                                <th>Producto</th>
                                                <th className="text-center">Cantidad</th>
                                                <th className="text-end">Precio unitario</th>
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
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold fs-5 pt-3">
                                                    Total pagado:
                                                </td>
                                                <td className="text-end fw-bold fs-5 pt-3" style={{ color: '#75452f' }}>
                                                    {formatearPrecio(pedido.total)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="mb-4 p-4 rounded-3" style={{ backgroundColor: '#fff4eb' }}>
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                    Datos de entrega
                                </h3>
                                <div className="row g-2 small">
                                    <div className="col-12 col-sm-6">
                                        <strong>Nombre:</strong> {pedido.cliente?.nombre}
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <strong>Correo:</strong> {pedido.cliente?.email}
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <strong>Teléfono:</strong> {pedido.cliente?.telefono}
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <strong>Dirección:</strong> {pedido.cliente?.direccion}
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <strong>Comuna / Región:</strong> {pedido.cliente?.comuna}, {pedido.cliente?.region}
                                    </div>
                                    {pedido.cliente?.indicaciones && (
                                        <div className="col-12">
                                            <strong>Indicaciones:</strong> {pedido.cliente.indicaciones}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center pt-3">
                                <Link
                                    to="/productos"
                                    className="btn btn-lg text-white px-5"
                                    style={{ backgroundColor: '#75452f' }}
                                >
                                    Volver al catálogo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CompraExitosa
