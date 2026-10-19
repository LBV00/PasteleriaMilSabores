import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../services/usuariosService.js'
import AuthLayout from '../components/templates/AuthLayout.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Button from '../components/atoms/Button.jsx'
import FormField from '../components/molecules/FormField.jsx'

function Registro() {
    const navigate = useNavigate()

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmarPassword, setConfirmarPassword] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('danger')

    function manejarEnvio(evento) {
        evento.preventDefault()
        setMensaje('')

        if (!nombre.trim() || !email.trim() || !password) {
            setMensaje('Completa todos los campos.')
            setTipoMensaje('danger')
            return
        }

        if (password.length < 6) {
            setMensaje('La contraseña debe tener al menos 6 caracteres.')
            setTipoMensaje('danger')
            return
        }

        if (password !== confirmarPassword) {
            setMensaje('Las contraseñas no coinciden.')
            setTipoMensaje('danger')
            return
        }

        const resultado = registrarUsuario({
            nombre,
            email,
            password,
        })

        setMensaje(resultado.mensaje)
        setTipoMensaje(resultado.ok ? 'success' : 'danger')

        if (resultado.ok) {
            setNombre('')
            setEmail('')
            setPassword('')
            setConfirmarPassword('')

            setTimeout(() => {
                navigate('/login')
            }, 1200)
        }
    }

    const sideContent = (
        <ul className="list-unstyled mt-4" style={{ color: '#6f554a' }}>
            <li className="mb-3">✓ Explora nuestro catálogo de productos.</li>
            <li className="mb-3">✓ Agrega tus favoritos al carrito.</li>
            <li>✓ Encuentra algo dulce para cada ocasión.</li>
        </ul>
    )

    return (
        <AuthLayout
            subtitle="Únete a nosotros"
            title="Crea tu cuenta"
            lead="Regístrate en Pastelería Mil Sabores y descubre dulces para acompañar tus momentos especiales."
            sideContent={sideContent}
            cardTitle="Registrarme"
            cardSubtitle="Completa tus datos para crear una cuenta."
        >
            <Alert
                tipo={tipoMensaje}
                mensaje={mensaje}
                role="alert"
                aria-live="polite"
            />

            <form onSubmit={manejarEnvio}>
                <FormField
                    id="nombre"
                    label="Nombre completo"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    maxLength={100}
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    size="lg"
                    required
                />

                <FormField
                    id="emailRegistro"
                    label="Correo electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    maxLength={150}
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    size="lg"
                    required
                />

                <FormField
                    id="passwordRegistro"
                    label="Contraseña"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    minLength={6}
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                    size="lg"
                    helpText="Debe contener al menos 6 caracteres."
                    required
                />

                <FormField
                    id="confirmarPassword"
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    value={confirmarPassword}
                    onChange={(evento) => setConfirmarPassword(evento.target.value)}
                    size="lg"
                    className="mb-4"
                    required
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-100"
                >
                    Crear mi cuenta
                </Button>
            </form>

            <p className="text-center mt-4 mb-0">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" style={{ color: '#75452f' }}>
                    Inicia sesión
                </Link>
            </p>
        </AuthLayout>
    )
}

export default Registro
