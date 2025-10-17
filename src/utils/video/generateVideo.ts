import path from 'path';
import { execSync } from 'child_process';
import { WORDS } from '../../assets/data/words';
import { execCommand } from '../fs/execCommand';

export const generateVideo = async (
  audioFile: string,
  outputDir: string,
  inputFiles: string[],
  level: string,
) => {
  const background = path.join(
    process.cwd(),
    `src/assets/videos/${level}_bg.mp4`,
  );
  const outputVideo = path.join(outputDir, 'result.mp4');

  // 1️⃣ Получаем длительность каждого аудиофайла (.mp3)
  const durations: number[] = inputFiles.map(file => {
    const result = execSync(
      `ffprobe -i "${file}" -show_entries format=duration -v quiet -of csv="p=0"`,
    )
      .toString()
      .trim();

    return parseFloat(result);
  });

  // 2️⃣ Рассчитываем общую длительность с учётом пауз
  let totalDuration = 0;
  for (let i = 0; i < WORDS.length; i++) {
    const ruDur = durations[i * 2] || 0;
    const enDur = durations[i * 2 + 1] || 0;
    totalDuration += ruDur + 3 + enDur + 2; // 3 сек на перевод, 2 сек пауза
  }

  // 3️⃣ Формируем filter_complex с drawtext
  let filter = '';
  let time = 0;
  let prevLabel = '[0:v]'; // первый вход — фон (градиент)

  for (let i = 0; i < WORDS.length; i++) {
    const { ru, en } = WORDS[i];
    const labelRu = `[v_ru_${i}]`;
    const labelEn = `[v_en_${i}]`;

    const ruDuration = durations[i * 2] || 0;
    const enDuration = durations[i * 2 + 1] || 0;

    // 🔹 Русское слово
    filter += `${prevLabel}drawtext=text='${ru}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=100:fontcolor=white:enable='between(t,${time.toFixed(
      3,
    )},${(time + ruDuration + 3).toFixed(3)})'${labelRu};`;
    time += ruDuration + 3;

    // 🔸 Английское слово
    filter += `${labelRu}drawtext=text='${en}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=100:fontcolor=yellow:enable='between(t,${time.toFixed(
      3,
    )},${(time + enDuration + 2).toFixed(3)})'${labelEn};`;
    time += enDuration + 2;

    prevLabel = labelEn;
  }

  const lastLabel = prevLabel;

  // 4️⃣ Генерация видео
  const cmd = `
    ffmpeg -stream_loop -1 -i "${background}" \
    -i "${audioFile}" \
    -filter_complex "${filter}" \
    -map "${lastLabel}" -map 1:a \
    -t ${totalDuration.toFixed(2)} \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${outputVideo}"
  `;

  execCommand(cmd);
};
