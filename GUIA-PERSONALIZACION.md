# 📝 Guía de Personalización - WAIRA & DR

Esta guía te ayudará a modificar todos los textos, enlaces y configuraciones de tu sitio web.

---

## 📱 Redes Sociales

### Ubicación:
- **Archivo:** `index.html` (líneas 106-126)
- **Archivo:** `producto.html` (líneas 148-168)

### Cómo modificar:

```html
<!-- Instagram -->
<a href="https://www.instagram.com/TU_USUARIO" ...>
Cambia: TU_USUARIO por tu usuario de Instagram

<!-- LinkedIn -->
<a href="https://www.linkedin.com/company/TU_EMPRESA" ...>
Cambia: TU_EMPRESA por el nombre de tu empresa en LinkedIn

<!-- WhatsApp -->
<a href="https://wa.me/51962370684" ...>
Cambia: 51962370684 por tu número (código país + número sin espacios)

<!-- TikTok -->
<a href="https://www.tiktok.com/@TU_USUARIO" ...>
Cambia: @TU_USUARIO por tu usuario de TikTok
```

**⚠️ Importante:** Los cambios deben hacerse en **AMBOS archivos** (index.html y producto.html)

---

## 📞 Número de WhatsApp

### Hay 3 lugares donde aparece el número de WhatsApp:

#### 1. Botón "Chatea con nosotros" (Página Principal)
- **Archivo:** `index.html` (línea 94)
- **Formato:** `https://wa.me/51962370684?text=MENSAJE`

```html
<a href="https://wa.me/51962370684?text=Hola%2C%20tengo%20una%20consulta%20sobre%20sus%20productos">
```

**Cómo cambiar:**
- Reemplaza `51962370684` por tu número (código país + número, sin espacios ni +)
- Cambia el mensaje después de `?text=` (usa %20 para espacios, %2C para comas)

#### 2. Botón "Comprar por WhatsApp" (Página de Producto)
- **Archivo:** `producto.js` (líneas 10-11)

```javascript
const WHATSAPP_NUMBER = "51962370684"; // Formato: código país + número (sin espacios, sin +)
const WHATSAPP_NUMBER_TEXT = "+51 962 370 684"; // Formato para mostrar (legible)
```

#### 3. Ícono de WhatsApp en el Footer
- **Archivo:** `index.html` (línea 116)
- **Archivo:** `producto.html` (línea 158)

```html
<a href="https://wa.me/51962370684">
```

**⚠️ Importante:** Cambia el número en los **3 lugares** para mantener consistencia.

**Ejemplo para otro país:**
```javascript
// México
const WHATSAPP_NUMBER = "5215512345678";
const WHATSAPP_NUMBER_TEXT = "+52 1 55 1234 5678";

// Argentina
const WHATSAPP_NUMBER = "5491123456789";
const WHATSAPP_NUMBER_TEXT = "+54 9 11 2345 6789";
```

---

## 💬 Mensajes de WhatsApp

### Hay 2 mensajes diferentes:

#### 1. Botón "Chatea con nosotros" (Consulta General)
- **Archivo:** `index.html` (línea 94)
- **Mensaje actual:** "Hola, tengo una consulta sobre sus productos"

```html
<!-- Cambiar el texto después de ?text= -->
<a href="https://wa.me/51962370684?text=Hola%2C%20tengo%20una%20consulta%20sobre%20sus%20productos">

<!-- Ejemplos: -->
?text=Hola%2C%20quisiera%20información%20sobre%20sus%20productos
?text=Buenos%20días%2C%20tengo%20una%20pregunta
?text=Hola%20WAIRA%2C%20me%20gustaría%20hacer%20una%20consulta
```

