/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import ControlYear from './ControlYear';
import ControlMonth from './ControlMonth';
import { AnimatePresence, motion } from 'motion/react';
import ControlDay from './ControlDay';

const ControlDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = dayjs();

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
    <div>
      <div className="p-4 flex gap-4">
        {/* Year picker */}
        <DatePicker
          picker="year"
          allowClear={false}
          value={year ? dayjs(year, 'YYYY') : null}
          onChange={(value) => {
            updateParam('year', value ? value.year().toString() : null);
          }}
        />

        {/* Month picker */}
        <DatePicker
          picker="month"
          value={
            year && month
              ? dayjs(`${year}-${String(month).padStart(2, '0')}`, 'YYYY-MM')
              : null
          }
          onChange={(value) => {
            updateParam('month', value ? (value.month() + 1).toString() : null);
          }}
        />

        {/* Date picker */}
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

      <AnimatePresence mode="wait" presenceAffectsLayout>
        {year && month && date ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ControlDay />
          </motion.div>
        ) : year && month && !date ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ControlMonth />
          </motion.div>
        ) : year && !month && !date ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <ControlYear />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ControlDetail;
