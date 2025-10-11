# 🎯 Ejemplo Práctico de Migración

## ✅ Migración Completada - Producto: SONIA ENCHAROLADO NEGRO

Ya hemos migrado tu primer producto como ejemplo. Aquí está el resultado:

### **Antes:**
```
assets/img/productos/
├── SONIA-ENCHAROLADO-NEGRO-2.webp
├── SONIA-ENCHAROLADO-NEGRO-3.webp
├── SONIA-ENCHAROLADO-NEGRO-4.webp
├── SONIA-ENCHAROLADO-NEGRO-5.webp
├── SONIA-ENCHAROLADO-NEGRO-6.webp
└── SONIA-ENCHAROLADO-NEGRO-7.webp
```

### **Ahora:**
```
assets/img/productos/
└── SONIA-ENCHAROLADO-NEGRO/
    ├── 1.webp  ← Portada (antes era la imagen -2)
    ├── 2.webp  ← Galería (antes era la imagen -3)
    ├── 3.webp  ← Galería (antes era la imagen -4)
    ├── 4.webp  ← Galería (antes era la imagen -5)
    ├── 5.webp  ← Galería (antes era la imagen -6)
    └── 6.webp  ← Galería (antes era la imagen -7)
```

---

## 📝 Cómo agregar un producto NUEVO

### **Ejemplo: Quieres agregar "Sandalia Boho - Beige"**

#### **Paso 1: Agregar al Google Sheet**

En tu hoja de cálculo, agrega estas filas:

| nombre        | color | talla | precio | cantidad | estado      | taco_cm | modelo | descripcion                    |
|---------------|-------|-------|--------|----------|-------------|---------|--------|--------------------------------|
| Sandalia Boho | Beige | 35    | 120.00 | 3        | DISPONIBLE  | 3       | SB2024 | Sandalia estilo boho cómoda    |
| Sandalia Boho | Beige | 36    | 120.00 | 5        | DISPONIBLE  | 3       | SB2024 | Sandalia estilo boho cómoda    |
| Sandalia Boho | Beige | 37    | 120.00 | 2        | DISPONIBLE  | 3       | SB2024 | Sandalia estilo boho cómoda    |
| Sandalia Boho | Beige | 38    | 120.00 | 0        | AGOTADO     | 3       | SB2024 | Sandalia estilo boho cómoda    |

**Nota:** Ya NO necesitas la columna `imagen`

#### **Paso 2: Calcular el slug**

```
Nombre: "Sandalia Boho"
Color:  "Beige"
Slug:   SANDALIA-BOHO-BEIGE
```

Fórmula: Todo en MAYÚSCULAS, espacios → guiones, sin acentos

#### **Paso 3: Crear carpeta y subir imágenes**

```bash
# Ir a la carpeta de productos
cd assets/img/productos/

# Crear carpeta con el slug
mkdir SANDALIA-BOHO-BEIGE

# Copiar tus imágenes (ajusta las rutas según donde estén tus archivos)
# IMPORTANTE: La primera debe ser la mejor foto (será la de portada)
cp ~/Downloads/sandalia-boho-frente.webp SANDALIA-BOHO-BEIGE/1.webp
cp ~/Downloads/sandalia-boho-lateral.jpg SANDALIA-BOHO-BEIGE/2.jpg
cp ~/Downloads/sandalia-boho-detalle.webp SANDALIA-BOHO-BEIGE/3.webp
cp ~/Downloads/sandalia-boho-suela.png SANDALIA-BOHO-BEIGE/4.png

# Verificar
ls -la SANDALIA-BOHO-BEIGE/
```

Resultado esperado:
```
SANDALIA-BOHO-BEIGE/
├── 1.webp  ← Foto frontal (aparecerá en catálogo)
├── 2.jpg   ← Foto lateral
├── 3.webp  ← Detalle
└── 4.png   ← Suela
```

#### **Paso 4: Verificar en la web**

1. Abre tu web: `index.html`
2. Presiona el botón "Actualizar catálogo" (o Ctrl+Shift+R)
3. Deberías ver el nuevo producto "Sandalia Boho-Beige"
4. Haz click en el producto para ver la galería completa

---

## 🎨 Diferentes Escenarios

### **Escenario 1: Producto con muchas variantes de color**

Si tienes "Tacones Elegantes" en 3 colores:

**En Google Sheet:**
```
nombre           | color  | talla | precio | cantidad | estado
Tacones Elegantes| Negro  | 35    | 150.00 | 2        | DISPONIBLE
Tacones Elegantes| Negro  | 36    | 150.00 | 5        | DISPONIBLE
Tacones Elegantes| Rojo   | 35    | 150.00 | 3        | DISPONIBLE
Tacones Elegantes| Rojo   | 36    | 150.00 | 1        | DISPONIBLE
Tacones Elegantes| Nude   | 35    | 150.00 | 4        | DISPONIBLE
```

