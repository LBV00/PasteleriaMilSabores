const CLAVE_USUARIOS = 'milSabores_usuarios'
const CLAVE_SESION = 'milSabores_sesion'

function obtenerUsuarios() {
    try {
        const datos = localStorage.getItem(CLAVE_USUARIOS)

        if (datos === null) {
            return []
        }

        const usuarios = JSON.parse(datos)
        return Array.isArray(usuarios) ? usuarios : []
    } catch (error) {
        console.error('No se pudieron leer los usuarios:', error)
        return []
    }
}

function guardarUsuarios(usuarios) {
    try {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
        return true
    } catch (error) {
        console.error('No se pudieron guardar los usuarios:', error)
        return false
    }
}

export function registrarUsuario({ nombre, email, password }) {
    const usuarios = obtenerUsuarios()
    const correo = email.trim().toLowerCase()

    const existe = usuarios.some((usuario) => usuario.email === correo)

    if (existe) {
        return {
            ok: false,
            mensaje: 'Ya existe una cuenta con ese correo electrónico.',
        }
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre.trim(),
        email: correo,
        password,
        rol: 'cliente',
    }

    const guardado = guardarUsuarios([...usuarios, nuevoUsuario])

    if (!guardado) {
        return {
            ok: false,
            mensaje: 'No se pudo guardar el usuario.',
        }
    }

    return {
        ok: true,
        mensaje: 'Cuenta creada correctamente.',
    }
}

export function iniciarSesion(email, password) {
    const correo = email.trim().toLowerCase()
    const usuarios = obtenerUsuarios()

    const usuario = usuarios.find(
        (item) => item.email === correo && item.password === password
    )

    if (!usuario) {
        return {
            ok: false,
            mensaje: 'Correo electrónico o contraseña incorrectos.',
        }
    }

    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
    }

    try {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))

        return {
            ok: true,
            mensaje: 'Inicio de sesión correcto.',
            usuario: sesion,
        }
    } catch (error) {
        console.error('No se pudo guardar la sesión:', error)

        return {
            ok: false,
            mensaje: 'No se pudo iniciar la sesión.',
        }
    }
}

export function obtenerSesion() {
    try {
        const datos = localStorage.getItem(CLAVE_SESION)
        return datos ? JSON.parse(datos) : null
    } catch (error) {
        console.error('No se pudo leer la sesión:', error)
        return null
    }
}

export function cerrarSesion() {
    try {
        localStorage.removeItem(CLAVE_SESION)
        return true
    } catch (error) {
        console.error('No se pudo cerrar la sesión:', error)
        return false
    }
}
