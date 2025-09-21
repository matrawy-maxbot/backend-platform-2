import express from 'express';
import * as adminsController from '../controllers/admins.controller.js';
import {
  createAdminsSchema,
  updateAdminsSchema,
  removeAdminSchema,
} from '../validators/admins.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

/**
 * مسارات إدارة المشرفين
 * @module AdminsRoutes
 */

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
 * تحديث سجل المشرفين
 * PUT /api/v1/restful/admins/:guildId
 */
router.put(
  '/:guildId',
  validationMiddlewareFactory(updateAdminsSchema),
  adminsController.updateAdmins
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

export default router;