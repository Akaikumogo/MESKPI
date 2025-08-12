import { useFetchComputers, useFetchLogs } from '@/api/hooks';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export default function ControlDayList() {
  const [searchParams] = useSearchParams();

  const year = Number(searchParams.get('year'));
  const month = Number(searchParams.get('month'));
  const date = Number(searchParams.get('date'));

  if (!year || !month || !date) return null;

  const { data: computers } = useFetchComputers();
  const { data: logsData } = useFetchLogs({
    device: '',
    page: 1,
    limit: 1000000000,
    from: new Date(year, month - 1, date, 0, 0, 0).toISOString(),
    to: new Date(year, month - 1, date + 1, 0, 0, 0).toISOString()
  });

  // Guruhlash
  const grouped: Record<string, typeof logsData.data> = {};
  logsData?.data.forEach((log) => {
    if (!grouped[log.device]) grouped[log.device] = [];
    grouped[log.device].push(log);
  });

  // Har bir device loglarini vaqt bo‘yicha tartiblash
  Object.keys(grouped).forEach((device) => {
    grouped[device].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });

  return (
    <div className="p-4 space-y-6">
      {computers?.map((comp) => {
        const logs = grouped[comp.name] || [];
        return (
          <div
            key={comp._id}
            className="bg-white dark:bg-[#121212] rounded-lg shadow p-4"
          >
            <h2 className="text-lg font-semibold mb-3 dark:text-white">
              {comp.name}
            </h2>
            {logs.length ? (
              <div className="space-y-2">
                {logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      log.type === 'login'
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-red-100 dark:bg-red-900'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium dark:text-white">
                        {log.application}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {dayjs(log.timestamp).format('HH:mm:ss')}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        log.type === 'login'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {log.type === 'login' ? 'Kirdi' : 'Chiqdi'}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Hech qanday log yo‘q</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
