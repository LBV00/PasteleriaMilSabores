import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listarProductos } from '../services/productosService.js'
import { agregarAlCarrito } from '../services/carritoService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import SearchBar from '../components/molecules/SearchBar.jsx'
import ProductCard from '../components/organisms/ProductCard.jsx'

function Productos() {
    const [productos] = useState(() => listarProductos())
    const [busqueda, setBusqueda] = useState('')
    const [categoria, setCategoria] = useState('Todas')
    const [mensaje, setMensaje] = useState('')

    const categorias = [
        'Todas',
        ...new Set(productos.map((producto) => producto.categoria)),
    ]

    const productosFiltrados = productos.filter((producto) => {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(busqueda.trim().toLowerCase())

        const coincideCategoria =
            categoria === 'Todas' || producto.categoria === categoria

        return coincideNombre && coincideCategoria
    })

    function manejarAgregar(producto) {
        const guardado = agregarAlCarrito(producto)

        setMensaje(
            guardado
                ? `${producto.nombre} agregado al carrito.`
                : 'No se pudo guardar el producto en el carrito.'
        )
    }

    return (
        <main>
            <PageHeader
                subtitle="Elaborados para disfrutar"
                title="Nuestro catálogo"
                description="Encuentra tu próximo dulce favorito en Pastelería Mil Sabores."
                centered
            />

            <section className="container py-5">
                <Alert
                    tipo="info"
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                <div className="row g-3 align-items-end mb-4">
                    <div className="col-12 col-lg-6">
                        <SearchBar
                            id="buscarProducto"
                            label="Buscar por nombre"
                            placeholder="Ej.: torta de chocolate"
                            value={busqueda}
                            onChange={(evento) => setBusqueda(evento.target.value)}
                            size="lg"
                        />
                    </div>

                    <div className="col-12 col-lg-4">
                        <label htmlFor="filtrarCategoria" className="form-label fw-semibold">
                            Filtrar por categoría
                        </label>

                        <select
                            id="filtrarCategoria"
                            className="form-select form-select-lg"
                            value={categoria}
                            onChange={(evento) => setCategoria(evento.target.value)}
                        >
                            {categorias.map((nombreCategoria) => (
                                <option key={nombreCategoria} value={nombreCategoria}>
                                    {nombreCategoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-lg-2">
                        <p className="text-secondary mb-2">
                            {productosFiltrados.length}{' '}
                            {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                        </p>
                    </div>
                </div>

                {productosFiltrados.length > 0 ? (
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
                ) : (
                    <div className="text-center py-5">
                        <h2 className="h4 fw-bold">No encontramos productos</h2>
                        <p className="text-secondary">
                            Prueba con otro nombre o selecciona otra categoría.
                        </p>
                        <button
                            className="btn btn-outline-dark"
                            onClick={() => {
                                setBusqueda('')
                                setCategoria('Todas')
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                <div className="text-center mt-5">
                    <Link
                        to="/carrito"
                        className="btn btn-outline-dark btn-lg px-4"
                    >
                        Ir al carrito
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Productos
