import path from 'path';
import puppeteer from 'puppeteer';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const outputDir = path.join(process.cwd(), 'src/assets/images');

const generateFirstPage = async (level: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1080, height: 1920 },
  });

  const page = await browser.newPage();

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .card {
          margin: 40px;
          width: 1000px;
          height: 1840px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          flex-direction: column;
          padding: 60px;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.3) 0px 25px 50px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
        }
        .badge {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 32px, rgba(255, 255, 255, 0.5) 0px 0px 20px inset;
          border: 2px solid rgb(255, 255, 255);
          padding: 16px 32px;
          border-radius: 32px;
          align-self: flex-start;
        }
        .badge span {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(to right, #9333ea, #db2777);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .challenge-title {
          font-size: 58px;
          font-weight: 800;
          color: white;
          margin-bottom: 80px;
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 40px, rgba(0, 0, 0, 0.9) 0px 4px 8px, rgba(255, 255, 255, 0.3) 0px 0px 80px;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
          line-height: 1.1;
        }
        .instructions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-bottom: 60px;
        }
        .instruction-item {
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(255, 255, 255, 0.25);
          padding: 24px 32px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(24px);
          box-shadow: rgba(0, 0, 0, 0.25) 0px 12px 40px, rgba(255, 255, 255, 0.25) 0px 0px 30px inset;
        }
        .instruction-icon {
          width: 80px;
          height: 80px;
          font-size: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgb(255, 255, 255);
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 30px, rgba(255, 255, 255, 0.5) 0px 0px 20px inset;
        }
        .instruction-item p {
          letter-spacing: -0.01em;
          -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.3);
          font-size: 38px;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: rgba(0, 0, 0, 0.9) 0px 0px 30px, rgba(0, 0, 0, 0.9) 0px 4px 8px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">
          <span>${level}</span>
        </div>
        <div class="card-content">
          <h1 class="challenge-title">Переведи 10 слов за 1 минуту</h1>
          <div class="instructions">
            <div class="instruction-item">
              <div class="instruction-icon">👀</div>
              <p>Смотри на русское слово</p>
            </div>
            <div class="instruction-item">
              <div class="instruction-icon">⏱️</div>
              <p>Думай 3 секунды</p>
            </div>
            <div class="instruction-item">
              <div class="instruction-icon">✅</div>
              <p>Проверь свой ответ</p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const cardElement = await page.$('body');
  if (cardElement) {
    await cardElement.screenshot({
      path: `${outputDir}/${level}_first_page.png`,
      omitBackground: true,
    });
  }

  await browser.close();
};

levels.forEach(level => generateFirstPage(level));
