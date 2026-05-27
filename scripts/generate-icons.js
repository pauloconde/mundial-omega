import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SOURCE_ICON = path.join(PUBLIC_DIR, 'favicon.svg');

const ICONS = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-192-maskable.png', size: 192, maskable: true },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-512-maskable.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false, background: '#0a0e1a' } // Fondo para iOS
];

async function generateIcons() {
  try {
    // Comprobar si existe el SVG fuente
    await fs.access(SOURCE_ICON);
    
    console.log('Generando iconos PWA desde favicon.svg...\n');

    for (const icon of ICONS) {
      const outputPath = path.join(PUBLIC_DIR, icon.name);
      
      let pipeline = sharp(SOURCE_ICON)
        .resize(icon.size, icon.size, {
          fit: icon.maskable ? 'contain' : 'cover',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        });

      if (icon.background) {
        pipeline = sharp(SOURCE_ICON)
          .resize(icon.size, icon.size, {
            fit: 'contain',
            background: icon.background
          })
          .flatten({ background: icon.background });
      }

      await pipeline.toFile(outputPath);
      console.log(`✅ Creado: ${icon.name} (${icon.size}x${icon.size})`);
    }

    console.log('\n¡Todos los iconos generados correctamente!');
    console.log('Recuerda asegurarte de que astro.config.mjs hace referencia a estos archivos.');
  } catch (error) {
    console.error('Error generando los iconos:', error);
    if (error.code === 'ENOENT') {
      console.error(`Asegúrate de que existe el archivo base en: ${SOURCE_ICON}`);
    }
  }
}

generateIcons();
