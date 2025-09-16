import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to environments folder
const environmentsPath = path.join(__dirname, 'environments');

// Load all environment files
const envFiles = [
  'Database.env',
  'Server.env',
  'Security.env',
  'FileStorage.env',
  'GraphQL.env',
  'IntegratedAuthentication.env',
  'Kafka.env',
  'Notifications.env',
  'Queue.env',
  'SessionCookies.env',
  'Webhooks.env',
  'Websocket.env'
];

// Load each environment file
envFiles.forEach(envFile => {
  const envPath = path.join(environmentsPath, envFile);
  try {
    dotenv.config({ path: envPath });
    console.log(`✅ Environment file loaded: ${envFile}`);
  } catch (error) {
    console.warn(`⚠️ Failed to load environment file: ${envFile}`, error.message);
  }
});

console.log('🚀 All environment files loaded successfully');

// Export function to reload environment files if needed
export const reloadEnvironments = () => {
  envFiles.forEach(envFile => {
    const envPath = path.join(environmentsPath, envFile);
    try {
      dotenv.config({ path: envPath, override: true });
    } catch (error) {
      console.warn(`⚠️ Failed to reload environment file: ${envFile}`, error.message);
    }
  });
};