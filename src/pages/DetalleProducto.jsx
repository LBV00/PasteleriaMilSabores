import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId, getPrecioEfectivo } from '../services/productosService.js'
import { agregarAlCarrito } from '../services/carritoService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'

function DetalleProducto() {
    const { id } = useParams()
    const producto = obtenerProductoPorId(id)
    const [mensaje, setMensaje] = useState('')

    if (!producto) {
        return (
            <main>
                <PageHeader
                    subtitle="Producto no encontrado"
                    title="Oops, este producto no existe"
                    description="El producto que buscas no está disponible o fue eliminado del catálogo."
                />
                <section className="container py-5 text-center">
                    <div className="mb-4" style={{ fontSize: '4rem' }}>🔍</div>
                    <p className="text-secondary mb-4">
                        Puede que el producto haya sido eliminado o el enlace sea incorrecto.
                    </p>
                    <Link
                        to="/productos"
                        className="btn btn-lg text-white px-4"
                        style={{ backgroundColor: '#75452f' }}
                    >
                        Volver al catálogo
                    </Link>
                </section>
            </main>
        )
    }

    const formatearPrecio = (valor) =>
        valor.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })

    const ofertaValida =
        producto.enOferta === true &&
        typeof producto.precioOferta === 'number' &&
        producto.precioOferta > 0 &&
        producto.precioOferta < producto.precio

    const precioEfectivo = getPrecioEfectivo(producto)

    const descuentoPct = ofertaValida
        ? Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)
        : 0

    function manejarAgregar() {
        const guardado = agregarAlCarrito(producto)
        setMensaje(
            guardado
                ? `${producto.nombre} agregado al carrito.`
                : 'No se pudo agregar al carrito.'
        )
    }

    return (
        <main>
            <PageHeader
                subtitle={producto.categoria}
                title={producto.nombre}
            />

            <section className="container py-5">
                <Alert
                    tipo="info"
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                <div className="row g-5 align-items-start">

                    <div className="col-12 col-md-6">
                        <div className="position-relative rounded-4 overflow-hidden shadow-sm">
                            <img
                                src={
                                    producto.imagen ||
                                    '/images/productos/default-pasteleria.jpg'
                                }
                                alt={producto.nombre}
                                className="img-fluid w-100"
                                style={{ maxHeight: '420px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src =
                                        '/images/productos/default-pasteleria.jpg'
                                }}
                            />
                            {ofertaValida && (
                                <span
                                    className="position-absolute top-0 end-0 m-3 badge fs-5 fw-bold"
                                    style={{ backgroundColor: '#c0392b', color: '#fff' }}
                                >
                                    -{descuentoPct}% OFERTA
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="mb-3">
                            <Badge className="px-3 py-2">{producto.categoria}</Badge>
                        </div>

                        <h2 className="display-6 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                            {producto.nombre}
                        </h2>

                        <p className="lead text-secondary mb-4">{producto.descripcion}</p>

                        {ofertaValida ? (
                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                    <span
                                        className="display-6 fw-bold"
                                        style={{ color: '#c0392b' }}
                                        aria-label={`Precio de oferta: ${formatearPrecio(precioEfectivo)}`}
                                    >
                                        {formatearPrecio(precioEfectivo)}
                                    </span>
                                    <span
                                        className="fs-4 text-decoration-line-through text-secondary"
                                        aria-label={`Precio original: ${formatearPrecio(producto.precio)}`}
                                    >
                                        {formatearPrecio(producto.precio)}
                                    </span>
                                </div>
                                <p
                                    className="fw-semibold mt-2"
                                    style={{ color: '#c0392b' }}
                                >
                                    ¡Ahorra {descuentoPct}% con esta oferta!
                                </p>
                            </div>
                        ) : (
                            <p
                                className="display-6 fw-bold mb-4"
                                style={{ color: '#75452f' }}
                            >
                                {formatearPrecio(precioEfectivo)}
                            </p>
                        )}

                        <div className="d-flex flex-column gap-3">
                            <Button
                                type="button"
                                size="lg"
                                className="w-100"
                                onClick={manejarAgregar}
                            >
                                Agregar al carrito
                            </Button>

                            <Link
                                to="/productos"
                                className="btn btn-outline-dark btn-lg w-100"
                            >
                                ← Volver al catálogo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetalleProducto
