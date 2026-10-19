import { Link } from 'react-router-dom'
import ProductCard from '../components/organisms/ProductCard.jsx'
import Badge from '../components/atoms/Badge.jsx'

function Home() {
    return (
        <>
            <section
                className="py-5"
                style={{
                    background: 'linear-gradient(135deg, #fff4eb 0%, #f9e1d2 100%)',
                }}
            >
                <div className="container py-lg-4">
                    <div className="row align-items-center g-5">
                        <div className="col-12 col-lg-6">
                            <Badge
                                className="px-3 py-2 mb-3"
                                backgroundColor="#f0d1bd"
                                color="#713f2b"
                            >
                                HECHO CON AMOR
                            </Badge>

                            <h1
                                className="display-3 fw-bold mb-4"
                                style={{ color: '#4b2e25' }}
                            >
                                Endulzamos tus momentos especiales
                            </h1>

                            <p className="lead mb-4" style={{ color: '#6f554a' }}>
                                Descubre tortas, pasteles y dulces ideales para compartir,
                                celebrar y crear recuerdos inolvidables con auténtica tradición pastelera.
                            </p>

                            <div className="d-flex flex-wrap gap-3">
                                <Link
                                    to="/productos"
                                    className="btn btn-lg text-white px-4 shadow-sm"
                                    style={{ backgroundColor: '#75452f' }}
                                >
                                    Ver productos
                                </Link>

                                <Link
                                    to="/registro"
                                    className="btn btn-lg btn-outline-dark px-4"
                                >
                                    Crear una cuenta
                                </Link>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <img
                                src="/images/productos/home-hero.jpg"
                                alt="Pastelería Mil Sabores: tortas y dulces"
                                className="img-fluid rounded-5 shadow"
                                style={{
                                    width: '100%',
                                    maxHeight: '460px',
                                    objectFit: 'cover',
                                }}
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = '/images/productos/default-pasteleria.jpg'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-5">
                <div className="text-center mb-5">
                    <p
                        className="text-uppercase fw-bold mb-2"
                        style={{ color: '#9a6246', letterSpacing: '2px' }}
                    >
                        Descubre nuestro sabor
                    </p>

                    <h2 className="fw-bold display-6" style={{ color: '#4b2e25' }}>
                        Nuestros productos
                    </h2>

                    <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                        Tenemos opciones dulces para tus celebraciones, reuniones
                        familiares y pequeños momentos del día.
                    </p>
                </div>

                <div className="row g-4">
                    <ProductCard
                        nombre="Tortas"
                        descripcion="El centro de tus celebraciones, con sabores para compartir."
                        imagen="/images/productos/torta-chocolate.jpg"
                        colClass="col-12 col-md-4"
                    />

                    <ProductCard
                        nombre="Pasteles"
                        descripcion="Pequeños placeres dulces para disfrutar en cualquier momento."
                        imagen="/images/productos/cheesecake.jpg"
                        colClass="col-12 col-md-4"
                    />

                    <ProductCard
                        nombre="Galletas"
                        descripcion="El acompañamiento perfecto para tus tardes y reuniones."
                        imagen="/images/productos/galletas-artesanales.jpg"
                        colClass="col-12 col-md-4"
                    />
                </div>

                <div className="text-center mt-5">
                    <Link
                        to="/productos"
                        className="btn btn-outline-dark btn-lg px-4"
                    >
                        Explorar catálogo completo
                    </Link>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: '#fff8f3' }}>
                <div className="container py-3">
                    <div className="text-center mb-5">
                        <span className="badge rounded-pill px-3 py-2 mb-2" style={{ backgroundColor: '#f0d1bd', color: '#713f2b' }}>
                            RECETAS TRADICIONALES
                        </span>
                        <h2 className="fw-bold display-6" style={{ color: '#4b2e25' }}>
                            Especialidades de la Repostería Chilena
                        </h2>
                        <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>
                            Elaborados artesanalmente con manjar de campo casero, recetas de antaño y el cariño de siempre.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm overflow-hidden text-center">
                                <img
                                    src="/images/productos/torta-mil-hojas.jpg"
                                    alt="Torta mil hojas chilena"
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-3 d-flex flex-column">
                                    <h3 className="h5 fw-bold mb-1" style={{ color: '#4b2e25' }}>Torta mil hojas</h3>
                                    <p className="small text-secondary mb-3">Capas crujientes con manjar artesanal y merengue tostado.</p>
                                    <Link to="/productos/8" className="btn btn-sm btn-outline-dark mt-auto">Ver detalle</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm overflow-hidden text-center">
                                <img
                                    src="/images/productos/alfajores-maicena.jpg"
                                    alt="Alfajores de maicena"
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-3 d-flex flex-column">
                                    <h3 className="h5 fw-bold mb-1" style={{ color: '#4b2e25' }}>Alfajores de maicena</h3>
                                    <p className="small text-secondary mb-3">Masa suave que se deshace, abundante manjar y coco.</p>
                                    <Link to="/productos/23" className="btn btn-sm btn-outline-dark mt-auto">Ver detalle</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm overflow-hidden text-center">
                                <img
                                    src="/images/productos/brazo-de-reina.jpg"
                                    alt="Brazo de reina artesanal"
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-3 d-flex flex-column">
                                    <h3 className="h5 fw-bold mb-1" style={{ color: '#4b2e25' }}>Brazo de reina</h3>
                                    <p className="small text-secondary mb-3">Pionono esponjoso bañado en manjar chileno tradicional.</p>
                                    <Link to="/productos/27" className="btn btn-sm btn-outline-dark mt-auto">Ver detalle</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm overflow-hidden text-center">
                                <img
                                    src="/images/productos/berlin-manjar.jpg"
                                    alt="Berlín de manjar"
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-3 d-flex flex-column">
                                    <h3 className="h5 fw-bold mb-1" style={{ color: '#4b2e25' }}>Berlín de manjar</h3>
                                    <p className="small text-secondary mb-3">Masa dorada esponjosa y relleno cremoso con azúcar flor.</p>
                                    <Link to="/productos/22" className="btn btn-sm btn-outline-dark mt-auto">Ver detalle</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: '#fff4eb' }}>
                <div className="container text-center py-3">
                    <h2 className="fw-bold mb-3" style={{ color: '#4b2e25' }}>
                        Un detalle dulce hace la diferencia
                    </h2>

                    <p className="text-secondary mb-4">
                        Encuentra algo especial para tu próxima celebración.
                    </p>

                    <Link
                        to="/productos"
                        className="btn btn-lg text-white px-4"
                        style={{ backgroundColor: '#75452f' }}
                    >
                        Conocer productos
                    </Link>
                </div>
            </section>
        </>
    )
}

export default Home