**Carpetas de imágenes:**
```
assets/img/productos/
├── TACONES-ELEGANTES-NEGRO/
│   ├── 1.webp
│   ├── 2.webp
│   └── 3.webp
├── TACONES-ELEGANTES-ROJO/
│   ├── 1.webp
│   ├── 2.webp
│   └── 3.webp
└── TACONES-ELEGANTES-NUDE/
    ├── 1.webp
    └── 2.webp
```

Resultado: 3 productos diferentes en el catálogo

### **Escenario 2: Producto con solo 1 imagen**

```bash
mkdir ZUECO-MINIMALISTA-NATURAL
cp mi-imagen.webp ZUECO-MINIMALISTA-NATURAL/1.webp
```

✅ Funciona perfectamente
- Aparecerá en el catálogo
- En la página de producto mostrará solo esa imagen

### **Escenario 3: Producto con 8 imágenes (máximo)**

```bash
mkdir BOTA-CHELSEA-MARRON
# Copiar todas las imágenes
cp foto1.webp BOTA-CHELSEA-MARRON/1.webp
cp foto2.jpg BOTA-CHELSEA-MARRON/2.jpg
cp foto3.webp BOTA-CHELSEA-MARRON/3.webp
cp foto4.png BOTA-CHELSEA-MARRON/4.png
cp foto5.webp BOTA-CHELSEA-MARRON/5.webp
cp foto6.jpg BOTA-CHELSEA-MARRON/6.jpg
cp foto7.webp BOTA-CHELSEA-MARRON/7.webp
cp foto8.webp BOTA-CHELSEA-MARRON/8.webp
```

### **Escenario 4: Producto con nombre que tiene acentos**

**En Google Sheet:**
```
nombre | color | talla | precio | cantidad | estado
María  | Café  | 36    | 95.00  | 5        | DISPONIBLE
```

**Slug correcto:** `MARIA-CAFE` (sin tildes)

**Carpeta:**
```bash
mkdir MARIA-CAFE
cp imagen.webp MARIA-CAFE/1.webp
```

---

## 🛠️ Scripts de Ayuda

### **Script para calcular slug (en terminal):**

```bash
# Función para calcular slug
calcular_slug() {
    local nombre="$1"
    local color="$2"
    echo "${nombre} ${color}" | tr '[:lower:]' '[:upper:]' | \
        iconv -f utf-8 -t ascii//TRANSLIT | \
        sed 's/ /-/g' | sed 's/[^A-Z0-9-]//g'
}

# Uso:
calcular_slug "Sandalia Boho" "Beige"
# Output: SANDALIA-BOHO-BEIGE

calcular_slug "María" "Café"
# Output: MARIA-CAFE
```

### **Script para listar productos sin imágenes:**

```bash
# Ver qué productos del Sheet no tienen carpeta de imágenes
cd assets/img/productos/
ls -d */ | sed 's/\///'
```

---

## 📊 Checklist Rápido

Antes de subir un producto nuevo:

```
[ ] 1. Agregar producto en Google Sheet (con nombre y color exactos)
[ ] 2. Calcular el slug: NOMBRE-COLOR (mayúsculas, sin acentos)
[ ] 3. Crear carpeta: mkdir assets/img/productos/SLUG
[ ] 4. Copiar imagen principal como 1.webp
[ ] 5. Copiar imágenes adicionales como 2.webp, 3.jpg, etc.
[ ] 6. Verificar en navegador
[ ] 7. Probar en producto.html?p=SLUG
```

---

## 🎯 Tu Próxima Tarea

Para continuar con la migración de tus productos existentes:

1. **Lista todos tus productos** en Google Sheet
2. **Para cada producto**, crea su carpeta y sube imágenes
3. **Verifica** que cada producto aparece correctamente

¿Necesitas ayuda con algún producto específico? Usa los ejemplos de arriba como referencia.

---

## 💡 Consejos Pro

### **Optimización de imágenes:**
```bash
# Convertir JPG/PNG a WebP (mejor compresión)
# Necesitas tener instalado cwebp
cwebp -q 85 imagen.jpg -o imagen.webp
```

### **Renombrar múltiples archivos rápidamente:**
```bash
# Si tienes: foto_1.jpg, foto_2.jpg, foto_3.jpg
cd PRODUCTO/
mv foto_1.jpg 1.webp
mv foto_2.jpg 2.webp
mv foto_3.jpg 3.webp
```

### **Verificar que todas las carpetas tienen imagen 1:**
```bash
cd assets/img/productos/
for dir in */; do
    if [ ! -f "$dir/1.webp" ] && [ ! -f "$dir/1.jpg" ] && [ ! -f "$dir/1.png" ]; then
        echo "⚠️  Falta imagen 1 en: $dir"
    fi
done
```

¡Éxito con tu migración! 🚀
