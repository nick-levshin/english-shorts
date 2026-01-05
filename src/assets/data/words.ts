import type { Level, Word } from '../../types';

export const LEVEL: Level = 'A1';

export const WORDS: Word[] = [
  { ru: 'Дом', en: 'House', transcription: '[haʊs]' },
  { ru: 'Книга', en: 'Book', transcription: '[bʊk]' },
  { ru: 'Вода', en: 'Water', transcription: '[ˈwɔːtə]' },
  { ru: 'Еда', en: 'Food', transcription: '[fuːd]' },
  { ru: 'Друг', en: 'Friend', transcription: '[frend]' },
  { ru: 'Семья', en: 'Family', transcription: '[ˈfæmɪli]' },
  { ru: 'Работа', en: 'Work', transcription: '[wɜːk]' },
  { ru: 'Город', en: 'City', transcription: '[ˈsɪti]' },
  { ru: 'День', en: 'Day', transcription: '[deɪ]' },
  { ru: 'Ночь', en: 'Night', transcription: '[naɪt]' },
] as const;
