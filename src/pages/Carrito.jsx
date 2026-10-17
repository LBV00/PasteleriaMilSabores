import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    listarCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
} from '../services/carritoService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Button from '../components/atoms/Button.jsx'
import CartItem from '../components/organisms/CartItem.jsx'
import CartSummary from '../components/organisms/CartSummary.jsx'

function Carrito() {
    const navigate = useNavigate()
    const [productos, setProductos] = useState(() => listarCarrito())
    const [mensaje, setMensaje] = useState('')

    const total = productos.reduce(
        (suma, producto) => suma + producto.precio * producto.cantidad,
        0
    )

    function formatearPrecio(precio) {
        return precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })
    }

    function manejarCantidad(id, cantidad) {
        if (actualizarCantidad(id, cantidad)) {
            setProductos(listarCarrito())
            setMensaje('Cantidad actualizada.')
        } else {
            setMensaje('No se pudo actualizar la cantidad.')
        }
    }

    function manejarEliminacion(id) {
        if (eliminarDelCarrito(id)) {
            setProductos(listarCarrito())
            setMensaje('Producto eliminado del carrito.')
        } else {
            setMensaje('No se pudo eliminar el producto.')
        }
    }

    function manejarVaciar() {
        if (vaciarCarrito()) {
            setProductos([])
            setMensaje('El carrito se ha vaciado.')
        } else {
            setMensaje('No se pudo vaciar el carrito.')
        }
    }

    return (
        <main>
            <PageHeader
                subtitle="Tus favoritos"
                title="Mi carrito"
            />

            <section className="container py-5">
                <Alert
                    tipo="info"
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                {productos.length === 0 ? (
                    <div className="text-center py-5">
                        <h2 className="h3 fw-bold mb-3">Tu carrito está vacío</h2>

                        <p className="text-secondary mb-4">
                            Descubre nuestras tortas, pasteles y dulces favoritos.
                        </p>

                        <Link
                            to="/productos"
                            className="btn btn-lg text-white px-4"
                            style={{ backgroundColor: '#75452f' }}
                        >
                            Explorar productos
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                            <p className="text-secondary mb-0">
                                {productos.length}{' '}
                                {productos.length === 1
                                    ? 'producto diferente'
                                    : 'productos diferentes'}
                            </p>

                            <Button
                                type="button"
                                variant="outline-danger"
                                onClick={manejarVaciar}
                            >
                                Vaciar carrito
                            </Button>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-lg-8">
                                <div className="d-flex flex-column gap-3">
                                    {productos.map((producto) => (
                                        <CartItem
                                            key={producto.id}
                                            producto={producto}
                                            onCambiarCantidad={manejarCantidad}
                                            onEliminar={manejarEliminacion}
                                            formatearPrecio={formatearPrecio}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="col-12 col-lg-4">
                                <CartSummary
                                    productos={productos}
                                    total={total}
                                    formatearPrecio={formatearPrecio}
                                    onContinuarCompra={() => navigate('/checkout')}
                                />
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}

export default Carrito
