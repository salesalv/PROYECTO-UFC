#!/bin/bash

# Script para copiar archivos de video después del build
echo "Copiando archivos de video a dist..."

# Copiar pelea.mp4 si existe
if [ -f "public/pelea.mp4" ]; then
    cp "public/pelea.mp4" "dist/pelea.mp4"
    echo "✓ pelea.mp4 copiado a dist/"
else
    echo "⚠ pelea.mp4 no encontrado en public/"
fi

# Copiar otros archivos de video si existen
for video in public/*.{mp4,webm,ogg,avi,mov}; do
    if [ -f "$video" ]; then
        filename=$(basename "$video")
        cp "$video" "dist/$filename"
        echo "✓ $filename copiado a dist/"
    fi
done

echo "Proceso completado."
