# WAIRA & DR - Catálogo Web

> Sitio web de catálogo para calzado femenino WAIRA & DR, alojado en GitHub Pages con dominio personalizado.

## 📋 Información del Repositorio

- **Repositorio:** `angelgarciadatablog/web-waira`
- **Visibilidad:** 🔒 Privado (GitHub Pro)
- **Sitio web:** [www.wairadr.com](https://www.wairadr.com/)
- **GitHub Pages:** Activo (branch `main`)
- **Dominio custom:** `www.wairadr.com`
- **HTTPS:** Forzado ✅

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript Vanilla (ES6+)
- **Hosting:** GitHub Pages (con repositorio privado)
- **CDN:** GitHub.com
- **Fuente de datos:** Google Sheets (vía CSV público)
- **Analytics:** Google Tag Manager (GTM) + Google Analytics 4 (GA4)

### Estructura de Archivos

```
web-waira/
├── index.html              # Página principal con catálogo
├── producto.html           # Página de detalle de producto
├── main.js                 # Lógica del catálogo principal
├── producto.js             # Lógica de página de producto
├── styles.css              # Estilos globales
├── CNAME                   # Configuración de dominio custom
├── .nojekyll              # Desactiva procesamiento Jekyll
│
├── assets/
│   ├── img/
│   │   ├── favicon/       # Favicons en múltiples resoluciones
│   │   ├── productos/     # Imágenes de productos (por SKU)
│   │   │   ├── [SKU]/
│   │   │   │   ├── 1.webp # Imagen principal
│   │   │   │   ├── 2.webp # Galería adicional
│   │   │   │   └── ...    # Hasta 10 imágenes por producto
│   │   ├── video-posters/ # Posters generados automáticamente
│   │   ├── hero-1.webp    # Imágenes del carrusel hero
│   │   ├── hero-2.webp
│   │   └── hero-3.webp
│   │
│   └── video/             # Videos para carrusel (formato MP4/WebM)
│
├── document-md/           # Documentación adicional
├── generate-video-posters.js  # Script Node.js para generar posters
├── generate-posters.sh    # Wrapper shell script
└── verificar_productos.sh # Script de verificación de productos

```

## 🗄️ Sistema de Datos y Caché

### Fuente de Datos: Google Sheets

**URL del CSV:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vRSdgxLG5bFq5l6RbmuAjeb0DSRxOrOMXBd-Ea35VmPHlcoGfpTqoKXBhTMO42C2sfDeXi90wwtwWbn/pub?gid=1176594951&single=true&output=csv
```

**Columnas del CSV:**
- `sku` - Identificador único del producto (nombre-color)
- `nombre` - Nombre del modelo
- `color` - Color del producto (en mayúsculas)
- `modelo` - Código de modelo
- `tipo` - Tipo/categoría del producto
- `talla` - Talla numérica
- `taco_cm` - Altura del taco en centímetros
- `precio` - Precio normal
- `precio_sale` - Precio en oferta (opcional)
- `cantidad` - Stock disponible
- `estado` - Estado: DISPONIBLE, AGOTADO, OCULTO
- `descripcion` - Descripción del producto (opcional)

### Sistema de Caché (localStorage)

**⚡ Caché inteligente de 3 minutos**

El sitio implementa un sistema de caché en localStorage para optimizar la carga:

```javascript
// Configuración
const CACHE_KEY = 'waira_catalog_cache';
const CACHE_TIME = 3 * 60 * 1000; // 3 minutos
```

**Funcionamiento:**

1. **Primera carga:** Descarga CSV desde Google Sheets y lo guarda en localStorage con timestamp
2. **Cargas subsecuentes:** Usa caché si tiene menos de 3 minutos de antigüedad
3. **Caché expirado:** Descarga datos frescos automáticamente
4. **Fallback:** Si hay error de red, usa caché antiguo como respaldo

**Mensajes en consola:**
```
✅ Usando caché (válido por 142s más)   # Caché válido
⏰ Caché expirado, descargando...        # Caché expirado
📡 Descargando catálogo desde Google...  # Sin caché
💾 Datos guardados en caché              # Guardado exitoso
🔄 Usando caché antiguo como fallback    # Error de red
```

**Limpiar caché manualmente:**
```javascript
// Desde consola del navegador:
localStorage.removeItem('waira_catalog_cache');

// O usando el botón "Actualizar" (si está habilitado)
```

### Cache Busting para Imágenes

```javascript
// Versión global que cambia en cada carga
let CSV_VERSION = Date.now();

// URLs de imágenes incluyen versión
`assets/img/productos/${sku}/1.webp?v=${CSV_VERSION}`
```

## 🎨 Funcionamiento del Catálogo

### Página Principal (index.html)

**1. Carrusel Hero**
- 3 imágenes rotativas automáticas
- Navegación manual con flechas
- Indicadores visuales

**2. Sistema de Filtros**
- **Por nombre:** Dropdown dinámico con todos los modelos
- **Por color:** Dropdown con todos los colores disponibles
- **Por taco:** Filtro por altura de taco (en cm)
- **Solo disponibles:** Checkbox (actualmente comentado)

**3. Grid de Productos**
- Cards responsive (grid CSS)
- Imagen principal (1.webp)
- Nombre + Color
- Precio (con soporte para ofertas)
- Altura de taco
- Chips de tallas (disponibles en verde, agotadas en gris)
- Stock total informativo

**4. Agrupación Inteligente**

Los productos se agrupan por `SKU` (nombre-color):
```javascript
// Ejemplo: ARUMI-NEGRO
{
  sku: "ARUMI-NEGRO",
  nombre: "ARUMI",
  color: "NEGRO",
  tallasDisp: [35, 36, 37],    // Tallas disponibles
  tallasAgot: [38, 39],         // Tallas agotadas
  precio: 120.00,
  precioSale: 95.00,            // Precio en oferta (opcional)
  stockTotal: 12,
  disponible: true              // true si al menos 1 talla disponible
}
```

### Página de Producto (producto.html)

**URL:** `producto.html?p=SKU`

**Características:**

1. **Galería de Imágenes**
   - Imagen principal grande
   - Thumbnails clickeables (hasta 10 imágenes)
   - Lazy loading
   - Fallback automático si imagen no existe

2. **Información del Producto**
   - Título dinámico (nombre + color)
   - Precio con soporte para ofertas
   - Altura de taco
   - Tallas disponibles (con chips visuales)
   - Stock total
   - Descripción (si existe)

3. **Call-to-Action**
   - Botón de WhatsApp con mensaje pre-escrito
   - Número: +51 906 396 063
   - Formato del mensaje:
     ```
     Hola, estoy interesado en [PRODUCTO-COLOR].
     ¿Podrías confirmarme disponibilidad?
     ```

4. **Productos Similares**
   - Carrusel de 8 productos aleatorios
   - Excluye el producto actual
   - Diseño responsive

5. **SEO Dinámico**
   - Título de página dinámico: `"[Nombre Color] — WAIRA & DR"`
   - Meta tags actualizados

## 📊 Google Tag Manager y Analytics

### Configuración GTM

**Container ID:** `GTM-P3PKMRXD`

**Implementación:**
```javascript
// Head (sincrónico)
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-P3PKMRXD');</script>

// Body (noscript fallback)
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P3PKMRXD"></iframe></noscript>
```

### Eventos GA4 Implementados

#### 1. **view_item** (Vista de Producto)

Dispara automáticamente al cargar página de producto:

```javascript
dataLayer.push({
  event: 'view_item',
  page_title: document.title,           // Título dinámico
  page_location: window.location.href,
  ecommerce: {
    currency: 'PEN',
    value: 95.00,                       // Precio sale o precio normal
    items: [{
      item_id: 'ARUMI-NEGRO',
      item_name: 'ARUMI',
      item_brand: 'WAIRA & DR',
      item_category: 'Zapato',
      item_variant: 'NEGRO',
      price: 95.00,
      quantity: 1
    }]
  },
  // Datos adicionales personalizados
  product_sku: 'ARUMI-NEGRO',
  product_stock: 12,
  product_estado: 'DISPONIBLE'
})
```

#### 2. **begin_checkout** (Inicio de Checkout)

Dispara al hacer click en botones de WhatsApp:

```javascript
dataLayer.push({
  event: 'begin_checkout',
  ecommerce: {
    currency: 'PEN',
    value: 95.00,
    items: [{ /* mismo formato que view_item */ }]
  },
  button_location: 'product_detail_top' // o 'product_detail_bottom'
})
```

#### 3. **select_item** (Selección de Producto)

Dispara al hacer click en tarjeta de producto desde catálogo:

```javascript
// Data attributes en cada card
<a href="producto.html?p=ARUMI-NEGRO"
   data-sku="ARUMI-NEGRO"
   data-product-name="ARUMI"
   data-product-color="NEGRO"
   data-product-type="Zapato"
   ...>
```

### Variables Personalizadas Disponibles

Estas variables están disponibles en el dataLayer para usar en GTM:

- `product_sku` - SKU del producto
- `product_name` - Nombre del modelo
- `product_color` - Color
- `product_type` - Tipo/categoría
- `product_model` - Código de modelo
- `product_taco` - Altura de taco
- `product_precio` - Precio normal
- `product_precio_sale` - Precio en oferta
- `product_stock` - Stock total
- `product_estado` - Estado (DISPONIBLE/AGOTADO)
- `button_location` - Ubicación del botón clickeado

## 🛠️ Scripts Automatizados

### 1. generate-video-posters.js

**Propósito:** Genera automáticamente imágenes poster (primer frame) de todos los videos del carrusel.

**Requisitos:**
- Node.js
- FFmpeg instalado

**Uso:**
```bash
# Opción 1: Node directamente
node generate-video-posters.js

# Opción 2: Shell script
./generate-posters.sh

# Instalar FFmpeg (si no lo tienes)
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

**Qué hace:**
- Escanea `assets/video/` buscando archivos `.mp4` y `.webm`
- Extrae el primer frame de cada video
- Guarda posters en `assets/img/video-posters/` como WebP
- Optimiza para web (calidad 85%)

### 2. verificar_productos.sh

**Propósito:** Verificar integridad del catálogo de productos.

**Uso:**
```bash
./verificar_productos.sh
```

## 🚀 Despliegue y Configuración

### GitHub Pages

**Configuración actual:**
- **Source:** Deploy from branch `main`
- **Carpeta:** `/ (root)`
- **HTTPS:** Forzado ✅
- **Dominio custom:** `www.wairadr.com`

**Archivo CNAME:**
```
www.wairadr.com
```

**Archivo .nojekyll:**
```
(archivo vacío para desactivar procesamiento Jekyll)
```

### DNS Configuration

**Registros DNS requeridos:**
```
Tipo:  CNAME
Host:  www
Valor: angelgarciadatablog.github.io
TTL:   3600 (o automático)
```

### Workflow de Deployment

1. **Hacer cambios localmente**
2. **Commit y push:**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. **GitHub Pages auto-deploys** (1-2 minutos)
4. **Verificar en:** www.wairadr.com

## 📱 Optimizaciones Implementadas

### Performance

✅ **Lazy Loading de Imágenes**
```html
<img loading="lazy" ...>
```

✅ **Formato WebP** (imágenes 30% más livianas que JPG)

✅ **Caché localStorage** (reduce requests a Google Sheets)

✅ **Cache Busting Inteligente** (solo cuando sea necesario)

✅ **Minificación de CSS/JS** (considerar en futuro)

### SEO

✅ **Títulos Dinámicos** por página
✅ **Meta Descriptions**
✅ **Alt Tags** en todas las imágenes
✅ **URLs Semánticas** (producto.html?p=SKU)
✅ **Favicon** en múltiples resoluciones
✅ **HTTPS Forzado**

### UX/UI

✅ **Diseño Responsive** (mobile-first)
✅ **Estados Visuales** (disponible/agotado)
✅ **Feedback Visual** (loading states)
✅ **Fallbacks** (imágenes que no cargan)
✅ **Mensajes Informativos** (stock, precios)

## 🔧 Mantenimiento

### Actualizar Productos

**Opción 1: Google Sheets (Recomendado)**
1. Editar directamente en Google Sheets
2. Cambios visibles en máximo 3 minutos (tiempo de caché)
3. Forzar actualización: borrar caché en consola del navegador

**Opción 2: Imágenes de Productos**
1. Crear carpeta en `assets/img/productos/[SKU]/`
2. Agregar imágenes numeradas: `1.webp`, `2.webp`, etc. (hasta 10)
3. Commit y push a GitHub

### Monitorear Analytics

**Google Analytics 4:**
1. Ir a GA4 dashboard
2. Revisar eventos:
   - `view_item` - Vistas de producto
   - `begin_checkout` - Clicks en WhatsApp
   - `select_item` - Clicks en catálogo
3. Reportes de ecommerce disponibles

**Google Tag Manager:**
1. Ir a GTM dashboard
2. Preview Mode para debugging
3. Verificar que eventos disparen correctamente

### Limpiar Caché

**Método 1: Botón en el Footer (Recomendado)**

En el footer de la página hay un ícono de reloj ⏱️ al inicio del texto de copyright:

1. Hacer click en el ícono (gira 360°)
2. El caché se limpia automáticamente
3. La página se recarga con datos frescos

**Método 2: Consola del navegador**

```javascript
// En consola del navegador (F12)
localStorage.removeItem('waira_catalog_cache');
location.reload();
```

**Método 3: Esperar**

El caché expira automáticamente después de **3 minutos**.

## 📞 Configuración de WhatsApp

**Número actual:** +51 906 396 063

**Para cambiar número:**
1. Editar en `producto.js` líneas 10-11:
   ```javascript
   const WHATSAPP_NUMBER = "51906396063";
   const WHATSAPP_NUMBER_TEXT = "+51 906 396 063";
   ```
2. Commit y push

## 🔒 Seguridad y Privacidad

✅ **Repositorio Privado** - Código fuente protegido
✅ **Sitio Público** - www.wairadr.com accesible para todos
✅ **HTTPS Forzado** - Conexiones seguras
✅ **No hay datos sensibles** en el código
✅ **API Keys** - Solo GTM (diseñado para ser público)

## 🐛 Troubleshooting

### El catálogo no carga

1. Abrir consola del navegador (F12)
2. Buscar errores en rojo
3. Verificar que Google Sheets esté público
4. Verificar URL del CSV en `main.js` línea 2-3

### Imágenes no aparecen

1. Verificar estructura de carpetas: `assets/img/productos/[SKU]/1.webp`
2. Verificar que el nombre del SKU coincida (mayúsculas)
3. Verificar formato: solo WebP soportado
4. Revisar en consola si hay errores 404

### Caché no se actualiza

1. Esperar 3 minutos completos
2. O forzar limpieza:
   ```javascript
   localStorage.removeItem('waira_catalog_cache');
   ```

### GitHub Pages no actualiza

1. Verificar que el push fue exitoso
2. Ir a: Settings → Pages
3. Esperar 1-2 minutos
4. Hard refresh: Ctrl+Shift+R (Win) o Cmd+Shift+R (Mac)

## 📚 Recursos Adicionales

- [Google Sheets CSV API](https://support.google.com/docs/answer/183965)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Google Tag Manager](https://tagmanager.google.com/)
- [GA4 Ecommerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

---

## 📝 Notas de Desarrollo

**Última migración:** 2025-11-02
- Repositorio transferido de `wairadrshoes-maker` a `angelgarciadatablog`
- Configurado como privado con GitHub Pro
- DNS actualizado correctamente
- GitHub Pages funcionando con dominio custom

**Próximas mejoras sugeridas:**
- [ ] Implementar Service Worker para PWA
- [ ] Optimizar carga inicial con Critical CSS
- [ ] Agregar búsqueda por texto
- [ ] Implementar filtro de rango de precios
- [ ] Agregar sistema de favoritos (localStorage)
- [ ] Implementar zoom en imágenes de producto

---

**Desarrollado y mantenido por:** Angel García
**Última actualización:** 2025-11-02
