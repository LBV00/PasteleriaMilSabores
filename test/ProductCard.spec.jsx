import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductCard from '../src/components/organisms/ProductCard.jsx'

describe('Componente ProductCard', () => {
    it('debe renderizar el nombre y la descripción del producto', () => {
        render(
            <ProductCard
                nombre="Torta de lúcuma"
                descripcion="Torta tradicional chilena de lúcuma y manjar"
            />
        )

        expect(screen.getByText('Torta de lúcuma')).toBeInTheDocument()
        expect(
            screen.getByText('Torta tradicional chilena de lúcuma y manjar')
        ).toBeInTheDocument()
    })

    it('debe contener un encabezado con el nombre del producto', () => {
        render(
            <ProductCard
                nombre="Brazo de reina"
                descripcion="Relleno con dulce de leche artesanal"
            />
        )

        const heading = screen.getByRole('heading', {
            level: 3,
            name: 'Brazo de reina',
        })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveClass('card-title')
    })
})
