import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, differenceInDays } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  return format(date, formatStr);
};

export const formatDisplayDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const getTodayString = () => {
  return formatDate(new Date());
};

export const getMonthDays = (year, month) => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return eachDayOfInterval({ start, end });
};

export const isSameDayHelper = (date1, date2) => {
  return isSameDay(parseISO(date1), parseISO(date2));
};

export const isTodayHelper = (dateStr) => {
  return isToday(parseISO(dateStr));
};

export const addDaysToDate = (dateStr, days) => {
  return formatDate(addDays(parseISO(dateStr), days));
};

export const getDaysBetween = (date1Str, date2Str) => {
  return differenceInDays(parseISO(date2Str), parseISO(date1Str));
};

export const getMonthName = (monthNum) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNum - 1] || '';
};