import { Navigate } from 'react-router-dom'
import { obtenerSesion } from '../../services/usuariosService.js'

function RutaProtegida({ children, soloAdmin = false }) {
    const usuario = obtenerSesion()

    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    if (soloAdmin && usuario.rol !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export default RutaProtegida
