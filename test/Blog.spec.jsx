import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Blog from '../src/pages/Blog.jsx'
import DetalleBlog from '../src/pages/DetalleBlog.jsx'

describe('Página Blog (listado)', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renderiza el título del blog y las publicaciones', () => {
        render(
            <MemoryRouter>
                <Blog />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('heading', { level: 1, name: 'Nuestro blog' })
        ).toBeInTheDocument()

        expect(
            screen.getByText(/Los secretos de una torta de chocolate perfecta/i)
        ).toBeInTheDocument()
        expect(
            screen.getAllByText(/Cheesecake sin horno/i).length
        ).toBeGreaterThan(0)
    })

    it('cada publicación tiene un enlace a su detalle', () => {
        render(
            <MemoryRouter>
                <Blog />
            </MemoryRouter>
        )

        const enlacesLeerMas = screen.getAllByRole('link', { name: /Leer más/i })
        expect(enlacesLeerMas.length).toBeGreaterThan(0)
        expect(enlacesLeerMas[0]).toHaveAttribute('href', expect.stringContaining('/blog/'))
    })

    it('muestra la categoría de cada publicación', () => {
        render(
            <MemoryRouter>
                <Blog />
            </MemoryRouter>
        )

        expect(screen.getAllByText('Consejos').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Recetas').length).toBeGreaterThan(0)
    })
})

describe('Página DetalleBlog', () => {
    function renderConRuta(ruta) {
        return render(
            <MemoryRouter initialEntries={[ruta]}>
                <Routes>
                    <Route path="/blog/:id" element={<DetalleBlog />} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('renderiza el detalle de una publicación existente (id=1)', () => {
        renderConRuta('/blog/1')

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /Los secretos de una torta de chocolate perfecta/i,
            })
        ).toBeInTheDocument()
        expect(screen.getAllByText(/Consejos/).length).toBeGreaterThan(0)
        expect(screen.getByRole('link', { name: /Volver al blog/i })).toBeInTheDocument()
    })

    it('muestra el contenido completo de la publicación', () => {
        renderConRuta('/blog/1')

        expect(screen.getByRole('heading', { name: /Temperatura y tiempo/i })).toBeInTheDocument()
    })

    it('muestra mensaje de no encontrado para un id inexistente', () => {
        renderConRuta('/blog/99999')

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /Este artículo no existe/i,
            })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /Volver al blog/i })
        ).toBeInTheDocument()
    })

    it('muestra mensaje de no encontrado para un id inválido (no numérico)', () => {
        renderConRuta('/blog/abc')

        expect(
            screen.getByRole('heading', { level: 1, name: /Este artículo no existe/i })
        ).toBeInTheDocument()
    })
})
