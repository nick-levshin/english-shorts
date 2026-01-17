import fs from 'fs';
import path from 'path';

export const cleanup = (dir: string) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.mp4') || file === 'result.mp3' || file === 'list.txt') {
      continue;
    }
    fs.unlinkSync(path.join(dir, file));
  }
};
