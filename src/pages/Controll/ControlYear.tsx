'use client';

import { useTranslation } from '@/hooks/useTranslation';

import { useSearchParams } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

const Card = ({
  m,
  index
}: {
  m: { uz: string; ru: string; en: string };
  index: number;
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {
    const updated = new URLSearchParams(searchParams);
    updated.set('month', (index + 1).toString());
    setSearchParams(updated);
  };

  return (
    <div
      key={index}
      onClick={handleClick}
      className="group relative overflow-hidden cursor-pointer rounded-2xl h-32 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        {/* Month Icon */}
        <div className="mb-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Month Name */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
          {t(m)}
        </h3>

        {/* Arrow Icon */}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300 mt-2" />
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
    </div>
  );
};

const ControlYear = () => {
  const [searchParams] = useSearchParams();
  const year = searchParams.get('year');

  const months = [
    { uz: 'Yanvar', ru: 'Январь', en: 'January' },
    { uz: 'Fevral', ru: 'Февраль', en: 'February' },
    { uz: 'Mart', ru: 'Март', en: 'March' },
    { uz: 'Aprel', ru: 'Апрель', en: 'April' },
    { uz: 'May', ru: 'Май', en: 'May' },
    { uz: 'Iyun', ru: 'Июнь', en: 'June' },
    { uz: 'Iyul', ru: 'Июль', en: 'July' },
    { uz: 'Avgust', ru: 'Август', en: 'August' },
    { uz: 'Sentabr', ru: 'Сентябрь', en: 'September' },
    { uz: 'Oktabr', ru: 'Октябрь', en: 'October' },
    { uz: 'Noyabr', ru: 'Ноябрь', en: 'November' },
    { uz: 'Dekabr', ru: 'Декабрь', en: 'December' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {year}-yil
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Oylik hisobot uchun oy tanlang
          </p>
        </div>
      </div>

      {/* Months Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((m, index) => (
          <Card key={index} m={m} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ControlYear;
