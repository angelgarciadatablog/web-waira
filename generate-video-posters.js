#!/usr/bin/env node

/**
 * Script para generar posters (primer frame) de todos los videos
 * Uso: node generate-video-posters.js
 * O ejecutar: ./generate-posters.sh
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const VIDEO_DIR = path.join(__dirname, 'assets', 'video');
const POSTER_DIR = path.join(__dirname, 'assets', 'img', 'video-posters');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}========================================${colors.reset}`);
console.log(`${colors.blue}  Generador de Posters para Videos${colors.reset}`);
console.log(`${colors.blue}========================================${colors.reset}\n`);

// Verificar que FFmpeg esté instalado
try {
  execSync('which ffmpeg', { stdio: 'pipe' });
  console.log(`${colors.green}✓${colors.reset} FFmpeg encontrado\n`);
} catch (error) {
  console.error(`${colors.red}✗ Error: FFmpeg no está instalado${colors.reset}`);
  console.error('Por favor instala FFmpeg:');
  console.error('  macOS:   brew install ffmpeg');
  console.error('  Ubuntu:  sudo apt install ffmpeg');
  console.error('  Windows: https://ffmpeg.org/download.html');
  process.exit(1);
}

// Crear directorio de posters si no existe
if (!fs.existsSync(POSTER_DIR)) {
  fs.mkdirSync(POSTER_DIR, { recursive: true });
  console.log(`${colors.green}✓${colors.reset} Carpeta creada: ${POSTER_DIR}\n`);
} else {
  console.log(`${colors.blue}→${colors.reset} Usando carpeta existente: ${POSTER_DIR}\n`);
}

// Verificar que exista la carpeta de videos
if (!fs.existsSync(VIDEO_DIR)) {
  console.error(`${colors.red}✗ Error: No se encontró la carpeta de videos${colors.reset}`);
  console.error(`  Buscando en: ${VIDEO_DIR}`);
  process.exit(1);
}

// Obtener lista de videos
const videoFiles = fs.readdirSync(VIDEO_DIR)
  .filter(file => file.endsWith('.mp4'))
  .sort();

if (videoFiles.length === 0) {
  console.log(`${colors.yellow}⚠ No se encontraron videos en ${VIDEO_DIR}${colors.reset}`);
  process.exit(0);
}

console.log(`${colors.blue}→${colors.reset} Videos encontrados: ${videoFiles.length}\n`);

// Procesar cada video
let successCount = 0;
let errorCount = 0;

videoFiles.forEach((videoFile, index) => {
  const videoPath = path.join(VIDEO_DIR, videoFile);
  const posterName = videoFile.replace('.mp4', '.webp');
  const posterPath = path.join(POSTER_DIR, posterName);

  console.log(`[${index + 1}/${videoFiles.length}] Procesando: ${videoFile}`);

  try {
    // Extraer el primer frame en formato webp (mejor compresión que jpg)
    execSync(
      `ffmpeg -i "${videoPath}" -ss 00:00:00.1 -vframes 1 -q:v 2 "${posterPath}" -y`,
      { stdio: 'pipe' }
    );

    // Verificar que se creó el archivo
    if (fs.existsSync(posterPath)) {
      const stats = fs.statSync(posterPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ${colors.green}✓${colors.reset} Generado: ${posterName} (${sizeKB} KB)\n`);
      successCount++;
    } else {
      console.log(`  ${colors.red}✗${colors.reset} Error: No se pudo crear ${posterName}\n`);
      errorCount++;
    }
  } catch (error) {
    console.log(`  ${colors.red}✗${colors.reset} Error al procesar ${videoFile}`);
    console.log(`  ${error.message}\n`);
    errorCount++;
  }
});

// Resumen
console.log(`${colors.blue}========================================${colors.reset}`);
console.log(`${colors.green}✓ Exitosos:${colors.reset} ${successCount}`);
if (errorCount > 0) {
  console.log(`${colors.red}✗ Errores:${colors.reset} ${errorCount}`);
}
console.log(`${colors.blue}========================================${colors.reset}\n`);

if (successCount > 0) {
  console.log(`${colors.green}¡Listo!${colors.reset} Los posters se guardaron en:`);
  console.log(`  ${POSTER_DIR}\n`);
  console.log(`${colors.yellow}Siguiente paso:${colors.reset}`);
  console.log(`  Actualiza el HTML para usar los posters generados`);
  console.log(`  (puedes ejecutar el script de actualización si lo tienes)\n`);
}

process.exit(errorCount > 0 ? 1 : 0);
