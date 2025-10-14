# 🎨 Guía de Migración - Nueva Estructura de Imágenes

## 📋 Resumen de Cambios

### ✅ **Lo que CAMBIÓ:**
- Las imágenes ahora se organizan por **carpetas** en lugar de archivos individuales
- Cada producto tiene su propia carpeta identificada por su **slug**
- Ya **NO necesitas** la columna `imagen` en Google Sheets
- La imagen `1.webp` (o .jpg/.png) es la de **portada** del catálogo
- Las imágenes `2-8` son la **galería adicional** en la página de producto

### 🎯 **Lo que NO cambió:**
- El Google Sheet sigue siendo la fuente de datos principal
- Los slugs se generan automáticamente (Nombre + Color en mayúsculas)
- El sistema de caché sigue funcionando igual
- La performance es la misma o mejor

---

## 📂 Nueva Estructura de Carpetas

### **Antes (sistema antiguo):**
```
assets/img/productos/
├── SONIA-ENCHAROLADO-NEGRO-2.webp
├── SONIA-ENCHAROLADO-NEGRO-3.webp
├── SANDALIA-BOHO-BEIGE-2.jpg
└── TACONES-ELEGANTES-ROJO-2.webp
```

### **Ahora (sistema nuevo):**
```
assets/img/productos/
├── SONIA-ENCHAROLADO-NEGRO/
│   ├── 1.webp  ← Imagen de portada (catálogo)
│   ├── 2.webp  ← Galería producto
│   ├── 3.webp
│   ├── 4.webp
│   ├── 5.webp
│   ├── 6.webp
│   └── 7.webp
├── SANDALIA-BOHO-BEIGE/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.webp
└── TACONES-ELEGANTES-ROJO/
    ├── 1.webp
    ├── 2.webp
    ├── 3.png
    └── 4.jpg
```

---

## 🔤 Cómo Calcular el SLUG de un Producto

El **slug** es el nombre de la carpeta y se calcula así:

### **Fórmula:**
```
SLUG = NOMBRE + "-" + COLOR (todo en MAYÚSCULAS, sin espacios, sin acentos)
```

### **Ejemplos:**

| Nombre en Sheet    | Color en Sheet | SLUG (nombre carpeta)        |
|--------------------|----------------|------------------------------|
| Sonia Encharolado  | Negro          | `SONIA-ENCHAROLADO-NEGRO`    |
| Sandalia Boho      | Beige          | `SANDALIA-BOHO-BEIGE`        |
| Tacones Elegantes  | Rojo           | `TACONES-ELEGANTES-ROJO`     |
| María              | Café           | `MARIA-CAFE`                 |
| Zuecos Minimalista | Natural        | `ZUECOS-MINIMALISTA-NATURAL` |

### **Reglas de normalización:**
- Los acentos se eliminan: `María` → `MARIA`
- Los espacios se convierten en guiones: `Sandalia Boho` → `SANDALIA-BOHO`
- Todo en mayúsculas
- Los caracteres especiales se eliminan

---

## 📸 Gestión de Imágenes

### **Imagen 1 (Portada):**
- **Dónde aparece:** Catálogo principal (index.html)
- **Requerido:** SÍ (si no existe, el producto no mostrará imagen)
- **Formatos aceptados:** `.webp`, `.jpg`, `.png`, `.jpeg`
- **Nombre:** `1.webp` (o .jpg, .png, .jpeg)
- **Recomendación:** Usar WebP para mejor rendimiento

### **Imágenes 2-8 (Galería):**
- **Dónde aparecen:** Página de detalle del producto (producto.html)
- **Requerido:** NO (opcional)
- **Formatos aceptados:** `.webp`, `.jpg`, `.png`, `.jpeg`
- **Nombres:** `2.webp`, `3.jpg`, `4.png`, etc.
- **Orden:** Se muestran en orden numérico (2, 3, 4...)

### **Características importantes:**
✅ **No importa el nombre** del archivo, solo el número
✅ **Puedes mezclar formatos** (ej: 1.webp, 2.jpg, 3.png)
✅ **No es necesario tener todas** las imágenes del 1-8
✅ El sistema **detecta automáticamente** cuántas imágenes hay

---

## 🚀 Proceso de Migración

### **Paso 1: Organizar imágenes existentes**

Si ya tienes imágenes con el formato antiguo:

```bash
# Ejemplo con el producto SONIA-ENCHAROLADO-NEGRO
cd assets/img/productos/

# Crear la carpeta del producto
mkdir SONIA-ENCHAROLADO-NEGRO

# Mover y renumerar las imágenes
# La imagen 2 antigua pasa a ser la 1 nueva (portada)
mv SONIA-ENCHAROLADO-NEGRO-2.webp SONIA-ENCHAROLADO-NEGRO/1.webp
mv SONIA-ENCHAROLADO-NEGRO-3.webp SONIA-ENCHAROLADO-NEGRO/2.webp
mv SONIA-ENCHAROLADO-NEGRO-4.webp SONIA-ENCHAROLADO-NEGRO/3.webp
mv SONIA-ENCHAROLADO-NEGRO-5.webp SONIA-ENCHAROLADO-NEGRO/4.webp
mv SONIA-ENCHAROLADO-NEGRO-6.webp SONIA-ENCHAROLADO-NEGRO/5.webp
mv SONIA-ENCHAROLADO-NEGRO-7.webp SONIA-ENCHAROLADO-NEGRO/6.webp
```

### **Paso 2: Limpiar Google Sheet (OPCIONAL)**

Puedes hacer cualquiera de estas opciones:

