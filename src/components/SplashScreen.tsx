import { motion } from 'motion/react';
import { useEffect } from 'react';
import IconCards from './IconCards';
import { useTranslation } from '@/hooks/useTranslation';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem('splashShown', 'true');
      onFinish();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onFinish]);

  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white text-gray-800 dark:bg-[#1f2937] dark:text-white transition-colors duration-300"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center">
          <motion.h1
            className="text-3xl md:text-5xl font-semibold bg-gradient-to-br from-blue-500 to-[#0cb9d4] dark:from-blue-400 dark:to-[#0cb9d4] inline-block text-transparent bg-clip-text"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t({
              uz: 'Magistral Elektr Tarmoqlari — KPI Tizimi',
              ru: 'Магистральные Электрические Сети — KPI Система',
              en: 'Main Electrical Grids — KPI System'
            })}
          </motion.h1>
        </div>

        <motion.div className="mt-6">
          <IconCards />
        </motion.div>

        <motion.h3
          className="text-sm md:text-base text-gray-500 dark:text-gray-400"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {t({
            uz: 'Loyiha muallifi — Muhandis Sarvarbek Xazratov',
            ru: 'Автор проекта — инженер Сарварбек Хазратов',
            en: 'Project Author — Engineer Sarvarbek Khazratov'
          })}
        </motion.h3>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
