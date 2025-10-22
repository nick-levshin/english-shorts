import { execSync } from 'child_process';

export const getDuration = (file: string) => {
  const result = execSync(
    `ffprobe -i "${file}" -show_entries format=duration -v quiet -of csv="p=0"`,
  )
    .toString()
    .trim();
  return parseFloat(result);
};
