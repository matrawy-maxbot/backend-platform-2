const { applyPunishment } = require('../applyPunishment');

/**
 * فحص محتوى القنوات بناءً على الإعدادات المحددة
 * @param {Object} message - رسالة Discord
 * @param {Object} channelSettings - إعدادات حماية المحتوى
 * @param {Object} guild - خادم Discord
 * @returns {Object} نتيجة الفحص
 */
async function checkChannelContent(message, channelSettings, guild) {
    try {
        // التحقق من وجود الإعدادات
        if (!channelSettings || !channelSettings.enabled) {
            return { success: true };
        }

        const channelId = message.channel.id;
        const messageContent = message.content;
        const hasAttachments = message.attachments && message.attachments.size > 0;
        const isBotCommand = messageContent.startsWith('!') || messageContent.startsWith('/') || messageContent.startsWith('?');
        
        console.log(`[Channel Content Protection] فحص الرسالة في القناة: ${channelId}`);
        console.log(`[Channel Content Protection] نوع المحتوى - نص: ${!!messageContent}, مرفقات: ${hasAttachments}, أوامر بوت: ${isBotCommand}`);

        // التحقق من وضع الحماية العام
        if (channelSettings.mode === 'allow_all') {
            // في وضع السماح للكل، نتحقق من الإعدادات المحددة للقنوات
            const specificChannelSettings = channelSettings.channelSettings?.[channelId];
            
            if (specificChannelSettings) {
                console.log(`[Channel Content Protection] إعدادات محددة للقناة ${channelId}:`, specificChannelSettings);
                
                // فحص الصور والملفات
                if (hasAttachments && !specificChannelSettings.allowImages && !specificChannelSettings.allowFiles) {
                    console.log(`[Channel Content Protection] حظر المرفقات في القناة ${channelId}`);
                    return await handleChannelContentViolation(message, 'attachments', guild);
                }
                
                // فحص الصور فقط
                if (hasAttachments && !specificChannelSettings.allowImages) {
                    const hasImages = message.attachments.some(attachment => 
                        attachment.contentType && attachment.contentType.startsWith('image/')
                    );
                    if (hasImages) {
                        console.log(`[Channel Content Protection] حظر الصور في القناة ${channelId}`);
                        return await handleChannelContentViolation(message, 'images', guild);
                    }
                }
                
                // فحص الملفات فقط
                if (hasAttachments && !specificChannelSettings.allowFiles) {
                    const hasFiles = message.attachments.some(attachment => 
                        !attachment.contentType || !attachment.contentType.startsWith('image/')
                    );
                    if (hasFiles) {
                        console.log(`[Channel Content Protection] حظر الملفات في القناة ${channelId}`);
                        return await handleChannelContentViolation(message, 'files', guild);
                    }
                }
                
                // فحص النصوص
                if (messageContent && !isBotCommand && !specificChannelSettings.allowTexts) {
                    console.log(`[Channel Content Protection] حظر النصوص في القناة ${channelId}`);
                    return await handleChannelContentViolation(message, 'texts', guild);
                }
                
                // فحص أوامر البوت
                if (isBotCommand && !specificChannelSettings.allowBotCommands) {
                    console.log(`[Channel Content Protection] حظر أوامر البوت في القناة ${channelId}`);
                    return await handleChannelContentViolation(message, 'bot_commands', guild);
                }
            }
        } else if (channelSettings.mode === 'block_all') {
            // في وضع حظر الكل، نحظر كل شيء إلا إذا كانت القناة مسموحة
            const isChannelAllowed = channelSettings.channels && channelSettings.channels.includes(channelId);
            
            if (!isChannelAllowed) {
                console.log(`[Channel Content Protection] حظر المحتوى في القناة ${channelId} - وضع حظر الكل`);
                return await handleChannelContentViolation(message, 'all_content', guild);
            }
        } else if (channelSettings.mode === 'whitelist') {
            // في وضع القائمة البيضاء، نسمح فقط للقنوات المحددة
            const isChannelWhitelisted = channelSettings.channels && channelSettings.channels.includes(channelId);
            
            if (!isChannelWhitelisted) {
                console.log(`[Channel Content Protection] القناة ${channelId} غير موجودة في القائمة البيضاء`);
                return await handleChannelContentViolation(message, 'not_whitelisted', guild);
            }
        } else if (channelSettings.mode === 'blacklist') {
            // في وضع القائمة السوداء، نحظر القنوات المحددة
            const isChannelBlacklisted = channelSettings.channels && channelSettings.channels.includes(channelId);
            
            if (isChannelBlacklisted) {
                console.log(`[Channel Content Protection] القناة ${channelId} موجودة في القائمة السوداء`);
                return await handleChannelContentViolation(message, 'blacklisted', guild);
            }
        }

        console.log(`[Channel Content Protection] تم السماح بالمحتوى في القناة ${channelId}`);
        return { success: true };

    } catch (error) {
        console.error('[Channel Content Protection] خطأ في فحص محتوى القناة:', error);
        return { success: true }; // في حالة الخطأ، نسمح بالمحتوى لتجنب حظر غير مرغوب فيه
    }
}

/**
 * التعامل مع انتهاك قواعد محتوى القناة
 * @param {Object} message - رسالة Discord
 * @param {string} violationType - نوع الانتهاك
 * @param {Object} guild - خادم Discord
 * @returns {Object} نتيجة المعالجة
 */
async function handleChannelContentViolation(message, violationType, guild) {
    try {
        console.log(`[Channel Content Protection] معالجة انتهاك: ${violationType} في القناة ${message.channel.id}`);
        
        // حذف الرسالة
        await message.delete().catch(err => {
            console.error('[Channel Content Protection] فشل في حذف الرسالة:', err);
        });

        // تحديد رسالة التحذير بناءً على نوع الانتهاك
        let warningMessage = '';
        switch (violationType) {
            case 'images':
                warningMessage = 'غير مسموح بإرسال الصور في هذه القناة';
                break;
            case 'files':
                warningMessage = 'غير مسموح بإرسال الملفات في هذه القناة';
                break;
            case 'attachments':
                warningMessage = 'غير مسموح بإرسال المرفقات في هذه القناة';
                break;
            case 'texts':
                warningMessage = 'غير مسموح بإرسال الرسائل النصية في هذه القناة';
                break;
            case 'bot_commands':
                warningMessage = 'غير مسموح بإرسال أوامر البوت في هذه القناة';
                break;
            case 'all_content':
                warningMessage = 'غير مسموح بإرسال أي محتوى في هذه القناة';
                break;
            case 'not_whitelisted':
                warningMessage = 'هذه القناة غير مسموحة لإرسال المحتوى';
                break;
            case 'blacklisted':
                warningMessage = 'هذه القناة محظورة من إرسال المحتوى';
                break;
            default:
                warningMessage = 'انتهاك قواعد محتوى القناة';
        }

        // تطبيق العقوبة (حذف الرسالة + تحذير)
        await applyPunishment(message, 'delete', warningMessage, guild);

        return {
            success: false,
            action: 'delete',
            reason: warningMessage,
            violationType: violationType
        };

    } catch (error) {
        console.error('[Channel Content Protection] خطأ في معالجة الانتهاك:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { checkChannelContent };