import type React from 'react';

import { useParams, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Activity,
  ChevronRight,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useFetchComputers, useFetchLogs } from '@/api/hooks';

// Simple Tag component
const Tag = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-block px-2 py-1 text-xs rounded-lg font-medium ${className}`}
  >
    {children}
  </span>
);

const Card = ({ day, index }: { day: number; index: number }) => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const month = Number(searchParams.get('month'));
  const year = Number(searchParams.get('year'));

  const handleClick = () => {
    const updated = new URLSearchParams(searchParams);
    updated.set('date', day.toString());
    setSearchParams(updated);
  };

  const { data: computers } = useFetchComputers();
  const currentComputer =
    computers?.find((c) => c._id === id) || computers?.[0];
  const { data } = useFetchLogs({
    device: currentComputer?.name || '',
    page: 1,
    limit: 10000000000,
    from: new Date(year, month - 1, day).toISOString(),
    to: new Date(year, month - 1, day + 1).toISOString()
  });

  const uniqByApp = data?.data.reduce<string[]>((acc, cur) => {
    if (!acc.some((item) => item === cur.application)) {
      acc.push(cur.application);
    }
    return acc;
  }, []);

  const hasActivity = uniqByApp && uniqByApp.length > 0;
  const isWeekend =
    new Date(year, month - 1, day).getDay() === 0 ||
    new Date(year, month - 1, day).getDay() === 6;

  return (
    <div
      key={`day-${index}`}
      onClick={handleClick}
      className={`
        group cursor-pointer relative overflow-hidden
        rounded-lg p-5 min-h-[140px] w-full
        border transition-all duration-300 ease-out
        ${
          hasActivity
            ? 'border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600'
            : isWeekend
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md'
            : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-600'
        }
      `}
    >
      {isWeekend && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      )}

      {!hasActivity && !isWeekend && (
        <div className="absolute top-3 right-3">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
        </div>
      )}

      {hasActivity && (
        <div className="absolute top-3 right-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      )}

      {/* Date display */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {new Date(year, month - 1, day).toLocaleDateString('uz-UZ', {
              weekday: 'short'
            })}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {day.toString().padStart(2, '0')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{`${year}.${month
          .toString()
          .padStart(2, '0')}`}</p>
      </div>

      {/* Applications */}
      <div className="relative z-10 space-y-3">
        {hasActivity ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {uniqByApp.length} ta dastur
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {uniqByApp.slice(0, 3).map((app, idx) => (
                <Tag
                  key={idx}
                  className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                >
                  {app.length > 8 ? `${app.slice(0, 8)}...` : app}
                </Tag>
              ))}
              {uniqByApp.length > 3 && (
                <Tag className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  +{uniqByApp.length - 3}
                </Tag>
              )}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Batafsil ko'rish
              </span>
              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </>
        ) : isWeekend ? (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Dam olish kuni
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              Faollik yo'q
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ControlMonth = () => {
  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get('year'));
  const month = Number(searchParams.get('month'));

  if (!year || !month) return null;

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = new Date(year, month - 1, 1).toLocaleDateString('uz-UZ', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {monthName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kunlik faollik monitoring hisoboti
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Faol</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Faollik yo'q
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Dam olish
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
        {days.map((day, index) => (
          <Card day={day} index={index} key={day} />
        ))}
      </div>
    </div>
  );
};

export default ControlMonth;
