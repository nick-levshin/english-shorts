import fs from 'fs';
import path from 'path';
import { execCommand } from '../fs/execCommand';
import { Level } from '../../types';
import { getDuration } from '../fs/getDuration';
import { INTRO_DURATION } from '../../config';

export const addPauses = (
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

  // 1️⃣ Генерируем вступительную фразу
  const introText = `Переведи десять слов за минуту. Уровень ${level}`;
  if (!fs.existsSync(introFile)) {
    execCommand(`gtts-cli "${introText}" --lang ru --output "${introFile}"`);
  }

  // 2️⃣ Проверяем, что нужные тишины (2 и 3 сек) есть
  for (const dur of [2, 3]) {
    const silenceFile = path.join(audioAssets, `silence_${dur}s.mp3`);
    if (!fs.existsSync(silenceFile)) {
      execCommand(
        `ffmpeg -f lavfi -i anullsrc=r=24000:cl=mono -t ${dur} -q:a 9 -acodec libmp3lame "${silenceFile}"`,
      );
    }
  }

  // 3️⃣ Делаем интро ровно 7 секунд
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
    // если интро длинное — просто обрезаем до 7 с
    execCommand(
      `ffmpeg -t ${INTRO_DURATION} -i "${introFile}" -acodec libmp3lame "${introFullFile}"`,
    );
  }

  // 4️⃣ Формируем список файлов
  const lines: string[] = [];
  lines.push(`file '${introFullFile}'`);

  inputFiles.forEach((file, index) => {
    lines.push(`file '${file}'`);
    const isRu = index % 2 === 0;
    const silenceDuration = isRu ? 3 : 2;
    lines.push(
      `file '${path.join(audioAssets, `silence_${silenceDuration}s.mp3`)}'`,
    );
  });

  // 5️⃣ Генерируем аутро
  const outroText = 'Напиши свой результат в комментариях';
  if (!fs.existsSync(outroFile)) {
    execCommand(`gtts-cli "${outroText}" --lang ru --output "${outroFile}"`);
  }
  lines.push(`file '${outroFile}'`);
  fs.writeFileSync(listPath, lines.join('\n'), 'utf8');

  // 6️⃣ Конкатенируем всё
  execCommand(
    `ffmpeg -f concat -safe 0 -i "${listPath}" -acodec libmp3lame -ar 44100 -ab 192k "${outputFile}"`,
  );
};
