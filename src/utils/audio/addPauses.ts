import fs from 'fs';
import path from 'path';
import { execCommand } from '../fs/execCommand';
import { Level } from '../../types';
import { getDuration } from '../fs/getDuration';
import { INTRO_DURATION } from '../../config';
import { generateAudio } from './generateAudio';

export const addPauses = async (
  inputFiles: string[],
  outputFile: string,
  level: Level,
) => {
  const dir = path.dirname(outputFile);
  const audioAssets = path.join(process.cwd(), 'src/assets/audio');
  const listPath = path.join(dir, 'list_with_pauses.txt');
  const introFile = path.join(audioAssets, `${level}_intro.mp3`);
  const outroFile = path.join(audioAssets, `${level}_autro.mp3`);
  const introFullFile = path.join(audioAssets, `${level}_intro_full.mp3`);

  // 🔊 Добавленные звуки
  const countdownFile = path.join(audioAssets, 'countdown.mp3');

  // Проверим, что они существуют
  if (!fs.existsSync(countdownFile)) {
    throw new Error(`Файл звука не найден: ${countdownFile}`);
  }

  // 1️⃣ Генерируем вступление (только если файл не существует)
  const introText = `Переведи десять слов за минуту. Уровень ${level}`;
  if (!fs.existsSync(introFile)) {
    await generateAudio(introText, 'ru', introFile);
  }

  // 2️⃣ Создаём тишину на 1 и 0.5 секунды, если их нет
  for (const dur of [1, 0.5]) {
    const silenceFile = path.join(audioAssets, `silence_${dur}s.mp3`);
    if (!fs.existsSync(silenceFile)) {
      execCommand(
        `ffmpeg -f lavfi -i anullsrc=r=24000:cl=mono -t ${dur} -q:a 9 -acodec libmp3lame "${silenceFile}"`,
      );
    }
  }

  // 3️⃣ Подгоняем длительность интро под INTRO_DURATION (только если файл не существует)
  if (!fs.existsSync(introFullFile)) {
    const duration = getDuration(introFile);
    const silenceNeeded = Math.max(0, INTRO_DURATION - duration);

    if (silenceNeeded) {
      const silenceTemp = path.join(audioAssets, `silence_temp_${level}.mp3`);
      execCommand(
        `ffmpeg -f lavfi -i anullsrc=r=24000:cl=mono -t ${silenceNeeded.toFixed(
          2,
        )} -q:a 9 -acodec libmp3lame "${silenceTemp}"`,
      );

      const tempList = path.join(dir, `intro_concat_${level}.txt`);
      fs.writeFileSync(
        tempList,
        [`file '${introFile}'`, `file '${silenceTemp}'`].join('\n'),
      );

      execCommand(
        `ffmpeg -f concat -safe 0 -i "${tempList}" -acodec libmp3lame "${introFullFile}"`,
      );

      fs.unlinkSync(silenceTemp);
      fs.unlinkSync(tempList);
    } else {
      execCommand(
        `ffmpeg -t ${INTRO_DURATION} -i "${introFile}" -acodec libmp3lame "${introFullFile}"`,
      );
    }
  }

  // 4️⃣ Собираем последовательность файлов
  const lines: string[] = [];
  lines.push(`file '${introFullFile}'`);

  inputFiles.forEach((file, index) => {
    lines.push(`file '${file}'`);
    const isRu = index % 2 === 0;
    const pauseToPush = isRu
      ? countdownFile
      : path.join(audioAssets, 'silence_0.5s.mp3');
    lines.push(`file '${pauseToPush}'`);
  });

  // 5️⃣ Генерируем аутро (только если файл не существует)
  const outroText = 'Напиши свой результат в комментариях';
  if (!fs.existsSync(outroFile)) {
    await generateAudio(outroText, 'ru', outroFile);
  }
  lines.push(`file '${outroFile}'`);

  // 6️⃣ Пишем список и объединяем в итоговый mp3
  fs.writeFileSync(listPath, lines.join('\n'), 'utf8');
  execCommand(
    `ffmpeg -f concat -safe 0 -i "${listPath}" -acodec libmp3lame -ar 44100 -ab 192k "${outputFile}"`,
  );
};
