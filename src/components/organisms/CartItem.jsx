import QuantityControl from '../molecules/QuantityControl.jsx'
import Button from '../atoms/Button.jsx'

function CartItem({
    producto,
    onCambiarCantidad,
    onEliminar,
    formatearPrecio,
}) {
    return (
        <article className="card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-sm-7">
                        <h2 className="h5 fw-bold mb-2">{producto.nombre}</h2>

                        <p className="text-secondary mb-1">
                            Precio unitario: {formatearPrecio(producto.precio)}
                        </p>

                        <p className="fw-bold mb-0" style={{ color: '#75452f' }}>
                            Subtotal:{' '}
                            {formatearPrecio(producto.precio * producto.cantidad)}
                        </p>
                    </div>

                    <div className="col-7 col-sm-3">
                        <label
                            htmlFor={`cantidad-${producto.id}`}
                            className="form-label small fw-semibold"
                        >
                            Cantidad
                        </label>

                        <QuantityControl
                            id={`cantidad-${producto.id}`}
                            cantidad={producto.cantidad}
                            nombreProducto={producto.nombre}
                            onDisminuir={() =>
                                onCambiarCantidad(producto.id, producto.cantidad - 1)
                            }
                            onAumentar={() =>
                                onCambiarCantidad(producto.id, producto.cantidad + 1)
                            }
                            onCambiarCantidad={(nueva) =>
                                onCambiarCantidad(producto.id, nueva)
                            }
                        />
                    </div>

                    <div className="col-5 col-sm-2 text-end">
                        <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onEliminar(producto.id)}
                        >
                            Quitar
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default CartItem
