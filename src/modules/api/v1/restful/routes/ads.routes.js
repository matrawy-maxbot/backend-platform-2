import express from 'express';
import * as adsController from '../controllers/ads.controller.js';
import {
  createAdSchema,
  createScheduledAdSchema,
  getAdByIdSchema,
  getAdsByGuildIdSchema,
  getAdsByChannelSchema,
  getAdsByNameSchema,
  getAdsByCitySchema,
  getAdsByTimezoneSchema,
  getAdsByRepeatSchema,
  getAdsByTimeSchema,
  getAdsByDaySchema,
  searchAdsTextSchema,
  getRecentAdsSchema,
  getTodayScheduledAdsSchema,
  updateAdSchema,
  updateAdTextSchema,
  updateAdChannelSchema,
  updateAdNameSchema,
  updateAdScheduleSchema,
  updateAdTimezoneSchema,
  toggleAdRepeatSchema,
  deleteAdSchema,
  deleteGuildAdsSchema,
  deleteAdsByChannelSchema,
  deleteOldAdsSchema,
  existsAdSchema,
  countGuildAdsSchema,
  countChannelAdsSchema,
  checkScheduleConflictSchema,
  upsertAdSchema,
  copyAdSchema
} from '../validators/ads.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

/**
 * مسارات إدارة الإعلانات
 * @module AdsRoutes
 */

// ===== مسارات POST (إنشاء) =====

/**
 * إنشاء إعلان جديد
 * POST /api/v1/restful/ads
 */
router.post(
  '/',
  validationMiddlewareFactory(createAdSchema),
  adsController.createAd
);

/**
 * إنشاء إعلان مجدول جديد
 * POST /api/v1/restful/ads/scheduled
 */
router.post(
  '/scheduled',
  validationMiddlewareFactory(createScheduledAdSchema),
  adsController.createScheduledAd
);

/**
 * التحقق من تضارب الجدولة
 * POST /api/v1/restful/ads/check-conflict
 */
router.post(
  '/check-conflict',
  validationMiddlewareFactory(checkScheduleConflictSchema),
  adsController.checkScheduleConflict
);

/**
 * نسخ إعلان
 * POST /api/v1/restful/ads/:sourceAdId/copy/:newAdId
 */
router.post(
  '/:sourceAdId/copy/:newAdId',
  validationMiddlewareFactory(copyAdSchema),
  adsController.copyAd
);

// ===== مسارات GET (قراءة) =====

/**
 * الحصول على جميع الإعلانات
 * GET /api/v1/restful/ads
 */
router.get(
  '/',
  adsController.getAllAds
);

/**
 * الحصول على إعلان بواسطة المعرف
 * GET /api/v1/restful/ads/:adId
 */
router.get(
  '/:adId',
  validationMiddlewareFactory(getAdByIdSchema),
  adsController.getAdById
);

/**
 * الحصول على إعلانات الخادم
 * GET /api/v1/restful/ads/guild/:guildId
 */
router.get(
  '/guild/:guildId',
  validationMiddlewareFactory(getAdsByGuildIdSchema),
  adsController.getAdsByGuildId
);

/**
 * الحصول على إعلانات القناة
 * GET /api/v1/restful/ads/channel/:channelId
 */
router.get(
  '/channel/:channelId',
  validationMiddlewareFactory(getAdsByChannelSchema),
  adsController.getAdsByChannel
);

/**
 * الحصول على إعلانات بواسطة الاسم
 * GET /api/v1/restful/ads/search/name
 */
router.get(
  '/search/name',
  validationMiddlewareFactory(getAdsByNameSchema),
  adsController.getAdsByName
);

/**
 * الحصول على إعلانات بواسطة المدينة
 * GET /api/v1/restful/ads/search/city
 */
router.get(
  '/search/city',
  validationMiddlewareFactory(getAdsByCitySchema),
  adsController.getAdsByCity
);

/**
 * الحصول على إعلانات بواسطة المنطقة الزمنية
 * GET /api/v1/restful/ads/search/timezone
 */
router.get(
  '/search/timezone',
  validationMiddlewareFactory(getAdsByTimezoneSchema),
  adsController.getAdsByTimezone
);

/**
 * الحصول على الإعلانات المتكررة
 * GET /api/v1/restful/ads/search/repeat
 */
router.get(
  '/search/repeat',
  validationMiddlewareFactory(getAdsByRepeatSchema),
  adsController.getAdsByRepeat
);

/**
 * الحصول على إعلانات بواسطة الوقت
 * GET /api/v1/restful/ads/search/time
 */
router.get(
  '/search/time',
  validationMiddlewareFactory(getAdsByTimeSchema),
  adsController.getAdsByTime
);

/**
 * الحصول على إعلانات بواسطة اليوم
 * GET /api/v1/restful/ads/search/day
 */
router.get(
  '/search/day',
  validationMiddlewareFactory(getAdsByDaySchema),
  adsController.getAdsByDay
);

/**
 * البحث في نصوص الإعلانات
 * GET /api/v1/restful/ads/search/text
 */
