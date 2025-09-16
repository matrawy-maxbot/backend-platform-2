import { transports } from 'winston';
import axios from 'axios';

export const remoteTransport = new transports.Http({
  host: 'example.com',
  path: '/logs',
  ssl: true,
  format: log => {
    return axios.post('https://example.com/logs', log);
  },
});