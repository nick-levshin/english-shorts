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
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          padding: 60px;
          overflow: hidden;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        .badge {
          background: rgba(255, 255, 255, 0.3);
          padding: 16px 28px;
          border-radius: 28px;
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(255, 255, 255, 0.25) inset;
          align-self: flex-start;
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
          font-size: 56px;
          font-weight: 800;
          color: white;
          margin-bottom: 80px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          line-height: 1.1;
          letter-spacing: -0.02em;
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
          background: rgba(255, 255, 255, 0.1);
          padding: 24px 32px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .instruction-icon {
          font-size: 38px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        .instruction-item p {
          font-size: 30px;
          font-weight: 500;
          color: white;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">${level}</div>
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
