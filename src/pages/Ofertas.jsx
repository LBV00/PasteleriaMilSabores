import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listarOfertas } from '../services/productosService.js'
import { agregarAlCarrito } from '../services/carritoService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import ProductCard from '../components/organisms/ProductCard.jsx'

function Ofertas() {
    const [ofertas] = useState(() => listarOfertas())
    const [mensaje, setMensaje] = useState('')

    function manejarAgregar(producto) {
        const guardado = agregarAlCarrito(producto)

        setMensaje(
            guardado
                ? `${producto.nombre} agregado al carrito con precio de oferta.`
                : 'No se pudo agregar el producto al carrito.'
        )
    }

    return (
        <main>
            <PageHeader
                subtitle="Precios especiales"
                title="Ofertas del momento"
                description="Aprovecha nuestros descuentos exclusivos en productos seleccionados."
                centered
            />

            <section className="container py-5">
                <Alert
                    tipo="info"
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                {ofertas.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4" style={{ fontSize: '4rem' }}>🎂</div>
                        <h2 className="h3 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                            No hay ofertas disponibles en este momento
                        </h2>
                        <p className="text-secondary mb-4">
                            Vuelve pronto para descubrir nuestros descuentos especiales.
                        </p>
                        <Link
                            to="/productos"
                            className="btn btn-lg text-white px-4"
                            style={{ backgroundColor: '#75452f' }}
                        >
                            Ver todos los productos
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-secondary mb-4">
                            {ofertas.length}{' '}
                            {ofertas.length === 1
                                ? 'producto en oferta'
                                : 'productos en oferta'}
                        </p>

                        <div className="row g-4">
                            {ofertas.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    id={producto.id}
                                    nombre={producto.nombre}
                                    descripcion={producto.descripcion}
                                    precio={producto.precio}
                                    precioOferta={producto.precioOferta}
                                    enOferta={producto.enOferta}
                                    categoria={producto.categoria}
                                    imagen={producto.imagen}
                                    onAgregar={() => manejarAgregar(producto)}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-5">
                            <Link
                                to="/carrito"
                                className="btn btn-outline-dark btn-lg px-4 me-3"
                            >
                                Ir al carrito
                            </Link>
                            <Link
                                to="/productos"
                                className="btn btn-outline-secondary btn-lg px-4"
                            >
                                Ver todos los productos
                            </Link>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}

export default Ofertas
