import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listarCarrito } from '../services/carritoService.js'
import { crearPedido, validarDatosEntrega } from '../services/pedidosService.js'
import { obtenerSesion } from '../services/usuariosService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Button from '../components/atoms/Button.jsx'
import FormField from '../components/molecules/FormField.jsx'

function Checkout() {
    const navigate = useNavigate()
    const sesion = obtenerSesion()
    const [productos] = useState(() => listarCarrito())

    const [formulario, setFormulario] = useState({
        nombre: sesion?.nombre || '',
        email: sesion?.email || '',
        telefono: '',
        direccion: '',
        comuna: '',
        region: 'Región Metropolitana',
        indicaciones: '',
    })

    const [errores, setErrores] = useState({})
    const [mensajeError, setMensajeError] = useState('')
    const [enviando, setEnviando] = useState(false)

    const total = productos.reduce(
        (suma, producto) => suma + (Number(producto.precio) || 0) * (Number(producto.cantidad) || 1),
        0
    )

    function formatearPrecio(precio) {
        return precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        })
    }

    function manejarCambio(evento) {
        const { name, value } = evento.target
        setFormulario((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errores[name]) {
            setErrores((prev) => {
                const copia = { ...prev }
                delete copia[name]
                return copia
            })
        }
    }

    async function manejarEnvio(evento) {
        evento.preventDefault()

        if (enviando) return

        if (productos.length === 0) {
            setMensajeError('Tu carrito está vacío. Agrega productos antes de continuar.')
            return
        }

        const validacion = validarDatosEntrega(formulario)
        if (!validacion.esValido) {
            setErrores(validacion.errores)
            setMensajeError('Por favor corrige los campos destacados en el formulario.')
            return
        }

        setEnviando(true)
        setMensajeError('')

        try {
            const resultado = await crearPedido(formulario, productos)

            if (resultado && resultado.ok && resultado.pedido) {
                navigate('/compra-exitosa', {
                    state: { pedidoId: resultado.pedido.id },
                    replace: true,
                })
            } else {
                setEnviando(false)
                navigate('/compra-fallida', {
                    state: { error: resultado?.error || 'Ocurrió un error al procesar tu pedido.' },
                    replace: true,
                })
            }
        } catch {
            setEnviando(false)
            navigate('/compra-fallida', {
                state: { error: 'Ocurrió un error al procesar tu pedido.' },
                replace: true,
            })
        }
    }

    return (
        <main>
            <PageHeader
                subtitle="Finalizar pedido"
                title="Datos de entrega"
                description="Completa tus datos para coordinar el despacho de tus delicias."
            />

            <section className="container py-5">
                {productos.length === 0 ? (
                    <div className="text-center py-5">
                        <Alert tipo="warning" role="alert">
                            Tu carrito está vacío. No puedes proceder al checkout sin productos.
                        </Alert>
                        <h2 className="h3 fw-bold mb-3">No hay productos en tu carrito</h2>
                        <Link
                            to="/productos"
                            className="btn btn-lg text-white px-4"
                            style={{ backgroundColor: '#75452f' }}
                        >
                            Ver productos
                        </Link>
                    </div>
                ) : (
                    <div className="row g-5">
                        <div className="col-12 col-lg-7">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h4 fw-bold mb-4" style={{ color: '#4b2e25' }}>
                                        Información de despacho
                                    </h2>

                                    {mensajeError && (
                                        <Alert tipo="danger" role="alert" className="mb-4">
                                            {mensajeError}
                                        </Alert>
                                    )}

                                    <form onSubmit={manejarEnvio} noValidate>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <FormField
                                                    id="nombreEntrega"
                                                    name="nombre"
                                                    label="Nombre completo"
                                                    placeholder="Ej.: Constanza Valenzuela"
                                                    value={formulario.nombre}
                                                    onChange={manejarCambio}
                                                    error={errores.nombre}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <FormField
                                                    id="emailEntrega"
                                                    name="email"
                                                    type="email"
                                                    label="Correo electrónico"
                                                    placeholder="nombre@ejemplo.com"
                                                    value={formulario.email}
                                                    onChange={manejarCambio}
                                                    error={errores.email}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <FormField
                                                    id="telefonoEntrega"
                                                    name="telefono"
                                                    type="tel"
                                                    label="Teléfono de contacto"
                                                    placeholder="Ej.: +56912345678"
                                                    value={formulario.telefono}
                                                    onChange={manejarCambio}
                                                    error={errores.telefono}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <FormField
                                                    id="direccionEntrega"
                                                    name="direccion"
                                                    label="Dirección (calle, número y depto.)"
                                                    placeholder="Ej.: Av. Providencia 1234, Depto 502"
                                                    value={formulario.direccion}
                                                    onChange={manejarCambio}
                                                    error={errores.direccion}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <FormField
                                                    id="comunaEntrega"
                                                    name="comuna"
                                                    label="Comuna"
                                                    placeholder="Ej.: Providencia"
                                                    value={formulario.comuna}
                                                    onChange={manejarCambio}
                                                    error={errores.comuna}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <FormField
                                                    id="regionEntrega"
                                                    name="region"
                                                    label="Región"
                                                    placeholder="Ej.: Región Metropolitana"
                                                    value={formulario.region}
                                                    onChange={manejarCambio}
                                                    error={errores.region}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <FormField
                                                    id="indicacionesEntrega"
                                                    name="indicaciones"
                                                    label="Indicaciones adicionales (opcional)"
                                                    as="textarea"
                                                    rows={2}
                                                    placeholder="Ej.: Tocar timbre 502 o dejar en conserjería"
                                                    value={formulario.indicaciones}
                                                    onChange={manejarCambio}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-100"
                                                disabled={enviando}
                                            >
                                                {enviando ? 'Procesando pedido...' : 'Confirmar y realizar pedido'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <aside className="card border-0 shadow-sm sticky-lg-top" style={{ top: '2rem' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="h4 fw-bold mb-0">Resumen del pedido</h2>
                                        <Link to="/carrito" className="btn btn-outline-dark btn-sm">
                                            Volver al carrito
                                        </Link>
                                    </div>

                                    <ul className="list-group list-group-flush mb-4">
                                        {productos.map((item) => (
                                            <li
                                                key={item.id}
                                                className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent"
                                            >
                                                <div>
                                                    <p className="fw-semibold mb-0">{item.nombre}</p>
                                                    <span className="small text-secondary">
                                                        {item.cantidad} x {formatearPrecio(item.precio)}
                                                    </span>
                                                </div>
                                                <span className="fw-bold" style={{ color: '#75452f' }}>
                                                    {formatearPrecio(item.precio * item.cantidad)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-secondary">Subtotal</span>
                                        <span>{formatearPrecio(total)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="fs-5 fw-bold">Total a pagar</span>
                                        <span className="fs-4 fw-bold" style={{ color: '#75452f' }}>
                                            {formatearPrecio(total)}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#fff4eb' }}>
                                        <p className="small text-secondary mb-0">
                                            ℹ️ El pago se coordinará contra entrega o transferencia bancaria según las indicaciones que te enviaremos por correo.
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Checkout
