import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    iniciarSesion,
    obtenerSesion,
} from '../services/usuariosService.js'
import AuthLayout from '../components/templates/AuthLayout.jsx'
import Alert from '../components/atoms/Alert.jsx'
import Button from '../components/atoms/Button.jsx'
import FormField from '../components/molecules/FormField.jsx'

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('danger')

    function manejarEnvio(evento) {
        evento.preventDefault()
        setMensaje('')

        const resultado = iniciarSesion(email, password)

        if (!resultado.ok) {
            setMensaje(resultado.mensaje)
            setTipoMensaje('danger')
            return
        }

        setMensaje(resultado.mensaje)
        setTipoMensaje('success')

        const usuario = obtenerSesion()

        setTimeout(() => {
            if (usuario?.rol === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        }, 800)
    }

    const sideContent = (
        <Link to="/productos" className="btn btn-outline-dark mt-2">
            Explorar productos
        </Link>
    )

    return (
        <AuthLayout
            subtitle="Nos alegra verte"
            title="Bienvenido de nuevo"
            lead="Ingresa a tu cuenta y continúa descubriendo los sabores de Pastelería Mil Sabores."
            sideContent={sideContent}
            cardTitle="Iniciar sesión"
            cardSubtitle="Introduce tus credenciales para continuar."
        >
            <Alert
                tipo={tipoMensaje}
                mensaje={mensaje}
                role="alert"
                aria-live="polite"
            />

            <form onSubmit={manejarEnvio}>
                <FormField
                    id="emailLogin"
                    label="Correo electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    size="lg"
                    required
                />

                <FormField
                    id="passwordLogin"
                    label="Contraseña"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                    size="lg"
                    className="mb-4"
                    required
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-100"
                >
                    Ingresar
                </Button>
            </form>

            <p className="text-center mt-4 mb-0">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" style={{ color: '#75452f' }}>
                    Regístrate aquí
                </Link>
            </p>
        </AuthLayout>
    )
}

export default Login
