import moment from 'moment-timezone';

const showDate = (
    date: Date | number = new Date(),
    timeZone: string = 'UTC',
    format: string = 'MMM DD YYYY hh:mm:ss A'
): string => moment(date).tz(timeZone).format(format);

export { showDate };
