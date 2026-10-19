const CATALOG_VERSION = 3

const CLAVE_STORAGE = 'milSabores_productos'
const CLAVE_CATALOG_VERSION = 'milSabores_catalogVersion'

const PRODUCTOS_INICIALES = [

    {
        id: 1,
        nombre: 'Torta de chocolate',
        categoria: 'Tortas',
        precio: 15990,
        descripcion: 'Torta de chocolate ideal para celebraciones, húmeda y esponjosa, cubierta con ganache de chocolate amargo.',
        imagen: '/images/productos/torta-chocolate.jpg',
        enOferta: false,
    },
    {
        id: 2,
        nombre: 'Cheesecake',
        categoria: 'Pasteles',
        precio: 4990,
        descripcion: 'Cheesecake cremoso al estilo neoyorquino sobre base crocante de galleta con coulis de frutos rojos seleccionados.',
        imagen: '/images/productos/cheesecake.jpg',
        enOferta: true,
        precioOferta: 3490,
    },
    {
        id: 3,
        nombre: 'Galletas artesanales',
        categoria: 'Galletas',
        precio: 2990,
        descripcion: 'Galletas artesanales horneadas con mantequilla de campo, recién horneadas y crujientes por fuera.',
        imagen: '/images/productos/galletas-artesanales.jpg',
        enOferta: true,
        precioOferta: 1990,
    },

    {
        id: 4,
        nombre: 'Torta de zanahoria',
        categoria: 'Tortas',
        precio: 14990,
        descripcion: 'Bizcocho de zanahoria y canela, cubierto con frosting de queso crema. Suave, aromática y perfectamente equilibrada.',
        imagen: '/images/productos/torta-zanahoria.jpg',
        enOferta: false,
    },
    {
        id: 5,
        nombre: 'Torta tres leches',
        categoria: 'Tortas',
        precio: 16990,
        descripcion: 'Bizcocho empapado en tres tipos de leche, coronado con crema chantilly y un toque de canela. Cremosa, húmeda e inolvidable.',
        imagen: '/images/productos/torta-tres-leches.jpg',
        enOferta: true,
        precioOferta: 12990,
    },
    {
        id: 6,
        nombre: 'Torta de frutilla',
        categoria: 'Tortas',
        precio: 17990,
        descripcion: 'Capas de bizcocho de vainilla alternadas con crema pastelera y frutillas frescas de temporada. Fresca y colorida.',
        imagen: '/images/productos/torta-frutilla.jpg',
        enOferta: false,
    },
    {
        id: 7,
        nombre: 'Torta de cumpleaños',
        categoria: 'Tortas',
        precio: 19990,
        descripcion: 'Torta de vainilla multicolor con suave frosting de mantequilla, decorada para que cada celebración sea inolvidable.',
        imagen: '/images/productos/torta-cumpleanos.jpg',
        enOferta: false,
    },
    {
        id: 8,
        nombre: 'Torta mil hojas',
        categoria: 'Tortas',
        precio: 18990,
        descripcion: 'Capas crujientes de hojaldre casero bañadas en manjar artesanal chileno y rematadas con merengue tostado.',
        imagen: '/images/productos/torta-mil-hojas.jpg',
        enOferta: false,
    },

    {
        id: 9,
        nombre: 'Pie de limón',
        categoria: 'Pasteles',
        precio: 3990,
        descripcion: 'Masa sablée crocante rellena de crema de limón natural y cubierta con merengue italiano tostado.',
        imagen: '/images/productos/pie-limon.jpg',
        enOferta: false,
    },
    {
        id: 10,
        nombre: 'Tiramisú',
        categoria: 'Pasteles',
        precio: 4490,
        descripcion: 'Savoiardi empapados en café espresso y licor, cubiertos con crema suave de mascarpone y cacao en polvo.',
        imagen: '/images/productos/tiramisu.jpg',
        enOferta: false,
    },
    {
        id: 11,
        nombre: 'Brownie de chocolate',
        categoria: 'Pasteles',
        precio: 2990,
        descripcion: 'Brownie intenso con corteza crujiente e interior fundente. Hecho con chocolate semi-amargo de primera calidad.',
        imagen: '/images/productos/brownie.jpg',
        enOferta: true,
        precioOferta: 2190,
    },
    {
        id: 12,
        nombre: 'Tres leches individual',
        categoria: 'Pasteles',
        precio: 2490,
        descripcion: 'Versión individual del clásico pastel de tres leches: húmedo, cremoso y con una cucharada de canela por encima.',
        imagen: '/images/productos/tres-leches-individual.jpg',
        enOferta: false,
    },

    {
        id: 13,
        nombre: 'Galletas chips de chocolate',
        categoria: 'Galletas',
        precio: 3490,
        descripcion: 'Galletas suaves por dentro y crocantes por fuera, repletas de chips de chocolate amargo con toque artesanal.',
        imagen: '/images/productos/galletas-chocolate.jpg',
        enOferta: false,
    },
    {
        id: 14,
        nombre: 'Galletas de avena',
        categoria: 'Galletas',
        precio: 2790,
        descripcion: 'Galletas saludables con avena integral, pasas rubias y canela. Crujientes, nutritivas y perfectas para la tarde.',
        imagen: '/images/productos/galletas-avena.jpg',
        enOferta: false,
    },

    {
        id: 15,
        nombre: 'Cupcake de vainilla',
        categoria: 'Cupcakes',
        precio: 1990,
        descripcion: 'Esponjoso cupcake de vainilla natural coronado con suave frosting de crema de mantequilla.',
        imagen: '/images/productos/cupcake-vainilla.jpg',
        enOferta: false,
    },
    {
        id: 16,
        nombre: 'Cupcake de chocolate',
        categoria: 'Cupcakes',
        precio: 1990,
        descripcion: 'Cupcake de chocolate amargo intenso con frosting de ganache artesanal para los amantes del buen cacao.',
        imagen: '/images/productos/cupcake-chocolate.jpg',
        enOferta: false,
    },
    {
        id: 17,
        nombre: 'Muffin de arándanos',
        categoria: 'Cupcakes',
        precio: 1790,
        descripcion: 'Muffin esponjoso horneado con arándanos frescos del sur de Chile y azúcar rubia en la corteza.',
        imagen: '/images/productos/muffin-arandanos.jpg',
        enOferta: false,
    },

    {
        id: 18,
        nombre: 'Croissant de mantequilla',
        categoria: 'Panadería',
        precio: 1490,
        descripcion: 'Croissant laminado con mantequilla pura de primera, hojaldrado, dorado y crujiente por fuera con técnica francesa.',
        imagen: '/images/productos/croissant.jpg',
        enOferta: false,
    },
    {
        id: 19,
        nombre: 'Rollo de canela',
        categoria: 'Panadería',
        precio: 2290,
        descripcion: 'Masa brioche enrollada con canela aromática, azúcar morena y glaseado suave de queso crema.',
        imagen: '/images/productos/rollo-canela.jpg',
        enOferta: false,
    },
    {
        id: 20,
        nombre: 'Donut glaseado',
        categoria: 'Panadería',
        precio: 1990,
        descripcion: 'Donut esponjoso glaseado con fina cobertura de azúcar y delicadas notas de vainilla.',
        imagen: '/images/productos/donut-glaseado.jpg',
        enOferta: false,
    },
    {
        id: 21,
        nombre: 'Medialuna de mantequilla',
        categoria: 'Panadería',
        precio: 990,
        descripcion: 'Medialuna tradicional: tierna, brillante y con suave almíbar dulce, ideal para el desayuno o la merienda.',
        imagen: '/images/productos/medialuna.jpg',
        enOferta: true,
        precioOferta: 790,
    },
    {
        id: 22,
        nombre: 'Berlín de manjar',
        categoria: 'Panadería',
        precio: 1790,
        descripcion: 'Berlín frito esponjoso, generosamente relleno de manjar chileno y nevado con azúcar flor.',
        imagen: '/images/productos/berlin-manjar.jpg',
        enOferta: true,
        precioOferta: 1290,
    },

    {
        id: 23,
        nombre: 'Alfajores de maicena',
        categoria: 'Especiales',
        precio: 1490,
        descripcion: 'Alfajores clásicos chilenos: dos tapas delicadas de maicena que se deshacen en la boca, manjar casero y coco rallado.',
        imagen: '/images/productos/alfajores-maicena.jpg',
        enOferta: false,
    },
    {
        id: 24,
        nombre: 'Macarons surtidos',
        categoria: 'Especiales',
        precio: 2990,
        descripcion: 'Macarons de almendra con rellenos artesanales de frambuesa, chocolate belga, pistacho y vainilla.',
        imagen: '/images/productos/macarons.jpg',
        enOferta: false,
    },
    {
        id: 25,
        nombre: 'Trufas de chocolate',
        categoria: 'Especiales',
        precio: 3490,
        descripcion: 'Trufas artesanales de chocolate belga, rellenas de ganache y rodadas en fino cacao amargo en polvo.',
        imagen: '/images/productos/trufas-chocolate.jpg',
        enOferta: false,
    },
    {
        id: 26,
        nombre: 'Caja de dulces surtidos',
        categoria: 'Especiales',
        precio: 12990,
        descripcion: 'Selección de nuestros mejores dulces: alfajores, trufas, macarons y galletas artesanales en elegante presentación.',
        imagen: '/images/productos/caja-dulces.jpg',
        enOferta: false,
    },
    {
        id: 27,
        nombre: 'Brazo de reina',
        categoria: 'Especiales',
        precio: 9990,
        descripcion: 'Pionono esponjoso relleno de generosas capas de manjar artesanal chileno. El postre clásico de las onces familiares.',
        imagen: '/images/productos/brazo-de-reina.jpg',
        enOferta: false,
    },
    {
        id: 28,
        nombre: 'Empolvados chilenos',
        categoria: 'Especiales',
        precio: 1890,
        descripcion: 'Tradicionales empolvados chilenos con masa suave y aireada, abundante manjar de leche y cubiertos en azúcar flor.',
        imagen: '/images/productos/empolvados.jpg',
        enOferta: false,
    },
]

