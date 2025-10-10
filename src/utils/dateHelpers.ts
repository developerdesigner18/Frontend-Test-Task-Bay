export function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function formatDueDate(dateString: string): string {
  const daysUntil = getDaysUntil(dateString);
  const formattedDate = formatDate(dateString);

  if (daysUntil < 0) {
    return `Overdue by ${Math.abs(daysUntil)} days (${formattedDate})`;
  } else if (daysUntil === 0) {
    return `Due today (${formattedDate})`;
  } else {
    return `Due in ${daysUntil} days (${formattedDate})`;
  }
}

export function isDateInRange(dateString: string, startDate: string, endDate: string): boolean {
  const date = new Date(dateString);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && date < start) return false;
  if (end && date > end) return false;

  return true;
}

export function isDateWithinDays(dateString: string, days: number): boolean {
  const daysUntil = getDaysUntil(dateString);
  return daysUntil >= 0 && daysUntil <= days;
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount}`;
  }
}
