import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Цвета уровней
const levels = {
  // A1: ['#1b2e6f', '#3f5ecf', '#a3c0ff'],
  // A2: ['#006654', '#00d9aa', '#99f0e0'],
  // B1: ['#8b1f1f', '#ff3f3f', '#ff9999'],
  // B2: ['#4b176e', '#a64bff', '#e0b3ff'],
  // C1: ['#805300', '#ffbf00', '#fff28f'],
  C2: ['#3f7f00', '#8fff00', '#ccff80'],
};

const outputDir = path.join(process.cwd(), 'src/assets/videos');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const generateGradientBackgrounds = (level: string, colors: string[]) => {
  const [c1, c2, c3] = colors;
  const outputPath = path.join(outputDir, `${level}_bg.mp4`);
  console.log(`🎨 Generating gradient background for ${level}...`);

  const duration = 15;

  // Частоты синусов для бесшовного цикла
  const freq1 = (2 * Math.PI) / duration; // 1 полный цикл
  const freq2 = (4 * Math.PI) / duration; // 2 полных цикла
  const freq3 = (6 * Math.PI) / duration; // 3 полных цикла

  const filter = `
    color=c=${c1}:s=3000x3000:d=${duration}[c1];
    color=c=${c2}:s=3000x3000:d=${duration}[c2];
    color=c=${c3}:s=3000x3000:d=${duration}[c3];
    [c1][c2]blend=all_expr='A*(1-(X+Y)/(2*W))+B*((X+Y)/(2*W))'[g12];
    [g12][c3]blend=all_expr='A*(1-(X+Y)/(1.5*W))+B*((X+Y)/(1.5*W))'[grad];
    [grad]crop=w=1080:h=1920:
      x='(in_w-1080)/2 + 100*sin(${freq1}*t) + 80*sin(${freq2}*t)':
      y='(in_h-1920)/2 + 100*cos(${freq2}*t) + 60*sin(${freq3}*t)',
      hue='20*sin(${freq1}*t)',
      eq=contrast=1.05:brightness=0.03:saturation=1.25,
      format=yuv420p[v]
  `.replace(/\n/g, '');

  const cmd = `
    ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" \
    -filter_complex "${filter}" \
    -map "[v]" -map 0:a \
    -t ${duration} -c:v libx264 -pix_fmt yuv420p -preset slow -crf 18 "${outputPath}"
  `;

  execSync(cmd, { stdio: 'inherit', shell: '/bin/bash' });
  console.log(`✅ ${level} background created: ${outputPath}`);
};

// Генерируем все уровни
Object.entries(levels).forEach(([level, colors]) =>
  generateGradientBackgrounds(level, colors),
);

console.log('✨ All animated backgrounds created!');
