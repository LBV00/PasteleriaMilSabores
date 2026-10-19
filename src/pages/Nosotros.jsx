import { Link } from 'react-router-dom'
import PageHeader from '../components/templates/PageHeader.jsx'
import Badge from '../components/atoms/Badge.jsx'

function Nosotros() {
    return (
        <main>
            <PageHeader
                subtitle="Nuestra historia"
                title="Quiénes somos"
                description="Una pastelería hecha con amor, dedicación y los mejores ingredientes."
            />

            <section className="container py-5">

                <div className="row align-items-center g-5 mb-5">
                    <div className="col-12 col-lg-6">
                        <Badge className="px-3 py-2 mb-3">Pastelería Mil Sabores</Badge>

                        <h2
                            className="display-6 fw-bold mb-4"
                            style={{ color: '#4b2e25' }}
                        >
                            Endulzando vidas desde 2008
                        </h2>

                        <p className="lead" style={{ color: '#6f554a' }}>
                            Pastelería Mil Sabores nació de la convicción de que cada momento
                            merece algo especial: un sabor que lo haga memorable, un aroma que
                            lo traiga de vuelta y una textura que lo convierta en un recuerdo.
                        </p>

                        <p className="text-secondary">
                            Lo que comenzó como un emprendimiento familiar en una pequeña cocina
                            se transformó con el tiempo en una pastelería con identidad propia,
                            reconocida por la calidad de sus productos, la honestidad de sus
                            ingredientes y el cariño puesto en cada preparación.
                        </p>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="position-relative rounded-4 overflow-hidden shadow-sm">
                            <img
                                src="/images/productos/nosotros-tienda.jpg"
                                alt="Interior de Pastelería Mil Sabores"
                                className="img-fluid w-100"
                                style={{ maxHeight: '420px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = '/images/productos/default-pasteleria.jpg'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-4">
                            <img
                                src="/images/productos/torta-chocolate.jpg"
                                alt="Torta artesanal"
                                className="card-img-top"
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="card-body p-3 text-center">
                                <h3 className="h6 fw-bold mb-0" style={{ color: '#4b2e25' }}>Recetas Clásicas</h3>
                                <p className="small text-secondary mb-0">Bizcochos húmedos y cacao puro</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-4">
                            <img
                                src="/images/productos/croissant.jpg"
                                alt="Hojaldre artesanal"
                                className="card-img-top"
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="card-body p-3 text-center">
                                <h3 className="h6 fw-bold mb-0" style={{ color: '#4b2e25' }}>Hojaldre Casero</h3>
                                <p className="small text-secondary mb-0">Mantequilla pura y fermentación lenta</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-4">
                            <img
                                src="/images/productos/alfajores-maicena.jpg"
                                alt="Dulces chilenos tradicionales"
                                className="card-img-top"
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="card-body p-3 text-center">
                                <h3 className="h6 fw-bold mb-0" style={{ color: '#4b2e25' }}>Tradición Chilena</h3>
                                <p className="small text-secondary mb-0">Manjar de campo y coco rallado</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-4">
                            <img
                                src="/images/productos/cheesecake.jpg"
                                alt="Postres y pasteles frescos"
                                className="card-img-top"
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="card-body p-3 text-center">
                                <h3 className="h6 fw-bold mb-0" style={{ color: '#4b2e25' }}>Postres del Día</h3>
                                <p className="small text-secondary mb-0">Frutos rojos y cremas suaves</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="rounded-4 p-5 mb-5 shadow-sm"
                    style={{ backgroundColor: '#fff4eb' }}
                >
                    <div className="text-center mb-5">
                        <p
                            className="text-uppercase fw-bold mb-2"
                            style={{ color: '#9a6246', letterSpacing: '2px' }}
                        >
                            Lo que nos define
                        </p>
                        <h2 className="fw-bold" style={{ color: '#4b2e25' }}>
                            Nuestros valores
                        </h2>
                    </div>

                    <div className="row g-4 text-center">
                        {[
                            {
                                emoji: '🌾',
                                titulo: 'Ingredientes de calidad',
                                desc: 'Seleccionamos cada ingrediente con cuidado. Sin colorantes artificiales, sin saborizantes sintéticos.',
                            },
                            {
                                emoji: '🤝',
                                titulo: 'Elaboración artesanal',
                                desc: 'Cada producto se prepara a mano, siguiendo las recetas originales de nuestra familia.',
                            },
                            {
                                emoji: '💛',
                                titulo: 'Compromiso con el sabor',
                                desc: 'No hacemos concesiones en el sabor. Si no nos satisface a nosotros, no llega a tu mesa.',
                            },
                        ].map((valor) => (
                            <div key={valor.titulo} className="col-12 col-md-4">
                                <div
                                    className="card border-0 h-100 p-4 shadow-sm"
                                    style={{ backgroundColor: '#fff8f2' }}
                                >
                                    <div className="card-body text-center">
                                        <div
                                            className="mb-3"
                                            style={{ fontSize: '2.5rem' }}
                                            role="img"
                                            aria-label={valor.titulo}
                                        >
                                            {valor.emoji}
                                        </div>
                                        <h3
                                            className="h5 fw-bold mb-2"
                                            style={{ color: '#4b2e25' }}
                                        >
                                            {valor.titulo}
                                        </h3>
                                        <p className="text-secondary mb-0 small">
                                            {valor.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-5 align-items-center mb-5">
                    <div className="col-12 col-lg-6 order-lg-2">
                        <div className="position-relative rounded-4 overflow-hidden shadow-sm">
                            <img
                                src="/images/productos/nosotros-cocina.jpg"
                                alt="Cocina de Pastelería Mil Sabores"
                                className="img-fluid w-100"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = '/images/productos/default-pasteleria.jpg'
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 order-lg-1">
                        <h2
                            className="h3 fw-bold mb-4"
                            style={{ color: '#4b2e25' }}
                        >
                            Una historia de familia
                        </h2>

                        <p className="text-secondary mb-3">
                            La historia de Pastelería Mil Sabores comenzó en el año 2008, cuando
                            Margarita, la fundadora, decidió convertir su pasión por la
                            repostería en un proyecto de vida. Con una receta de torta de
                            chocolate heredada de su abuela y muchas ganas de compartirla,
                            comenzó a preparar pedidos para vecinos y amigos.
                        </p>

                        <p className="text-secondary mb-3">
                            Con el tiempo, la boca a boca hizo su trabajo. En 2013 se incorporó
                            su hijo Pedro, pastelero formado en Chile y Francia, quien amplió el
                            catálogo con recetas europeas adaptadas a los sabores locales.
                        </p>

                        <p className="text-secondary mb-0">
                            Hoy, Pastelería Mil Sabores elabora decenas de productos cada día,
                            siempre con el mismo espíritu del primer bizcocho: hacerlo bien,
                            hacerlo con amor y hacerlo para que cada persona que lo pruebe
                            sienta que ese dulce fue preparado especialmente para ella.
                        </p>
                    </div>
                </div>

                <div
                    className="rounded-4 p-5 text-center shadow"
                    style={{ backgroundColor: '#75452f' }}
                >
                    <h2 className="fw-bold text-white mb-3">
                        ¿Listo para descubrir nuestros sabores?
                    </h2>
                    <p className="text-white mb-4" style={{ opacity: 0.85 }}>
                        Explora nuestro catálogo y encuentra el dulce perfecto para tu
                        próximo momento especial.
                    </p>
                    <Link
                        to="/productos"
                        className="btn btn-lg btn-light px-5 shadow-sm"
                        style={{ color: '#75452f', fontWeight: 600 }}
                    >
                        Ver catálogo
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Nosotros
