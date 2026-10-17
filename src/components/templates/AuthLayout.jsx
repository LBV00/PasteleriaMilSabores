function AuthLayout({
    subtitle,
    title,
    lead,
    sideContent,
    cardTitle,
    cardSubtitle,
    children,
}) {
    return (
        <section
            className="py-5"
            style={{
                background: 'linear-gradient(135deg, #fff4eb 0%, #f9e1d2 100%)',
            }}
        >
            <div className="container py-lg-4">
                <div className="row justify-content-center align-items-center g-5">
                    <div className="col-12 col-lg-5">
                        {subtitle && (
                            <p
                                className="text-uppercase fw-bold mb-2"
                                style={{ color: '#9a6246', letterSpacing: '2px' }}
                            >
                                {subtitle}
                            </p>
                        )}

                        <h1
                            className="display-5 fw-bold mb-3"
                            style={{ color: '#4b2e25' }}
                        >
                            {title}
                        </h1>

                        {lead && (
                            <p className="lead" style={{ color: '#6f554a' }}>
                                {lead}
                            </p>
                        )}

                        {sideContent}
                    </div>

                    <div className="col-12 col-md-9 col-lg-6">
                        <div className="card border-0 shadow">
                            <div className="card-body p-4 p-md-5">
                                {cardTitle && (
                                    <h2
                                        className="h3 fw-bold mb-2"
                                        style={{ color: '#4b2e25' }}
                                    >
                                        {cardTitle}
                                    </h2>
                                )}

                                {cardSubtitle && (
                                    <p className="text-secondary mb-4">
                                        {cardSubtitle}
                                    </p>
                                )}

                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AuthLayout
