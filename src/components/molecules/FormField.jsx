import Input from '../atoms/Input.jsx'

function FormField({
    id,
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    size = '',
    required = false,
    as = 'input',
    rows = 3,
    helpText = '',
    error = '',
    className = 'mb-3',
    children,
    ...props
}) {
    const errorClass = error ? 'is-invalid' : ''

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="form-label fw-semibold">
                    {label}
                </label>
            )}

            {as === 'textarea' ? (
                <textarea
                    id={id}
                    name={name}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`form-control ${errorClass}`.trim()}
                    {...props}
                />
            ) : as === 'select' ? (
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`form-select ${size ? `form-select-${size}` : ''} ${errorClass}`.trim()}
                    {...props}
                >
                    {children}
                </select>
            ) : (
                <Input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    size={size}
                    required={required}
                    className={errorClass}
                    {...props}
                />
            )}

            {helpText && !error && <div className="form-text">{helpText}</div>}
            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    )
}

export default FormField
