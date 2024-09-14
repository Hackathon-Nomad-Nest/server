const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateTimeFormatTwelveHour = 'YYYY-MM-DD hh:mm A';

const timeFormat = 'HH:mm';

const dateFormatter = {
  YYYYMMDD: dateFormat,
  MMDDYYYY: 'MM-DD-YYYY',
  YYYYMMDDHHmm: dateTimeFormat,
  YYYYMMDDhhmmA: dateTimeFormatTwelveHour,
  MMDDYYYY_WITH_SLASHES: 'MM/DD/YYYY',
  MMMDDYYYYHHMMSS: 'MMM DD, YYYY hh:mm A',
};

const timeFormatter = {
  HHmm: timeFormat,
  hhmma: 'hh:mm a',
};

const getStartOfTheDay = (date, format = dateFormat) => {
  return moment.utc(date, format).startOf('day');
};

// Helper function to get the end of the day
const getEndOfTheDay = (date, format = dateFormat) => {
  return moment.utc(date, format).endOf('day');
};

// Helper function to get the date difference in the specified unit
const getDateDiff = (startDate, endDate, { unit }) => {
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);
  return end.diff(start, unit);
};

const getStartOfTheDayWithTZ = (date, { timezone, format = dateFormat }) => {
  return moment.tz(date, format, timezone).startOf('day').toDate();
};

const getEndOfTheDayWithTZ = (date, { timezone, format = dateFormat }) => {
  return moment.tz(date, format, timezone).endOf('day').toDate();
};

const getStartOfTheWeekWithTZ = (date, { timezone, format = dateFormat }) => {
  return moment.tz(date, format, timezone).startOf('week').toDate();
};

const getEndOfTheWeekWithTZ = (date, { timezone, format = dateFormat }) => {
  return moment.tz(date, format, timezone).endOf('week').toDate();
};

const convertToUtc = (date, { timezone, format = dateFormat }) => {
  return moment.tz(date, format, timezone).utc().format();
};

const formatDate = (date, { timezone = 'UTC', format = dateFormat } = {}) => {
  return moment.utc(date).tz(timezone).format(format);
};

const formatDateWithoutTz = (date, { format = dateFormat }) => {
  return moment(date).format(format);
};

const getDayMonthYearFromDate = ({ date = new Date(), timezone = 'America/New_York' }) => {
  const dateMoment = moment.tz(date, timezone);
  const dayOfMonth = dateMoment.format('D');
  const month = dateMoment.format('M');
  const year = dateMoment.format('YYYY');
  return { dayOfMonth, month, year };
};

const getCurrentMinuteRange = () => {
  const currentDate = moment().utc();
  const start = currentDate.clone().startOf('minute');
  const end = currentDate.clone().endOf('minute');
  return { start, end };
};

const getTimezoneAbbreviation = (timezone) => moment.tz(timezone.toString()).format('z');

const isValidDateFromSearchFilter = (dateStr = '') => {
  if (dateStr.includes('-')) {
    dateStr = dateStr.replaceAll('-', '');
  }

  if (dateStr.includes('/')) {
    dateStr = dateStr.replaceAll('/', '');
  }

  if (dateStr.length !== 8) {
    return false;
  }

  // Parse the string into parts
  const month = parseInt(dateStr.substring(0, 2), 10);
  const day = parseInt(dateStr.substring(2, 4), 10);
  const year = parseInt(dateStr.substring(4, 8), 10);

  // Check the ranges of month and year
  if (month < 1 || month > 12 || year < 1000 || year > 9999) {
    return false;
  }

  // Create a date object with the parsed values
  const dateObj = new Date(year, month - 1, day);

  // Check if the date object is valid and the values match the input
  if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
    return false;
  }

  return true;
};

const getDateFromSearchText = (dateStr = '') => {
  if (dateStr.includes('-')) {
    dateStr = dateStr.replaceAll('-', '');
  }

  if (dateStr.includes('/')) {
    dateStr = dateStr.replaceAll('/', '');
  }
  // Assuming dateStr is a valid date in MMDDYYYY format
  const year = dateStr.substring(4);
  const month = dateStr.substring(0, 2);
  const day = dateStr.substring(2, 4);

  // Construct the date in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
};

module.exports = {
  getDateDiff,
  getEndOfTheDay,
  getStartOfTheDay,
  dateFormat,
  dateTimeFormat,
  timeFormat,
  convertToUtc,
  getStartOfTheDayWithTZ,
  getEndOfTheDayWithTZ,
  getStartOfTheWeekWithTZ,
  getEndOfTheWeekWithTZ,
  formatDate,
  formatDateWithoutTz,
  dateTimeFormatTwelveHour,
  dateFormatter,
  getDayMonthYearFromDate,
  timeFormatter,
  getCurrentMinuteRange,
  getTimezoneAbbreviation,
  isValidDateFromSearchFilter,
  getDateFromSearchText,
};
