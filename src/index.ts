import path from 'path';
import { WORDS } from './assets/data/words';
import { cleanup } from './utils/fs/cleanup';
import { getOutputDir } from './utils/fs/getOutputDir';
import { generateAudio } from './utils/audio/generateAudio';
import { addPauses } from './utils/audio/addPauses';
import { saveWordsToTxt } from './utils/fs/saveWordsToTxt';
import { generateVideo } from './utils/video/generateVideo';
import { renderInitPage } from './utils/images/generateInitPage';

const level = 'B1';
const outputDir = getOutputDir(level);

(async () => {
  console.log('🚀 Starting English Shorts generation...');

  const generatedFiles: string[] = [];

  // 1️⃣ Генерация аудио для всех слов
  for (const { ru, en } of WORDS) {
    console.log(`🎤 Generating: ${ru} → ${en}`);

    const ruFile = generateAudio(
      ru,
      'ru',
      path.join(outputDir, `${en}_ru.mp3`),
    );
    const enFile = generateAudio(
      en,
      'en',
      path.join(outputDir, `${en}_en.mp3`),
    );
    generatedFiles.push(ruFile, enFile);
  }

  // 2️⃣ Сохраняем список слов в текстовый файл
  saveWordsToTxt(outputDir);
  console.log('📝 Words list saved.');

  // 3️⃣ Добавляем паузы между словами
  const pausedAudioPath = path.join(outputDir, 'result.mp3');
  addPauses(generatedFiles, pausedAudioPath);
  console.log('🔇 Audio with pauses created.');

  // 4️⃣ Генерируем видео
  await generateVideo(pausedAudioPath, outputDir, generatedFiles, level);
  console.log('🎬 Video generated successfully!');

  // 5️⃣ Очистка (опционально)
  cleanup(outputDir);

  console.log(`✅ Done! Check your video at: ${outputDir}`);
})();
