import type { Level, Word } from '../../types';

export const LEVEL: Level = 'B1';

export const WORDS: Word[] = [
  { ru: 'Путешествие', en: 'Journey', transcription: '[ˈdʒɜːni]' },
  // { ru: 'Достижение', en: 'Achievement', transcription: '[əˈtʃiːvmənt]' },
  // { ru: 'Окружение', en: 'Environment', transcription: '[ɪnˈvaɪrənmənt]' },
  // { ru: 'Влияние', en: 'Influence', transcription: '[ˈɪnfluəns]' },
  // { ru: 'Улучшение', en: 'Improvement', transcription: '[ɪmˈpruːvmənt]' },
  // {
  //   ru: 'Ответственность',
  //   en: 'Responsibility',
  //   transcription: '[rɪˌspɒnsəˈbɪləti]',
  // },
  // { ru: 'Образование', en: 'Education', transcription: '[ˌedjʊˈkeɪʃən]' },
  // { ru: 'Возможность', en: 'Opportunity', transcription: '[ˌɒpəˈtjuːnɪti]' },
  // { ru: 'Знакомство', en: 'Acquaintance', transcription: '[əˈkweɪntəns]' },
  // { ru: 'Решение', en: 'Decision', transcription: '[dɪˈsɪʒən]' },
] as const;
