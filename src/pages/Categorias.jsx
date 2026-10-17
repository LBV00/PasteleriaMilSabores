import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listarProductos } from '../services/productosService.js'
import { agregarAlCarrito } from '../services/carritoService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Badge from '../components/atoms/Badge.jsx'
import ProductCard from '../components/organisms/ProductCard.jsx'

function Categorias() {
    const [productos] = useState(() => listarProductos())
    const [categoriaActiva, setCategoriaActiva] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const navigate = useNavigate()

    const categorias = [...new Set(productos.map((p) => p.categoria))]

    const productosFiltrados = categoriaActiva
        ? productos.filter((p) => p.categoria === categoriaActiva)
        : []

    function manejarAgregar(producto) {
        const guardado = agregarAlCarrito(producto)
        setMensaje(
            guardado
                ? `${producto.nombre} agregado al carrito.`
                : 'No se pudo agregar el producto al carrito.'
        )
    }

    return (
        <main>
            <PageHeader
                subtitle="Explora por tipo"
                title="Categorías"
                description="Selecciona una categoría para explorar sus productos."
                centered
            />

            <section className="container py-5">
                <Alert
                    tipo="info"
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                <div className="row g-4 mb-5">
                    {categorias.map((cat) => {
                        const cantidad = productos.filter((p) => p.categoria === cat).length
                        const activa = categoriaActiva === cat

                        return (
                            <div key={cat} className="col-12 col-sm-6 col-lg-4">
                                <button
                                    type="button"
                                    className={`card w-100 h-100 border-0 shadow-sm text-start p-4 ${activa ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: activa ? '#75452f' : '#fff4eb',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onClick={() =>
                                        setCategoriaActiva(activa ? null : cat)
                                    }
                                    aria-pressed={activa}
                                >
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span
                                            className="fs-1"
                                            role="img"
                                            aria-label={cat}
                                        >
                                            {cat === 'Tortas'
                                                ? '🎂'
                                                : cat === 'Pasteles'
                                                ? '🍰'
                                                : cat === 'Galletas'
                                                ? '🍪'
                                                : cat === 'Cupcakes'
                                                ? '🧁'
                                                : cat === 'Panadería'
                                                ? '🥐'
                                                : '✨'}
                                        </span>
                                        <Badge
                                            style={{
                                                backgroundColor: activa ? 'rgba(255,255,255,0.25)' : undefined,
                                                color: activa ? '#fff' : undefined,
                                            }}
                                        >
                                            {cantidad}{' '}
                                            {cantidad === 1 ? 'producto' : 'productos'}
                                        </Badge>
                                    </div>

                                    <h2
                                        className="h4 fw-bold mb-1"
                                        style={{ color: activa ? '#fff' : '#4b2e25' }}
                                    >
                                        {cat}
                                    </h2>
                                    <p
                                        className="small mb-0"
                                        style={{ color: activa ? 'rgba(255,255,255,0.8)' : '#6f554a' }}
                                    >
                                        {activa ? 'Haz clic para cerrar' : 'Haz clic para explorar'}
                                    </p>
                                </button>
                            </div>
                        )
                    })}
                </div>

                {categoriaActiva && (
                    <div>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                            <h2 className="h3 fw-bold mb-0" style={{ color: '#4b2e25' }}>
                                {categoriaActiva}
                            </h2>
                            <span className="text-secondary">
                                {productosFiltrados.length}{' '}
                                {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                            </span>
                        </div>

                        {productosFiltrados.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-secondary mb-3">
                                    No hay productos disponibles en esta categoría.
                                </p>
                                <Link
                                    to="/productos"
                                    className="btn btn-outline-dark"
                                >
                                    Ver todos los productos
                                </Link>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {productosFiltrados.map((producto) => (
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
                        )}

                        <div className="text-center mt-5">
                            <button
                                type="button"
                                className="btn btn-outline-secondary me-3"
                                onClick={() => setCategoriaActiva(null)}
                            >
                                Cerrar categoría
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-dark"
                                onClick={() => navigate('/carrito')}
                            >
                                Ir al carrito
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Categorias
