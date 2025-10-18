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
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
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
        .completion-celebration {
          text-align: center;
          margin-bottom: 100px;
        }
        .celebration-icon {
          font-size: 80px;
        }
        .completion-title {
          font-size: 56px;
          font-weight: 800;
          color: white;
          margin: 30px 0 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }
        .completion-subtitle {
          font-size: 30px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        .features-section {
          margin-bottom: 24px;
        }
        .features-title {
          font-size: 44px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 20px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin: 0 auto;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          padding: 24px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .feature-icon {
          font-size: 38px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .feature-text h3 {
          font-size: 28px;
          font-weight: 600;
          color: white;
          margin: 0 0 8px;
        }
        .feature-text p {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.8);
        }
        .motivation-text {
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 100px;
        }
        .motivation-text-title {
          font-size: 40px;
        }
        .motivation-text-subtitle {
          font-size: 28px;
        }
        .motivation-text p {
          color: white;
          line-height: 1.5;
        }
        .motivation-text strong {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">Готово!</div>
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
