const loggerConfig = {
     level: 'info', // مستوى الـ Logging (مثل info, error, debug)
     transports: [
          'console', 
          'file', 
          'remote'
     ], // أماكن حفظ الـ Logs
     file: {
       filename: 'logs/app.log', // مسار حفظ الـ Logs في ملف
     },
     remote: {
       url: 'https://example.com/logs', // URL علشان ترسل الـ Logs لسيرفر خارجي
     },
   };
   
   export default loggerConfig;