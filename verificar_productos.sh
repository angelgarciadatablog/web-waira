#!/bin/bash

# Script para verificar el estado de las imágenes de productos
# Uso: ./verificar_productos.sh

echo "🔍 VERIFICACIÓN DE PRODUCTOS - WAIRA & DR"
echo "=========================================="
echo ""

cd "$(dirname "$0")/assets/img/productos" || exit 1

total=0
con_imagenes=0
sin_imagenes=0

echo "📊 Estado detallado:"
echo ""

for dir in */; do
    name=${dir%/}
    total=$((total + 1))

    # Contar imágenes
    count=$(find "$dir" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) 2>/dev/null | wc -l | xargs)

    # Verificar si tiene imagen 1 (portada)
    portada=""
    if [ -f "$dir/1.webp" ] || [ -f "$dir/1.jpg" ] || [ -f "$dir/1.png" ] || [ -f "$dir/1.jpeg" ]; then
        portada="✅"
        con_imagenes=$((con_imagenes + 1))
    else
        portada="❌"
        sin_imagenes=$((sin_imagenes + 1))
    fi

    if [ "$count" -gt 0 ]; then
        echo "  $portada $name: $count imagen(es)"
        # Mostrar qué imágenes tiene
        imgs=$(ls "$dir" 2>/dev/null | grep -E '\.(webp|jpg|png|jpeg)$' | sort -V | tr '\n' ', ' | sed 's/,$//')
        echo "      └─ Archivos: $imgs"
    else
        echo "  $portada $name: Sin imágenes ⚠️  NECESITA SUBIR"
    fi
    echo ""
done

echo "=========================================="
echo "📈 RESUMEN"
echo "=========================================="
echo ""
echo "  Total de productos:      $total"
echo "  ✅ Con imagen portada:   $con_imagenes"
echo "  ❌ Sin imagen portada:   $sin_imagenes"
echo ""

if [ "$sin_imagenes" -gt 0 ]; then
    echo "⚠️  Productos que necesitan imagen de portada (1.webp):"
    echo ""
    for dir in */; do
        name=${dir%/}
        if [ ! -f "$dir/1.webp" ] && [ ! -f "$dir/1.jpg" ] && [ ! -f "$dir/1.png" ] && [ ! -f "$dir/1.jpeg" ]; then
            echo "     • $name"
        fi
    done
    echo ""
fi

echo "=========================================="
echo ""
echo "💡 Tip: Los productos necesitan al menos la imagen '1' para"
echo "   aparecer en el catálogo principal (index.html)"
echo ""
echo "📝 Para subir imágenes:"
echo "   cp tu-imagen.jpg assets/img/productos/PRODUCTO/1.jpg"
echo ""
