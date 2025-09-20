const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const optimizedDir = path.join(publicDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Process each image
const images = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a'];

async function optimizeImages() {
  for (const imageName of images) {
    const inputPath = path.join(publicDir, `${imageName}.png`);

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${imageName}.png - file not found`);
      continue;
    }

    console.log(`Processing ${imageName}.png...`);

    try {
      // Create WebP version (high quality for main display)
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(path.join(optimizedDir, `${imageName}.webp`));

      // Create thumbnail WebP (for carousel - smaller size)
      await sharp(inputPath)
        .resize(800, 800, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toFile(path.join(optimizedDir, `${imageName}-thumb.webp`));

      // Create fallback JPEG (compressed)
      await sharp(inputPath)
        .resize(1200, 1200, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85, progressive: true })
        .toFile(path.join(optimizedDir, `${imageName}.jpg`));

      console.log(`✓ ${imageName} optimized`);
    } catch (error) {
      console.error(`Error processing ${imageName}:`, error);
    }
  }

  // Get file sizes for comparison
  console.log('\n=== File Size Comparison ===');
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const imageName of images) {
    const originalPath = path.join(publicDir, `${imageName}.png`);
    const optimizedPath = path.join(optimizedDir, `${imageName}-thumb.webp`);

    if (fs.existsSync(originalPath) && fs.existsSync(optimizedPath)) {
      const originalSize = fs.statSync(originalPath).size;
      const optimizedSize = fs.statSync(optimizedPath).size;
      const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

      totalOriginal += originalSize;
      totalOptimized += optimizedSize;

      console.log(`${imageName}: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(optimizedSize / 1024).toFixed(0)}KB (${reduction}% reduction)`);
    }
  }

  console.log(`\nTotal: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalOptimized / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Overall reduction: ${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%`);
}

optimizeImages().then(() => {
  console.log('\n✅ Image optimization complete!');
}).catch(console.error);