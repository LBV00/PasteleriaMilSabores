# 🍰 Pastelería Mil Sabores — Frontend SPA (Versión 3 con Gestión Integral)

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.18.4-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.5-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-205%20passed-brightgreen)](./test/)
[![Coverage](https://img.shields.io/badge/Coverage-88.67%25_Lines-brightgreen)](./coverage/index.html)
[![IVA Chile](https://img.shields.io/badge/IVA-19%25_Chile-blue)](#-3-gestión-de-impuestos-iva-chileno-del-19)
[![Institution](https://img.shields.io/badge/Duoc_UC-DSY1104-002B49)](https://www.duoc.cl/)

Aplicación web de comercio electrónico tipo **Single Page Application (SPA)** desarrollada con **React 19**, **Vite 6** y **Bootstrap 5**, diseñada bajo la metodología **Atomic Design**. Proyecto extendido para la gestión integral de repostería artesanal chilena con control de roles y acceso, sistema tributario de IVA chileno (19%), control estricto de inventario en tiempo real y emisión de comprobantes de compra detallados.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Gestión de Roles y Control de Acceso](#-1-gestión-de-roles-y-control-de-acceso)
3. [Sistema de Impuestos: IVA Chileno del 19%](#-2-sistema-de-impuestos-iva-chileno-del-19)
4. [Control de Stock e Inventario](#-3-control-de-stock-e-inventario)
5. [Dashboard Administrativo](#-4-dashboard-administrativo)
6. [Emisión y Comprobante de Compra](#-5-emisión-y-comprobante-de-compra)
7. [Arquitectura y Atomic Design](#-6-arquitectura-y-atomic-design)
8. [Persistencia Local y Limitaciones de LocalStorage](#-7-persistencia-local-y-limitaciones-de-localstorage)
9. [Instalación y Puesta en Marcha](#-8-instalación-y-puesta-en-marcha)
10. [Pruebas Automatizadas (Vitest) y Cobertura (QA)](#-9-pruebas-automatizadas-vitest-y-cobertura-qa)
11. [Validación Final del Sistema](#-10-validación-final-del-sistema)

---

## 📖 Descripción General

**Pastelería Mil Sabores** combina la tradición pastelera chilena (tortas de milhojas, empolvados, alfajores de maicena, brazos de reina) con repostería fina contemporánea (cheesecakes, tiramisú, cupcakes).

Esta versión incorpora tres módulos estratégicos:
1. **Roles y redirección inteligente:** Redirección automática post-login (`admin` hacia `/admin`, `cliente` hacia `/`), protección reforzada de rutas mediante `<RutaProtegida>` y eliminación total del estado de sesión al salir.
2. **Sistema tributario chileno (IVA 19%):** Modelo de precios finales con IVA incluido, cálculo de Neto e IVA mediante precisión decimal y redondeo a pesos chilenos (CLP), desglose en Carrito, Checkout y Comprobante de Venta con soporte de impresión.
3. **Control de stock e inventario:** Monitoreo de disponibilidad por producto, prevención de compras sobre el límite o con stock cero, descuento atómico tras pedidos confirmados y administración interactiva de stock desde el panel de control.

---

## 🔐 1. Gestión de Roles y Control de Acceso

### 1.1. Credenciales de Demostración

Para facilitar la evaluación y auditoría académica sin necesidad de registrar cuentas manualmente, el sistema cuenta con dos usuarios predeterminados:

| Rol | Correo Electrónico | Contraseña | Destino tras Login | Acceso Permitido |
| :--- | :--- | :--- | :---: | :--- |
| **Administrador** | `admin@pasteleria.cl` | `admin123` | `/admin` | Dashboard completo, Inventario, Catálogo, Pedidos e Impuestos. |
| **Cliente** | `cliente@pasteleria.cl` | `cliente123` | `/` | Catálogo de productos, Carrito, Checkout y Comprobantes. |

> *Nota:* Cualquier usuario nuevo registrado a través de `/registro` se crea automáticamente con el rol `cliente`.

### 1.2. Redirección Automática Post-Login
- **Flujo Administrador:** Al ingresar credenciales de administrador, el sistema valida la identidad, almacena la sesión en `milSabores_sesion` y navega automáticamente a `/admin`.
- **Flujo Cliente:** Al autenticarse como cliente, el sistema valida las credenciales y redirige a la página principal `/`, manteniendo activo el carrito y el flujo de compra.

### 1.3. Protección de Rutas (`RutaProtegida.jsx`)
- Si un usuario no autenticado intenta ingresar a `/admin`, es redirigido a `/login`.
- Si un usuario con rol `cliente` intenta ingresar a `/admin`, es interceptado y redirigido a `/`.
- Al hacer clic en **Cerrar sesión** (desde el Navbar o desde el Dashboard), se purga la clave `milSabores_sesion` en `localStorage` y se redirige a `/`, imposibilitando volver a entrar utilizando botones de historial del navegador.

---

## 💰 2. Sistema de Impuestos: IVA Chileno del 19%

### 2.1. Regla de Negocio: Precios con IVA Incluido
En cumplimiento con la normativa comercial y tributaria de Chile, **los precios publicados en el catálogo corresponden al precio final que paga el consumidor**, el cual ya incluye el 19% de IVA. El sistema no recarga un 19% adicional, evitando la doble tributación.

### 2.2. Fórmulas de Cálculo Aplicadas
Implementadas centralizadamente en [`src/services/impuestosService.js`](file:///src/services/impuestosService.js):

$$\text{Precio Neto} = \text{Math.round}\left(\frac{\text{Total}}{1 + \text{Tasa IVA}}\right) = \text{Math.round}\left(\frac{\text{Total}}{1.19}\right)$$

$$\text{IVA (19\%)} = \text{Total} - \text{Precio Neto}$$

$$\text{Total Final} = \text{Precio Neto} + \text{IVA}$$

#### Ejemplo práctico:
- Si un producto cuesta **\$11.900**:
  - $\text{Neto} = \text{Math.round}(11900 / 1.19) = \$10.000$
  - $\text{IVA (19\%)} = 11900 - 10000 = \$1.900$
  - $\text{Total a Pagar} = \$11.900$
- Si un producto cuesta **\$15.990**:
  - $\text{Neto} = \text{Math.round}(15990 / 1.19) = \$13.437$
  - $\text{IVA (19\%)} = 15990 - 13437 = \$2.553$
  - $\text{Total a Pagar} = \$15.990$

### 2.3. Puntos de Despliegue del Desglose
1. **Carrito de Compras (`CartSummary.jsx`):** Muestra Cantidad total, Subtotal (IVA incl.), Precio Neto, IVA del 19% y Total final.
2. **Checkout (`Checkout.jsx`):** Antes de confirmar, resume los productos, cantidades, subtotales, Monto Neto, IVA del 19% y Total a pagar.
3. **Comprobante de Compra (`CompraExitosa.jsx`):** Desglosa formalmente el Monto Neto, IVA del 19% y Total pagado.
4. **Dashboard Administrativo (`Admin.jsx`):** Consolida en la pestaña de ventas el IVA 19% total acumulado por todas las ventas.

---

## 📦 3. Control de Stock e Inventario

### 3.1. Modelo de Datos de Producto
Cada ítem dispone de la propiedad `stock` que representa las unidades físicas disponibles:
```javascript
{
  id: 1,
  nombre: "Torta de chocolate",
  categoria: "Tortas",
  precio: 15990,
  stock: 15,
  enOferta: false,
  descripcion: "...",
  imagen: "/images/productos/torta-chocolate.jpg"
}
```

### 3.2. Estrategia de Inicialización Compatible
Si el almacenamiento local contiene productos antiguos sin la propiedad `stock`, la función `normalizarProducto()` de [`src/services/productosService.js`](file:///src/services/productosService.js) detecta la ausencia y asigna valores demostrativos de respaldo (10 unidades o el stock base del catálogo) sin sobreescribir datos preexistentes.

### 3.3. Indicadores Visuales de Disponibilidad
- 🟢 **Verde (`Disponible`):** Stock mayor a 5 unidades.
- 🟡 **Amarillo (`¡Últimas X unidades!`):** Stock entre 1 y 5 unidades.
- 🔴 **Rojo (`Agotado`):** Stock igual a 0 unidades. El botón *Agregar al carrito* se deshabilita automáticamente.

### 3.4. Validaciones en Carrito y Pedidos
- **Límite de unidades:** El cliente no puede agregar más unidades de las disponibles ni superar el stock mediante el control de cantidad (`QuantityControl`).
- **Cantidades inválidas:** Se rechazan valores menores a 1, decimales o negativos.
- **Validación atómica de Checkout:** Antes de emitir el pedido, `validarStockDisponible()` comprueba nuevamente el inventario en LocalStorage. Si el stock cambió o es insuficiente, la orden se rechaza y no se descuenta ningún producto.
- **Descuento tras éxito:** Solo cuando el pedido se guarda correctamente en `milSabores_pedidos`, se ejecuta `descontarStock()`, garantizando que el stock nunca sea negativo (`Math.max(0, stock - cantidad)`).

---

## 📊 4. Dashboard Administrativo

Accediendo con la cuenta de administrador a `/admin`:

1. **Encabezado y Perfil:** Identifica al administrador autenticado (`admin@pasteleria.cl`) y ofrece un botón de desconexión segura.
2. **Métricas en Tiempo Real:**
   - **Productos registrados:** Total de ítems en el catálogo.
   - **Stock bajo ($\le 5$ un.):** Conteo de productos que requieren reposición.
   - **Sin stock (Agotados):** Conteo de productos con stock en 0.
   - **Pedidos confirmados:** Total de órdenes formalizadas.
   - **Total ventas (CLP):** Facturación bruta acumulada.
   - **IVA 19% acumulado:** Impuesto total generado por las ventas.
3. **Pestañas de Navegación Lateral:**
   - 🍰 **Catálogo y Productos:** Formulario para agregar/editar productos (con precio, stock y ofertas), buscador predictivo y tabla de acciones (Editar y Eliminar).
   - 📊 **Control de Inventario:** Tabla de stock con filtros rápidos (*Todos*, *Disponibles*, *Stock bajo*, *Agotados*), botones de ajuste rápido (`-1`, `+1`, `+5`) y campo numérico para ingreso directo con botón *Guardar*.
   - 🧾 **Registro de Pedidos:** Tabla cronológica con id, fecha, datos del cliente, desglose de Neto, IVA, Total y estado.
   - 📈 **Ventas e IVA:** Tarjetas consolidadas de Neto, IVA y Total, junto al ranking de los 5 productos más vendidos.

---

## 🧾 5. Emisión y Comprobante de Compra

Al finalizar una compra exitosa en `/checkout`, el sistema redirige a `/compra-exitosa`, presentando el **Comprobante de Compra**:
- **Identificador único de pedido:** Código alfanumérico generado con marca de tiempo (ej. `PED-1741234567890-4821`).
- **Fecha y hora oficial:** Formato chileno legible.
- **Datos del comprador:** Nombre, email, teléfono, dirección, comuna, región e indicaciones de despacho.
- **Detalle de productos:** Lista de ítems con cantidad, precio unitario y subtotal.
- **Resumen comercial y tributario:** Subtotal con IVA incluido, Monto Neto, IVA del 19% chileno y Total pagado.
- **Opción de impresión:** Botón interactivo *Imprimir comprobante* que dispara `window.print()` con diseño optimizado para impresora o exportación a PDF.
- **Descargo de responsabilidad académico:** El comprobante aclara explícitamente su naturaleza simulada con fines educativos y formativos, sin atribuirse validez legal ante el Servicio de Impuestos Internos (SII).

---

## 🏛️ 6. Arquitectura y Atomic Design

El proyecto respeta la jerarquía de **Atomic Design** y desacopla la persistencia mediante la capa de servicios:

```
src/
├── components/
│   ├── atoms/         # Badge, Button, Input, Alert
│   ├── molecules/     # FormField, QuantityControl (con soporte prop max), SearchBar
│   ├── organisms/     # CartItem, CartSummary, Footer, Navbar, ProductCard, RutaProtegida
│   └── templates/     # AuthLayout, MainLayout, PageHeader
├── pages/             # 16 Vistas SPA (Home, Productos, DetalleProducto, Ofertas,
│                      # Categorías, Carrito, Checkout, CompraExitosa, Admin, etc.)
└── services/
    ├── blogService.js
    ├── carritoService.js     # Validaciones de cantidad y límites de stock
    ├── impuestosService.js   # Lógica centralizada de IVA 19% y formateo CLP
    ├── pedidosService.js     # Creación de pedidos, cálculo tributario y descuento de stock
    ├── productosService.js   # Catálogo de 28 productos, stock, ofertas y CRUD
    └── usuariosService.js    # Sesión, registro y credenciales demo
```

---

## 💾 7. Persistencia Local y Limitaciones de LocalStorage

### 7.1. Modelo de Almacenamiento
Todos los datos operan sobre la **Web Storage API** bajo claves prefijadas con `milSabores_*`:
- `milSabores_productos`: Catálogo maestro con stock y ofertas.
- `milSabores_usuarios`: Cuentas registradas.
- `milSabores_sesion`: Token/objeto del usuario logueado.
- `milSabores_carrito`: Artículos en el carrito de compras.
- `milSabores_pedidos`: Historial de compras con desglose de impuestos.
- `milSabores_ultimo_pedido`: Caché para comprobante inmediato.

### 7.2. Limitaciones Técnicas Documentadas
> [!WARNING]
> **Limitaciones de LocalStorage como mecanismo de persistencia:**
> 1. **Ámbito de cliente (Single-client):** Los datos se almacenan exclusivamente en el navegador local del usuario. No se sincronizan en tiempo real entre múltiples dispositivos o pestañas en modo incógnito.
> 2. **Seguridad y Cifrado:** LocalStorage no provee encriptación de datos en reposo ni sustituye una base de datos relacional segura (como PostgreSQL o MySQL) con autenticación basada en JWT / cookies HTTP-only.
> 3. **Concurrencia de Inventario:** En un entorno de producción real con miles de clientes concurrentes, la reserva de stock debe gestionarse con transacciones ACID / bloqueos pesimistas u optimistas en el backend para evitar condiciones de carrera (*race conditions*). En este prototipo académico, la validación se realiza de forma síncrona en el cliente antes de confirmar la orden.
> 4. **Capacidad de almacenamiento:** Está restringido por el navegador a un límite habitual de ~5 MB.

---

## 🚀 8. Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js 18 o superior (recomendado Node 20 o 22).
- npm o gestor compatible.

### Pasos
```powershell
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en Vite
npm run dev

# 3. La aplicación estará disponible en:
http://localhost:5173/
```

---

## 🧪 9. Pruebas Automatizadas (Vitest) y Cobertura (QA)

El proyecto cuenta con **205 pruebas unitarias automatizadas** distribuidas en **30 archivos de prueba**, ejecutadas con **Vitest 5.0.5** y reporte instrumentado por **@vitest/coverage-v8**.

### Comandos de Ejecución

```powershell
# Ejecutar todas las pruebas una vez (CI / Batch)
npm.cmd run test:run

# Ejecutar pruebas con reporte de cobertura en consola y HTML
npm.cmd run test:coverage

# Análisis estático de código (ESLint)
npm.cmd run lint

# Compilación de producción (Vite build)
npm.cmd run build
```

---

## 📋 10. Validación Final del Sistema

### Métricas de Cobertura de Código

| Métrica | Porcentaje Obtenido | Requisito Mínimo | Estado |
| :--- | :---: | :---: | :---: |
| **Líneas (`% Lines`)** | **88.67%** | 80.00% | ✅ **Aprobado (+8.67%)** |
| **Sentencias (`% Stmts`)** | **87.56%** | 80.00% | ✅ **Aprobado (+7.56%)** |
| **Ramas (`% Branch`)** | **84.00%** | 80.00% | ✅ **Aprobado (+4.00%)** |
| **Funciones (`% Funcs`)** | **88.93%** | 80.00% | ✅ **Aprobado (+8.93%)** |
| **Pruebas Totales** | **205 / 205 Pasadas** | 100% | ✅ **0 Fallos** |

### Resumen de Suite de Pruebas

- **Pruebas de roles y control de acceso:** `test/rolesYProteccion.spec.jsx`, `test/Login.spec.jsx`, `test/RutaProtegida.spec.jsx`, `test/usuariosService.spec.jsx`.
- **Pruebas de impuestos (IVA 19%):** `test/impuestosService.spec.jsx`, `test/comprobanteImpuestos.spec.jsx`, `test/pedidosService.spec.jsx`.
- **Pruebas de control de stock e inventario:** `test/stockInventario.spec.jsx`, `test/productosService.spec.jsx`, `test/carritoService.spec.jsx`.
- **Pruebas del dashboard administrativo:** `test/Admin.spec.jsx`, `test/AdminDashboardFeatures.spec.jsx`.
- **Pruebas de checkout y comprobante:** `test/Checkout.spec.jsx`, `test/CompraExitosa.spec.jsx`.

---

## 🎓 Información Académica

- **Institución:** Duoc UC
- **Carrera:** Ingeniería en Informática / Analista Programador
- **Asignatura:** Desarrollo Fullstack II (`DSY1104`)
- **Framework:** React 19 + Vite 6 + Bootstrap 5 + Vitest
