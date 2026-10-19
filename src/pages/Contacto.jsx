import { useState } from 'react'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Button from '../components/atoms/Button.jsx'
import FormField from '../components/molecules/FormField.jsx'

const FORMULARIO_VACIO = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Contacto() {
    const [formulario, setFormulario] = useState({ ...FORMULARIO_VACIO })
    const [errores, setErrores] = useState({})
    const [enviado, setEnviado] = useState(false)

    function manejarCambio(evento) {
        const { name, value } = evento.target

        setFormulario((prev) => ({ ...prev, [name]: value }))

        if (errores[name]) {
            setErrores((prev) => {
                const copia = { ...prev }
                delete copia[name]
                return copia
            })
        }
    }

    function validar() {
        const nuevosErrores = {}

        if (!formulario.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio.'
        }

        if (!formulario.email.trim()) {
            nuevosErrores.email = 'El correo electrónico es obligatorio.'
        } else if (!REGEX_EMAIL.test(formulario.email.trim())) {
            nuevosErrores.email = 'Ingresa un correo electrónico válido.'
        }

        if (!formulario.asunto.trim()) {
            nuevosErrores.asunto = 'El asunto es obligatorio.'
        }

        if (!formulario.mensaje.trim()) {
            nuevosErrores.mensaje = 'El mensaje no puede estar vacío.'
        } else if (formulario.mensaje.trim().length < 10) {
            nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
        }

        return nuevosErrores
    }

    function manejarEnvio(evento) {
        evento.preventDefault()

        const nuevosErrores = validar()

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores)
            return
        }

        setEnviado(true)
        setFormulario({ ...FORMULARIO_VACIO })
        setErrores({})
    }

    if (enviado) {
        return (
            <main>
                <PageHeader
                    subtitle="Gracias por escribirnos"
                    title="Mensaje recibido"
                    description="Hemos recibido tu consulta. Nos pondremos en contacto a la brevedad."
                />

                <section className="container py-5 text-center">
                    <div
                        className="mb-4"
                        style={{ fontSize: '4rem' }}
                        role="img"
                        aria-label="Sobre enviado"
                    >
                        ✉️
                    </div>

                    <div
                        className="card border-0 shadow-sm mx-auto p-5"
                        style={{ maxWidth: '560px', backgroundColor: '#fff4eb' }}
                    >
                        <h2 className="h4 fw-bold mb-3" style={{ color: '#4b2e25' }}>
                            Tu mensaje fue registrado correctamente
                        </h2>
                        <p className="text-secondary mb-4">
                            Revisamos los mensajes periódicamente. Si tienes una consulta
                            urgente, puedes volver a escribirnos en cualquier momento.
                        </p>
                        <Button
                            type="button"
                            onClick={() => setEnviado(false)}
                            size="lg"
                        >
                            Enviar otro mensaje
                        </Button>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main>
            <PageHeader
                subtitle="Escríbenos"
                title="Contacto"
                description="¿Tienes alguna consulta, sugerencia o pedido especial? Cuéntanos."
            />

            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">
                                <h2
                                    className="h4 fw-bold mb-4"
                                    style={{ color: '#4b2e25' }}
                                >
                                    Formulario de contacto
                                </h2>

                                <Alert
                                    tipo="danger"
                                    mensaje={
                                        Object.keys(errores).length > 0
                                            ? 'Por favor corrige los campos indicados.'
                                            : ''
                                    }
                                    onCerrar={() => setErrores({})}
                                />

                                <form onSubmit={manejarEnvio} noValidate>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <FormField
                                                id="contactoNombre"
                                                name="nombre"
                                                label="Nombre completo"
                                                placeholder="Ej.: María González"
                                                value={formulario.nombre}
                                                onChange={manejarCambio}
                                                error={errores.nombre}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <FormField
                                                id="contactoEmail"
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

                                        <div className="col-12">
                                            <FormField
                                                id="contactoAsunto"
                                                name="asunto"
                                                label="Asunto"
                                                placeholder="Ej.: Consulta sobre pedidos especiales"
                                                value={formulario.asunto}
                                                onChange={manejarCambio}
                                                error={errores.asunto}
                                                required
                                            />
                                        </div>

                                        <div className="col-12">
                                            <FormField
                                                id="contactoMensaje"
                                                name="mensaje"
                                                label="Mensaje"
                                                as="textarea"
                                                rows={5}
                                                placeholder="Escribe tu consulta aquí..."
                                                value={formulario.mensaje}
                                                onChange={manejarCambio}
                                                error={errores.mensaje}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Button type="submit" size="lg" className="w-100">
                                            Enviar mensaje
                                        </Button>
                                    </div>

                                    <p className="small text-secondary mt-3 mb-0 text-center">
                                        Ningún dato de este formulario se transmite a servidores externos.
                                        Revisamos las consultas periódicamente.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Contacto
