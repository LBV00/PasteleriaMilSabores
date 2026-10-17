# 🍰 Pastelería Mil Sabores — Frontend SPA (Versión 2)

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.18.4-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.5-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-89.54%25_Lines-brightgreen)](./coverage/index.html)
[![Institution](https://img.shields.io/badge/Duoc_UC-DSY1104-002B49)](https://www.duoc.cl/)

Aplicación web de comercio electrónico tipo **Single Page Application (SPA)** desarrollada con **React 19**, **Vite 6** y **Bootstrap 5**, diseñada bajo la metodología **Atomic Design**. Proyecto desarrollado para la **Evaluación Parcial 2** de la asignatura **Desarrollo Fullstack II (DSY1104)** de la Escuela de Informática y Telecomunicaciones de **Duoc UC**.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Características Principales](#-características-principales)
3. [Arquitectura y Atomic Design](#-arquitectura-y-atomic-design)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
6. [Pruebas Automatizadas y Cobertura (QA)](#-pruebas-automatizadas-y-cobertura-qa)
7. [Modelo de Persistencia Local (LocalStorage)](#-modelo-de-persistencia-local-localstorage)
8. [Mapa de Rutas (16 Rutas Reales)](#-mapa-de-rutas-16-rutas-reales)
9. [Documentación de Entrega Oficial](#-documentación-de-entrega-oficial)
10. [Información Académica](#-información-académica)

---

## 📖 Descripción General

**Pastelería Mil Sabores** es una tienda virtual orientada a la difusión y comercialización de repostería artesanal tradicional chilena (alfajores de maicena, empolvados, brazo de reina, torta de milhojas) y pastelería fina contemporánea (cheesecakes, tartas, brownies, cupcakes).

La **Versión 2** moderniza integralmente el frontend respecto a la Evaluación Parcial 1, transformándolo en una SPA reactiva con 28 productos reales respaldados por fotografías locales de alta resolución, cálculo automático de ofertas, carrito de compras dinámico, checkout con validaciones de entrega, panel de administración con operaciones CRUD completas y una cobertura de pruebas automatizadas con Vitest superior al **89%**.

---

## ✨ Características Principales

- 🎂 **Catálogo Ampliado (28 Productos):** Variedad gastronómica distribuida en 8 categorías con fotografías locales optimizadas en `public/images/productos/`.
- 🔍 **Búsqueda y Filtros en Tiempo Real:** Búsqueda predictiva por texto libre (nombre y descripción) y filtrado interactivo por categorías.
- 🏷️ **Módulo de Ofertas y Precios Efectivos:** Despliegue de productos rebajados calculados dinámicamente mediante la función de servicio `getPrecioEfectivo()`.
- 🛒 **Carrito de Compras Interactivo:** Control estricto de cantidades (enteros $\ge 1$), cálculo automático de subtotales y persistencia instantánea.
- 🚚 **Checkout y Formalización de Pedidos:** Validación semántica rigurosa de datos de contacto y entrega (nombre, email RFC 5322, teléfono, dirección, comuna y región).
- 🧾 **Pantallas de Compra Exitosa y Fallida:** Generación de comprobante con identificador único (`PED-${Date.now()}-${random}`) y manejo amigable ante cancelaciones o errores.
- 🔐 **Autenticación y Control de Acceso:** Sistema de registro, login y sesiones persistentes en cliente, con protección de rutas mediante `<RutaProtegida>` para administradores.
- 🛠️ **Panel de Administración (CRUD Completo):** Vista de gestión para buscar, crear, editar y eliminar productos del inventario con confirmación modal.
- 📰 **Vistas Institucionales y Editoriales:**
  - **Nosotros:** Historia, pilares de calidad y fotografías de cocina/local.
  - **Blog Gastronómico:** Artículos formativos sobre técnicas y recetas de repostería.
  - **Contacto:** Formulario con validación y confirmación visual de recepción.
- 🛡️ **Tolerancia a Fallos:** Manejador `onError` en tarjetas de catálogo que carga automáticamente `/images/productos/default-pasteleria.jpg` si un recurso gráfico no está disponible.
- 🔄 **Migración Automática de Catálogo:** Detección de versión (`CATALOG_VERSION = 3`) que sincroniza los 28 productos base sin sobreescribir los productos agregados por el administrador.

---

## 🏛️ Arquitectura y Atomic Design

El proyecto desacopla estrictamente la interfaz visual de la lógica de negocio y persistencia, utilizando **Atomic Design** y el patrón **Service Layer**:

```
src/
├── components/
│   ├── atoms/         # Componentes indivisibles: Alert, Badge, Button, Input
│   ├── molecules/     # Combinaciones funcionales: FormField, QuantityControl, SearchBar
│   ├── organisms/     # Secciones complejas: CartItem, CartSummary, Footer, Navbar, ProductCard, RutaProtegida
│   └── templates/     # Estructuras de página: AuthLayout, MainLayout, PageHeader
├── pages/             # 16 Vistas principales de la SPA
└── services/          # Capa de negocio: productosService, usuariosService, carritoService, pedidosService, blogService
```

---

## 📂 Estructura del Proyecto

```bash
PasteleriaReactTemp/
├── coverage/                          # Reporte interactivo de cobertura HTML generado por Vitest
│   └── index.html
├── public/                            # Activos estáticos públicos
│   └── images/
│       └── productos/                 # 28 fotografías reales + hero + default fallback
├── src/
│   ├── components/                    # Componentes organizados por Atomic Design
│   ├── pages/                         # 16 páginas de la tienda
│   ├── services/                      # 5 servicios modulares con acceso a LocalStorage
│   ├── App.css
│   ├── App.jsx                        # Enrutador principal con 16 rutas declaradas
│   ├── index.css                      # Estilos globales y tokens
│   └── main.jsx                       # Punto de entrada de React 19
├── test/                              # Suite de pruebas automatizadas
│   ├── setup.js                       # Configuración global y cleanup de React Testing Library
│   ├── Admin.spec.jsx                 # Pruebas CRUD de panel de administración
│   ├── App.spec.jsx                   # Pruebas de navegación y enrutador
│   ├── atomicComponents.spec.jsx      # Pruebas de átomos visuales
│   ├── Carrito.spec.jsx               # Pruebas de vista de carrito
│   ├── carritoService.spec.jsx        # Pruebas de servicio de carrito
│   ├── Checkout.spec.jsx              # Pruebas de validación de despacho
│   ├── productosService.spec.jsx      # Pruebas de catálogo, migración y ofertas
│   └── ...                            # (25 archivos de prueba en total)
├── ERS_Pasteleria_Mil_Sabores_V2.docx # Documento de Especificación de Requisitos (Word)
├── ERS_Pasteleria_Mil_Sabores_V2.pdf  # Documento de Especificación de Requisitos (PDF)
├── Informe_Cobertura_Testing_Pasteleria_Mil_Sabores_V2.docx # Informe de QA (Word)
├── Informe_Cobertura_Testing_Pasteleria_Mil_Sabores_V2.pdf  # Informe de QA (PDF)
├── package.json
└── vite.config.js                     # Configuración de Vite y Vitest (v8, jsdom)
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js:** Versión 18.0 o superior (recomendado Node 20+ o 22+).
- **npm:** Gestor de paquetes incluido con Node.js.

### 1. Clonar o Descargar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd PasteleriaReactTemp
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:5173/`.

### 4. Compilar para Producción
```bash
npm run build
npm run preview
```

---

## 🧪 Pruebas Automatizadas y Cobertura (QA)

El proyecto cuenta con **171 pruebas unitarias** automatizadas distribuidas en **25 archivos de especificación**, ejecutadas con el motor **Vitest 5.0.5** y reporte instrumentado por **@vitest/coverage-v8**.

### Comandos de Ejecución

```powershell
# Ejecutar pruebas y generar reporte de cobertura en consola y HTML
npm.cmd run test:coverage

# Ejecutar las pruebas una sola vez (modo CI / batch)
npm.cmd run test:run

# Modo watcher interactivo durante el desarrollo
npm.cmd test
```

> **Nota para Windows PowerShell:** Se recomienda utilizar `npm.cmd` en lugar de `npm` para respetar las políticas de ejecución de scripts de Windows.

### Métricas de Cobertura Obtenidas (Auditoría Oficial)

| Métrica | Porcentaje Obtenido | Requisito Mínimo | Estado |
| :--- | :---: | :---: | :---: |
| **Líneas (`% Lines`)** | **89.54%** | 80.00% | ✅ **Superado (+9.54%)** |
| **Ramas (`% Branch`)** | **90.35%** | 80.00% | ✅ **Superado (+10.35%)** |
| **Funciones (`% Funcs`)** | **89.23%** | 80.00% | ✅ **Superado (+9.23%)** |
| **Sentencias (`% Stmts`)** | **88.95%** | 80.00% | ✅ **Superado (+8.95%)** |
| **Pruebas Unitarias** | **171 / 171 Pasadas** | 100% | ✅ **0 Fallos** |

Para inspeccionar el detalle visual interactivo de cada archivo, abre en tu navegador:
```
coverage/index.html
```

---

## 💾 Modelo de Persistencia Local (LocalStorage)

Dado el alcance de la Evaluación Parcial 2 (Frontend puro), la persistencia de datos opera en el navegador del usuario utilizando la **Web Storage API**. Todas las claves utilizan el espacio de nombres corporativo `milSabores_*`:

| Clave en LocalStorage | Servicio | Descripción y Contenido |
| :--- | :--- | :--- |
| `milSabores_productos` | `productosService.js` | Catálogo de productos con precios, stock, imágenes y ofertas. |
| `milSabores_catalogVersion` | `productosService.js` | Control de versión del catálogo (`"3"`) para migración automática. |
| `milSabores_usuarios` | `usuariosService.js` | Registro de cuentas de clientes y administradores. |
| `milSabores_sesion` | `usuariosService.js` | Objeto de la sesión activa autenticada. |
| `milSabores_carrito` | `carritoService.js` | Ítems seleccionados con precio efectivo y cantidades. |
| `milSabores_pedidos` | `pedidosService.js` | Historial de órdenes de compra confirmadas. |
| `milSabores_ultimo_pedido` | `pedidosService.js` | Respaldo de la última orden para la pantalla de compra exitosa. |

---

## 🗺️ Mapa de Rutas (16 Rutas Reales)

Declaradas en [`src/App.jsx`](file:///c:/Users/diber/Downloads/PasteleriaReactTemp/src/App.jsx):

| N° | Ruta URL | Página / Componente | Acceso | Propósito |
| :---: | :--- | :--- | :---: | :--- |
| 1 | `/` | `Home.jsx` | Público | Portada, banner héroe y vitrina chilena. |
| 2 | `/productos` | `Productos.jsx` | Público | Catálogo con 28 productos, filtros y búsqueda. |
| 3 | `/productos/:id` | `DetalleProducto.jsx` | Público | Ficha técnica completa y selector de cantidad. |
| 4 | `/ofertas` | `Ofertas.jsx` | Público | Vitrina exclusiva de productos rebajados. |
| 5 | `/categorias` | `Categorias.jsx` | Público | Directorio interactivo de las 8 categorías. |
| 6 | `/nosotros` | `Nosotros.jsx` | Público | Historia institucional y fotos del taller. |
| 7 | `/blog` | `Blog.jsx` | Público | Artículos formativos sobre pastelería. |
| 8 | `/blog/:id` | `DetalleBlog.jsx` | Público | Lectura completa de artículo editorial. |
| 9 | `/contacto` | `Contacto.jsx` | Público | Formulario de atención al cliente. |
| 10 | `/login` | `Login.jsx` | Público | Autenticación para clientes y administrador. |
| 11 | `/registro` | `Registro.jsx` | Público | Alta de nuevos usuarios clientes. |
| 12 | `/carrito` | `Carrito.jsx` | Público | Resumen y edición interactiva de compra. |
| 13 | `/checkout` | `Checkout.jsx` | Privado | Formulario y validación de despacho. |
| 14 | `/compra-exitosa` | `CompraExitosa.jsx` | Público / Cliente | Comprobante de orden generada (`PED-`). |
| 15 | `/compra-fallida` | `CompraFallida.jsx` | Público / Cliente | Aviso de error con preservación de carrito. |
| 16 | `/admin` | `Admin.jsx` | Privado (`admin`) | Panel CRUD unificado de productos. |

---

## 📄 Documentación de Entrega Oficial

En la raíz del proyecto se encuentran disponibles los documentos académicos formales generados para la evaluación:

1. **Especificación de Requisitos de Software (ERS V2):**
   - Editable Word: [`ERS_Pasteleria_Mil_Sabores_V2.docx`](./ERS_Pasteleria_Mil_Sabores_V2.docx)
   - PDF Oficial: [`ERS_Pasteleria_Mil_Sabores_V2.pdf`](./ERS_Pasteleria_Mil_Sabores_V2.pdf)
2. **Informe de Pruebas Unitarias y Cobertura de Código:**
   - Editable Word: [`Informe_Cobertura_Testing_Pasteleria_Mil_Sabores_V2.docx`](./Informe_Cobertura_Testing_Pasteleria_Mil_Sabores_V2.docx)
   - PDF Oficial: [`Informe_Cobertura_Testing_Pasteleria_Mil_Sabores_V2.pdf`](./Informe_Cobertura_Testing_Pasteleria_Mil_Sabores_V2.pdf)

---

## 🎓 Información Académica

- **Institución:** Duoc UC
- **Carrera / Escuela:** Escuela de Informática y Telecomunicaciones
- **Asignatura:** Desarrollo Fullstack II (`DSY1104`)
- **Evaluación:** Evaluación Parcial 2 (EP2)
- **Periodo:** Segundo Semestre 2026
- **Integrantes:** `[Nombre del Alumno 1 / Nombre del Alumno 2]`
- **Docente:** `[Nombre del Profesor / Docente]`
