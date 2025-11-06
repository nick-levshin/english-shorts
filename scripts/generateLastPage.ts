import path from 'path';
import puppeteer from 'puppeteer';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const outputDir = path.join(process.cwd(), 'src/assets/images');

const generateLastPage = async (level: string) => {
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
        .completion-celebration {
          text-align: center;
          margin-bottom: 100px;
        }
        .celebration-icon {
          font-size: 100px;
        }
        .completion-title {
          font-size: 58px;
          font-weight: 800;
          color: white;
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 40px, rgba(0, 0, 0, 0.9) 0px 4px 8px, rgba(255, 255, 255, 0.3) 0px 0px 80px;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .completion-subtitle {
          font-size: 30px;
          font-weight: 500;
          color: white;
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 20px, rgba(0, 0, 0, 0.9) 0px 2px 8px;
          margin: 0px;
        }
        .features-section {
          margin-bottom: 24px;
          width: 100%;
        }
        .features-title {
          font-size: 44px;
          font-weight: 700;
          color: rgb(255, 255, 255);
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 30px, rgba(0, 0, 0, 0.9) 0px 2px 10px;
          margin: 0px 0px 20px;
        }
        .features-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin: 0 auto;
        }
        .feature-item {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 10px;
          padding: 24px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(24px);
          box-shadow: rgba(0, 0, 0, 0.25) 0px 12px 40px, rgba(255, 255, 255, 0.25) 0px 0px 30px inset;
        }
        .feature-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgb(255, 255, 255);
          font-size: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 30px, rgba(255, 255, 255, 0.5) 0px 0px 20px inset;
          flex-shrink: 0;
        }
        .feature-text h3 {
          font-size: 28px;
          font-weight: 600;
          color: white;
          margin: 0 0 8px;
          text-shadow: rgba(0, 0, 0, 0.9) 0px 0px 20px, rgba(0, 0, 0, 0.9) 0px 2px 8px;
          line-height: 1.5;
        }
        .feature-text p {
          font-size: 24px;
          color: white;
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 15px, rgba(0, 0, 0, 0.9) 0px 2px 6px;
          margin: 0;
        }
        .motivation-text {
          padding: 30px;
          border-radius: 20px;
          margin-bottom: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-color: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(24px);
          box-shadow: rgba(0, 0, 0, 0.25) 0px 12px 40px, rgba(255, 255, 255, 0.25) 0px 0px 30px inset;
        }
        .motivation-text-title {
          font-size: 40px;
          text-shadow: rgba(0, 0, 0, 0.9) 0px 0px 20px, rgba(0, 0, 0, 0.9) 0px 2px 8px;
          margin: 0px 0px 12px;
        }
        .motivation-text-subtitle {
          font-size: 28px;
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 15px, rgba(0, 0, 0, 0.9) 0px 2px 6px;
          margin: 0px;
        }
        .motivation-text p {
          color: white;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">
          <span>Готово!</span>
        </div>
        <div class="card-content">
          <div class="completion-celebration">
            <div class="celebration-icon">🎉</div>
            <h1 class="completion-title">Уровень ${level} завершен!</h1>
            <p class="completion-subtitle">Ты изучил 10 новых слов</p>
          </div>

          <div class="features-section">
            <h2 class="features-title">Что дальше?</h2>
            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon">📚</div>
                <div class="feature-text">
                  <h3>Ежедневные уроки</h3>
                  <p>Новые слова каждый день</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <div class="feature-text">
                  <h3>Все уровни A1-C2</h3>
                  <p>От начального до продвинутого</p>
                </div>
              </div>
            </div>
          </div>

          <div class="motivation-text">
            <p class="motivation-text-title">💡 <strong>Совет:</strong></p>
            <p class="motivation-text-subtitle">Повторяй эти слова через день, неделю и месяц для лучшего запоминания</p>
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
      path: `${outputDir}/${level}_last_page.png`,
      omitBackground: true,
    });
  }

  await browser.close();
};

levels.forEach(level => generateLastPage(level));