const IDS_CATALOGO_BASE = new Set(PRODUCTOS_INICIALES.map((p) => p.id))

function inicializarCatalogo() {
    try {
        const versionGuardada = Number(localStorage.getItem(CLAVE_CATALOG_VERSION) || '0')
        const datosGuardados = localStorage.getItem(CLAVE_STORAGE)

        if (datosGuardados === null) {
            localStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify(PRODUCTOS_INICIALES.map((p) => ({ ...p })))
            )
            localStorage.setItem(CLAVE_CATALOG_VERSION, String(CATALOG_VERSION))
            return
        }

        if (versionGuardada >= CATALOG_VERSION) return

        const productosGuardados = JSON.parse(datosGuardados)
        if (!Array.isArray(productosGuardados)) return

        const productosAdmin = productosGuardados.filter(
            (p) => !IDS_CATALOGO_BASE.has(p.id)
        )

        const fusionados = [
            ...PRODUCTOS_INICIALES.map((p) => ({ ...p })),
            ...productosAdmin,
        ]

        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(fusionados))
        localStorage.setItem(CLAVE_CATALOG_VERSION, String(CATALOG_VERSION))
    } catch (error) {
        console.error('Error al inicializar catálogo:', error)
    }
}

inicializarCatalogo()

function obtenerProductos() {
    try {
        const guardados = localStorage.getItem(CLAVE_STORAGE)

        if (guardados !== null) {
            const productos = JSON.parse(guardados)

            if (Array.isArray(productos)) {
                return productos
            }
        }
    } catch (error) {
        console.error('No se pudieron leer los productos:', error)
    }

    return PRODUCTOS_INICIALES.map((producto) => ({ ...producto }))
}

