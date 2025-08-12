import { motion } from 'framer-motion';
import { useFetchComputers } from '@/api/hooks';
import { Spin } from 'antd';
import { useApp } from '@/Providers/Configuration';
import { useNavigate } from 'react-router-dom';

const Control = () => {
  const { data, isLoading, error } = useFetchComputers();
  const navigate = useNavigate();
  const { theme } = useApp();
  if (isLoading)
    return (
      <div>
        <Spin />
      </div>
    );
  if (error) return <div>Error</div>;
  return (
    <>
      <div className="flex flex-wrap items-start  gap-5 p-6">
        {data?.map((comp) => (
          <motion.div
            key={comp._id}
            layoutId={comp._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{
              boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
              backgroundColor:
                theme === 'dark' ? 'rgb(31, 41, 55)' : 'rgb(249, 250, 251)'
            }}
            onClick={() => navigate('/dashboard/control/' + comp._id)}
            className="bg-white dark:bg-[#1c1c1cd8] rounded-xl p-5 w-60 cursor-pointer shadow dark:shadow-black/50 select-none"
          >
            <h3 className="font-semibold mb-2 text-lg text-gray-900 dark:text-gray-100">
              {comp.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Yaratilgan: {new Date(comp.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Control;
