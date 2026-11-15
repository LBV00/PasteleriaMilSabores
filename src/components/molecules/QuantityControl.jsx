import Button from '../atoms/Button.jsx'

function QuantityControl({
    id,
    cantidad,
    nombreProducto = '',
    onDisminuir,
    onAumentar,
    onCambiarCantidad,
    min = 1,
    max,
    disabled = false,
}) {
    function manejarChange(evento) {
        const nuevoValor = Number(evento.target.value)
        if (Number.isInteger(nuevoValor) && nuevoValor >= min && onCambiarCantidad) {
            if (max !== undefined && nuevoValor > max) {
                onCambiarCantidad(max)
            } else {
                onCambiarCantidad(nuevoValor)
            }
        }
    }

    const puedeAumentar = !disabled && (max === undefined || cantidad < max)

    return (
        <div className="input-group">
            <Button
                type="button"
                variant="outline-secondary"
                aria-label={nombreProducto ? `Disminuir cantidad de ${nombreProducto}` : 'Disminuir cantidad'}
                disabled={disabled || cantidad <= min}
                onClick={onDisminuir}
            >
                −
            </Button>

            <input
                id={id}
                className="form-control text-center"
                type="number"
                min={min}
                max={max}
                step="1"
                value={cantidad}
                disabled={disabled}
                onChange={manejarChange}
            />

            <Button
                type="button"
                variant="outline-secondary"
                aria-label={nombreProducto ? `Aumentar cantidad de ${nombreProducto}` : 'Aumentar cantidad'}
                disabled={!puedeAumentar}
                onClick={onAumentar}
            >
                +
            </Button>
        </div>
    )
}

export default QuantityControl
