import responseTime from 'response-time';

const responseTimeMiddleware = responseTime((req, res, time) => {
  console.log(`[Response Time] ${req.method} ${req.url} - ${time.toFixed(2)}ms`);
});

export default responseTimeMiddleware;
