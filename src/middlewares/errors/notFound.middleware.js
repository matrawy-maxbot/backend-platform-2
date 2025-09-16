import status from '../../config/status.config.js';

const notFoundMiddleware = (req, res, next) => {
    res.status(status.NOT_FOUND);
    next(new Error(`${status.NOT_FOUND} Not Found - ${req.originalUrl}`));
  };
  
  export default notFoundMiddleware;
  