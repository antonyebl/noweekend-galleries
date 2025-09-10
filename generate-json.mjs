import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { getAverageColor } from 'image-average-color';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function processGalleries() {
  const galleryDirs = await fs.readdir(__dirname);
  
  for (const dir of galleryDirs) {
    if (dir.startsWith('gallery_')) {
      const galleryPath = path.join(__dirname, dir);
      console.log(`Processing gallery: ${galleryPath}`);

      const files = (await fs.readdir(galleryPath))
        .filter(file => file.toLowerCase().endsWith('.jpg'))
        .sort();

      const imageData = await Promise.all(files.map(async file => {
        const filePath = path.join(galleryPath, file);
        try {
          const color = await getAverageColor(filePath);
          const hexColor = `#${color.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
          return { filename: file, avgColor: hexColor };
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
          return { filename: file, avgColor: '#e0e0e0' }; // Fallback color
        }
      }));

      await fs.writeFile(
        path.join(galleryPath, 'images.json'),
        JSON.stringify(imageData, null, 2)
      );

      console.log(`images.json for ${dir} generated successfully.`);
    }
  }
}

processGalleries();
