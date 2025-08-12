import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion'; // motion/react emas, framer-motion ishlatamiz
import { useSearchParams } from 'react-router-dom';

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
    updated.set('month', (index + 1).toString()); // month = 1-based
    setSearchParams(updated);
  };
  return (
    <motion.div
      key={index}
      layoutId={`${index}`} // layoutId ni index bilan bog‘ladik
      whileHover={{
        scale: 1.01,

        transition: { duration: 0.2 }
      }}
      onClick={handleClick}
      className="cursor-pointer rounded-lg h-40 flex items-center justify-center border border-gray-300 dark:border-gray-700 p-4 text-center shadow-sm dark:bg-[#1c1c1cd8] bg-white dark:text-white"
    >
      {t(m)}
    </motion.div>
  );
};
const ControlYear = () => {
  const months = [
    { uz: 'Yanvar', ru: 'Январь', en: 'January' },
    { uz: 'Fevral', ru: 'Февраль', en: 'February' },
    { uz: 'Mart', ru: 'Март', en: 'March' },
    { uz: 'Aprel', ru: 'Апрель', en: 'April' },
    { uz: 'May', ru: 'Май', en: 'May' },
    { uz: 'Iyun', ru: 'Июнь', en: 'June' },
    { uz: 'Iyul', ru: 'Июль', en: 'July' },
    { uz: 'Avgust', ru: 'Август', en: 'August' },
    { uz: 'Sentabr', ru: 'Сентябрь', en: 'September' },
    { uz: 'Oktabr', ru: 'Октябрь', en: 'October' },
    { uz: 'Noyabr', ru: 'Ноябрь', en: 'November' },
    { uz: 'Dekabr', ru: 'Декабрь', en: 'December' }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {months.map((m, index) => (
        <Card m={m} index={index} />
      ))}
    </div>
  );
};

export default ControlYear;
