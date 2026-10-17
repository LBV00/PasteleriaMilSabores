import { Link } from 'react-router-dom'
import { listarPublicaciones } from '../services/blogService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Badge from '../components/atoms/Badge.jsx'

function Blog() {
    const publicaciones = listarPublicaciones()

    function formatearFecha(isoDate) {
        return new Date(isoDate).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <main>
            <PageHeader
                subtitle="Pastelería y repostería"
                title="Nuestro blog"
                description="Recetas, consejos y todo lo que necesitas saber sobre el mundo dulce."
                centered
            />

            <section className="container py-5">
                <div className="row g-4">
                    {publicaciones.map((post) => (
                        <div key={post.id} className="col-12 col-md-6 col-lg-4">
                            <article className="card h-100 border-0 shadow-sm overflow-hidden">
                                <img
                                    src={post.imagen}
                                    alt={post.titulo}
                                    className="card-img-top"
                                    loading="lazy"
                                    style={{ height: '220px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null
                                        e.currentTarget.src =
                                            'https://placehold.co/800x450/f2d8c7/704632?text=Pasteleria'
                                    }}
                                />

                                <div className="card-body d-flex flex-column p-4">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <Badge>{post.categoria}</Badge>
                                        <span className="small text-secondary">
                                            {formatearFecha(post.fechaPublicacion)}
                                        </span>
                                    </div>

                                    <h2
                                        className="h5 fw-bold mb-2"
                                        style={{ color: '#4b2e25' }}
                                    >
                                        {post.titulo}
                                    </h2>

                                    <p className="text-secondary small flex-grow-1">
                                        {post.resumen}
                                    </p>

                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="btn btn-outline-dark btn-sm mt-3 align-self-start"
                                    >
                                        Leer más →
                                    </Link>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Blog
