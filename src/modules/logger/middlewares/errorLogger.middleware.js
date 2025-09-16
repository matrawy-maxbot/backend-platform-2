import logger from '../utils/logger.util.js';
import status from '../../../config/status.config.js';

export const errorLogger = (err, req, res, next) => {
  logger.error(`${err.status || status.INTERNAL_SERVER_ERROR} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  next(err);
};