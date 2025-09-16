export const scrape_interval = process.env.PROMETHEUS_SCRAPE_INTERVAL || '15s';
export const targets = {
  api: [process.env.API_TARGET || 'localhost:9090'],
  database: [process.env.DATABASE_TARGET || 'localhost:9091'],
  system: [process.env.SYSTEM_TARGET || 'localhost:9092']
};
export const tls = {
  enabled: process.env.TLS_ENABLED === 'true',
  cert_file: process.env.TLS_CERT_FILE,
  key_file: process.env.TLS_KEY_FILE
};