import { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, FIREBASE_API_KEY } from '../../../config/notifications.config.js';

const notificationsConfig = {
     email: {
       service: EMAIL_HOST || 'gmail',
       auth: {
         user: EMAIL_USER,
         pass: EMAIL_PASSWORD,
       },
     },
     sms: {
       provider: 'twilio',
       accountSid: TWILIO_ACCOUNT_SID,
       authToken: TWILIO_AUTH_TOKEN,
       from: TWILIO_PHONE_NUMBER,
     },
     push: {
       provider: 'firebase',
       apiKey: FIREBASE_API_KEY,
     },
   };
   
   export default notificationsConfig;