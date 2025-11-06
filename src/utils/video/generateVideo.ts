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

  const timerFramesDir = path.join(process.cwd(), 'frames');
  const timerPattern = path.join(timerFramesDir, 'frame_%04d.png');

  const slidesRu = WORDS.map(({ ru }) => path.join(outputDir, `${ru}.png`));
  const slidesEn = WORDS.map(({ en }) => path.join(outputDir, `${en}.png`));

  // 1️⃣ Длительности аудио
  const durations: number[] = inputFiles.map(getDuration);

  // 2️⃣ Тайминги
  const slidesWithTiming: {
    file: string;
    start: number;
    end: number;
    timer?: { start: number };
  }[] = [];

  let time = 0;

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
    const ruEnd = ruStart + ruDur;
    const pauseStart = ruEnd;
    const pauseEnd = pauseStart + 3;

    slidesWithTiming.push({
      file: slidesRu[i],
      start: ruStart,
      end: pauseEnd,
      timer: { start: pauseStart },
    });

    const enStart = pauseEnd;
    const enEnd = enStart + enDur + 2;

    slidesWithTiming.push({
      file: slidesEn[i],
      start: enStart,
      end: enEnd,
    });

    time = enEnd;
  }

  slidesWithTiming.push({
    file: endSlide,
    start: time,
    end: time + OUTRO_DURATION,
  });

  time += OUTRO_DURATION;
  const totalDuration = time;

  // 3️⃣ Входы
  const inputsArr = [
    `-stream_loop -1 -i "${background}"`,
    ...slidesWithTiming.map(
      s => `-loop 1 -t ${totalDuration.toFixed(2)} -i "${s.file}"`,
    ),
    `-framerate 60 -i "${timerPattern}"`,
    `-i "${audioFile}"`,
  ];
  const inputs = inputsArr.join(' ');

  // 4️⃣ Фильтры
  let filter = `[0:v]setpts=PTS-STARTPTS,fps=30,scale=1080:1920[bg];`;
  let lastLabel = '[bg]';

  slidesWithTiming.forEach((slide, i) => {
    const slideInput = i + 1;
    const nextLabel = `[v${i}]`;

    // Наложение слайда
    filter += `${lastLabel}[${slideInput}:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${slide.start.toFixed(
      2,
    )},${slide.end.toFixed(2)})'${nextLabel};`;
    lastLabel = nextLabel;

    // Таймер
    if (slide.timer) {
      const timerStart = slide.timer.start; // когда начинается обратный отсчёт
      const timerEnd = timerStart + 3; // длительность таймера
      const nextTimerLabel = `[v${i}t]`;

      const timerIndex = slidesWithTiming.length + 1;

      // 1️⃣ Показать первый кадр таймера неподвижно на момент появления слова
      filter += `[${timerIndex}:v]trim=start_frame=0:end_frame=1,setpts=PTS-STARTPTS+${slide.start}/TB[first${i}];`;

      // 2️⃣ Сам таймер после появления слова
      filter += `[${timerIndex}:v]setpts=PTS-STARTPTS+${timerStart}/TB[timer_seq${i}];`;

      // 3️⃣ Скомпозить: сначала первый кадр, потом обратный отсчёт
      filter += `${lastLabel}[first${i}]overlay=W-overlay_w+0:-10:format=auto:enable='between(t,${slide.start.toFixed(
        2,
      )},${timerStart.toFixed(2)})'[tmp${i}];`;
      filter += `[tmp${i}][timer_seq${i}]overlay=W-overlay_w+0:-10:format=auto:enable='between(t,${timerStart.toFixed(
        2,
      )},${timerEnd.toFixed(2)})'${nextTimerLabel};`;

      lastLabel = nextTimerLabel;
    }
  });

  // 5️⃣ Генерация видео
  const cmd = `
    ffmpeg ${inputs} \
    -filter_complex "${filter}" \
    -map "${lastLabel}" -map ${slidesWithTiming.length + 2}:a \
    -t ${totalDuration.toFixed(2)} \
    -c:v libx264 -pix_fmt yuva420p -c:a aac -shortest -y "${outputVideo}"
  `;

  execCommand(cmd);
};
