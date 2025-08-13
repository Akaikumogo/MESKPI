'use client';

import { motion } from 'framer-motion';
import { useFetchComputers } from '@/api/hooks';

import { useNavigate } from 'react-router-dom';
import { Monitor, Calendar, Activity, ChevronRight } from 'lucide-react';

const Control = () => {
  const { data, isLoading, error } = useFetchComputers();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Kompyuterlar yuklanmoqda...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Xatolik yuz berdi
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Kompyuterlarni yuklashda muammo
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      {/* <CHANGE> Simplified header without blue background and reduced spacing */}
      {/* <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Kompyuter Nazorati
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {data?.length || 0} ta kompyuter mavjud
        </p>
      </div> */}

      {/* <CHANGE> Simplified grid with minimal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.map((comp, index) => (
          <motion.div
            key={comp._id}
            layoutId={comp._id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.2,
                delay: index * 0.05
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/control/' + comp._id)}
            className="group bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          >
            {/* <CHANGE> Removed background patterns and complex animations */}

            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>

            {/* Computer Name */}
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
              {comp.name}
            </h3>

            {/* Creation Date */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(comp.createdAt).toLocaleDateString('uz-UZ')}
              </span>
            </div>

            {/* <CHANGE> Simplified action area with minimal blue accent */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Activity className="w-3 h-3" />
                <span>Batafsil</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* <CHANGE> Simplified empty state */}
      {data?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Kompyuter topilmadi
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            Hozircha nazorat qilish uchun kompyuter qo'shilmagan.
          </p>
        </div>
      )}
    </div>
  );
};

export default Control;
