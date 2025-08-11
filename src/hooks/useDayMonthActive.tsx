import { useLocation } from "react-router-dom";

export function useScheduleActive(type: 'day' | 'month') {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  const scheduleIndex = parts.indexOf('schedule');
  if (scheduleIndex === -1 || !parts[scheduleIndex + 1]) return false;

  const datePart = parts[scheduleIndex + 1];

  if (type === 'day') {
    // YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(datePart);
  }
  if (type === 'month') {
    // YYYY-MM (lekin YYYY-MM-DD bo'lmasligi kerak)
    return (
      /^\d{4}-\d{2}$/.test(datePart) && !/^\d{4}-\d{2}-\d{2}$/.test(datePart)
    );
  }
  return false;
}
