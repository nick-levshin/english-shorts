import fs from 'fs';
import path from 'path';

export const getOutputDir = (level: string): string => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dir = path.resolve('output', date, level);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};
