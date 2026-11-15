import { Link } from 'react-router-dom'
import Badge from '../atoms/Badge.jsx'
import Button from '../atoms/Button.jsx'

const IMAGEN_DEFAULT = '/images/productos/default-pasteleria.jpg'

function ProductCard({
    id,
    nombre,
    descripcion,
    precio,
    precioOferta,
    enOferta,
    categoria,
    imagen,
    stock,
    onAgregar,
    colClass = 'col-12 col-sm-6 col-lg-4 col-xl-3',
}) {

    if (precio === undefined && !onAgregar) {
        return (
            <div className={colClass}>
                <article className="card h-100 shadow-sm border-0 overflow-hidden">
                    <img
                        src={imagen || IMAGEN_DEFAULT}
                        className="card-img-top"
                        alt={nombre}
                        loading="lazy"
                        style={{ height: '220px', width: '100%', objectFit: 'cover' }}
                        onError={(evento) => {
                            evento.currentTarget.onerror = null
                            evento.currentTarget.src = IMAGEN_DEFAULT
                        }}
                    />
                    <div className="card-body">
                        <h3 className="h5 card-title">{nombre}</h3>
                        <p className="card-text text-secondary">{descripcion}</p>
                    </div>
                </article>
            </div>
        )
    }

    const formatearPrecio = (valor) =>
        (valor || 0).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })

    const ofertaValida =
        enOferta === true &&
        typeof precioOferta === 'number' &&
        precioOferta > 0 &&
        precioOferta < precio

    const descuentoPct = ofertaValida
        ? Math.round(((precio - precioOferta) / precio) * 100)
        : 0

    const esAgotado = typeof stock === 'number' && stock <= 0
    const esStockBajo = typeof stock === 'number' && stock > 0 && stock <= 5

    return (
        <div className={colClass}>
            <article className="card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column">
                <div className="position-relative">
                    <img
                        src={imagen || IMAGEN_DEFAULT}
                        className="card-img-top"
                        alt={nombre}
                        loading="lazy"
                        style={{ height: '220px', width: '100%', objectFit: 'cover' }}
                        onError={(evento) => {
                            evento.currentTarget.onerror = null
                            evento.currentTarget.src = IMAGEN_DEFAULT
                        }}
                    />
                    {ofertaValida && (
                        <span
                            className="position-absolute top-0 end-0 m-2 badge fs-6 fw-bold"
                            style={{ backgroundColor: '#c0392b', color: '#fff' }}
                            aria-label={`Oferta: ${descuentoPct}% de descuento`}
                        >
                            -{descuentoPct}%
                        </span>
                    )}
                </div>

                <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        {categoria && (
                            <Badge className="px-3 py-2">
                                {categoria}
                            </Badge>
                        )}

                        {esAgotado && (
                            <span className="badge bg-danger">
                                Agotado
                            </span>
                        )}
                        {esStockBajo && (
                            <span className="badge bg-warning text-dark">
                                {stock === 1 ? '¡Última unidad!' : `¡Últimas ${stock} un.!`}
                            </span>
                        )}
                        {typeof stock === 'number' && stock > 5 && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                                Disponible ({stock})
                            </span>
                        )}
                    </div>

                    <h2 className="h4 fw-bold" style={{ color: '#4b2e25' }}>
                        {nombre}
                    </h2>

                    <p className="text-secondary mb-3">{descripcion}</p>

                    <div className="mt-auto">
                        {ofertaValida ? (
                            <div className="mb-3">
                                <span
                                    className="fs-4 fw-bold me-2"
                                    style={{ color: '#c0392b' }}
                                >
                                    {formatearPrecio(precioOferta)}
                                </span>
                                <span
                                    className="fs-6 text-decoration-line-through text-secondary"
                                    aria-label={`Precio original: ${formatearPrecio(precio)}`}
                                >
                                    {formatearPrecio(precio)}
                                </span>
                            </div>
                        ) : (
                            <p
                                className="fs-4 fw-bold mb-3"
                                style={{ color: '#75452f' }}
                            >
                                {formatearPrecio(precio)}
                            </p>
                        )}

                        <div className="d-flex flex-column gap-2">
                            {esAgotado ? (
                                <Button
                                    type="button"
                                    size="lg"
                                    className="w-100"
                                    disabled
                                    variant="secondary"
                                >
                                    Agotado
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    size="lg"
                                    className="w-100"
                                    onClick={onAgregar}
                                >
                                    Agregar al carrito
                                </Button>
                            )}

                            {id !== undefined && (
                                <Link
                                    to={`/productos/${id}`}
                                    className="btn btn-outline-dark btn-lg w-100"
                                >
                                    Ver detalle
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default ProductCard
