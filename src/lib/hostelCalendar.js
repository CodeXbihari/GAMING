const hostelDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export function hostelCalendarDay(now = new Date()) {
  const parts = hostelDate.formatToParts(now);
  const value = type => Number(parts.find(part => part.type === type).value);
  return new Date(value('year'), value('month') - 1, value('day'));
}
