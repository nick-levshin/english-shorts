import fs from 'fs';
import path from 'path';
import { execCommand } from '../fs/execCommand';

export const addPauses = (inputFiles: string[], outputFile: string) => {
  const listPath = path.join(path.dirname(outputFile), 'list_with_pauses.txt');

  const lines: string[] = [];

  inputFiles.forEach((file, index) => {
    lines.push(`file '${file}'`);

    const isRu = index % 2 === 0;
    const silenceDuration = isRu ? 3 : 2; // 3 сек после ru, 2 сек после en
    lines.push(`file 'silence_${silenceDuration}s.mp3'`);
  });

  for (const dur of [2, 3]) {
    const silenceFile = path.join(
      path.dirname(outputFile),
      `silence_${dur}s.mp3`,
    );
    if (!fs.existsSync(silenceFile)) {
      execCommand(
        `ffmpeg -f lavfi -i anullsrc=r=24000:cl=mono -t ${dur} -q:a 9 -acodec libmp3lame "${silenceFile}"`,
      );
    }
  }

  fs.writeFileSync(listPath, lines.join('\n'), 'utf8');

  execCommand(
    `ffmpeg -f concat -safe 0 -i "${listPath}" -c copy "${outputFile}"`,
  );
};
