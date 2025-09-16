import cors from 'cors';
import { CORS_ORIGIN, CORS_METHODS, CORS_HEADERS } from '../../config/security.config.js';

const corsMiddleware = cors({
  origin: CORS_ORIGIN,
  methods: CORS_METHODS,
  allowedHeaders: CORS_HEADERS,
});

export default corsMiddleware;
