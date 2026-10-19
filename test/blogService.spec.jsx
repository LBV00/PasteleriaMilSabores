import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    listarPublicaciones,
    obtenerPublicacionPorId,
    listarCategoriasBlog,
} from '../src/services/blogService.js'

describe('Servicio de blog', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('listarPublicaciones devuelve todas las publicaciones', () => {
        const publicaciones = listarPublicaciones()
        expect(Array.isArray(publicaciones)).toBe(true)
        expect(publicaciones.length).toBeGreaterThan(0)
    })

    it('cada publicación tiene los campos obligatorios', () => {
        const publicaciones = listarPublicaciones()
        publicaciones.forEach((p) => {
            expect(p.id).toBeDefined()
            expect(p.titulo).toBeTruthy()
            expect(p.resumen).toBeTruthy()
            expect(p.contenido).toBeTruthy()
            expect(p.imagen).toBeTruthy()
            expect(p.categoria).toBeTruthy()
            expect(p.fechaPublicacion).toBeTruthy()
        })
    })

    it('obtenerPublicacionPorId devuelve la publicación correcta', () => {
        const post = obtenerPublicacionPorId(1)
        expect(post).not.toBeNull()
        expect(post.id).toBe(1)
        expect(post.titulo).toBeTruthy()
    })

    it('obtenerPublicacionPorId devuelve null para un id inexistente', () => {
        expect(obtenerPublicacionPorId(9999)).toBeNull()
    })

    it('obtenerPublicacionPorId devuelve null para un id no numérico', () => {
        expect(obtenerPublicacionPorId('abc')).toBeNull()
        expect(obtenerPublicacionPorId(undefined)).toBeNull()
    })

    it('listarCategoriasBlog devuelve categorías únicas', () => {
        const categorias = listarCategoriasBlog()
        expect(Array.isArray(categorias)).toBe(true)

        const unicaSet = new Set(categorias)
        expect(unicaSet.size).toBe(categorias.length)
    })
})
