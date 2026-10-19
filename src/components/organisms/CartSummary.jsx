import { Link } from 'react-router-dom'
import Button from '../atoms/Button.jsx'

function CartSummary({
    productos,
    total,
    formatearPrecio,
    onContinuarCompra,
}) {
    const cantidadTotal = productos.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    )

    return (
        <aside className="card border-0 shadow-sm">
            <div className="card-body p-4">
                <h2 className="h4 fw-bold mb-4">Resumen de compra</h2>

                <div className="d-flex justify-content-between gap-3 mb-3">
                    <span className="text-secondary">Cantidad total</span>
                    <span>{cantidadTotal}</span>
                </div>

                <div className="d-flex justify-content-between gap-3 mb-3">
                    <span className="text-secondary">Subtotal</span>
                    <span>{formatearPrecio(total)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                    <span className="fw-bold">Total</span>
                    <span className="fs-4 fw-bold" style={{ color: '#75452f' }}>
                        {formatearPrecio(total)}
                    </span>
                </div>

                <p className="small text-secondary">
                    El costo de despacho, si corresponde, se calculará por separado.
                </p>

                <Button
                    type="button"
                    size="lg"
                    className="w-100"
                    onClick={onContinuarCompra}
                >
                    Continuar compra
                </Button>

                <Link
                    to="/productos"
                    className="btn btn-outline-dark w-100 mt-3"
                >
                    Seguir comprando
                </Link>
            </div>
        </aside>
    )
}

export default CartSummary
