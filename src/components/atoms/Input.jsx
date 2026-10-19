function Input({
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    className = '',
    size = '',
    required = false,
    disabled = false,
    ...props
}) {
    const sizeClass = size ? `form-control-${size}` : ''

    return (
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`form-control ${sizeClass} ${className}`.trim()}
            {...props}
        />
    )
}

export default Input