function guardarProductos(productos) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos))
        return true
    } catch (error) {
        console.error('No se pudieron guardar los productos:', error)
        return false
    }
}

export function getPrecioEfectivo(producto) {
    if (
        producto?.enOferta === true &&
        typeof producto.precioOferta === 'number' &&
        producto.precioOferta > 0 &&
        producto.precioOferta < producto.precio
    ) {
        return producto.precioOferta
    }
    return producto?.precio ?? 0
}

export function listarProductos() {
    return obtenerProductos()
}

export function obtenerProductoPorId(id) {
    if (id === undefined || id === null) return null
    const idNum = Number(id)
    if (!Number.isFinite(idNum)) return null
    const productos = obtenerProductos()
    return productos.find((p) => p.id === idNum) || null
}

export function listarOfertas() {
    const productos = obtenerProductos()
    return productos.filter((producto) => {
        if (!producto.enOferta) return false
        const precioOferta = Number(producto.precioOferta)
        return (
            Number.isFinite(precioOferta) &&
            precioOferta > 0 &&
            precioOferta < producto.precio
        )
    })
}

export function agregarProducto(producto) {
    const productos = obtenerProductos()

    const nuevoProducto = {
        ...producto,
        id: Date.now(),
    }

    const actualizados = [...productos, nuevoProducto]

    if (!guardarProductos(actualizados)) {
        return null
    }

    return nuevoProducto
}

export function editarProducto(id, cambios) {
    const productos = obtenerProductos()
    const existe = productos.some((producto) => producto.id === id)

    if (!existe) {
        return false
    }

    const actualizados = productos.map((producto) =>
        producto.id === id
            ? { ...producto, ...cambios, id: producto.id }
            : producto
    )

    return guardarProductos(actualizados)
}

export function eliminarProducto(id) {
    const productos = obtenerProductos()
    const actualizados = productos.filter((producto) => producto.id !== id)

    if (actualizados.length === productos.length) {
        return false
    }

    return guardarProductos(actualizados)
}

export { PRODUCTOS_INICIALES, CATALOG_VERSION, IDS_CATALOGO_BASE }
