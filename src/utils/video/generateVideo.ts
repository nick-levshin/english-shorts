import path from 'path';
import { WORDS } from '../../assets/data/words';
import { execCommand } from '../fs/execCommand';
import { getDuration } from '../fs/getDuration';
import { INTRO_DURATION, OUTRO_DURATION } from '../../config';

export const generateVideo = async (
  audioFile: string,
  outputDir: string,
  inputFiles: string[],
  level: string,
) => {
  const background = path.join(
    process.cwd(),
    `src/assets/videos/${level}_gradient.mp4`,
  );
  const outputVideo = path.join(outputDir, 'result.mp4');

  const startSlide = path.join(
    process.cwd(),
    'src/assets/images',
    `${level}_first_page.png`,
  );
  const endSlide = path.join(
    process.cwd(),
    'src/assets/images',
    `${level}_last_page.png`,
  );
  const slidesRu = WORDS.map(({ ru }) => path.join(outputDir, `${ru}.png`));
  const slidesEn = WORDS.map(({ en }) => path.join(outputDir, `${en}.png`));

  // 1️⃣ Получаем длительности аудио
  const durations: number[] = inputFiles.map(getDuration);

  // 2️⃣ Формируем интервалы (включая старт и энд экраны)
  const slidesWithTiming: { file: string; start: number; end: number }[] = [];
  let time = 0;

  // — стартовый экран
  slidesWithTiming.push({
    file: startSlide,
    start: time,
    end: time + INTRO_DURATION - 0.01,
  });
  time += INTRO_DURATION;

  for (let i = 0; i < WORDS.length; i++) {
    const ruDur = durations[i * 2] || 0;
    const enDur = durations[i * 2 + 1] || 0;

    const ruStart = time;
    const ruEnd = ruStart + ruDur + 3;
    slidesWithTiming.push({ file: slidesRu[i], start: ruStart, end: ruEnd });

    const enStart = ruEnd;
    const enEnd = enStart + enDur + 2;
    slidesWithTiming.push({ file: slidesEn[i], start: enStart, end: enEnd });

    time = enEnd;
  }

  // — финальный экран
  slidesWithTiming.push({
    file: endSlide,
    start: time,
    end: time + OUTRO_DURATION,
  });
  time += OUTRO_DURATION;

  const totalDuration = time;

  // 3️⃣ Собираем inputs
  const inputs = [
    `-stream_loop -1 -i "${background}"`,
    ...slidesWithTiming.map(
      s => `-loop 1 -t ${totalDuration.toFixed(2)} -i "${s.file}"`,
    ),
    `-i "${audioFile}"`,
  ].join(' ');

  // 4️⃣ Формируем filter_complex
  let filter = `[0:v]setpts=PTS-STARTPTS,fps=30,scale=1080:1920[bg];`;
  let lastLabel = '[bg]';

  slidesWithTiming.forEach((slide, i) => {
    const inputIndex = i + 1;
    const nextLabel = `[v${i}]`;
    filter += `${lastLabel}[${inputIndex}:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${slide.start.toFixed(
      3,
    )},${slide.end.toFixed(3)})'${nextLabel};`;
    lastLabel = nextLabel;
  });

  const cmd = `
    ffmpeg ${inputs} \
    -filter_complex "${filter}" \
    -map "${lastLabel}" -map ${slidesWithTiming.length + 1}:a \
    -t ${totalDuration.toFixed(2)} \
    -c:v libx264 -pix_fmt yuv420p -c:a aac \
    -shortest -async 1 -vsync 1 -video_track_timescale 30000 \
    "${outputVideo}"
  `;

  execCommand(cmd);
};
