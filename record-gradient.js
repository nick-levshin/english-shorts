import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './gradient_frames';
const VIDEO_OUTPUT = './C1_gradient.mp4';
const FPS = 60;
const DURATION = 60;

async function recordGradient() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1080, height: 1920 },
  });

  const page = await browser.newPage();
  await page.goto(`file://${process.cwd()}/C1_gradient.html`);

  for (let i = 0; i < DURATION * FPS; i++) {
    const framePath = path.join(
      OUTPUT_DIR,
      `frame_${String(i).padStart(5, '0')}.png`,
    );
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 1000 / FPS));
  }

  await browser.close();

  execSync(
    `ffmpeg -framerate ${FPS} -i ${OUTPUT_DIR}/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -t ${DURATION} -r ${FPS} ${VIDEO_OUTPUT}`,
  );

  console.log(`🎥 Saved smooth looping gradient to: ${VIDEO_OUTPUT}`);
}

recordGradient();
