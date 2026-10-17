import { useLocation, Link } from 'react-router-dom'
import PageHeader from '../components/templates/PageHeader.jsx'
import Alert from '../components/atoms/Alert.jsx'

function CompraFallida() {
    const location = useLocation()
    const mensajeError = location.state?.error || 'No fue posible registrar tu pedido en este momento.'

    return (
        <main>
            <PageHeader
                subtitle="Estado del pedido"
                title="No pudimos completar tu compra"
                description="Ocurrió un inconveniente durante el procesamiento de tu pedido."
                centered
            />

            <section className="container py-5 text-center">
                <div className="card border-0 shadow-sm p-4 p-md-5 mx-auto" style={{ maxWidth: '640px' }}>
                    <div className="mb-4">
                        <span className="display-4 text-danger d-block mb-3">⚠️</span>
                        <h2 className="h4 fw-bold" style={{ color: '#4b2e25' }}>
                            Hubo un problema al procesar la solicitud
                        </h2>
                    </div>

                    <Alert tipo="danger" role="alert" className="mb-4 text-start">
                        {mensajeError}
                    </Alert>

                    <p className="text-secondary mb-4">
                        No te preocupes, los productos siguen guardados en tu carrito. Puedes volver a revisarlos e intentar enviar tu pedido nuevamente.
                    </p>

                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <Link
                            to="/carrito"
                            className="btn btn-lg text-white px-4"
                            style={{ backgroundColor: '#75452f' }}
                        >
                            Volver al carrito
                        </Link>

                        <Link
                            to="/productos"
                            className="btn btn-lg btn-outline-dark px-4"
                        >
                            Explorar productos
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CompraFallida
