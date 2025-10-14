# Guía de Imágenes de Productos - WAIRA & DR

## 📁 Estructura de carpetas

Las imágenes de productos se almacenan en:
```
web-waira/
├── assets/
│   └── img/
│       └── productos/
│           ├── MAYA-NEGRO-2.jpg
│           ├── MAYA-NEGRO-3.jpg
│           ├── MAYA-NEGRO-4.jpg
│           ├── LUNA-BEIGE-2.jpg
│           ├── LUNA-BEIGE-3.jpg
│           └── ...
```

## 🎯 Convención de nombres

### Formato:
```
{NOMBRE}-{COLOR}-{NUMERO}.jpg
```

### Reglas importantes:

1. **NOMBRE y COLOR en MAYÚSCULAS** (igual que en Google Sheets)
2. **Sin espacios** - usa guiones (-)
3. **Sin tildes ni caracteres especiales**
4. **Numeración**: del 2 al 8
   - Imagen 1: viene de Google Sheets (columna "imagen")
   - Imágenes 2-8: se cargan desde `assets/img/productos/`

### Ejemplos:

#### Producto: Maya - Negro
```
Google Sheet (imagen principal):
https://tu-url.com/maya-negro-1.jpg

Imágenes locales:
assets/img/productos/MAYA-NEGRO-2.jpg
assets/img/productos/MAYA-NEGRO-3.jpg
assets/img/productos/MAYA-NEGRO-4.jpg
assets/img/productos/MAYA-NEGRO-5.jpg
```

#### Producto: Luna - Beige
```
Google Sheet (imagen principal):
https://tu-url.com/luna-beige-1.jpg

Imágenes locales:
assets/img/productos/LUNA-BEIGE-2.jpg
assets/img/productos/LUNA-BEIGE-3.jpg
```

#### Producto: Sol - Café Oscuro
```
Google Sheet (imagen principal):
https://tu-url.com/sol-cafe-oscuro-1.jpg

Imágenes locales:
assets/img/productos/SOL-CAFE-OSCURO-2.jpg
assets/img/productos/SOL-CAFE-OSCURO-3.jpg
assets/img/productos/SOL-CAFE-OSCURO-4.jpg
```

## 🔍 Cómo saber el nombre exacto del archivo

1. Abre tu producto en el navegador (ej: `producto.html?p=MAYA-NEGRO`)
2. Observa la URL, el parámetro `p=` es exactamente el nombre base
3. Usa ese nombre + número para tus imágenes

**Ejemplo:**
- URL: `producto.html?p=MAYA-NEGRO`
- Archivos: `MAYA-NEGRO-2.jpg`, `MAYA-NEGRO-3.jpg`, etc.

## 📸 Especificaciones de las imágenes

### Formato recomendado:
- **Formato**: JPG (o PNG si necesitas transparencia)
- **Tamaño**: Máximo 500KB por imagen
- **Dimensiones**: 1200x1200 px (cuadrado) o 1200x1600 px (vertical)
- **Calidad**: 80-85% en JPG
- **Nombre**: Sin espacios, solo letras, números y guiones

## 🚀 Cómo agregar imágenes a un producto

### Paso 1: Identifica el slug del producto
El slug se genera automáticamente a partir del nombre y color:
- "Maya Negro" → `MAYA-NEGRO`
- "Luna Beige" → `LUNA-BEIGE`
- "Sol Café Oscuro" → `SOL-CAFE-OSCURO`

### Paso 2: Nombra tus archivos
```bash
# Ejemplo para producto "Maya Negro" con 5 imágenes
MAYA-NEGRO-2.jpg  # Segunda imagen
MAYA-NEGRO-3.jpg  # Tercera imagen
MAYA-NEGRO-4.jpg  # Cuarta imagen
MAYA-NEGRO-5.jpg  # Quinta imagen
```

### Paso 3: Copia los archivos
```bash
cp tus-imagenes/* assets/img/productos/
```

### Paso 4: Verifica
Abre el producto en el navegador y verifica que todas las imágenes aparezcan en los thumbnails.

## ⚙️ Cómo funciona

1. **Imagen principal**: Se carga desde la URL en Google Sheets
2. **Imágenes adicionales**: El sistema busca automáticamente archivos del 2 al 8:
   - `{SLUG}-2.jpg`
   - `{SLUG}-3.jpg`
   - `{SLUG}-4.jpg`
   - ... hasta `{SLUG}-8.jpg`
3. Si una imagen no existe, el sistema deja de buscar
4. Todas las imágenes se muestran como thumbnails clickeables

## 💡 Ventajas de este sistema

✅ **Más rápido**: Las imágenes locales cargan instantáneamente
✅ **Menos dependencia**: No dependes 100% de Google Sheets
✅ **Fácil actualización**: Solo copia archivos a la carpeta
✅ **SEO friendly**: URLs limpias y estables
✅ **Flexible**: Puedes tener 1-8 imágenes por producto

## 🔧 Troubleshooting

**Problema**: Las imágenes no se cargan
- ✓ Verifica que el nombre del archivo sea EXACTAMENTE igual al slug + número
- ✓ Verifica que uses MAYÚSCULAS
- ✓ Verifica que la extensión sea `.jpg` (minúsculas)
- ✓ Verifica que el archivo esté en `assets/img/productos/`
- ✓ Haz hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

**Problema**: Solo aparece la imagen 1
- ✓ Verifica que las imágenes empiecen desde `-2.jpg` (no `-1.jpg`)
- ✓ La imagen 1 viene de Google Sheets

**Problema**: No aparecen todas las imágenes
- ✓ Las imágenes deben ser secuenciales (2,3,4...) sin saltos
- ✓ Si falta `-3.jpg`, el sistema no buscará `-4.jpg`, `-5.jpg`, etc.

## 📝 Ejemplo completo

### Google Sheets:
| nombre | color | talla | precio | imagen | estado |
|--------|-------|-------|--------|--------|--------|
| Maya | Negro | 35 | 120 | https://ejemplo.com/maya-negro.jpg | DISPONIBLE |

### Archivos locales:
```
assets/img/productos/
├── MAYA-NEGRO-2.jpg
├── MAYA-NEGRO-3.jpg
├── MAYA-NEGRO-4.jpg
└── MAYA-NEGRO-5.jpg
```

### Resultado:
El producto "Maya Negro" tendrá 5 imágenes:
1. https://ejemplo.com/maya-negro.jpg (desde Sheet)
2. MAYA-NEGRO-2.jpg (local)
3. MAYA-NEGRO-3.jpg (local)
4. MAYA-NEGRO-4.jpg (local)
5. MAYA-NEGRO-5.jpg (local)
