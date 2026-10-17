import Input from '../atoms/Input.jsx'

function SearchBar({
    id = 'buscarProducto',
    label = 'Buscar por nombre',
    value,
    onChange,
    placeholder = 'Ej.: torta de chocolate',
    size = '',
    className = '',
}) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="form-label fw-semibold">
                    {label}
                </label>
            )}

            <Input
                id={id}
                type="search"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                size={size}
            />
        </div>
    )
}

export default SearchBar
