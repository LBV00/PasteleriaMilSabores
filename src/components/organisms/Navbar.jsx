import { Link, NavLink, useNavigate } from 'react-router-dom'
import { obtenerSesion, cerrarSesion } from '../../services/usuariosService.js'

function Navbar() {
    const sesion = obtenerSesion()
    const navigate = useNavigate()

    function handleCerrarSesion() {
        cerrarSesion()
        navigate('/')
        window.location.reload()
    }

    const enlaceClase = ({ isActive }) =>
        `nav-link ${isActive ? 'active fw-bold' : ''}`

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    Pastelería Mil Sabores
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menuPrincipal"
                    aria-controls="menuPrincipal"
                    aria-expanded="false"
                    aria-label="Abrir menú"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuPrincipal">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/">
                                Inicio
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/productos">
                                Productos
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/categorias">
                                Categorías
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/ofertas">
                                Ofertas
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/blog">
                                Blog
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/nosotros">
                                Nosotros
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/contacto">
                                Contacto
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={enlaceClase} to="/carrito">
                                Carrito
                            </NavLink>
                        </li>

                        {sesion ? (
                            <>
                                {sesion.rol === 'admin' && (
                                    <li className="nav-item">
                                        <NavLink className={enlaceClase} to="/admin">
                                            Administración
                                        </NavLink>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-light btn-sm ms-lg-2 my-2 my-lg-0"
                                        onClick={handleCerrarSesion}
                                    >
                                        Cerrar sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className={enlaceClase} to="/login">
                                        Iniciar sesión
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className={enlaceClase} to="/registro">
                                        Registrarse
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
