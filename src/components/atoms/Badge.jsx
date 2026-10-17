function Badge({
    children,
    className = '',
    style = {},
    backgroundColor = '#f5e0d3',
    color = '#75452f',
    ...props
}) {
    return (
        <span
            className={`badge rounded-pill ${className}`.trim()}
            style={{ backgroundColor, color, ...style }}
            {...props}
        >
            {children}
        </span>
    )
}

export default Badge
