function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = '',
    className = '',
    style = {},
    disabled = false,
    onClick,
    ...props
}) {
    const sizeClass = size ? `btn-${size}` : ''
    const isPrimary = variant === 'primary'

    const variantClass = isPrimary
        ? 'btn text-white'
        : `btn btn-${variant}`

    const combinedStyle = isPrimary
        ? { backgroundColor: '#75452f', ...style }
        : style

    return (
        <button
            type={type}
            className={`${variantClass} ${sizeClass} ${className}`.trim()}
            style={combinedStyle}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
