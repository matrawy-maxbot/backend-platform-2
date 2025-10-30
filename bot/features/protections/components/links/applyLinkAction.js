const { applyPunishment } = require('../applyPunishment');

/**
 * تطبيق إجراء الرابط
 * Apply link action
 * @param {Message} message - الرسالة
 * @param {string} action - الإجراء (delete, warn, timeout)
 * @param {string} linkContent - محتوى الرابط
 */
async function applyLinkAction(message, action, linkContent) {
  try {
    const reason = `Blocked link detected: ${linkContent}`;
    return await applyPunishment(message, action, reason);
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error applying link action:`, error);
    return { success: false, action: `Error: ${error.message}` };
  }
}

module.exports = {applyLinkAction};