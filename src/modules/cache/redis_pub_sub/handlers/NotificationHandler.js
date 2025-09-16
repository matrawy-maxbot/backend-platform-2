// redis_pub_sub/handlers/NotificationHandler.js
class NotificationHandler {
     static handle(message) {
       switch (message.type) {
         case 'EMAIL':
           this.sendEmail(message.data);
           break;
         case 'SMS':
           this.sendSMS(message.data);
           break;
         default:
           console.warn('⚠️ نوع إشعار غير معروف:', message.type);
       }
     }
   
     static sendEmail(data) {
       console.log(`📧 إرسال إيميل إلى ${data.email}: ${data.text}`);
       // استخدم مكتبة مثل nodemailer هنا
     }
   
     static sendSMS(data) {
       console.log(`📱 إرسال SMS إلى ${data.phone}: ${data.text}`);
       // استخدم مكتبة مثل twilio هنا
     }
   }
   
   export default NotificationHandler;