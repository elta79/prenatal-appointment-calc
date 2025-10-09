/**
 * Utility functions for calculating prenatal appointments
 */

/**
 * Add days to a date
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date, days) {
  return addDays(date, -days);
}

/**
 * Format date as readable string
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate date at specific weeks of gestation
 * Due date is 40 weeks, so we subtract (40 - targetWeeks) * 7 days
 */
export function calculateWeekDate(dueDate, weeks) {
  const daysToSubtract = (40 - weeks) * 7;
  return subtractDays(dueDate, daysToSubtract);
}

/**
 * Find the closest Friday before a given date
 */
export function findFridayBefore(date) {
  const result = new Date(date);
  // Get day of week (0 = Sunday, 5 = Friday)
  const dayOfWeek = result.getDay();

  // Calculate days to subtract to get to Friday
  let daysToSubtract;
  if (dayOfWeek === 5) {
    // If it's already Friday, go back 7 days
    daysToSubtract = 7;
  } else if (dayOfWeek === 6) {
    // Saturday - go back 1 day
    daysToSubtract = 1;
  } else {
    // Sunday (0) through Thursday (4)
    // Sunday: 0 + 2 = 2 days back
    // Monday: 1 + 2 = 3 days back
    // Thursday: 4 + 2 = 6 days back
    daysToSubtract = dayOfWeek === 0 ? 2 : dayOfWeek + 2;
  }

  return subtractDays(result, daysToSubtract);
}

/**
 * Find the closest Friday after a given date
 */
export function findFridayAfter(date) {
  const result = new Date(date);
  const dayOfWeek = result.getDay();

  // Calculate days to add to get to Friday
  let daysToAdd;
  if (dayOfWeek === 5) {
    // If it's already Friday, go forward 7 days
    daysToAdd = 7;
  } else if (dayOfWeek < 5) {
    // Before Friday in the same week
    daysToAdd = 5 - dayOfWeek;
  } else {
    // Saturday (6) or Sunday (0)
    daysToAdd = dayOfWeek === 6 ? 6 : 5;
  }

  return addDays(result, daysToAdd);
}

/**
 * Find two closest Fridays (one before, one after) for a specific week
 */
export function findClosestFridays(dueDate, targetWeek) {
  const targetDate = calculateWeekDate(dueDate, targetWeek);
  return {
    before: findFridayBefore(targetDate),
    after: findFridayAfter(targetDate)
  };
}

/**
 * Find Fridays within or closest to a date range
 * Returns one Friday before/within and one after/within the range
 */
export function findFridaysInRange(startDate, endDate) {
  // Find Friday closest to start (before or within)
  let fridayStart = new Date(startDate);
  const startDayOfWeek = fridayStart.getDay();

  if (startDayOfWeek <= 5) {
    // If start is before or on Friday, find that Friday
    const daysToFriday = startDayOfWeek === 5 ? 0 : 5 - startDayOfWeek;
    fridayStart = addDays(fridayStart, daysToFriday);
  } else {
    // If start is Saturday or Sunday, get next Friday
    const daysToFriday = startDayOfWeek === 6 ? 6 : 5;
    fridayStart = addDays(fridayStart, daysToFriday);
  }

  // If this Friday is after the end date, use the Friday before start
  if (fridayStart > endDate) {
    fridayStart = findFridayBefore(startDate);
  }

  // Find the next Friday after fridayStart
  const fridayEnd = addDays(fridayStart, 7);

  return {
    first: fridayStart,
    second: fridayEnd
  };
}

/**
 * Get the first Saturday of a given month
 */
export function getFirstSaturday(year, month) {
  // Month is 0-indexed (0 = January)
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();

  // Calculate days until Saturday (6)
  const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;

  return addDays(firstDay, daysUntilSaturday);
}

/**
 * Get the third Thursday of a given month
 */
export function getThirdThursday(year, month) {
  // Month is 0-indexed (0 = January)
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();

  // Calculate days until first Thursday (4)
  const daysUntilThursday = dayOfWeek === 4 ? 0 : (4 - dayOfWeek + 7) % 7;
  const firstThursday = addDays(firstDay, daysUntilThursday);

  // Third Thursday is 14 days after first Thursday
  return addDays(firstThursday, 14);
}

/**
 * Calculate all prenatal appointments based on due date
 */
export function calculateAppointments(dueDateString) {
  // Parse the date string as local time to avoid timezone issues
  // Input format is "YYYY-MM-DD"
  const [year, month, day] = dueDateString.split('-').map(num => parseInt(num, 10));
  const dueDate = new Date(year, month - 1, day);

  // Calculate the month before the due date month
  const monthBeforeDue = dueDate.getMonth() === 0 ? 11 : dueDate.getMonth() - 1;
  const yearForClasses = dueDate.getMonth() === 0 ? dueDate.getFullYear() - 1 : dueDate.getFullYear();

  // 20 week ultrasound - just the date, no Fridays needed
  const week20 = calculateWeekDate(dueDate, 20);

  // Glucose test - 26-28 weeks range, find 2 closest Fridays
  const week26 = calculateWeekDate(dueDate, 26);
  const week28 = calculateWeekDate(dueDate, 28);
  const glucoseFridays = findFridaysInRange(week26, week28);

  // 32 week appointment - 2 closest Fridays
  const week32Fridays = findClosestFridays(dueDate, 32);

  // 36 week labs - 2 closest Fridays
  const week36Fridays = findClosestFridays(dueDate, 36);

  // 37 week appointment - 2 closest Fridays
  const week37Fridays = findClosestFridays(dueDate, 37);

  // Classes
  const childbirthClass = getFirstSaturday(yearForClasses, monthBeforeDue);
  const breastfeedingClass = getThirdThursday(yearForClasses, monthBeforeDue);

  return {
    dueDate: {
      date: dueDate,
      weeks: 40
    },
    ultrasound20Week: {
      date: week20,
      weeks: 20
    },
    glucoseTest: {
      rangeStart: week26,
      rangeEnd: week28,
      fridays: [glucoseFridays.first, glucoseFridays.second],
      weeks: '26-28'
    },
    week32: {
      fridays: [week32Fridays.before, week32Fridays.after],
      weeks: 32
    },
    week36Labs: {
      fridays: [week36Fridays.before, week36Fridays.after],
      weeks: 36
    },
    week37: {
      fridays: [week37Fridays.before, week37Fridays.after],
      weeks: 37
    },
    childbirthClass: {
      date: childbirthClass,
      description: 'First Saturday of the month before due date'
    },
    breastfeedingClass: {
      date: breastfeedingClass,
      description: 'Third Thursday of the month before due date'
    }
  };
}
