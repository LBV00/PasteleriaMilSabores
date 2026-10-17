import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    listarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerProductoPorId,
    listarOfertas,
    getPrecioEfectivo,
    PRODUCTOS_INICIALES,
} from '../src/services/productosService.js'

describe('Servicio de productos', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('debe devolver los productos iniciales', () => {
        const productos = listarProductos()

        expect(productos.length).toBe(PRODUCTOS_INICIALES.length)
        expect(productos.length).toBeGreaterThanOrEqual(24)
        expect(productos[0].nombre).toBe('Torta de chocolate')
    })

    it('debe agregar un producto', () => {
        const nuevo = agregarProducto({
            nombre: 'Brownie nuevo',
            categoria: 'Pasteles',
            precio: 2500,
            descripcion: 'Brownie de chocolate',
            imagen: '/images/productos/brownie.jpg',
        })

        expect(nuevo).not.toBeNull()
        expect(listarProductos().length).toBe(PRODUCTOS_INICIALES.length + 1)
    })

    it('debe editar un producto existente', () => {
        const productos = listarProductos()
        const id = productos[0].id

        const resultado = editarProducto(id, {
            nombre: 'Torta de vainilla',
        })

        expect(resultado).toBe(true)
        expect(listarProductos()[0].nombre).toBe('Torta de vainilla')
    })

    it('debe eliminar un producto existente', () => {
        const productos = listarProductos()
        const id = productos[0].id

        const resultado = eliminarProducto(id)

        expect(resultado).toBe(true)
        expect(listarProductos().length).toBe(PRODUCTOS_INICIALES.length - 1)
    })

    it('debe devolver false al editar un producto inexistente', () => {
        expect(editarProducto(-1, { nombre: 'Producto inexistente' })).toBe(false)
    })

    it('debe devolver false al eliminar un producto inexistente', () => {
        expect(eliminarProducto(-1)).toBe(false)
    })

    it('debe devolver los productos iniciales si el almacenamiento contiene JSON inválido', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        localStorage.setItem('milSabores_productos', '{json inválido')

        const productos = listarProductos()

        expect(productos.length).toBe(PRODUCTOS_INICIALES.length)
    })

    it('debe devolver null si falla el guardado al agregar un producto', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Error al guardar')
        })

        const resultado = agregarProducto({
            nombre: 'Brownie',
            categoria: 'Pasteles',
            precio: 2500,
        })

        expect(resultado).toBeNull()
    })

    it('debe devolver false si falla el guardado al editar un producto', () => {
        const productos = listarProductos()
        const id = productos[0].id

        vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Error al guardar')
        })

        const resultado = editarProducto(id, { nombre: 'Torta editada' })

        expect(resultado).toBe(false)
    })

    it('debe devolver false si falla el guardado al eliminar un producto', () => {
        const productos = listarProductos()
        const id = productos[0].id

        vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Error al guardar')
        })

        const resultado = eliminarProducto(id)

        expect(resultado).toBe(false)
    })

    it('obtenerProductoPorId devuelve el producto correcto por id', () => {
        const productos = listarProductos()
        const id = productos[0].id
        const producto = obtenerProductoPorId(id)
        expect(producto).not.toBeNull()
        expect(producto.nombre).toBe('Torta de chocolate')
    })

    it('obtenerProductoPorId devuelve null para un id inexistente', () => {
        expect(obtenerProductoPorId(-999)).toBeNull()
    })

    it('obtenerProductoPorId devuelve null si se llama sin argumento', () => {
        expect(obtenerProductoPorId(null)).toBeNull()
        expect(obtenerProductoPorId(undefined)).toBeNull()
    })

    it('listarOfertas devuelve solo productos con enOferta y precioOferta válido', () => {
        const ofertas = listarOfertas()
        expect(ofertas.length).toBe(6)
        ofertas.forEach((o) => {
            expect(o.enOferta).toBe(true)
            expect(o.precioOferta).toBeGreaterThan(0)
            expect(o.precioOferta).toBeLessThan(o.precio)
        })
    })

    it('listarOfertas devuelve lista vacía si no hay productos en oferta', () => {

        const productos = listarProductos().map((p) => ({
            ...p,
            enOferta: false,
            precioOferta: undefined,
        }))
        localStorage.setItem('milSabores_productos', JSON.stringify(productos))

        const ofertas = listarOfertas()
        expect(ofertas.length).toBe(0)
    })

    it('listarOfertas ignora productos donde precioOferta >= precio', () => {
        const productos = listarProductos().map((p, i) =>
            i === 0 ? { ...p, enOferta: true, precioOferta: p.precio } : p
        )
        localStorage.setItem('milSabores_productos', JSON.stringify(productos))

        const ofertas = listarOfertas()

        expect(ofertas.every((o) => o.precioOferta < o.precio)).toBe(true)
    })

    it('getPrecioEfectivo devuelve precioOferta si la oferta es válida', () => {
        const producto = { precio: 5000, enOferta: true, precioOferta: 3000 }
        expect(getPrecioEfectivo(producto)).toBe(3000)
    })

    it('getPrecioEfectivo devuelve precio normal si no está en oferta', () => {
        const producto = { precio: 5000, enOferta: false }
        expect(getPrecioEfectivo(producto)).toBe(5000)
    })

    it('getPrecioEfectivo devuelve precio normal si precioOferta es mayor o igual', () => {
        expect(getPrecioEfectivo({ precio: 5000, enOferta: true, precioOferta: 5000 })).toBe(5000)
        expect(getPrecioEfectivo({ precio: 5000, enOferta: true, precioOferta: 6000 })).toBe(5000)
    })

    it('getPrecioEfectivo devuelve precio normal si precioOferta es cero o negativo', () => {
        expect(getPrecioEfectivo({ precio: 5000, enOferta: true, precioOferta: 0 })).toBe(5000)
        expect(getPrecioEfectivo({ precio: 5000, enOferta: true, precioOferta: -100 })).toBe(5000)
    })

    it('el catálogo contiene al menos 24 productos con IDs únicos y fotos válidas', () => {
        const productos = listarProductos()
        expect(productos.length).toBeGreaterThanOrEqual(24)

        const ids = productos.map((p) => p.id)
        const idsUnicos = new Set(ids)
        expect(idsUnicos.size).toBe(productos.length)

        productos.forEach((p) => {
            expect(p.nombre).toBeTruthy()
            expect(p.descripcion).toBeTruthy()
            expect(p.categoria).toBeTruthy()
            expect(p.precio).toBeGreaterThan(0)
            expect(p.imagen).toMatch(/^\/images\/productos\/[a-z0-9-]+\.jpg$/i)
        })
    })

    it('contiene las categorías requeridas incluyendo productos chilenos', () => {
        const productos = listarProductos()
        const categorias = new Set(productos.map((p) => p.categoria))

        expect(categorias.has('Tortas')).toBe(true)
        expect(categorias.has('Pasteles')).toBe(true)
        expect(categorias.has('Galletas')).toBe(true)
        expect(categorias.has('Cupcakes')).toBe(true)
        expect(categorias.has('Panadería')).toBe(true)
        expect(categorias.has('Especiales')).toBe(true)

        const nombres = productos.map((p) => p.nombre)
        expect(nombres).toContain('Torta mil hojas')
        expect(nombres).toContain('Alfajores de maicena')
        expect(nombres).toContain('Brazo de reina')
        expect(nombres).toContain('Berlín de manjar')
        expect(nombres).toContain('Empolvados chilenos')
    })
})
