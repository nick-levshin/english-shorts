import puppeteer from 'puppeteer';

export const generateEnglishWordPage = async (
  outputDir: string,
  word: string,
  transcription: string,
  index: number,
) => {
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
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
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
        .word-counter {
          display: inline-block;
          font-size: 26px;
          font-weight: 600;
          color: white;
          background: rgba(255, 255, 255, 0.2);
          padding: 12px 24px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .check-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(76, 175, 80, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
        }
        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .english-word {
          font-size: 72px;
          font-weight: 800;
          color: white;
          margin-bottom: 20px;
          text-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .transcription {
          font-size: 36px;
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
          background: rgba(255, 255, 255, 0.15);
          padding: 16px 32px;
          border-radius: 20px;
          display: inline-block;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 30px;
          font-weight: 500;
        }
        .progress-bar {
          margin-top: 40px;
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #8bc34a);
          width: ${(index + 1) * 10}%;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="card-header">
          <div class="word-counter">${index + 1}/10</div>
          <div class="check-icon"> 
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <div class="card-content">
          <h2 class="english-word">${word}</h2>
          <p class="transcription">${transcription}</p>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const cardElement = await page.$('body');
  if (cardElement) {
    await cardElement.screenshot({
      path: `${outputDir}/${word}.png`,
      omitBackground: true,
    });
  }

  await browser.close();
};
