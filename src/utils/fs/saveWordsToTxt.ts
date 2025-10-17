import fs from 'fs';
import path from 'path';
import { WORDS } from '../../assets/data/words';

export const saveWordsToTxt = (outputDir: string) => {
  const filePath = path.join(outputDir, 'list.txt');
  const content = WORDS.map(({ ru, en }) => `${ru} — ${en}`).join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
};
