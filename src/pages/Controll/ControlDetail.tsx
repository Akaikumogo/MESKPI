/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ControlYear from './ControlYear';
import ControlMonth from './ControlMonth';
import { AnimatePresence, motion } from 'motion/react';
import ControlDay from './ControlDay';
import { ArrowLeft } from 'lucide-react';

const ControlDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const now = dayjs();
  // <CHANGE> Added back button functionality
  const handleBack = () => {
    navigate(-1);
  };

  // Boshlanishida faqat year param qo'shish
  useEffect(() => {
    if (!searchParams.get('year')) {
      const updated = new URLSearchParams(searchParams);
      updated.set('year', now.year().toString());
      setSearchParams(updated);
    }
  }, []);

  const updateParam = (key: string, value?: string | null) => {
    const updated = new URLSearchParams(searchParams);
    if (value) {
      updated.set(key, value);
    } else {
      updated.delete(key);
    }
    setSearchParams(updated);
  };

  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const date = searchParams.get('date');

  return (
    <div className="">
      {/* <CHANGE> Added back button and government branding */}

      {/* Date Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Orqaga</span>
          </button>
          {/* Year picker */}
          <div className="flex flex-col gap-2">
            <DatePicker
              picker="year"
              allowClear={false}
              value={year ? dayjs(year, 'YYYY') : null}
              onChange={(value) => {
                updateParam('year', value ? value.year().toString() : null);
              }}
            />
          </div>

          {/* Month picker */}
          <div className="flex flex-col gap-2">
            <DatePicker
              picker="month"
              value={
                year && month
                  ? dayjs(
                      `${year}-${String(month).padStart(2, '0')}`,
                      'YYYY-MM'
                    )
                  : null
              }
              onChange={(value) => {
                updateParam(
                  'month',
                  value ? (value.month() + 1).toString() : null
                );
              }}
            />
          </div>

          {/* Date picker */}
          <div className="flex flex-col gap-2">
            <DatePicker
              value={
                year && month && date
                  ? dayjs(
                      `${year}-${String(month).padStart(2, '0')}-${String(
                        date
                      ).padStart(2, '0')}`,
                      'YYYY-MM-DD'
                    )
                  : null
              }
              onChange={(value) => {
                updateParam('date', value ? value.date().toString() : null);
              }}
            />
          </div>
        </div>

        {/* Current Selection Display */}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" presenceAffectsLayout>
        {year && month && date ? (
          <motion.div
            key="day"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ControlDay />
          </motion.div>
        ) : year && month && !date ? (
          <motion.div
            key="month"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ControlMonth />
          </motion.div>
        ) : year && !month && !date ? (
          <motion.div
            key="year"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ControlYear />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ControlDetail;
