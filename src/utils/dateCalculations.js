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
    weekday: 'short',
    year: 'numeric',
    month: 'short',
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
 * Find the next occurrence of a specific day of week from a given date
 * @param {Date} date - Starting date
 * @param {number} targetDay - Day of week (0=Sunday, 1=Monday, etc.)
 * @param {boolean} includeToday - Whether to include the starting date if it matches
 */
export function findNextDayOfWeek(date, targetDay, includeToday = false) {
  const result = new Date(date);
  const currentDay = result.getDay();

  let daysToAdd;
  if (currentDay === targetDay && includeToday) {
    daysToAdd = 0;
  } else if (currentDay < targetDay) {
    daysToAdd = targetDay - currentDay;
  } else {
    daysToAdd = 7 - currentDay + targetDay;
  }

  return addDays(result, daysToAdd);
}

/**
 * Find the exact Friday at a specific week of gestation
 */
export function findFridayAtWeek(dueDate, week) {
  const targetDate = calculateWeekDate(dueDate, week);
  return findNextDayOfWeek(targetDate, 5, true);
}

/**
 * Get alternating lab Fridays starting from January 9, 2026
 * Returns the two lab Friday options closest to the target date
 */
export function getLabFridays(targetDate) {
  // Reference date: January 9, 2026 is a lab Friday
  const referenceDate = new Date(2026, 0, 9); // Month is 0-indexed

  // Calculate weeks difference
  const daysDiff = Math.floor((targetDate - referenceDate) / (1000 * 60 * 60 * 24));
  const weeksDiff = Math.floor(daysDiff / 7);

  // Find the lab Friday on or before target date
  const weeksToReference = Math.floor(weeksDiff / 2) * 2;
  const labFriday1 = addDays(referenceDate, weeksToReference * 7);

  // Get the next lab Friday (2 weeks later)
  const labFriday2 = addDays(labFriday1, 14);

  // If labFriday1 is way before target, use the next one
  if (labFriday1 < subtractDays(targetDate, 14)) {
    return [labFriday2, addDays(labFriday2, 14)];
  }

  return [labFriday1, labFriday2];
}

/**
 * Find Monday and Wednesday options for a given week
 */
export function getMondayWednesdayOptions(targetDate) {
  const monday = findNextDayOfWeek(subtractDays(targetDate, 3), 1, true);
  const wednesday = findNextDayOfWeek(subtractDays(targetDate, 3), 3, true);

  return [monday, wednesday];
}

/**
 * Get the first Saturday of a given month
 */
export function getFirstSaturday(year, month) {
  const firstDay = new Date(year, month, 1);
  return findNextDayOfWeek(firstDay, 6, true);
}

/**
 * Get the third Thursday of a given month
 */
export function getThirdThursday(year, month) {
  const firstDay = new Date(year, month, 1);
  const firstThursday = findNextDayOfWeek(firstDay, 4, true);
  return addDays(firstThursday, 14);
}

/**
 * Find two Friday telehealth options around a target week
 */
export function getTelehealthFridayOptions(dueDate, week) {
  const targetDate = calculateWeekDate(dueDate, week);
  const friday1 = findNextDayOfWeek(subtractDays(targetDate, 3), 5, true);
  const friday2 = addDays(friday1, 7);
  return [friday1, friday2];
}

/**
 * Calculate all prenatal appointments based on due date
 */
export function calculateAppointments(dueDateString) {
  const [year, month, day] = dueDateString.split('-').map(num => parseInt(num, 10));
  const dueDate = new Date(year, month - 1, day);

  // First Trimester
  const week13 = calculateWeekDate(dueDate, 13);
  const week11 = calculateWeekDate(dueDate, 11);
  const initialTelehealth = findFridayAtWeek(dueDate, 11);
  const initialLabs = getLabFridays(week11);
  const firstOfficeVisit = getMondayWednesdayOptions(addDays(initialTelehealth, 3));

  // Second Trimester - Monthly appointments (every 4 weeks) from first office visit until 28 weeks
  const week20 = calculateWeekDate(dueDate, 20);
  const week16 = calculateWeekDate(dueDate, 16);
  const week24 = calculateWeekDate(dueDate, 24);
  const week28 = calculateWeekDate(dueDate, 28);

  const secondTrimesterAppts = [
    { week: 16, dates: getMondayWednesdayOptions(week16) },
    { week: 20, dates: getMondayWednesdayOptions(week20), hasAppointment: true },
    { week: 20, date: week20, isUltrasound: true },
    { week: 24, dates: getMondayWednesdayOptions(week24) },
    { week: 28, dates: getMondayWednesdayOptions(week28) }
  ];

  // Third Trimester - Every 2 weeks from 28-36 weeks
  const week30 = calculateWeekDate(dueDate, 30);
  const week32 = calculateWeekDate(dueDate, 32);
  const week34 = calculateWeekDate(dueDate, 34);
  const week36 = calculateWeekDate(dueDate, 36);

  const glucoseTest = getLabFridays(calculateWeekDate(dueDate, 27));
  const week32Telehealth = getTelehealthFridayOptions(dueDate, 32);
  const week36Labs = getLabFridays(week36);

  const thirdTrimesterAppts = [
    { week: 30, dates: getMondayWednesdayOptions(week30) },
    { week: 32, telehealth: week32Telehealth },
    { week: 34, dates: getMondayWednesdayOptions(week34) },
    { week: 36, dates: getMondayWednesdayOptions(week36), labs: week36Labs }
  ];

  // Weekly appointments from 36-41 weeks
  const week37 = calculateWeekDate(dueDate, 37);
  const week38 = calculateWeekDate(dueDate, 38);
  const week39 = calculateWeekDate(dueDate, 39);
  const week40 = dueDate;
  const week41 = calculateWeekDate(dueDate, 41);

  const week37Telehealth = getTelehealthFridayOptions(dueDate, 37);

  const weeklyAppts = [
    { week: 37, telehealth: week37Telehealth },
    { week: 38, dates: getMondayWednesdayOptions(week38) },
    { week: 39, dates: getMondayWednesdayOptions(week39) },
    { week: 40, dates: getMondayWednesdayOptions(week40), isWeek40: true },
    { week: 41, dates: getMondayWednesdayOptions(week41), week41Date: week41, isWeek41: true }
  ];

  // Classes
  const monthBeforeDue = dueDate.getMonth() === 0 ? 11 : dueDate.getMonth() - 1;
  const yearForClasses = dueDate.getMonth() === 0 ? dueDate.getFullYear() - 1 : dueDate.getFullYear();
  const childbirthClass = getFirstSaturday(yearForClasses, monthBeforeDue);
  const breastfeedingClass = getThirdThursday(yearForClasses, monthBeforeDue);

  return {
    firstTrimester: {
      week13,
      initialTelehealth,
      initialLabs,
      firstOfficeVisit
    },
    secondTrimester: secondTrimesterAppts,
    glucoseTest,
    thirdTrimester: thirdTrimesterAppts,
    weeklyAppts,
    classes: {
      childbirth: childbirthClass,
      breastfeeding: breastfeedingClass
    },
    birthRehearsal: {
      week36Date: week36
    },
    dueDate
  };
}
