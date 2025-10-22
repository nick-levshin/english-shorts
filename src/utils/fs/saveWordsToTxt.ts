import fs from 'fs';
import path from 'path';
import { WORDS } from '../../assets/data/words';

export const saveWordsToTxt = (outputDir: string, level: string) => {
  const filePath = path.join(outputDir, 'list.txt');
  let content = `${level}\n`;
  content += WORDS.map(({ ru, en }) => `${ru} — ${en}`).join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
};
