import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
};

export const getDateRange = (type) => {
  const now = new Date();
  let start, end;

  switch (type) {
    case 'day':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'week':
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    default:
      start = startOfDay(now);
      end = endOfDay(now);
  }

  return { start, end };
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

