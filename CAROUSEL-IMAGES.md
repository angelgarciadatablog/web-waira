# Cómo agregar imágenes al carrusel

## Ubicación de las imágenes

Las imágenes del carrusel deben estar en la carpeta:
```
/assets/img/
```

## Nombres de archivos necesarios

El carrusel busca estas 3 imágenes:
- `hero-1.jpg` - Primera imagen (slide principal)
- `hero-2.jpg` - Segunda imagen
- `hero-3.jpg` - Tercera imagen

## Especificaciones recomendadas

### Tamaño óptimo:
- **Ancho:** 1920px
- **Alto:** 800-1000px
- **Formato:** JPG o WebP
- **Peso:** < 500KB (optimizado para web)

### Contenido:
- Imágenes horizontales (landscape)
- Espacio libre en la parte inferior para el texto overlay
- Alta calidad, bien iluminadas
- Que representen tu marca/productos

## Si no tienes imágenes aún

### Opción 1: Usar gradientes temporales
El carrusel ya tiene gradientes de respaldo que se mostrarán si las imágenes no existen.

### Opción 2: Usar imágenes de productos
Puedes usar tus mejores fotos de productos actuales:
1. Renombra 3 fotos de productos como `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`
2. Colócalas en `/assets/img/`

### Opción 3: Imágenes de stock temporales
Puedes usar imágenes gratuitas de:
- [Unsplash](https://unsplash.com) (busca: "shoes", "fashion", "minimalist")
- [Pexels](https://pexels.com)

## Editar textos del carrusel

Para cambiar los textos de cada slide, edita el archivo `index.html`:

```html
<!-- Slide 1 -->
<h1 class="carousel-title">Encuentra tu estilo</h1>
<p class="carousel-subtitle">Diseños únicos con estética cálida...</p>

<!-- Slide 2 -->
<h1 class="carousel-title">Elegancia minimalista</h1>
<p class="carousel-subtitle">Cada paso, una expresión...</p>

<!-- Slide 3 -->
<h1 class="carousel-title">Confort sin límites</h1>
<p class="carousel-subtitle">Calidad artesanal...</p>
```

## Características del carrusel

✅ **Auto-play:** Cambia cada 5 segundos automáticamente
✅ **Navegación:** Flechas izquierda/derecha
✅ **Indicadores:** Puntos en la parte inferior
✅ **Swipe móvil:** Desliza con el dedo en móviles
✅ **Pausa en hover:** Se detiene cuando pasas el mouse
✅ **Responsive:** Se adapta a todos los tamaños de pantalla
