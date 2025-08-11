'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Users, BookOpen, FileText } from 'lucide-react';

// KPI tizimiga moslashtirilgan ikonalar
const iconData = [
  {
    icon: LayoutDashboard,
    label: {
      uz: 'Asosiy Panel',
      ru: 'Главная Панель',
      en: 'Dashboard'
    },
    color: 'text-blue-500'
  },
  {
    icon: Users,
    label: {
      uz: 'Xodimlar',
      ru: 'Сотрудники',
      en: 'Personnel'
    },
    color: 'text-green-500'
  },
  {
    icon: BookOpen,
    label: {
      uz: 'O‘quv Modullari',
      ru: 'Учебные Модули',
      en: 'Training Modules'
    },
    color: 'text-purple-500'
  },
  {
    icon: FileText,
    label: {
      uz: 'Hisobotlar',
      ru: 'Отчеты',
      en: 'Reports'
    },
    color: 'text-orange-500'
  }
];

import { useTranslation } from '@/hooks/useTranslation';

export default function IconCards() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex justify-center flex-wrap gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {iconData.map((item, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center space-y-2"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div
            className={`p-4 rounded-full bg-opacity-10 ${item.color} bg-gray-200 dark:bg-white/10`}
          >
            <item.icon size={32} className={item.color} />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {t(item.label) || item.label.uz}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
