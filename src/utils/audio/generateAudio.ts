import { execCommand } from '../fs/execCommand';

export const generateAudio = (
  text: string,
  lang: string,
  outputDir: string,
) => {
  execCommand(`python3 scripts/tts.py ${lang} "${text}" "${outputDir}"`);
  return outputDir;
};
