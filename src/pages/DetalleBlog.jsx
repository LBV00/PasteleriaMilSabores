import { Link, useParams } from 'react-router-dom'
import { obtenerPublicacionPorId } from '../services/blogService.js'
import PageHeader from '../components/templates/PageHeader.jsx'
import Badge from '../components/atoms/Badge.jsx'

function DetalleBlog() {
    const { id } = useParams()
    const post = obtenerPublicacionPorId(id)

    if (!post) {
        return (
            <main>
                <PageHeader
                    subtitle="Publicación no encontrada"
                    title="Este artículo no existe"
                    description="La publicación que buscas no está disponible o el enlace es incorrecto."
                />
                <section className="container py-5 text-center">
                    <div className="mb-4" style={{ fontSize: '4rem' }}>📄</div>
                    <p className="text-secondary mb-4">
                        Puede que la publicación haya sido eliminada o el enlace sea incorrecto.
                    </p>
                    <Link
                        to="/blog"
                        className="btn btn-lg text-white px-4"
                        style={{ backgroundColor: '#75452f' }}
                    >
                        Volver al blog
                    </Link>
                </section>
            </main>
        )
    }

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
                subtitle={post.categoria}
                title={post.titulo}
            />

            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">

                        <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
                            <Badge className="px-3 py-2">{post.categoria}</Badge>
                            <span className="text-secondary small">
                                {formatearFecha(post.fechaPublicacion)}
                            </span>
                            <span className="text-secondary small">
                                Por {post.autor}
                            </span>
                        </div>

                        <img
                            src={post.imagen}
                            alt={post.titulo}
                            className="img-fluid rounded-4 w-100 mb-4 shadow-sm"
                            style={{ maxHeight: '420px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src =
                                    'https://placehold.co/800x450/f2d8c7/704632?text=Pasteleria'
                            }}
                        />

                        <div
                            className="card border-0 shadow-sm p-4 p-md-5"
                            style={{ backgroundColor: '#fff' }}
                        >
                            {post.contenido.split('\n\n').map((parrafo, i) => {
                                if (parrafo.startsWith('**') && parrafo.endsWith('**')) {
                                    return (
                                        <h3
                                            key={i}
                                            className="h5 fw-bold mt-4 mb-2"
                                            style={{ color: '#4b2e25' }}
                                        >
                                            {parrafo.replace(/\*\*/g, '')}
                                        </h3>
                                    )
                                }

                                if (parrafo.startsWith('**')) {
                                    const limpio = parrafo.replace(/\*\*/g, '')
                                    return (
                                        <h3
                                            key={i}
                                            className="h5 fw-bold mt-4 mb-2"
                                            style={{ color: '#4b2e25' }}
                                        >
                                            {limpio}
                                        </h3>
                                    )
                                }
                                return (
                                    <p key={i} className="text-secondary">
                                        {parrafo}
                                    </p>
                                )
                            })}
                        </div>

                        <div className="mt-5 text-center">
                            <Link
                                to="/blog"
                                className="btn btn-outline-dark btn-lg px-4"
                            >
                                ← Volver al blog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetalleBlog
