import { useState } from 'react'
import {
    listarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    actualizarStock,
} from '../services/productosService.js'
import { listarPedidos } from '../services/pedidosService.js'
import { obtenerSesion, cerrarSesion } from '../services/usuariosService.js'
import { calcularImpuestos } from '../services/impuestosService.js'
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
    stock: '10',
    descripcion: '',
    imagen: '',
    enOferta: false,
    precioOferta: '',
}

function Admin() {
    const sesion = obtenerSesion() || {
        nombre: 'Administrador',
        email: 'admin@pasteleria.cl',
        rol: 'admin',
    }

    const [seccionActiva, setSeccionActiva] = useState('productos')
    const [productos, setProductos] = useState(() => listarProductos())
    const [pedidos] = useState(() => listarPedidos())
    const [formulario, setFormulario] = useState({ ...FORMULARIO_VACIO })
    const [idEditando, setIdEditando] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('info')
    const [busqueda, setBusqueda] = useState('')

    // Filtros de inventario
    const [busquedaInventario, setBusquedaInventario] = useState('')
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todos')
    const [stocksEdicion, setStocksEdicion] = useState({})

    // Métricas calculadas en tiempo real desde LocalStorage
    const productosStockBajo = productos.filter(
        (p) => typeof p.stock === 'number' && p.stock > 0 && p.stock <= 5
    )
    const productosAgotados = productos.filter(
        (p) => typeof p.stock === 'number' && p.stock <= 0
    )
    const totalVentas = pedidos.reduce((sum, ped) => sum + (Number(ped.total) || 0), 0)
    const desgloseTotalVentas = calcularImpuestos(totalVentas)

    // Cálculo de productos más vendidos
    const conteoVentas = {}
    pedidos.forEach((ped) => {
        if (Array.isArray(ped.items)) {
            ped.items.forEach((it) => {
                conteoVentas[it.nombre] = (conteoVentas[it.nombre] || 0) + (it.cantidad || 1)
            })
        }
    })
    const productosMasVendidos = Object.entries(conteoVentas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

    // Filtro catálogo productos
    const productosFiltrados = productos.filter((producto) =>
        `${producto.nombre} ${producto.categoria}`
            .toLowerCase()
            .includes(busqueda.trim().toLowerCase())
    )

    // Filtro vista inventario
    const productosInventarioFiltrados = productos.filter((p) => {
        const coincideTexto = `${p.nombre} ${p.categoria}`
            .toLowerCase()
            .includes(busquedaInventario.trim().toLowerCase())

        const stock = typeof p.stock === 'number' ? p.stock : 0
        if (!coincideTexto) return false

        if (filtroDisponibilidad === 'disponibles') return stock > 5
        if (filtroDisponibilidad === 'bajo') return stock > 0 && stock <= 5
        if (filtroDisponibilidad === 'agotados') return stock <= 0
        return true
    })

    function mostrarMensaje(texto, tipo = 'info') {
        setMensaje(texto)
        setTipoMensaje(tipo)
    }

    function manejarCerrarSesion() {
        cerrarSesion()
        window.location.href = '/'
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

        const stockNum =
            formulario.stock === '' || formulario.stock === undefined
                ? 10
                : Number(formulario.stock)

        if (!Number.isFinite(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
            mostrarMensaje('El stock debe ser un número entero mayor o igual a cero.', 'danger')
            return
        }

        const datos = {
            nombre,
            categoria: formulario.categoria,
            precio,
            stock: stockNum,
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
            stock: producto.stock !== undefined ? String(producto.stock) : '10',
            descripcion: producto.descripcion,
            imagen: producto.imagen || '',
            enOferta: producto.enOferta === true,
            precioOferta: producto.precioOferta != null ? String(producto.precioOferta) : '',
        })

        setMensaje('')
        if (typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
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

    function manejarModificarStockRapido(id, delta) {
        const prod = productos.find((p) => p.id === id)
        if (!prod) return

        const stockActual = typeof prod.stock === 'number' ? prod.stock : 0
        const nuevoStock = Math.max(0, stockActual + delta)

        if (actualizarStock(id, nuevoStock)) {
            setProductos(listarProductos())
            mostrarMensaje(`Stock de "${prod.nombre}" actualizado a ${nuevoStock} unidades.`, 'success')
        } else {
            mostrarMensaje('No se pudo actualizar el stock.', 'danger')
        }
    }

    function manejarGuardarStockDirecto(id) {
        const valor = stocksEdicion[id]
        if (valor === undefined || valor === '') return

        const nuevoStock = Number(valor)
        if (!Number.isFinite(nuevoStock) || nuevoStock < 0 || !Number.isInteger(nuevoStock)) {
            mostrarMensaje('Ingresa un número entero mayor o igual a cero.', 'danger')
            return
        }

        if (actualizarStock(id, nuevoStock)) {
            setProductos(listarProductos())
            setStocksEdicion((prev) => {
                const copia = { ...prev }
                delete copia[id]
                return copia
            })
            mostrarMensaje('Stock actualizado correctamente.', 'success')
        } else {
            mostrarMensaje('No se pudo actualizar el stock.', 'danger')
        }
    }

    function formatearPrecio(precio) {
        return (precio || 0).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })
    }

    function badgeStock(stock) {
        if (stock <= 0) {
            return <span className="badge bg-danger px-3 py-2">Agotado (0)</span>
        }
        if (stock <= 5) {
            return <span className="badge bg-warning text-dark px-3 py-2">Stock bajo ({stock})</span>
        }
        return <span className="badge bg-success px-3 py-2">Disponible ({stock})</span>
    }

    return (
        <main>
            <PageHeader
                subtitle="Panel de control"
                title="Administrar productos"
                description="Gestiona el catálogo de Pastelería Mil Sabores."
            />

            <section className="container-fluid px-lg-5 py-4">
                <Alert
                    tipo={tipoMensaje}
                    mensaje={mensaje}
                    onCerrar={() => setMensaje('')}
                />

                {/* Barra de perfil y sesión del Administrador */}
                <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#fff4eb' }}>
                    <div className="card-body p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4"
                                style={{ width: '48px', height: '48px', backgroundColor: '#75452f' }}
                            >
                                👤
                            </div>
                            <div>
                                <h1 className="h5 fw-bold mb-0" style={{ color: '#4b2e25' }}>
                                    {sesion.nombre}
                                </h1>
                                <span className="small text-secondary">
                                    {sesion.email} &bull; <strong className="text-uppercase text-dark">{sesion.rol}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <Button
                                type="button"
                                variant="outline-danger"
                                size="sm"
                                onClick={manejarCerrarSesion}
                            >
                                Cerrar sesión administrativa
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tarjetas de Métricas Principales */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-2">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 text-center">
                                <p className="text-secondary small mb-1">Productos registrados</p>
                                <p className="h3 fw-bold mb-0" style={{ color: '#75452f' }}>
                                    {productos.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-2">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 text-center">
                                <p className="text-secondary small mb-1">⚠️ Stock bajo (&le; 5)</p>
                                <p className="h3 fw-bold mb-0 text-warning">
                                    {productosStockBajo.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-2">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 text-center">
                                <p className="text-secondary small mb-1">🛑 Sin stock (Agotados)</p>
                                <p className="h3 fw-bold mb-0 text-danger">
                                    {productosAgotados.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-2">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 text-center">
                                <p className="text-secondary small mb-1">📦 Pedidos confirmados</p>
                                <p className="h3 fw-bold mb-0 text-primary">
                                    {pedidos.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-2">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 text-center">
                                <p className="text-secondary small mb-1">💰 Total ventas (CLP)</p>
                                <p className="h5 fw-bold mb-0 text-success">
                                    {formatearPrecio(totalVentas)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-2">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 text-center">
                                <p className="text-secondary small mb-1">🏛️ IVA 19% acumulado</p>
                                <p className="h5 fw-bold mb-0 text-secondary">
                                    {formatearPrecio(desgloseTotalVentas.iva)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menú lateral / navegación por pestañas */}
                <div className="row g-4">
                    <div className="col-12 col-lg-3 col-xl-2">
                        <div className="card border-0 shadow-sm sticky-top" style={{ top: '1rem' }}>
                            <div className="card-body p-3">
                                <p className="text-uppercase small fw-bold text-secondary mb-3 px-2">
                                    Menú administrativo
                                </p>
                                <nav className="nav nav-pills flex-column gap-2">
                                    <button
                                        type="button"
                                        className={`nav-link text-start py-2 px-3 border-0 ${seccionActiva === 'productos' ? 'active' : 'bg-transparent text-dark'}`}
                                        style={seccionActiva === 'productos' ? { backgroundColor: '#75452f' } : {}}
                                        onClick={() => { setSeccionActiva('productos'); setMensaje('') }}
                                    >
                                        🍰 Productos y Catálogo
                                    </button>

                                    <button
                                        type="button"
                                        className={`nav-link text-start py-2 px-3 border-0 ${seccionActiva === 'inventario' ? 'active' : 'bg-transparent text-dark'}`}
                                        style={seccionActiva === 'inventario' ? { backgroundColor: '#75452f' } : {}}
                                        onClick={() => { setSeccionActiva('inventario'); setMensaje('') }}
                                    >
                                        📊 Control de Inventario
                                    </button>

                                    <button
                                        type="button"
                                        className={`nav-link text-start py-2 px-3 border-0 ${seccionActiva === 'pedidos' ? 'active' : 'bg-transparent text-dark'}`}
                                        style={seccionActiva === 'pedidos' ? { backgroundColor: '#75452f' } : {}}
                                        onClick={() => { setSeccionActiva('pedidos'); setMensaje('') }}
                                    >
                                        🧾 Registro de Pedidos
                                    </button>

                                    <button
                                        type="button"
                                        className={`nav-link text-start py-2 px-3 border-0 ${seccionActiva === 'impuestos' ? 'active' : 'bg-transparent text-dark'}`}
                                        style={seccionActiva === 'impuestos' ? { backgroundColor: '#75452f' } : {}}
                                        onClick={() => { setSeccionActiva('impuestos'); setMensaje('') }}
                                    >
                                        📈 Ventas e IVA (19%)
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-9 col-xl-10">
                        {/* SECCIÓN 1: PRODUCTOS Y CATÁLOGO */}
                        {seccionActiva === 'productos' && (
                            <>
                                <div className="card border-0 shadow-sm mb-4">
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
                                                        id="stockProducto"
                                                        name="stock"
                                                        label="Stock disponible"
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={formulario.stock}
                                                        onChange={manejarCambio}
                                                        placeholder="Ej.: 10"
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

                                <div className="card border-0 shadow-sm overflow-hidden mb-5">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead style={{ backgroundColor: '#fff4eb' }}>
                                                <tr>
                                                    <th className="p-3">Nombre</th>
                                                    <th className="p-3">Categoría</th>
                                                    <th className="p-3">Precio</th>
                                                    <th className="p-3">Stock</th>
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
                                                            {badgeStock(producto.stock)}
                                                        </td>
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
                                                        <td colSpan="6" className="text-center text-secondary p-5">
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
                            </>
                        )}

                        {/* SECCIÓN 2: CONTROL DE INVENTARIO Y STOCK */}
                        {seccionActiva === 'inventario' && (
                            <div className="card border-0 shadow-sm p-4 p-lg-5 mb-5">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                                    <div>
                                        <h2 className="h4 fw-bold mb-1" style={{ color: '#4b2e25' }}>
                                            Control de inventario y stock en tiempo real
                                        </h2>
                                        <p className="text-secondary small mb-0">
                                            Ajusta unidades disponibles, identifica productos agotados y actualiza stock.
                                        </p>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${filtroDisponibilidad === 'todos' ? 'btn-dark' : 'btn-outline-dark'}`}
                                            onClick={() => setFiltroDisponibilidad('todos')}
                                        >
                                            Todos ({productos.length})
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${filtroDisponibilidad === 'disponibles' ? 'btn-success text-white' : 'btn-outline-success'}`}
                                            onClick={() => setFiltroDisponibilidad('disponibles')}
                                        >
                                            Disponibles ({productos.filter((p) => p.stock > 5).length})
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${filtroDisponibilidad === 'bajo' ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
                                            onClick={() => setFiltroDisponibilidad('bajo')}
                                        >
                                            Stock bajo ({productosStockBajo.length})
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${filtroDisponibilidad === 'agotados' ? 'btn-danger text-white' : 'btn-outline-danger'}`}
                                            onClick={() => setFiltroDisponibilidad('agotados')}
                                        >
                                            Agotados ({productosAgotados.length})
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4" style={{ maxWidth: '400px' }}>
                                    <SearchBar
                                        id="buscarInventario"
                                        label="Filtrar por nombre o categoría"
                                        placeholder="Ej.: torta, cheesecake..."
                                        value={busquedaInventario}
                                        onChange={(e) => setBusquedaInventario(e.target.value)}
                                    />
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Producto</th>
                                                <th>Categoría</th>
                                                <th>Estado</th>
                                                <th>Stock actual</th>
                                                <th>Ajuste rápido</th>
                                                <th>Modificar valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosInventarioFiltrados.map((prod) => {
                                                const stock = typeof prod.stock === 'number' ? prod.stock : 0
                                                const valorEdicion = stocksEdicion[prod.id] !== undefined ? stocksEdicion[prod.id] : ''

                                                return (
                                                    <tr key={prod.id}>
                                                        <td className="fw-semibold">{prod.nombre}</td>
                                                        <td><Badge>{prod.categoria}</Badge></td>
                                                        <td>{badgeStock(stock)}</td>
                                                        <td className="fw-bold fs-5 text-center">{stock}</td>
                                                        <td>
                                                            <div className="btn-group btn-group-sm">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary"
                                                                    title="Restar 1"
                                                                    disabled={stock <= 0}
                                                                    onClick={() => manejarModificarStockRapido(prod.id, -1)}
                                                                >
                                                                    -1
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary"
                                                                    title="Sumar 1"
                                                                    onClick={() => manejarModificarStockRapido(prod.id, 1)}
                                                                >
                                                                    +1
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary"
                                                                    title="Sumar 5"
                                                                    onClick={() => manejarModificarStockRapido(prod.id, 5)}
                                                                >
                                                                    +5
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="input-group input-group-sm" style={{ maxWidth: '160px' }}>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    className="form-control"
                                                                    placeholder={String(stock)}
                                                                    value={valorEdicion}
                                                                    onChange={(e) => setStocksEdicion({ ...stocksEdicion, [prod.id]: e.target.value })}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => manejarGuardarStockDirecto(prod.id)}
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                            {productosInventarioFiltrados.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center text-muted p-4">
                                                        No se encontraron productos para el filtro seleccionado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 3: REGISTRO DE PEDIDOS */}
                        {seccionActiva === 'pedidos' && (
                            <div className="card border-0 shadow-sm p-4 p-lg-5 mb-5">
                                <h2 className="h4 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                    Historial de pedidos realizados
                                </h2>
                                <p className="text-secondary small mb-4">
                                    Pedidos registrados y almacenados en el sistema local.
                                </p>

                                {pedidos.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <p className="fs-1 mb-2">📦</p>
                                        <p className="h5">Aún no se han registrado compras.</p>
                                        <p className="small">Cuando los clientes confirmen órdenes, se mostrarán aquí con su detalle e impuestos.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID Pedido</th>
                                                    <th>Fecha</th>
                                                    <th>Cliente</th>
                                                    <th>Ítems</th>
                                                    <th>Neto</th>
                                                    <th>IVA (19%)</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedidos.map((ped) => {
                                                    const imp = calcularImpuestos(ped.total)
                                                    const neto = ped.neto ?? imp.neto
                                                    const iva = ped.iva ?? imp.iva

                                                    return (
                                                        <tr key={ped.id}>
                                                            <td className="fw-bold">{ped.id}</td>
                                                            <td className="small text-secondary">
                                                                {new Date(ped.fecha).toLocaleDateString('es-CL')}
                                                            </td>
                                                            <td>
                                                                <div className="fw-semibold">{ped.cliente?.nombre}</div>
                                                                <div className="small text-muted">{ped.cliente?.email}</div>
                                                            </td>
                                                            <td>{ped.cantidadTotal || ped.items?.length || 0} un.</td>
                                                            <td>{formatearPrecio(neto)}</td>
                                                            <td>{formatearPrecio(iva)}</td>
                                                            <td className="fw-bold" style={{ color: '#75452f' }}>
                                                                {formatearPrecio(ped.total)}
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-success">
                                                                    {ped.estado?.toUpperCase() || 'CONFIRMADO'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SECCIÓN 4: REPORTE DE VENTAS E IVA (19%) */}
                        {seccionActiva === 'impuestos' && (
                            <div className="card border-0 shadow-sm p-4 p-lg-5 mb-5">
                                <h2 className="h4 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                    Reporte consolidado de ventas e impuestos (IVA 19%)
                                </h2>
                                <p className="text-secondary small mb-4">
                                    Desglose tributario basado en la tasa oficial del 19% chileno bajo la regla de IVA incluido.
                                </p>

                                <div className="row g-4 mb-5">
                                    <div className="col-12 col-md-4">
                                        <div className="card bg-light border p-4 text-center">
                                            <p className="text-secondary small mb-1">Monto Neto Acumulado</p>
                                            <p className="display-6 fw-bold mb-0 text-dark">
                                                {formatearPrecio(desgloseTotalVentas.neto)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="card bg-light border p-4 text-center">
                                            <p className="text-secondary small mb-1">IVA 19% Acumulado</p>
                                            <p className="display-6 fw-bold mb-0 text-secondary">
                                                {formatearPrecio(desgloseTotalVentas.iva)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="card border-0 p-4 text-center" style={{ backgroundColor: '#fff4eb' }}>
                                            <p className="text-secondary small mb-1">Total Ventas Facturado</p>
                                            <p className="display-6 fw-bold mb-0" style={{ color: '#75452f' }}>
                                                {formatearPrecio(totalVentas)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="h5 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                                    Productos más vendidos
                                </h3>
                                {productosMasVendidos.length === 0 ? (
                                    <p className="text-muted small">No hay suficientes ventas registradas para calcular tendencias.</p>
                                ) : (
                                    <ul className="list-group list-group-flush mb-4">
                                        {productosMasVendidos.map(([nombreProd, cantVendida]) => (
                                            <li key={nombreProd} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                <span>{nombreProd}</span>
                                                <span className="badge bg-primary rounded-pill px-3 py-2">
                                                    {cantVendida} unidades vendidas
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="alert alert-info py-2 px-3 small mb-0">
                                    <strong>Fórmula aplicada:</strong> Precio Neto = Total / 1,19 &bull; IVA = Total - Precio Neto &bull; Redondeo exacto a pesos chilenos (CLP).
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Admin