router.get(
  '/search/text',
  validationMiddlewareFactory(searchAdsTextSchema),
  adsController.searchAdsText
);

/**
 * الحصول على الإعلانات الحديثة
 * GET /api/v1/restful/ads/recent
 */
router.get(
  '/recent',
  validationMiddlewareFactory(getRecentAdsSchema),
  adsController.getRecentAds
);

/**
 * الحصول على إعلانات اليوم المجدولة
 * GET /api/v1/restful/ads/today-scheduled
 */
router.get(
  '/today-scheduled',
  validationMiddlewareFactory(getTodayScheduledAdsSchema),
  adsController.getTodayScheduledAds
);

/**
 * الحصول على إحصائيات الإعلانات
 * GET /api/v1/restful/ads/stats
 */
router.get(
  '/stats',
  adsController.getAdsStats
);

/**
 * التحقق من وجود إعلان
 * GET /api/v1/restful/ads/exists/:adId
 */
router.get(
  '/exists/:adId',
  validationMiddlewareFactory(existsAdSchema),
  adsController.existsAd
);

/**
 * عد إعلانات الخادم
 * GET /api/v1/restful/ads/count/guild/:guildId
 */
router.get(
  '/count/guild/:guildId',
  validationMiddlewareFactory(countGuildAdsSchema),
  adsController.countGuildAds
);

/**
 * عد إعلانات القناة
 * GET /api/v1/restful/ads/count/channel/:channelId
 */
router.get(
  '/count/channel/:channelId',
  validationMiddlewareFactory(countChannelAdsSchema),
  adsController.countChannelAds
);

// ===== مسارات PUT (تحديث كامل) =====

/**
 * تحديث إعلان
 * PUT /api/v1/restful/ads/:adId
 */
router.put(
  '/:adId',
  validationMiddlewareFactory(updateAdSchema),
  adsController.updateAd
);

/**
 * إنشاء أو تحديث إعلان
 * PUT /api/v1/restful/ads/upsert/:adId
 */
router.put(
  '/upsert/:adId',
  validationMiddlewareFactory(upsertAdSchema),
  adsController.upsertAd
);

/**
 * تحديث جدولة الإعلان
 * PUT /api/v1/restful/ads/:adId/schedule
 */
router.put(
  '/:adId/schedule',
  validationMiddlewareFactory(updateAdScheduleSchema),
  adsController.updateAdSchedule
);

// ===== مسارات PATCH (تحديث جزئي) =====

/**
 * تحديث نص الإعلان
 * PATCH /api/v1/restful/ads/:adId/text
 */
router.patch(
  '/:adId/text',
  validationMiddlewareFactory(updateAdTextSchema),
  adsController.updateAdText
);

/**
 * تحديث قناة الإعلان
 * PATCH /api/v1/restful/ads/:adId/channel
 */
router.patch(
  '/:adId/channel',
  validationMiddlewareFactory(updateAdChannelSchema),
  adsController.updateAdChannel
);

/**
 * تحديث اسم الإعلان
 * PATCH /api/v1/restful/ads/:adId/name
 */
router.patch(
  '/:adId/name',
  validationMiddlewareFactory(updateAdNameSchema),
  adsController.updateAdName
);

/**
 * تحديث المنطقة الزمنية للإعلان
 * PATCH /api/v1/restful/ads/:adId/timezone
 */
router.patch(
  '/:adId/timezone',
  validationMiddlewareFactory(updateAdTimezoneSchema),
  adsController.updateAdTimezone
);

/**
 * تبديل حالة التكرار للإعلان
 * PATCH /api/v1/restful/ads/:adId/toggle-repeat
 */
router.patch(
  '/:adId/toggle-repeat',
  validationMiddlewareFactory(toggleAdRepeatSchema),
  adsController.toggleAdRepeat
);

// ===== مسارات DELETE (حذف) =====

/**
 * حذف إعلان
 * DELETE /api/v1/restful/ads/:adId
 */
router.delete(
  '/:adId',
  validationMiddlewareFactory(deleteAdSchema),
  adsController.deleteAd
);

/**
 * حذف إعلانات الخادم
 * DELETE /api/v1/restful/ads/guild/:guildId
 */
router.delete(
  '/guild/:guildId',
  validationMiddlewareFactory(deleteGuildAdsSchema),
  adsController.deleteGuildAds
);

/**
 * حذف إعلانات القناة
 * DELETE /api/v1/restful/ads/channel/:channelId
 */
router.delete(
  '/channel/:channelId',
  validationMiddlewareFactory(deleteAdsByChannelSchema),
  adsController.deleteAdsByChannel
);

/**
 * حذف الإعلانات غير المتكررة
 * DELETE /api/v1/restful/ads/non-repeating
 */
router.delete(
  '/non-repeating',
  adsController.deleteNonRepeatingAds
);

/**
 * حذف الإعلانات القديمة
 * DELETE /api/v1/restful/ads/old
 */
router.delete(
  '/old',
  validationMiddlewareFactory(deleteOldAdsSchema),
  adsController.deleteOldAds
);

export default router;