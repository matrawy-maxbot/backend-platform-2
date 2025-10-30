import express from 'express';
import * as scheduleMessagesController from '../controllers/scheduleMessages.controller.js';
import * as scheduleMessagesValidator from '../validators/scheduleMessages.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة الرسائل المجدولة
 * @module ScheduleMessagesRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/schedule-messages
 * @desc الحصول على جميع الرسائل المجدولة
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  scheduleMessagesController.getAllScheduleMessages
);

/**
 * @route GET /api/v1/restful/schedule-messages/:id
 * @desc الحصول على رسالة مجدولة بواسطة المعرف
 * @access Public
 * @param {number} id - معرف الرسالة المجدولة
 */
router.get(
  '/:id',
  validationMiddlewareFactory(scheduleMessagesValidator.getScheduleMessageByIdSchema.params, 'params'),
  scheduleMessagesController.getScheduleMessageById
);

/**
 * @route GET /api/v1/restful/schedule-messages/server/:serverId
 * @desc الحصول على الرسائل المجدولة بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(scheduleMessagesValidator.getScheduleMessagesByServerIdSchema.params, 'params'),
  scheduleMessagesController.getScheduleMessagesByServerId
);

/**
 * @route POST /api/v1/restful/schedule-messages
 * @desc إنشاء رسالة مجدولة جديدة
 * @access Public
 * @body {Object} scheduleMessageData - بيانات الرسالة المجدولة الجديدة
 * @body {string} scheduleMessageData.server_id - معرف الخادم
 * @body {string} scheduleMessageData.title - عنوان الإعلان
 * @body {string} scheduleMessageData.content - محتوى الإعلان
 * @body {string} [scheduleMessageData.image_url] - رابط الصورة للإعلان
 * @body {string} [scheduleMessageData.link_url] - رابط الإعلان
 * @body {Array} [scheduleMessageData.channels] - قائمة القنوات المستهدفة
 * @body {Array} [scheduleMessageData.roles] - قائمة الأدوار المستهدفة
 * @body {string} [scheduleMessageData.publish_type] - نوع النشر (immediate/scheduled)
 * @body {string} [scheduleMessageData.schedule_mode] - وضع الجدولة (specific_time/delay_from_now)
 * @body {string} [scheduleMessageData.scheduled_time] - الوقت المجدول المحدد
 * @body {number} [scheduleMessageData.delay_amount] - مقدار التأخير
 * @body {string} [scheduleMessageData.delay_unit] - وحدة التأخير (minutes/hours/days)
 * @body {string} [scheduleMessageData.schedule_type] - نوع الجدولة (one_time/recurring)
 * @body {string} [scheduleMessageData.recurring_type] - نوع التكرار (daily/weekly/monthly)
 * @body {string} [scheduleMessageData.priority_level] - مستوى الأولوية (low/normal/high)
 */
router.post(
  '/',
  validationMiddlewareFactory(scheduleMessagesValidator.createScheduleMessageSchema.body, 'body'),
  scheduleMessagesController.createScheduleMessage
);

/**
 * @route PUT /api/v1/restful/schedule-messages/:id
 * @desc تحديث الرسالة المجدولة
 * @access Public
 * @param {number} id - معرف الرسالة المجدولة
 * @body {Object} updateData - البيانات المحدثة
 * @body {string} [updateData.title] - عنوان الإعلان
 * @body {string} [updateData.content] - محتوى الإعلان
 * @body {string} [updateData.image_url] - رابط الصورة للإعلان
 * @body {string} [updateData.link_url] - رابط الإعلان
 * @body {Array} [updateData.channels] - قائمة القنوات المستهدفة
 * @body {Array} [updateData.roles] - قائمة الأدوار المستهدفة
 * @body {string} [updateData.publish_type] - نوع النشر (immediate/scheduled)
 * @body {string} [updateData.schedule_mode] - وضع الجدولة (specific_time/delay_from_now)
 * @body {string} [updateData.scheduled_time] - الوقت المجدول المحدد
 * @body {number} [updateData.delay_amount] - مقدار التأخير
 * @body {string} [updateData.delay_unit] - وحدة التأخير (minutes/hours/days)
 * @body {string} [updateData.schedule_type] - نوع الجدولة (one_time/recurring)
 * @body {string} [updateData.recurring_type] - نوع التكرار (daily/weekly/monthly)
 * @body {string} [updateData.priority_level] - مستوى الأولوية (low/normal/high)
 */
router.put(
  '/:id',
  validationMiddlewareFactory(scheduleMessagesValidator.updateScheduleMessageSchema.params, 'params'),
  validationMiddlewareFactory(scheduleMessagesValidator.updateScheduleMessageSchema.body, 'body'),
  scheduleMessagesController.updateScheduleMessage
);

/**
 * @route DELETE /api/v1/restful/schedule-messages/:id
 * @desc حذف الرسالة المجدولة
 * @access Public
 * @param {number} id - معرف الرسالة المجدولة
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(scheduleMessagesValidator.deleteScheduleMessageSchema.params, 'params'),
  scheduleMessagesController.deleteScheduleMessage
);

export default router;