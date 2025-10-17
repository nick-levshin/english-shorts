import fs from 'fs';
import path from 'path';

export const cleanup = (dir: string) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file !== 'result.mp3' && file !== 'result.mp4' && file !== 'list.txt') {
      fs.unlinkSync(path.join(dir, file));
    }
  }
};
