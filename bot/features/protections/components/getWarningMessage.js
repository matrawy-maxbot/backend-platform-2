/**
 * الحصول على رسالة التحذير المناسبة حسب نوع العقوبة
 * Get appropriate warning message based on punishment type
 * @param {string} action - نوع العقوبة
 * @returns {string} - رسالة التحذير
 */
function getWarningMessage(action) {
  switch (action) {
    case 'delete':
      return 'This is your first warning. Next time your message will be deleted';
    case 'kick':
      return 'This is your first warning. Next time you will be kicked from the server';
    case 'ban':
      return 'This is your first warning. Next time you will be banned from the server';
    default:
      return 'This is your first warning. Next time the penalty will be applied';
  }
}
module.exports = {getWarningMessage};