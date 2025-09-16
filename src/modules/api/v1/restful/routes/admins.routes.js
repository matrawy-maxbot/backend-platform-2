import express from 'express';
import * as adminsController from '../controllers/admins.controller.js';
import {
  createAdminsSchema,
  createGuildAdminsSchema,
  getAdminsByGuildIdSchema,
  getGuildsByAdminIdSchema,
  getAdminsByMaxKbSchema,
  getAdminsByBlacklistKbSchema,
  getRecentAdminsSchema,
  updateAdminsSchema,
  updateAdminsIdSchema,
  updateMaxKbSchema,
  updateBlacklistKbSchema,
  addAdminSchema,
  removeAdminSchema,
  toggleMaxKbSchema,
  toggleBlacklistKbSchema,
  deleteAdminsSchema,
  deleteOldAdminsSchema,
  existsAdminsSchema,
  isUserAdminSchema
} from '../validators/admins.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

/**
 * مسارات إدارة المشرفين
 * @module AdminsRoutes
 */

// ===== مسارات POST (إنشاء) =====

/**
 * إنشاء سجل مشرفين جديد
 * POST /api/v1/restful/admins
 */
router.post(
  '/',
  validationMiddlewareFactory(createAdminsSchema),
  adminsController.createAdmins
);

/**
 * إنشاء سجل مشرفين للخادم مع الإعدادات الافتراضية
 * POST /api/v1/restful/admins/guild
 */
router.post(
  '/guild',
  validationMiddlewareFactory(createGuildAdminsSchema),
  adminsController.createGuildAdmins
);

// ===== مسارات GET (استعلام) =====

/**
 * الحصول على جميع سجلات المشرفين
 * GET /api/v1/restful/admins
 */
router.get(
  '/',
  adminsController.getAllAdmins
);

/**
 * الحصول على سجل المشرفين بواسطة معرف الخادم
 * GET /api/v1/restful/admins/guild/:guildId
 */
router.get(
  '/guild/:guildId',
  validationMiddlewareFactory(getAdminsByGuildIdSchema),
  adminsController.getAdminsByGuildId
);

/**
 * الحصول على الخوادم التي لديها مشرفين محددين
 * GET /api/v1/restful/admins/admin/:adminId/guilds
 */
router.get(
  '/admin/:adminId/guilds',
  validationMiddlewareFactory(getGuildsByAdminIdSchema),
  adminsController.getGuildsByAdminId
);

/**
 * الحصول على الخوادم بواسطة إعداد الحد الأقصى للكيبورد
 * GET /api/v1/restful/admins/max-kb
 */
router.get(
  '/max-kb',
  validationMiddlewareFactory(getAdminsByMaxKbSchema),
  adminsController.getAdminsByMaxKb
);

/**
 * الحصول على الخوادم بواسطة إعداد كيبورد القائمة السوداء
 * GET /api/v1/restful/admins/blacklist-kb
 */
router.get(
  '/blacklist-kb',
  validationMiddlewareFactory(getAdminsByBlacklistKbSchema),
  adminsController.getAdminsByBlacklistKb
);

/**
 * الحصول على الخوادم التي لديها مشرفين
 * GET /api/v1/restful/admins/with-admins
 */
router.get(
  '/with-admins',
  adminsController.getGuildsWithAdmins
);

/**
 * الحصول على الخوادم التي ليس لديها مشرفين
 * GET /api/v1/restful/admins/without-admins
 */
router.get(
  '/without-admins',
  adminsController.getGuildsWithoutAdmins
);

/**
 * الحصول على أحدث سجلات المشرفين
 * GET /api/v1/restful/admins/recent
 */
router.get(
  '/recent',
  validationMiddlewareFactory(getRecentAdminsSchema),
  adminsController.getRecentAdmins
);

/**
 * الحصول على إحصائيات المشرفين
 * GET /api/v1/restful/admins/stats
 */
router.get(
  '/stats',
  adminsController.getAdminsStats
);

/**
 * التحقق من وجود سجل المشرفين للخادم
 * GET /api/v1/restful/admins/exists/:guildId
 */
router.get(
  '/exists/:guildId',
  validationMiddlewareFactory(existsAdminsSchema),
  adminsController.existsAdmins
);

/**
 * التحقق من كون المستخدم مشرف في الخادم
 * GET /api/v1/restful/admins/is-admin/:guildId/:userId
 */
router.get(
  '/is-admin/:guildId/:userId',
  validationMiddlewareFactory(isUserAdminSchema),
  adminsController.isUserAdmin
);

// ===== مسارات PUT (تحديث كامل) =====

/**
 * تحديث سجل المشرفين
 * PUT /api/v1/restful/admins/:guildId
 */
router.put(
  '/:guildId',
  validationMiddlewareFactory(updateAdminsSchema),
  adminsController.updateAdmins
);

/**
 * تحديث معرفات المشرفين للخادم
 * PUT /api/v1/restful/admins/:guildId/admins-id
 */
router.put(
  '/:guildId/admins-id',
  validationMiddlewareFactory(updateAdminsIdSchema),
  adminsController.updateAdminsId
);

/**
 * تحديث إعداد الحد الأقصى للكيبورد
 * PUT /api/v1/restful/admins/:guildId/max-kb
 */
router.put(
  '/:guildId/max-kb',
  validationMiddlewareFactory(updateMaxKbSchema),
  adminsController.updateMaxKb
);

/**
 * تحديث إعداد كيبورد القائمة السوداء
 * PUT /api/v1/restful/admins/:guildId/blacklist-kb
 */
router.put(
  '/:guildId/blacklist-kb',
  validationMiddlewareFactory(updateBlacklistKbSchema),
  adminsController.updateBlacklistKb
);

// ===== مسارات PATCH (تحديث جزئي) =====

/**
 * إضافة مشرف جديد إلى قائمة المشرفين
 * PATCH /api/v1/restful/admins/:guildId/add-admin
 */
router.patch(
  '/:guildId/add-admin',
  validationMiddlewareFactory(addAdminSchema),
  adminsController.addAdmin
);

/**
 * إزالة مشرف من قائمة المشرفين
 * PATCH /api/v1/restful/admins/:guildId/remove-admin
 */
router.patch(
  '/:guildId/remove-admin',
  validationMiddlewareFactory(removeAdminSchema),
  adminsController.removeAdmin
);

/**
 * تبديل إعداد الحد الأقصى للكيبورد
 * PATCH /api/v1/restful/admins/:guildId/toggle-max-kb
 */
router.patch(
  '/:guildId/toggle-max-kb',
  validationMiddlewareFactory(toggleMaxKbSchema),
  adminsController.toggleMaxKb
);

/**
 * تبديل إعداد كيبورد القائمة السوداء
 * PATCH /api/v1/restful/admins/:guildId/toggle-blacklist-kb
 */
router.patch(
  '/:guildId/toggle-blacklist-kb',
  validationMiddlewareFactory(toggleBlacklistKbSchema),
  adminsController.toggleBlacklistKb
);

// ===== مسارات DELETE (حذف) =====

/**
 * حذف سجل المشرفين
 * DELETE /api/v1/restful/admins/:guildId
 */
router.delete(
  '/:guildId',
  validationMiddlewareFactory(deleteAdminsSchema),
  adminsController.deleteAdmins
);

/**
 * حذف السجلات القديمة
 * DELETE /api/v1/restful/admins/old
 */
router.delete(
  '/old',
  validationMiddlewareFactory(deleteOldAdminsSchema),
  adminsController.deleteOldAdmins
);

export default router;