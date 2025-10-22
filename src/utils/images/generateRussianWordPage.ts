import puppeteer from 'puppeteer';

export const generateRussianWordPage = async (
  outputDir: string,
  word: string,
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
          display: inline-block;
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
        }
        .russian-word {
          font-size: 90px;
          font-weight: 800;
          color: rgb(255, 255, 255);
          text-shadow: rgba(0, 0, 0, 0.8) 0px 0px 40px, rgba(0, 0, 0, 0.9) 0px 4px 8px, rgba(255, 255, 255, 0.3) 0px 0px 80px;
          letter-spacing: -0.02em;
          line-height: 1.1;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
        }
        .progress-bar {
          margin-top: 40px;
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 6px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #8bc34a);
          width: ${(index + 1) * 10}%;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 6px;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">
          <span>${index + 1}/10</span>
        </div>
        <div class="card-content">
          <h2 class="russian-word">${word}</h2>
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
