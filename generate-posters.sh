#!/bin/bash

# Script para generar posters de videos
# Este script ejecuta el generador de posters Node.js

echo "🎬 Generando posters para videos..."
echo ""

# Ejecutar el script Node.js
node generate-video-posters.js

# Capturar el código de salida
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Proceso completado exitosamente"
else
    echo "❌ Hubo algunos errores durante el proceso"
fi

exit $EXIT_CODE
