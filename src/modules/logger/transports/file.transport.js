import { format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const fileFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const fileTransport = new transports.File({
  filename: 'logs/app.log',
  format: combine(
    timestamp(),
    fileFormat
  ),
});