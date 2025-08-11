import { useParams } from 'react-router-dom';

import MonthlyPage from './ByMonth/ByMonth';
import DailyPage from './ByDay/ByDay';

const DayMonthController = () => {
  const { yyyymmdd: dateParam } = useParams();
  if (!dateParam) {
    return <div>Sanani tanlang</div>;
  }

  // Parametr uzunligi bilan aniqlash: 7 ta belgi => oy (YYYY-MM), 10 ta belgi => kun (YYYY-MM-DD)
  const isMonth = dateParam.length === 7;
  const isDay = dateParam.length === 10;

  return (
    <>
      {isMonth && <MonthlyPage date={dateParam} />}
      {isDay && <DailyPage date={dateParam} />}
      {!isMonth && !isDay && <div>Noto‘g‘ri formatdagi sana</div>}
    </>
  );
};

export default DayMonthController;
