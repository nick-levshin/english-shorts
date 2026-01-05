import path from 'path';
import { LEVEL, WORDS } from './assets/data/words';
import { cleanup } from './utils/fs/cleanup';
import { getOutputDir } from './utils/fs/getOutputDir';
import { generateAudio } from './utils/audio/generateAudio';
import { addPauses } from './utils/audio/addPauses';
import { saveWordsToTxt } from './utils/fs/saveWordsToTxt';
import { generateVideo } from './utils/video/generateVideo';
import { generateRussianWordPage } from './utils/images/generateRussianWordPage';
import { generateEnglishWordPage } from './utils/images/generateEnglishWordPage';

const outputDir = getOutputDir(LEVEL);

(async () => {
  console.log('🚀 Starting English Shorts generation...');

  // 1️⃣ Генерация аудио для всех слов (параллельно)
  const audioPromises = WORDS.flatMap(({ ru, en }) => [
    generateAudio(ru, 'ru', path.join(outputDir, `${ru}.mp3`)),
    generateAudio(en, 'en', path.join(outputDir, `${en}.mp3`)),
  ]);
  const generatedFiles = await Promise.all(audioPromises);
  console.log('🎤 Words audio files were generated.');

  // 2️⃣ Сохраняем список слов в текстовый файл
  saveWordsToTxt(outputDir, LEVEL);
  console.log('📝 Words list saved.');

  // 3️⃣ Добавляем паузы между словами
  const pausedAudioPath = path.join(outputDir, 'result.mp3');
  await addPauses(generatedFiles, pausedAudioPath, LEVEL);
  console.log('🔇 Audio with pauses created.');

  // 4️⃣ Генерируем слайды для русских слов (используем один браузер)
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    defaultViewport: { width: 1080, height: 1920 },
  });

  try {
    for (let i = 0; i < WORDS.length; i++) {
      const { ru } = WORDS[i];
      await generateRussianWordPage(outputDir, ru, i, browser);
    }
    console.log('🇷🇺 Russian slides created.');

    // 5️⃣ Генерируем слайды для английских слов
    for (let i = 0; i < WORDS.length; i++) {
      const { en, transcription } = WORDS[i];
      await generateEnglishWordPage(outputDir, en, transcription, i, browser);
    }
    console.log('🇬🇧 English slides created.');
  } finally {
    await browser.close();
  }

  // 6️⃣ Собираем итоговое видео
  await generateVideo(pausedAudioPath, outputDir, generatedFiles, LEVEL);
  console.log('🎬 Video generated successfully!');

  // 7️⃣ Очистка
  cleanup(outputDir);

  console.log(`✅ Done! Check your video at: ${outputDir}`);
})();
