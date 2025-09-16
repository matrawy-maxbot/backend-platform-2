import express from 'express';
import GiveawayController from '../controllers/giveaway.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createGiveawaySchema,
  getGiveawayByIdSchema,
  getGiveawaysByChannelSchema,
  updateGiveawaySchema,
  deleteGiveawaySchema,
  deleteGiveawaysByChannelSchema,
  getExpiredGiveawaysSchema
} from '../validators/giveaway.validator.js';

const router = express.Router();

/**
 * مسارات API لإدارة الـ Giveaways
 */

// إنشاء giveaway جديد
router.post('/', validationMiddlewareFactory(createGiveawaySchema, 'body'), GiveawayController.createGiveaway);

// الحصول على جميع الـ giveaways
router.get('/', GiveawayController.getAllGiveaways);

// الحصول على giveaway بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getGiveawayByIdSchema, 'params'), GiveawayController.getGiveawayById);

// الحصول على giveaways بواسطة القناة
router.get('/channel/:channel', validationMiddlewareFactory(getGiveawaysByChannelSchema, 'params'), GiveawayController.getGiveawaysByChannel);

// الحصول على giveaways منتهية الصلاحية
router.get('/expired/list', validationMiddlewareFactory(getExpiredGiveawaysSchema, 'query'), GiveawayController.getExpiredGiveaways);

// تحديث giveaway
router.put('/:id', 
  validationMiddlewareFactory(getGiveawayByIdSchema, 'params'),
  validationMiddlewareFactory(updateGiveawaySchema, 'body'),
  GiveawayController.updateGiveaway
);

// حذف giveaway
router.delete('/:id', validationMiddlewareFactory(deleteGiveawaySchema, 'params'), GiveawayController.deleteGiveaway);

// حذف جميع giveaways قناة معينة
router.delete('/channel/:channel', validationMiddlewareFactory(deleteGiveawaysByChannelSchema, 'params'), GiveawayController.deleteGiveawaysByChannel);

export default router;