**Tip:** Usa un [codificador de URL](https://www.urlencoder.org/) para convertir tu mensaje.

#### 2. Botón "Comprar por WhatsApp" (Página de Producto)
- **Archivo:** `producto.js` (línea 168)
- **Mensaje actual:** "Hola, estoy interesado en [PRODUCTO]. ¿Podrías confirmarme disponibilidad y precio?"

```javascript
// Mensaje actual
`Hola, estoy interesado en ${productName}. ¿Podrías confirmarme disponibilidad y precio?`

// Ejemplos de otros mensajes:
`Hola! Me interesa el modelo ${productName}. ¿Qué tallas tienes disponibles?`
`Buenos días, quiero comprar ${productName}. ¿Está disponible?`
`Hola WAIRA! Consulto por el ${productName}. ¿Podrías darme más información?`
```

**Nota:** La variable `${productName}` se reemplaza automáticamente por el nombre y color del producto.

---

## 🔘 Botones de Acción (Página Principal)

### Ubicación:
- **Archivo:** `index.html` (líneas 87-101)

### Botones actuales:

#### 1. Botón "Actualizar" (Secundario - Gris)
```html
<button id="refresh" class="btn-refresh btn-secondary">
  Actualizar
</button>
```
- **Función:** Limpia el caché y recarga los productos desde Google Sheets
- **Color:** Gris claro (discreto)
- **Tipo:** Botón HTML

#### 2. Botón "Chatea con nosotros" (Primario - Verde)
```html
<a href="https://wa.me/51962370684?text=Hola%2C%20tengo%20una%20consulta%20sobre%20sus%20productos"
   class="btn-refresh btn-primary">
  Chatea con nosotros
</a>
```
- **Función:** Abre WhatsApp con mensaje pre-escrito
- **Color:** Verde brand (destacado)
- **Tipo:** Enlace a WhatsApp

### Cómo personalizar:

#### Cambiar el texto del botón:
```html
<!-- Original -->
Chatea con nosotros

<!-- Ejemplos: -->
Contactar por WhatsApp
Consultar disponibilidad
Hacer una pregunta
Solicitar información
```

#### Cambiar el ícono:
Los botones usan íconos SVG. Para cambiarlos, reemplaza el código `<svg>...</svg>`.

Recursos de íconos gratuitos:
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)
- [Material Icons](https://fonts.google.com/icons)

#### Cambiar los colores:
**Archivo:** `styles.css` (líneas 325-347)

```css
/* Botón primario (verde) */
.btn-primary{
  background:var(--brand);  /* Cambiar a otro color */
  color:var(--brand-ink);
}

/* Botón secundario (gris) */
.btn-secondary{
  background:var(--bg);     /* Cambiar a otro color */
  color:var(--muted);
}
```

#### Agregar un tercer botón:
```html
<a href="TU_ENLACE" class="btn-refresh btn-primary">
  Tu texto aquí
</a>
```

#### Remover un botón:
Simplemente elimina el código HTML del botón que no quieres.

---

## 🎨 Carrusel de Portada

### Imágenes:
- **Ubicación:** `/assets/img/`
- **Nombres requeridos:**
  - `hero-1.jpg` (Primera imagen)
  - `hero-2.jpg` (Segunda imagen)
  - `hero-3.jpg` (Tercera imagen)

### Textos del Carrusel:
- **Archivo:** `index.html` (líneas 28-50)

```html
<!-- Slide 1 -->
<h1 class="carousel-title">Encuentra tu estilo</h1>
<p class="carousel-subtitle">Diseños únicos con estética cálida y confort excepcional</p>

<!-- Slide 2 -->
<h1 class="carousel-title">Elegancia minimalista</h1>
<p class="carousel-subtitle">Cada paso, una expresión de tu esencia</p>

<!-- Slide 3 -->
<h1 class="carousel-title">Confort sin límites</h1>
<p class="carousel-subtitle">Calidad artesanal en cada detalle</p>
```

### Velocidad del Carrusel:
- **Archivo:** `index.html` (línea 161)

```javascript
// Cambiar cada 5 segundos (actual)
let autoplayInterval = setInterval(nextSlide, 5000);

// Ejemplos:
let autoplayInterval = setInterval(nextSlide, 3000); // Cada 3 segundos
let autoplayInterval = setInterval(nextSlide, 7000); // Cada 7 segundos
```

---

## 🏷️ Títulos y Descripciones

### Página Principal (index.html)

#### Título del navegador:
```html
<title>WAIRA & DR — Calzado Femenino Minimalista</title>
```

#### Meta descripción (para SEO):
```html
<meta name="description" content="Calzado femenino minimalista con estética cálida. Descubre modelos por nombre y color, tallas disponibles y stock consolidado.">
```

#### Nombre de la marca (Header):
```html
<strong class="logo-large">WAIRA & DR</strong>
<p class="tagline">Calzado femenino minimalista</p>
```

### Página de Producto (producto.html)

#### Título del navegador:
```html
<title>Producto — WAIRA & DR</title>
```

#### Tagline en header:
```html
<strong class="logo-large">WAIRA & DR</strong>
<p class="tagline">Calzado femenino minimalista</p>
```

---

## 🚚 Información de Envíos

### Ubicación:
- **Archivo:** `producto.html` (líneas 134-137)

### Cómo modificar:

```html
<ul class="note" style="margin:6px 0 0 18px">
  <li>Lima Metropolitana: consultar tarifas (moto/envío programado).</li>
  <li>Provincias: Olva/Serpost/Los Andes según destino.</li>
  <li>Tiempo de preparación: 1–2 días hábiles.</li>
</ul>
```

**Ejemplo personalizado:**
```html
<ul class="note" style="margin:6px 0 0 18px">
  <li>Envío gratis en pedidos mayores a S/ 150.</li>
  <li>Lima: entrega en 24-48 horas.</li>
  <li>Provincias: 3-5 días hábiles.</li>
  <li>Recojo en tienda disponible (sin costo).</li>
</ul>
```

---

## 🎨 Colores de la Marca

### Ubicación:
- **Archivo:** `styles.css` (líneas 4-15)

### Paleta actual:

```css
:root{
  --brand:       #2E4A3B;  /* Verde bosque (color principal) */
  --brand-ink:   #F9F6F1;  /* Texto sobre brand */
  --sage:        #9FB7A5;  /* Salvia apoyo */
  --champagne:   #E7D9C6;  /* Neutro cálido para superficies */
  --bg:          #F9F6F1;  /* Fondo general */
  --surface:     #FFFFFF;  /* Tarjetas blancas */
  --ink:         #1A1A1A;  /* Texto principal */
  --muted:       #5E6A65;  /* Texto secundario */
  --line:        #E8E2D8;  /* Líneas y bordes suaves */
  --shadow:      0 1px 1px rgba(0,0,0,.03), 0 6px 20px rgba(0,0,0,.06);
}
```

### Cómo cambiar el color principal:

```css
/* Ejemplo: Cambiar a azul */
--brand: #1E3A5F;  /* Azul oscuro */

/* Ejemplo: Cambiar a terracota */
--brand: #B8572A;  /* Terracota */

/* Ejemplo: Cambiar a negro minimalista */
--brand: #1A1A1A;  /* Negro */
```

**⚠️ Nota:** Al cambiar `--brand`, el color se aplicará automáticamente a:
- Botones
- Hover de tarjetas
- Iconos de redes sociales al hacer hover
- Elementos interactivos

---

## 📊 Google Sheets (Catálogo de Productos)

### Ubicación del enlace:
- **Archivo:** `main.js` (líneas 2-3)
- **Archivo:** `producto.js` (líneas 2-3)

### Cómo obtener tu URL de Google Sheets:

1. Abre tu Google Sheet
2. Ve a **Archivo → Compartir → Publicar en la web**
3. Selecciona la pestaña que quieres publicar
4. Formato: **CSV**
5. Copia la URL generada
6. Pégala en ambos archivos:

```javascript
const SHEET_CSV_BASE = "TU_URL_AQUI";
```

### Estructura del Google Sheet:

Tu hoja debe tener estas columnas (en este orden):

| nombre | color | modelo | talla | precio | cantidad | taco_cm | estado | imagen | descripcion |
|--------|-------|--------|-------|--------|----------|---------|--------|--------|-------------|
| DIANA | GUINDA | D-001 | 36 | 150 | 5 | 3 | DISPONIBLE | https://... | Sandalia elegante... |

**Valores válidos para `estado`:**
- `DISPONIBLE` - Se muestra como disponible
- `AGOTADO` - Se muestra como agotado
- `NO_FABRICADO` - NO se muestra en el catálogo

---

## ⏱️ Caché del Catálogo

### Ubicación:
- **Archivo:** `main.js` (línea 89)
- **Archivo:** `producto.js` (línea 69)

### Tiempo actual: 3 minutos

```javascript
const CACHE_TIME = 3 * 60 * 1000; // 3 minutos en milisegundos
```

### Cómo cambiar:

```javascript
// 1 minuto
const CACHE_TIME = 1 * 60 * 1000;

// 5 minutos
const CACHE_TIME = 5 * 60 * 1000;

// 10 minutos
const CACHE_TIME = 10 * 60 * 1000;
```

**⚠️ Importante:**
- Tiempo más corto = Más actualizaciones, más requests a Google Sheets
- Tiempo más largo = Menos actualizaciones, pero más rápido y menos requests

---

## 🔧 Otros Ajustes Comunes

### Cambiar el Copyright en el Footer:

**Archivo:** `index.html` (línea 129) y `producto.html` (línea 171)

```html
<p class="footer-text">&copy; <span id="year"></span> WAIRA & DR. Todos los derechos reservados.</p>

<!-- Cambiar a: -->
<p class="footer-text">&copy; <span id="year"></span> TU MARCA. Todos los derechos reservados.</p>
```

### Cambiar Tipografías:

**Archivo:** `index.html` y `producto.html` (línea 11)

```html
<!-- Actual: Cormorant Garamond + Inter -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Ejemplo: Playfair Display + Open Sans -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Luego en `styles.css` (líneas 29 y 24):

```css
/* Títulos */
font-family:"Playfair Display", Georgia, serif;

/* Texto general */
font-family:"Open Sans", system-ui, sans-serif;
```

---

## 📝 Lista de Verificación

Usa esta lista para asegurarte de que personalizaste todo:

### Contacto y Redes:
- [ ] Redes sociales actualizadas en footer (Instagram, LinkedIn, WhatsApp, TikTok)
- [ ] Número de WhatsApp en 3 lugares (botón "Chatea con nosotros", botón de compra, footer)
- [ ] Mensaje del botón "Chatea con nosotros" personalizado
- [ ] Mensaje del botón "Comprar por WhatsApp" personalizado

### Contenido Visual:
- [ ] Imágenes del carrusel agregadas (hero-1.jpg, hero-2.jpg, hero-3.jpg)
- [ ] Textos del carrusel modificados (títulos y subtítulos)
- [ ] Títulos de página actualizados (index.html y producto.html)
- [ ] Tagline del header personalizado

### Información de Negocio:
- [ ] Información de envíos personalizada
- [ ] URL de Google Sheets configurada (main.js y producto.js)
- [ ] Copyright actualizado con tu marca

### Opcionales:
- [ ] Colores de marca ajustados
- [ ] Tiempo de caché modificado (si es necesario)
- [ ] Velocidad del carrusel ajustada
- [ ] Tipografías cambiadas

---

## 🆘 Ayuda

Si tienes dudas o problemas:

1. Revisa que no haya errores de sintaxis (comillas, punto y coma, etc.)
2. Asegúrate de guardar los archivos después de editarlos
3. Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
4. Usa la consola del navegador (F12) para ver errores

**Buenas prácticas:**
- Haz una copia de respaldo antes de editar
- Edita un archivo a la vez y prueba los cambios
- Usa las mismas comillas (" o ') que encuentres en el código
- Mantén la misma indentación (espacios/tabs)

---

✨ **¡Listo!** Con esta guía puedes personalizar completamente tu sitio web.
