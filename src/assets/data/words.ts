import type { Level, Word } from '../../types';

export const LEVEL: Level = 'A2';

export const WORDS: Word[] = [
  { ru: 'Событие', en: 'Event', transcription: '[ɪˈvent]' },
  { ru: 'Причинять (вред)', en: 'Cause', transcription: '[kɔːz]' },
  { ru: 'Улучшать', en: 'Improve', transcription: '[ɪmˈpruːv]' },
  { ru: 'Повторять', en: 'Repeat', transcription: '[rɪˈpiːt]' },
  { ru: 'Предлагать', en: 'Offer', transcription: '[ˈɒfə]' },
  { ru: 'Следовать', en: 'Follow', transcription: '[ˈfɒləʊ]' },
  { ru: 'Принимать (решение)', en: 'Accept', transcription: '[əkˈsept]' },
  { ru: 'Отменять', en: 'Cancel', transcription: '[ˈkænsəl]' },
  { ru: 'Обсуждать', en: 'Discuss', transcription: '[dɪˈskʌs]' },
  { ru: 'Приглашать', en: 'Invite', transcription: '[ɪnˈvaɪt]' },
] as const;
