'use client';

import { useParams, useSearchParams } from 'react-router-dom';
import { useFetchComputers, useFetchLogs } from '@/api/hooks';
import { motion } from 'framer-motion';
import { Calendar, Clock, Monitor, AlertCircle } from 'lucide-react';

const ControlDay = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get('year'));
  const month = Number(searchParams.get('month'));
  const date = Number(searchParams.get('date'));

  const { data: computers } = useFetchComputers();
  const currentComputer =
    computers?.find((c) => c._id === id) || computers?.[0];

  const { data, isLoading } = useFetchLogs({
    device: currentComputer?.name || '',
    page: 1,
    limit: 10000000000,
    from: new Date(year, month - 1, date).toISOString(),
    to: new Date(year, month - 1, date + 1).toISOString()
  });

  if (!year || !month || !date) return null;

  const selectedDate = new Date(year, month - 1, date);
  const formattedDate = selectedDate.toLocaleDateString('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Process logs data
  const logs = data?.data || [];

  // Group applications with their access times and count
  const appUsage = logs.reduce<
    Record<string, { count: number; times: string[] }>
  >((acc, log) => {
    const time = new Date(log.time).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (!acc[log.application]) {
      acc[log.application] = { count: 0, times: [] };
    }

    acc[log.application].count += 1;
    if (!acc[log.application].times.includes(time)) {
      acc[log.application].times.push(time);
    }

    return acc;
  }, {});

  // Sort applications by usage count
  const sortedApps = Object.entries(appUsage).sort(
    ([, a], [, b]) => b.count - a.count
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Ma'lumotlar yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {formattedDate}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentComputer?.name} • Kompyuter faoliyati
            </p>
          </div>
        </div>
      </div>

      {/* Simple summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              Jami {sortedApps.length} ta dastur ishlatilgan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {logs.length} ta hodisa
            </span>
          </div>
        </div>
      </div>

      {sortedApps.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ishlatilgan dasturlar
            </h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedApps.map(([app, { count, times }], index) => (
              <motion.div
                key={app}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {app}
                      </h4>
                    </div>

                    <div className="ml-11 space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {count} marta ishlatilgan
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {times.length} xil vaqtda
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {times.slice(0, 10).map((time, timeIndex) => (
                          <span
                            key={timeIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded"
                          >
                            {time}
                          </span>
                        ))}
                        {times.length > 10 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded">
                            +{times.length - 10} ko'proq
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* No Activity State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Bu kunda faollik qayd etilmagan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {formattedDate} kuni {currentComputer?.name} kompyuterida hech
            qanday faollik kuzatilmagan.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ControlDay;