**Opción A - Borrar columna `imagen`** (Recomendado ✅)
1. Abre tu Google Sheet
2. Selecciona la columna `imagen`
3. Click derecho → "Eliminar columna"
4. Listo

**Opción B - Dejar columna vacía**
- El código simplemente la ignorará
- Útil si quieres mantener la estructura

**Opción C - No hacer nada**
- El código funcionará igual
- La columna será ignorada

### **Paso 3: Subir productos nuevos**

Para agregar un producto nuevo llamado "Sandalia Casual - Marrón":

1. **Agregar en Google Sheet:**
   ```
   nombre          | color   | talla | precio | cantidad | estado
   Sandalia Casual | Marrón  | 36    | 95.00  | 8        | DISPONIBLE
   Sandalia Casual | Marrón  | 37    | 95.00  | 5        | DISPONIBLE
   ```

2. **Calcular el slug:**
   - Nombre: "Sandalia Casual"
   - Color: "Marrón"
   - Slug: `SANDALIA-CASUAL-MARRON` (sin tilde)

3. **Crear carpeta y subir imágenes:**
   ```bash
   cd assets/img/productos/
   mkdir SANDALIA-CASUAL-MARRON

   # Copiar tus imágenes
   cp /ruta/imagen-principal.webp SANDALIA-CASUAL-MARRON/1.webp
   cp /ruta/detalle-1.jpg SANDALIA-CASUAL-MARRON/2.jpg
   cp /ruta/detalle-2.webp SANDALIA-CASUAL-MARRON/3.webp
   ```

4. **Verificar:**
   - Recargar la web
   - El producto aparecerá automáticamente

---

## 🔍 Solución de Problemas

### ❌ **Problema: El producto no muestra imagen en el catálogo**

**Causa:** No existe la imagen `1.webp` (o .jpg/.png) en la carpeta

**Solución:**
```bash
# Verificar que existe la carpeta
ls -la assets/img/productos/NOMBRE-PRODUCTO/

# Verificar que existe la imagen 1
ls -la assets/img/productos/NOMBRE-PRODUCTO/1.*

# Si no existe, crear/renombrar la primera imagen
mv assets/img/productos/NOMBRE-PRODUCTO/2.webp assets/img/productos/NOMBRE-PRODUCTO/1.webp
```

### ❌ **Problema: El slug no coincide**

**Causa:** Diferencias en mayúsculas, espacios o acentos

**Solución:**
1. Verifica el nombre exacto en Google Sheet
2. Calcula el slug siguiendo las reglas (mayúsculas, sin acentos, guiones en lugar de espacios)
3. Renombra la carpeta con el slug correcto

Ejemplo:
```bash
# Si el producto es "María - Café" pero la carpeta es "maria-cafe"
mv assets/img/productos/maria-cafe assets/img/productos/MARIA-CAFE
```

### ❌ **Problema: Las imágenes 2-8 no aparecen en la galería**

**Causa:** Imágenes mal numeradas o formato no soportado

**Solución:**
```bash
# Verificar nombres de archivos
ls -la assets/img/productos/NOMBRE-PRODUCTO/

# Deben ser: 1.webp, 2.webp, 3.jpg, etc.
# NO: imagen-1.webp, foto2.jpg, detalle_3.png
```

### 🔄 **Limpiar caché**

Si hiciste cambios pero no se ven:
1. Abre la web
2. Presiona el botón **"Actualizar catálogo"** en la página
3. O borra el caché del navegador (Ctrl+Shift+R / Cmd+Shift+R)

---

## 📝 Checklist de Migración

Para cada producto:

- [ ] Calcular el slug correcto (NOMBRE-COLOR en MAYÚSCULAS)
- [ ] Crear la carpeta: `assets/img/productos/SLUG/`
- [ ] Subir imagen de portada como `1.webp` (o .jpg/.png)
- [ ] Subir imágenes adicionales numeradas del 2 al 8
- [ ] Verificar que el producto esté en Google Sheet con el nombre y color correctos
- [ ] Probar en el navegador

---

## 🎯 Mejores Prácticas

### **Formato de imágenes:**
- ✅ **Recomendado:** WebP (mejor compresión)
- ✅ **Alternativo:** JPG para fotos, PNG para transparencias
- ⚠️ **Evitar:** Archivos muy pesados (>1MB)

### **Nombres de carpetas:**
- ✅ Siempre en MAYÚSCULAS
- ✅ Guiones en lugar de espacios
- ✅ Sin acentos ni caracteres especiales
- ❌ No uses: `María-Café` → Usa: `MARIA-CAFE`

### **Organización:**
- ✅ Mantén un orden lógico en las imágenes (frontal, lateral, detalle)
- ✅ La imagen 1 debe ser la más representativa
- ✅ Usa números consecutivos (1, 2, 3... no 1, 3, 5)

---

## 📞 Contacto y Soporte

Si tienes dudas o problemas:
1. Revisa esta guía completa
2. Verifica la consola del navegador (F12) para mensajes de error
3. Comprueba que los slugs coincidan exactamente

**Archivos modificados en esta actualización:**
- `producto.js` - Manejo de imágenes en página de producto
- `main.js` - Manejo de imágenes en catálogo principal
- Esta guía de migración

---

## 🎉 ¡Listo!

Con estos cambios, tu sistema de productos es:
- ✅ Más organizado y escalable
- ✅ Más fácil de mantener
- ✅ Independiente del Google Sheet para imágenes
- ✅ Más flexible con formatos de imagen

¡Disfruta de tu nuevo sistema! 🚀
