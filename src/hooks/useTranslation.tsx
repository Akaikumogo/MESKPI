import { latinToCyrillic } from '@/utils/LatToCry';
import { useApp } from '../Providers/Configuration';

export const useTranslation = () => {
  const { lang, setLang } = useApp();

  const t = (dict: Partial<Record<'uz' | 'ru' | 'en', string>>) => {
    if (lang === 'cr') {
      if (dict['uz']) return latinToCyrillic(dict['uz']) as string;
      return '[No translation]';
    }
    return dict[lang] ?? dict['uz'] ?? '[No translation]';
  };

  return { t, lang, setLang };
};
