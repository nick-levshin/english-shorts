import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs/promises';

const OUTPUT_DIR = './frames';
const OUTPUT_VIDEO = 'timer.mp4';
const HTML_FILE = 'timer.html';

async function main() {
  // Создаём папку для кадров
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const html = await fs.readFile(HTML_FILE, 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 300, height: 300 },
  });

  const page = await browser.newPage();
  await page.setContent(html);

  // Функция задержки вместо page.waitForTimeout
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  const frames = 180;
  const fps = 60;

  console.log('📸 Записываю кадры...');

  for (let i = 0; i < frames; i++) {
    const frameName = `${OUTPUT_DIR}/frame_${String(i).padStart(4, '0')}.png`;
    await page.screenshot({ path: frameName, omitBackground: true });
    await wait(1000 / fps);
  }

  await browser.close();

  console.log('🎞️ Собираю MP4 через ffmpeg...');

  execSync(
    `ffmpeg -y -framerate 60 -pattern_type glob -i './frames/*.png' \
  -vf format=yuva420p \
  -c:v libvpx-vp9 -lossless 1 -b:v 0 -auto-alt-ref 0 \
  -metadata alpha_mode=1 \
  timer.webm`,
    { stdio: 'inherit' },
  );

  console.log(`✅ Видео готово: ${OUTPUT_VIDEO}`);
}

main().catch(console.error);
