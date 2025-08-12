import type { Log } from '@/api/axiosInstance';
import { useFetchComputers, useFetchLogs } from '@/api/hooks';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';

const Card = ({ day, index }: { day: number; index: number }) => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const month = Number(searchParams.get('month'));
  const year = Number(searchParams.get('year'));
  const handleClick = () => {
    const updated = new URLSearchParams(searchParams);
    updated.set('date', day.toString()); // date param
    setSearchParams(updated);
  };
  const { data: computers } = useFetchComputers();
  const currentComputer = computers?.find((c) => c._id === id);
  const { data } = useFetchLogs({
    device: currentComputer?.name || '',
    page: 1,
    limit: 10000000000,
    from: new Date(year, month - 1, day).toISOString(),
    to: new Date(year, month - 1, day + 1).toISOString()
  });
  const uniqByApp = data?.data.reduce<string[]>((acc, cur) => {
    // agar shu application hali acc ichida bo‘lmasa – qo‘shamiz
    if (!acc.some((item) => item === cur.application)) {
      acc.push(cur.application);
    }
    return acc;
  }, []);
  console.log(uniqByApp);
  return (
    <motion.div
      layoutId={`${index}`}
      key={index}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.15 }
      }}
      onClick={handleClick}
      className="cursor-pointer rounded-lg h-20 flex items-center justify-center border border-slate-300 dark:border-[#5a5a5ad8]  p-2 text-center shadow-sm dark:bg-[#131313d8] bg-white dark:text-white"
    >
      {`${year}.${month >= 0 && month <= 9 ? '0' + month : month}.${
        day >= 0 && day <= 9 ? '0' + day : day
      }`}
    </motion.div>
  );
};

const ControlMonth = () => {
  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get('year'));
  const month = Number(searchParams.get('month'));

  // Agar year yoki month bo‘lmasa, hech narsa chiqarmaymiz
  if (!year || !month) return null;

  // Oyda nechta kun borligini aniqlash
  const daysInMonth = new Date(year, month, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-2 p-6">
      {days.map((day, index) => (
        <Card day={day} index={index} key={day} />
      ))}
    </div>
  );
};

export default ControlMonth;
