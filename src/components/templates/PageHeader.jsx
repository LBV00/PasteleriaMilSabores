function PageHeader({
    subtitle,
    title,
    description,
    centered = false,
}) {
    const alignmentClass = centered ? 'text-center py-3' : ''

    return (
        <section
            className="py-5"
            style={{
                background: 'linear-gradient(135deg, #fff4eb 0%, #f9e1d2 100%)',
            }}
        >
            <div className={`container ${alignmentClass}`.trim()}>
                {subtitle && (
                    <p
                        className="text-uppercase fw-bold mb-2"
                        style={{ color: '#9a6246', letterSpacing: '2px' }}
                    >
                        {subtitle}
                    </p>
                )}

                <h1
                    className={`display-5 fw-bold ${description ? 'mb-3' : 'mb-0'}`}
                    style={{ color: '#4b2e25' }}
                >
                    {title}
                </h1>

                {description && (
                    <p className="lead mb-0" style={{ color: '#6f554a' }}>
                        {description}
                    </p>
                )}
            </div>
        </section>
    )
}

export default PageHeader
