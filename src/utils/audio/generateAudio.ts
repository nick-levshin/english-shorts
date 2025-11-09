import path from 'path';
import { execCommand } from '../fs/execCommand';

export const generateAudio = (
  text: string,
  lang: 'ru' | 'en',
  outputFile: string,
) => {
  // Получаем python из pyenv
  const pythonPath = '/Users/nick-levshin/.pyenv/versions/3.11.6/bin/python';
  const ttsScript = path.resolve('scripts/tts.py');

  try {
    execCommand(
      `${pythonPath} ${ttsScript} "${text}" "${outputFile}" "${lang}"`,
    );
  } catch (err) {
    console.error('Ошибка генерации аудио:', err);
  }
  return outputFile;
};
