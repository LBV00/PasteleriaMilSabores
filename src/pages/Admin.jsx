import { useState } from 'react'
import {
    listarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
} from '../services/productosService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'
import SearchBar from '../components/molecules/SearchBar.jsx'
import FormField from '../components/molecules/FormField.jsx'

const FORMULARIO_VACIO = {
    nombre: '',
    categoria: 'Tortas',
    precio: '',
    descripcion: '',
    imagen: '',
    enOferta: false,
    precioOferta: '',
}

function Admin() {
    const [productos, setProductos] = useState(() => listarProductos())
    const [formulario, setFormulario] = useState({ ...FORMULARIO_VACIO })
    const [idEditando, setIdEditando] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('info')
    const [busqueda, setBusqueda] = useState('')

    const productosFiltrados = productos.filter((producto) =>
        `${producto.nombre} ${producto.categoria}`
            .toLowerCase()
            .includes(busqueda.trim().toLowerCase())
    )

    function mostrarMensaje(texto, tipo = 'info') {
        setMensaje(texto)
        setTipoMensaje(tipo)
    }

    function manejarCambio(evento) {
        const { name, type, checked, value } = evento.target

        setFormulario((anterior) => ({
            ...anterior,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    function cancelarEdicion() {
        setIdEditando(null)
        setFormulario({ ...FORMULARIO_VACIO })
        setMensaje('')
    }

    function manejarEnvio(evento) {
        evento.preventDefault()

        const nombre = formulario.nombre.trim()
        const descripcion = formulario.descripcion.trim()
        const precio = Number(formulario.precio)

        if (
            !nombre ||
            !descripcion ||
            !Number.isFinite(precio) ||
            precio <= 0 ||
            !Number.isInteger(precio)
        ) {
            mostrarMensaje(
                'Completa todos los campos y escribe un precio entero mayor que cero.',
                'danger'
            )
            return
        }

        let precioOferta = undefined
        let enOferta = false

        if (formulario.enOferta) {
            const precioOfertaNum = Number(formulario.precioOferta)

            if (
                !formulario.precioOferta ||
                !Number.isFinite(precioOfertaNum) ||
                precioOfertaNum <= 0 ||
                !Number.isInteger(precioOfertaNum) ||
                precioOfertaNum >= precio
            ) {
                mostrarMensaje(
                    'El precio de oferta debe ser un entero positivo y menor al precio normal.',
                    'danger'
                )
                return
            }

            enOferta = true
            precioOferta = precioOfertaNum
        }

        const datos = {
            nombre,
            categoria: formulario.categoria,
            precio,
            descripcion,
            imagen: formulario.imagen?.trim() || '/images/productos/default-pasteleria.jpg',
            enOferta,
            ...(enOferta ? { precioOferta } : { precioOferta: undefined }),
        }

        if (idEditando !== null) {
            const guardado = editarProducto(idEditando, datos)

            if (!guardado) {
                mostrarMensaje('No se pudo actualizar el producto.', 'danger')
                return
            }

            setProductos(listarProductos())
            setIdEditando(null)
            setFormulario({ ...FORMULARIO_VACIO })
            mostrarMensaje('Producto actualizado correctamente.', 'success')
            return
        }

        const nuevoProducto = agregarProducto(datos)

        if (!nuevoProducto) {
            mostrarMensaje('No se pudo guardar el producto.', 'danger')
            return
        }

        setProductos(listarProductos())
        setFormulario({ ...FORMULARIO_VACIO })
        mostrarMensaje('Producto agregado correctamente.', 'success')
    }

    function iniciarEdicion(producto) {
        setIdEditando(producto.id)

        setFormulario({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: String(producto.precio),
            descripcion: producto.descripcion,
            imagen: producto.imagen || '',
            enOferta: producto.enOferta === true,
            precioOferta: producto.precioOferta != null ? String(producto.precioOferta) : '',
        })

        setMensaje('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function manejarEliminacion(producto) {
        const confirmar = window.confirm(
            `¿Seguro que deseas eliminar "${producto.nombre}"?`
        )

        if (!confirmar) return

        const eliminado = eliminarProducto(producto.id)

        if (eliminado) {
            if (idEditando === producto.id) {
                setIdEditando(null)
                setFormulario({ ...FORMULARIO_VACIO })
            }

            setProductos(listarProductos())
            mostrarMensaje('Producto eliminado correctamente.', 'success')
        } else {
            mostrarMensaje('No se pudo eliminar el producto.', 'danger')
        }
    }

    function formatearPrecio(precio) {
        return precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })
    }

    return (
        <main>
            <PageHeader
                subtitle="Panel de control"
                title="Administrar productos"
                description="Gestiona el catálogo de Pastelería Mil Sabores."
            />

            <section className="container py-5">
                <Alert
                    tipo={tipoMensaje}
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                <div className="row g-3 mb-5">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                                <p className="text-secondary mb-2">Productos registrados</p>
                                <p className="display-5 fw-bold mb-0" style={{ color: '#75452f' }}>
                                    {productos.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-8">
                        <div
                            className="card border-0 h-100"
                            style={{ backgroundColor: '#fff4eb' }}
                        >
                            <div className="card-body p-4 d-flex flex-column justify-content-center">
                                <h2 className="h5 fw-bold" style={{ color: '#4b2e25' }}>
                                    Gestión del catálogo
                                </h2>
                                <p className="text-secondary mb-0">
                                    Agrega productos nuevos, actualiza sus datos o elimina los
                                    que ya no estén disponibles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-5">
                    <div className="card-body p-4 p-lg-5">
                        <h2 className="h4 fw-bold mb-4" style={{ color: '#4b2e25' }}>
                            {idEditando !== null ? 'Editar producto' : 'Agregar producto'}
                        </h2>

                        <form onSubmit={manejarEnvio}>
                            <div className="row g-4">
                                <div className="col-12 col-md-6">
                                    <FormField
                                        id="nombreProducto"
                                        name="nombre"
                                        label="Nombre del producto"
                                        value={formulario.nombre}
                                        onChange={manejarCambio}
                                        placeholder="Ej.: Torta de chocolate"
                                        maxLength={100}
                                        required
                                        className="mb-0"
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <FormField
                                        id="categoriaProducto"
                                        name="categoria"
                                        label="Categoría"
                                        as="select"
                                        value={formulario.categoria}
                                        onChange={manejarCambio}
                                        className="mb-0"
                                    >
                                        <option value="Tortas">Tortas</option>
                                        <option value="Pasteles">Pasteles</option>
                                        <option value="Galletas">Galletas</option>
                                        <option value="Cupcakes">Cupcakes</option>
                                        <option value="Panadería">Panadería</option>
                                        <option value="Especiales">Especiales</option>
                                    </FormField>
                                </div>

                                <div className="col-12 col-md-6">
                                    <FormField
                                        id="precioProducto"
                                        name="precio"
                                        label="Precio (CLP)"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={formulario.precio}
                                        onChange={manejarCambio}
                                        placeholder="Ej.: 15000"
                                        required
                                        className="mb-0"
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <FormField
                                        id="imagenProducto"
                                        name="imagen"
                                        label="URL o ruta de la fotografía"
                                        type="text"
                                        value={formulario.imagen}
                                        onChange={manejarCambio}
                                        placeholder="Ej.: /images/productos/torta-chocolate.jpg"
                                        maxLength={500}
                                        className="mb-0"
                                    />
                                </div>

                                <div className="col-12">
                                    <FormField
                                        id="descripcionProducto"
                                        name="descripcion"
                                        label="Descripción"
                                        as="textarea"
                                        rows={3}
                                        maxLength={500}
                                        value={formulario.descripcion}
                                        onChange={manejarCambio}
                                        placeholder="Describe el producto..."
                                        required
                                        className="mb-0"
                                    />
                                </div>

                                <div className="col-12">
                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="enOfertaProducto"
                                            name="enOferta"
                                            checked={formulario.enOferta}
                                            onChange={manejarCambio}
                                        />
                                        <label
                                            className="form-check-label fw-semibold"
                                            htmlFor="enOfertaProducto"
                                        >
                                            Poner en oferta
                                        </label>
                                    </div>

                                    {formulario.enOferta && (
                                        <div className="col-12 col-md-6 mt-2">
                                            <FormField
                                                id="precioOfertaProducto"
                                                name="precioOferta"
                                                label="Precio de oferta (CLP)"
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={formulario.precioOferta}
                                                onChange={manejarCambio}
                                                placeholder="Debe ser menor al precio normal"
                                                className="mb-0"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-2 mt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                >
                                    {idEditando !== null ? 'Guardar cambios' : 'Agregar producto'}
                                </Button>

                                {idEditando !== null && (
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        size="lg"
                                        onClick={cancelarEdicion}
                                    >
                                        Cancelar edición
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                    <div>
                        <h2 className="h3 fw-bold mb-1" style={{ color: '#4b2e25' }}>
                            Productos registrados
                        </h2>
                        <p className="text-secondary mb-0">
                            {productosFiltrados.length} resultados
                        </p>
                    </div>

                    <div style={{ maxWidth: '400px', width: '100%' }}>
                        <SearchBar
                            id="buscarAdmin"
                            label="Buscar producto"
                            placeholder="Nombre o categoría"
                            value={busqueda}
                            onChange={(evento) => setBusqueda(evento.target.value)}
                        />
                    </div>
                </div>

                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead style={{ backgroundColor: '#fff4eb' }}>
                                <tr>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Categoría</th>
                                    <th className="p-3">Precio</th>
                                    <th className="p-3">Oferta</th>
                                    <th className="p-3">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productosFiltrados.map((producto) => (
                                    <tr key={producto.id}>
                                        <td className="p-3 fw-semibold">{producto.nombre}</td>
                                        <td className="p-3">
                                            <Badge>
                                                {producto.categoria}
                                            </Badge>
                                        </td>
                                        <td className="p-3">{formatearPrecio(producto.precio)}</td>
                                        <td className="p-3">
                                            {producto.enOferta && producto.precioOferta ? (
                                                <span
                                                    className="badge"
                                                    style={{ backgroundColor: '#c0392b', color: '#fff' }}
                                                >
                                                    {formatearPrecio(producto.precioOferta)}
                                                </span>
                                            ) : (
                                                <span className="text-secondary small">—</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="d-flex flex-wrap gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => iniciarEdicion(producto)}
                                                >
                                                    Editar
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => manejarEliminacion(producto)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {productosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-secondary p-5">
                                            {productos.length === 0
                                                ? 'Todavía no hay productos registrados.'
                                                : 'No encontramos productos con esa búsqueda.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Admin
