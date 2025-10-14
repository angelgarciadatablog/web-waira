# Generador de Posters para Videos

Este proyecto incluye un sistema automatizado para generar posters (primer frame) de los videos del carrusel.

## ¿Por qué usar posters?

Los videos con el atributo `poster` muestran una imagen antes de reproducirse, mejorando la experiencia visual:
- ✅ El primer frame se muestra inmediatamente
- ✅ Mejor experiencia de usuario
- ✅ Indicador visual claro del contenido del video
- ✅ Funciona consistentemente en todos los navegadores

## Requisitos

- **Node.js** (ya instalado en tu proyecto)
- **FFmpeg** - Para extraer frames de los videos
  - macOS: `brew install ffmpeg`
  - Ubuntu: `sudo apt install ffmpeg`
  - Windows: [Descargar desde ffmpeg.org](https://ffmpeg.org/download.html)

## Uso

### Cuando agregues o actualices videos:

1. **Coloca tus videos** en la carpeta `assets/video/`
   - Deben tener formato `.mp4`
   - Nombrarlos como: `video-1.mp4`, `video-2.mp4`, etc.

2. **Ejecuta el script**:
   ```bash
   ./generate-posters.sh
   ```

   O alternativamente:
   ```bash
   node generate-video-posters.js
   ```

3. **¡Listo!** Los posters se generarán automáticamente en:
   - `assets/img/video-posters/`
   - Con formato `.webp` (mejor compresión)

## ¿Qué hace el script?

1. Busca todos los archivos `.mp4` en `assets/video/`
2. Extrae el primer frame (a los 0.1 segundos)
3. Lo guarda como `.webp` en `assets/img/video-posters/`
4. Genera un nombre correspondiente (video-1.mp4 → video-1.webp)

## Estructura de archivos

```
web-waira/
├── assets/
│   ├── video/
│   │   ├── video-1.mp4
│   │   ├── video-2.mp4
│   │   └── ...
│   └── img/
│       └── video-posters/
│           ├── video-1.webp  ← Generado automáticamente
│           ├── video-2.webp  ← Generado automáticamente
│           └── ...
├── generate-video-posters.js  ← Script Node.js
└── generate-posters.sh        ← Script de shell (fácil ejecución)
```

## Configuración en HTML

Los videos ya están configurados con el atributo `poster`:

```html
<video muted playsinline preload="metadata" poster="assets/img/video-posters/video-1.webp">
  <source src="assets/video/video-1.mp4" type="video/mp4">
</video>
```

## Agregar nuevos videos

1. Agrega el video en `assets/video/` (ej: `video-9.mp4`)
2. Ejecuta: `./generate-posters.sh`
3. Agrega el HTML en `producto.html`:
   ```html
   <div class="video-thumb" data-video="assets/video/video-9.mp4">
     <video muted playsinline preload="metadata" poster="assets/img/video-posters/video-9.webp">
       <source src="assets/video/video-9.mp4" type="video/mp4">
     </video>
     <div class="video-play-icon">
       <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
         <path d="M8 5v14l11-7z"/>
       </svg>
     </div>
   </div>
   ```

## Solución de problemas

### Error: "FFmpeg no está instalado"
Instala FFmpeg según tu sistema operativo (ver Requisitos arriba).

### Los posters no se muestran
1. Verifica que los archivos existan en `assets/img/video-posters/`
2. Verifica que los nombres coincidan (video-1.mp4 → video-1.webp)
3. Limpia la caché del navegador

### Regenerar todos los posters
Simplemente ejecuta el script de nuevo. Los archivos existentes se sobrescribirán automáticamente.

## Personalización

Puedes modificar `generate-video-posters.js` para:
- Cambiar el formato de salida (jpg, png, etc.)
- Ajustar la calidad de la imagen
- Extraer el frame de un momento diferente
- Cambiar los nombres de archivo

---

**Creado**: 2025-10-14
**Última actualización**: 2025-10-14
