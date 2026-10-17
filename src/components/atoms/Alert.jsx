function Alert({
    tipo = 'info',
    children,
    mensaje,
    onCerrar,
    className = '',
    role = 'status',
    ...props
}) {
    const contenido = children || mensaje

    if (!contenido) return null

    const dismissibleClass = onCerrar ? 'alert-dismissible fade show' : ''

    return (
        <div
            className={`alert alert-${tipo} ${dismissibleClass} ${className}`.trim()}
            role={role}
            {...props}
        >
            {contenido}
            {onCerrar && (
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar mensaje"
                    onClick={onCerrar}
                />
            )}
        </div>
    )
}

export default Alert
