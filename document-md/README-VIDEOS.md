# Guía de Videos - WAIRA & DR

## 📁 Estructura de carpetas

Necesitas crear la siguiente estructura en tu proyecto:

```
web-waira/
├── assets/
│   └── video/
│       ├── video-1.mp4
│       ├── video-2.mp4
│       ├── video-3.mp4
│       ├── video-4.mp4
│       ├── video-5.mp4
│       ├── video-6.mp4
│       ├── video-7.mp4
│       └── video-8.mp4
```

## 📹 Especificaciones de los videos

### Formato recomendado:
- **Formato**: MP4 (H.264)
- **Orientación**: Vertical (9:16) - estilo Instagram/TikTok
- **Resolución recomendada**: 1080x1920 o 720x1280
- **Tamaño máximo por video**: 3-5 MB (máximo)
- **Duración**: 10-30 segundos
- **FPS**: 30 fps
- **Audio**: Opcional (el carrusel reproduce sin sonido por defecto)

### ¿Por qué estos límites?

GitHub Pages tiene un límite de 1GB para el repositorio completo. Con 8 videos de ~4MB cada uno, usarías aproximadamente 32MB, lo cual es aceptable.

## 🛠️ Cómo comprimir tus videos

### Opción 1: HandBrake (Gratis, interfaz gráfica)
1. Descarga HandBrake: https://handbrake.fr/
2. Abre tu video
3. Preset: "Fast 720p30"
4. Video Codec: H.264
5. Quality: RF 24-26
6. Exportar

### Opción 2: FFmpeg (Línea de comandos)
```bash
ffmpeg -i input.mp4 -vf "scale=720:1280" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 64k output.mp4
```

### Opción 3: Online (Cloudconvert, etc.)
- https://cloudconvert.com/mp4-converter
- Configurar: 720x1280, H.264, calidad media

## 📦 Pasos para agregar tus videos

1. **Crea la carpeta video**:
   ```bash
   mkdir -p assets/video
   ```

2. **Copia tus 8 videos** en la carpeta `assets/video/` con los nombres:
   - video-1.mp4
   - video-2.mp4
   - video-3.mp4
   - ... hasta video-8.mp4

3. **Haz commit y push**:
   ```bash
   git add assets/video/
   git commit -m "Agregar videos del carrusel"
   git push
   ```

## ✨ Características implementadas

- ✅ Carrusel horizontal con 8 videos en thumbnails verticales
- ✅ Preview al pasar el mouse sobre los thumbnails
- ✅ Click para abrir video en modal full-screen
- ✅ Navegación con flechas izquierda/derecha
- ✅ Paginación con puntos en el modal
- ✅ Soporte para teclado (ESC para cerrar, flechas para navegar)
- ✅ Responsive (se adapta a móvil)
- ✅ Scroll horizontal en thumbnails para móvil

## 🎨 Personalización

Si quieres cambiar el título "Descubre nuestros diseños", edita en `index.html` línea 73:
```html
<h2 class="video-section-title">Tu título aquí</h2>
```

## ⚠️ Nota importante

Mientras no agregues los videos reales, los thumbnails mostrarán el fondo color champagne. Una vez que subas los videos con los nombres correctos, se mostrarán automáticamente.

## 🔧 Troubleshooting

**Problema**: Los videos no se cargan
- Verifica que los nombres sean exactamente: `video-1.mp4`, `video-2.mp4`, etc.
- Verifica que estén en `assets/video/`
- Abre la consola del navegador (F12) y revisa si hay errores

**Problema**: Los videos son muy pesados
- Usa HandBrake o FFmpeg para comprimirlos
- Reduce la resolución a 720x1280
- Reduce la duración a menos de 30 segundos

**Problema**: El carrusel no funciona en móvil
- Haz hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
- Verifica que el JavaScript se haya cargado correctamente
