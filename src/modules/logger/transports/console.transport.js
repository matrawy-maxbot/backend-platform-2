import { format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const consoleTransport = new transports.Console({
  format: combine(
    timestamp(),
    consoleFormat
  ),
});