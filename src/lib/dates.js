/**
 * Date utility functions for Winter Arc 2026
 */

export const DEFAULT_START_DATE = '2026-10-01';
export const TOTAL_ARC_DAYS = 90;

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function calculateEndDate(startDateStr, duration = TOTAL_ARC_DAYS) {
  return addDays(startDateStr, duration - 1);
}

export function getDayDifference(startDateStr, targetDateStr) {
  const start = new Date(startDateStr + 'T00:00:00');
  const target = new Date(targetDateStr + 'T00:00:00');
  const diffTime = target.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function getCurrentArcDay(startDateStr, currentDateStr) {
  const diff = getDayDifference(startDateStr, currentDateStr);
  if (diff < 1) return 1;
  if (diff > TOTAL_ARC_DAYS) return TOTAL_ARC_DAYS;
  return diff;
}

export function getDaysRemaining(currentDay) {
  const remaining = TOTAL_ARC_DAYS - currentDay;
  return remaining < 0 ? 0 : remaining;
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = String(d.getFullYear()).slice(-2);
  return `${day} ${month} 20${year}`;
}

export function formatFullDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getWeekForDay(dayNumber) {
  return Math.ceil(dayNumber / 7);
}

export function getDateForDayNumber(startDateStr, dayNumber) {
  return addDays(startDateStr, dayNumber - 1);
}
