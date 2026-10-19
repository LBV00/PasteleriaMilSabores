import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    registrarUsuario,
    iniciarSesion,
    obtenerSesion,
    cerrarSesion,
} from '../src/services/usuariosService.js'

describe('Servicio de usuarios', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('debe registrar un nuevo usuario correctamente', () => {
        const respuesta = registrarUsuario({
            nombre: 'Juan Perez',
            email: 'JUAN@example.com',
            password: 'secretPassword',
        })

        expect(respuesta.ok).toBe(true)
        expect(respuesta.mensaje).toBe('Cuenta creada correctamente.')

        const usuariosGuardados = JSON.parse(
            localStorage.getItem('milSabores_usuarios')
        )
        expect(usuariosGuardados.length).toBe(1)
        expect(usuariosGuardados[0].email).toBe('juan@example.com')
        expect(usuariosGuardados[0].rol).toBe('cliente')
    })

    it('no debe permitir registrar dos veces el mismo correo electrónico', () => {
        registrarUsuario({
            nombre: 'Usuario 1',
            email: 'duplicado@example.com',
            password: '123',
        })

        const respuestaDuplicado = registrarUsuario({
            nombre: 'Usuario 2',
            email: ' DUPLICADO@example.com ',
            password: '456',
        })

        expect(respuestaDuplicado.ok).toBe(false)
        expect(respuestaDuplicado.mensaje).toBe(
            'Ya existe una cuenta con ese correo electrónico.'
        )
    })

    it('debe iniciar sesión con credenciales válidas', () => {
        registrarUsuario({
            nombre: 'Maria Gomez',
            email: 'maria@example.com',
            password: 'password123',
        })

        const respuesta = iniciarSesion('MARIA@example.com', 'password123')

        expect(respuesta.ok).toBe(true)
        expect(respuesta.usuario.nombre).toBe('Maria Gomez')
        expect(respuesta.usuario.email).toBe('maria@example.com')
        expect(obtenerSesion()).toEqual(respuesta.usuario)
    })

    it('debe fallar al iniciar sesión con contraseña incorrecta', () => {
        registrarUsuario({
            nombre: 'Maria Gomez',
            email: 'maria@example.com',
            password: 'password123',
        })

        const respuesta = iniciarSesion('maria@example.com', 'passwordErronea')

        expect(respuesta.ok).toBe(false)
        expect(respuesta.mensaje).toBe(
            'Correo electrónico o contraseña incorrectos.'
        )
        expect(obtenerSesion()).toBeNull()
    })

    it('debe fallar al iniciar sesión con un correo no registrado', () => {
        const respuesta = iniciarSesion('noexiste@example.com', '123')

        expect(respuesta.ok).toBe(false)
        expect(respuesta.mensaje).toBe(
            'Correo electrónico o contraseña incorrectos.'
        )
    })

    it('debe cerrar la sesión activa correctamente', () => {
        localStorage.setItem(
            'milSabores_sesion',
            JSON.stringify({ id: 1, nombre: 'Test', email: 'test@example.com' })
        )
        expect(obtenerSesion()).not.toBeNull()

        const resultado = cerrarSesion()
        expect(resultado).toBe(true)
        expect(obtenerSesion()).toBeNull()
    })

    it('debe devolver null si la sesión almacenada es JSON inválido', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        localStorage.setItem('milSabores_sesion', '{invalido')

        expect(obtenerSesion()).toBeNull()
    })

    it('debe manejar errores si falla el guardado al registrar un usuario', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Storage full')
        })

        const respuesta = registrarUsuario({
            nombre: 'Error User',
            email: 'err@example.com',
            password: '123',
        })

        expect(respuesta.ok).toBe(false)
        expect(respuesta.mensaje).toBe('No se pudo guardar el usuario.')
    })
})
