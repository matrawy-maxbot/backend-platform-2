import express from 'express';
import * as membersController from '../controllers/members.controller.js';
import * as membersValidator from '../validators/members.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة الأعضاء
 * @module MembersRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/members
 * @desc الحصول على جميع إعدادات الأعضاء
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  membersController.getAllMembers
);

/**
 * @route GET /api/v1/restful/members/:id
 * @desc الحصول على إعدادات أعضاء بواسطة المعرف
 * @access Public
 * @param {string} id - معرف إعدادات الأعضاء (MongoDB ObjectId)
 */
router.get(
  '/:id',
  validationMiddlewareFactory(membersValidator.getMembersByIdSchema.params, 'params'),
  membersController.getMembersById
);

/**
 * @route GET /api/v1/restful/members/server/:serverId
 * @desc الحصول على إعدادات أعضاء بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(membersValidator.getMembersByServerIdSchema.params, 'params'),
  membersController.getMembersByServerId
);

/**
 * @route POST /api/v1/restful/members
 * @desc إنشاء إعدادات أعضاء جديدة
 * @access Private
 * @body {Object} membersData - بيانات إعدادات الأعضاء الجديدة
 * @body {string} membersData.server_id - معرف الخادم (مطلوب)
 * @body {boolean} [membersData.welcome_message=false] - تفعيل رسالة الترحيب
 * @body {string} [membersData.welcome_message_content] - محتوى رسالة الترحيب
 * @body {string} [membersData.welcome_message_channel] - قناة رسالة الترحيب
 * @body {boolean} [membersData.welcome_image=false] - تفعيل صورة الترحيب
 * @body {boolean} [membersData.leave_message=false] - تفعيل رسالة المغادرة
 * @body {string} [membersData.leave_message_content] - محتوى رسالة المغادرة
 * @body {string} [membersData.leave_message_channel] - قناة رسالة المغادرة
 * @body {boolean} [membersData.auto_role=false] - تفعيل الدور التلقائي
 * @body {string} [membersData.auto_role_channel] - قناة الدور التلقائي
 */
router.post(
  '/',
  validationMiddlewareFactory(membersValidator.createMembersSchema.body, 'body'),
  membersController.createMembers
);

/**
 * @route PUT /api/v1/restful/members/:id
 * @desc تحديث إعدادات الأعضاء بواسطة المعرف
 * @access Private
 * @param {string} id - معرف إعدادات الأعضاء (MongoDB ObjectId)
 * @body {Object} membersData - بيانات إعدادات الأعضاء المحدثة
 * @body {boolean} [membersData.welcome_message] - تفعيل رسالة الترحيب
 * @body {string} [membersData.welcome_message_content] - محتوى رسالة الترحيب
 * @body {string} [membersData.welcome_message_channel] - قناة رسالة الترحيب
 * @body {boolean} [membersData.welcome_image] - تفعيل صورة الترحيب
 * @body {boolean} [membersData.leave_message] - تفعيل رسالة المغادرة
 * @body {string} [membersData.leave_message_content] - محتوى رسالة المغادرة
 * @body {string} [membersData.leave_message_channel] - قناة رسالة المغادرة
 * @body {boolean} [membersData.auto_role] - تفعيل الدور التلقائي
 * @body {string} [membersData.auto_role_channel] - قناة الدور التلقائي
 */
router.put(
  '/:id',
  validationMiddlewareFactory(membersValidator.updateMembersSchema.params, 'params'),
  validationMiddlewareFactory(membersValidator.updateMembersSchema.body, 'body'),
  membersController.updateMembers
);

/**
 * @route PUT /api/v1/restful/members/server/:serverId
 * @desc تحديث إعدادات الأعضاء بواسطة معرف الخادم
 * @access Private
 * @param {string} serverId - معرف الخادم
 * @body {Object} membersData - بيانات إعدادات الأعضاء المحدثة
 * @body {boolean} [membersData.welcome_message] - تفعيل رسالة الترحيب
 * @body {string} [membersData.welcome_message_content] - محتوى رسالة الترحيب
 * @body {string} [membersData.welcome_message_channel] - قناة رسالة الترحيب
 * @body {boolean} [membersData.welcome_image] - تفعيل صورة الترحيب
 * @body {boolean} [membersData.leave_message] - تفعيل رسالة المغادرة
 * @body {string} [membersData.leave_message_content] - محتوى رسالة المغادرة
 * @body {string} [membersData.leave_message_channel] - قناة رسالة المغادرة
 * @body {boolean} [membersData.auto_role] - تفعيل الدور التلقائي
 * @body {string} [membersData.auto_role_channel] - قناة الدور التلقائي
 */
router.put(
  '/server/:serverId',
  validationMiddlewareFactory(membersValidator.updateMembersByServerIdSchema.params, 'params'),
  validationMiddlewareFactory(membersValidator.updateMembersByServerIdSchema.body, 'body'),
  membersController.updateMembersByServerId
);

/**
 * @route DELETE /api/v1/restful/members/:id
 * @desc حذف إعدادات الأعضاء بواسطة المعرف
 * @access Private
 * @param {string} id - معرف إعدادات الأعضاء (MongoDB ObjectId)
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(membersValidator.deleteMembersSchema.params, 'params'),
  membersController.deleteMembers
);

/**
 * @route DELETE /api/v1/restful/members/server/:serverId
 * @desc حذف إعدادات الأعضاء بواسطة معرف الخادم
 * @access Private
 * @param {string} serverId - معرف الخادم
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(membersValidator.deleteMembersByServerIdSchema.params, 'params'),
  membersController.deleteMembersByServerId
);

export default router;