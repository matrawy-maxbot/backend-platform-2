import { createLogger, format, transports } from 'winston';
import loggerConfig from '../config/logger.config.js';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const loggerTransports = [];
if (loggerConfig.transports.includes('console')) {
  loggerTransports.push(new transports.Console());
}
if (loggerConfig.transports.includes('file')) {
  loggerTransports.push(new transports.File({ filename: loggerConfig.file.filename }));
}
if (loggerConfig.transports.includes('remote')) {
  loggerTransports.push(new transports.Http({
    host: loggerConfig.remote.url,
    path: '/logs',
    ssl: true,
  }));
}

const logger = createLogger({
  level: loggerConfig.level,
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: loggerTransports,
});

export default logger;