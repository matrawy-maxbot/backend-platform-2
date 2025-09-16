import { AdsService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في عمليات الإعلانات
 * @module AdsController
 */

/**
 * إنشاء إعلان جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createAd = async (req, res) => {
  try {
    const result = await AdsService.createAd(req.body);
    send(res, { data: result }, 'تم إنشاء الإعلان بنجاح', 201);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إنشاء الإعلان', 500);
  }
};

/**
 * إنشاء إعلان مجدول جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createScheduledAd = async (req, res) => {
  try {
    const { adId, guildId, adName, adChannel, adText, scheduleData } = req.body;
    const result = await AdsService.createScheduledAd(adId, guildId, adName, adChannel, adText, scheduleData);
    send(res, { data: result }, 'تم إنشاء الإعلان المجدول بنجاح', 201);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إنشاء الإعلان المجدول', 500);
  }
};

/**
 * الحصول على جميع الإعلانات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllAds = async (req, res) => {
  try {
    const result = await AdsService.getAllAds();
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الإعلانات بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الإعلانات', 500);
  }
};

/**
 * الحصول على إعلان بواسطة المعرف
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdById = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.getAdById(adId);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الإعلان', 500);
  }
};

/**
 * الحصول على إعلانات الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByGuildId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdsService.getAdsByGuildId(guildId);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات لهذا الخادم', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات الخادم بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات الخادم', 500);
  }
};

/**
 * الحصول على إعلانات القناة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await AdsService.getAdsByChannel(channelId);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات لهذه القناة', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات القناة بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات القناة', 500);
  }
};

/**
 * الحصول على إعلانات بواسطة الاسم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByName = async (req, res) => {
  try {
    const { adName } = req.query;
    const result = await AdsService.getAdsByName(adName);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات بهذا الاسم', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الإعلانات بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الإعلانات', 500);
  }
};

/**
 * الحصول على إعلانات بواسطة المدينة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByCity = async (req, res) => {
  try {
    const { city } = req.query;
    const result = await AdsService.getAdsByCity(city);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات لهذه المدينة', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات المدينة بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات المدينة', 500);
  }
};

/**
 * الحصول على إعلانات بواسطة المنطقة الزمنية
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByTimezone = async (req, res) => {
  try {
    const { timezone } = req.query;
    const result = await AdsService.getAdsByTimezone(parseInt(timezone));
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات لهذه المنطقة الزمنية', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات المنطقة الزمنية بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات المنطقة الزمنية', 500);
  }
};

/**
 * الحصول على الإعلانات المتكررة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByRepeat = async (req, res) => {
  try {
    const { isRepeating } = req.query;
    const result = await AdsService.getAdsByRepeat(isRepeating === 'true');
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات متكررة', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الإعلانات المتكررة بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الإعلانات المتكررة', 500);
  }
};

/**
 * الحصول على إعلانات بواسطة الوقت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByTime = async (req, res) => {
  try {
    const { hour, minute, apm } = req.query;
    const result = await AdsService.getAdsByTime(parseInt(hour), minute ? parseInt(minute) : null, apm);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات لهذا الوقت', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات الوقت بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات الوقت', 500);
  }
};

/**
 * الحصول على إعلانات بواسطة اليوم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsByDay = async (req, res) => {
  try {
    const { day } = req.query;
    const result = await AdsService.getAdsByDay(day);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات لهذا اليوم', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات اليوم بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات اليوم', 500);
  }
};

/**
 * البحث في نصوص الإعلانات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const searchAdsText = async (req, res) => {
  try {
    const { searchText } = req.query;
    const result = await AdsService.searchAdsText(searchText);
    if (result.length === 0) {
      send(res, {}, 'لا توجد إعلانات تحتوي على هذا النص', 404);
    } else {
      send(res, { data: result }, 'تم البحث في الإعلانات بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في البحث في الإعلانات', 500);
  }
};

/**
 * الحصول على الإعلانات الحديثة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getRecentAds = async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await AdsService.getRecentAds(limit ? parseInt(limit) : 10);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات حديثة', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الإعلانات الحديثة بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الإعلانات الحديثة', 500);
  }
};

/**
 * الحصول على إعلانات اليوم المجدولة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getTodayScheduledAds = async (req, res) => {
  try {
    const { timezone } = req.query;
    const result = await AdsService.getTodayScheduledAds(timezone ? parseInt(timezone) : 0);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد إعلانات مجدولة لليوم', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على إعلانات اليوم المجدولة بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إعلانات اليوم المجدولة', 500);
  }
};

/**
 * تحديث إعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.updateAd(adId, req.body);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تحديث الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث الإعلان', 500);
  }
};

/**
 * تحديث نص الإعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdText = async (req, res) => {
  try {
    const { adId } = req.params;
    const { adText } = req.body;
    const result = await AdsService.updateAdText(adId, adText);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تحديث نص الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث نص الإعلان', 500);
  }
};

/**
 * تحديث قناة الإعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdChannel = async (req, res) => {
  try {
    const { adId } = req.params;
    const { adChannel } = req.body;
    const result = await AdsService.updateAdChannel(adId, adChannel);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تحديث قناة الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث قناة الإعلان', 500);
  }
};

/**
 * تحديث اسم الإعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdName = async (req, res) => {
  try {
    const { adId } = req.params;
    const { adName } = req.body;
    const result = await AdsService.updateAdName(adId, adName);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تحديث اسم الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث اسم الإعلان', 500);
  }
};

/**
 * تحديث جدولة الإعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdSchedule = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.updateAdSchedule(adId, req.body);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تحديث جدولة الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث جدولة الإعلان', 500);
  }
};

/**
 * تحديث المنطقة الزمنية للإعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdTimezone = async (req, res) => {
  try {
    const { adId } = req.params;
    const { timezone } = req.body;
    const result = await AdsService.updateAdTimezone(adId, timezone);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تحديث المنطقة الزمنية للإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث المنطقة الزمنية للإعلان', 500);
  }
};

/**
 * تبديل حالة التكرار للإعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const toggleAdRepeat = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.toggleAdRepeat(adId);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للتحديث', 404);
    } else {
      send(res, { data: result }, 'تم تبديل حالة التكرار للإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تبديل حالة التكرار للإعلان', 500);
  }
};

/**
 * حذف إعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.deleteAd(adId);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان للحذف', 404);
    } else {
      send(res, {}, 'تم حذف الإعلان بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف الإعلان', 500);
  }
};

/**
 * حذف إعلانات الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteGuildAds = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdsService.deleteGuildAds(guildId);
    send(res, { data: { deletedCount: result } }, 'تم حذف إعلانات الخادم بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف إعلانات الخادم', 500);
  }
};

/**
 * حذف إعلانات القناة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteAdsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await AdsService.deleteAdsByChannel(channelId);
    send(res, { data: { deletedCount: result } }, 'تم حذف إعلانات القناة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف إعلانات القناة', 500);
  }
};

/**
 * حذف الإعلانات غير المتكررة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteNonRepeatingAds = async (req, res) => {
  try {
    const result = await AdsService.deleteNonRepeatingAds();
    send(res, { data: { deletedCount: result } }, 'تم حذف الإعلانات غير المتكررة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف الإعلانات غير المتكررة', 500);
  }
};

/**
 * حذف الإعلانات القديمة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteOldAds = async (req, res) => {
  try {
    const { daysOld } = req.query;
    const result = await AdsService.deleteOldAds(daysOld ? parseInt(daysOld) : 30);
    send(res, { data: { deletedCount: result } }, 'تم حذف الإعلانات القديمة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف الإعلانات القديمة', 500);
  }
};

/**
 * الحصول على إحصائيات الإعلانات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdsStats = async (req, res) => {
  try {
    const result = await AdsService.getAdsStats();
    send(res, { data: result }, 'تم الحصول على إحصائيات الإعلانات بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات الإعلانات', 500);
  }
};

/**
 * التحقق من وجود إعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const existsAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.existsAd(adId);
    send(res, { data: { exists: result } }, result ? 'الإعلان موجود' : 'الإعلان غير موجود', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في التحقق من وجود الإعلان', 500);
  }
};

/**
 * عد إعلانات الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const countGuildAds = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdsService.countGuildAds(guildId);
    send(res, { data: { count: result } }, 'تم عد إعلانات الخادم بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في عد إعلانات الخادم', 500);
  }
};

/**
 * عد إعلانات القناة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const countChannelAds = async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await AdsService.countChannelAds(channelId);
    send(res, { data: { count: result } }, 'تم عد إعلانات القناة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في عد إعلانات القناة', 500);
  }
};

/**
 * التحقق من تضارب الجدولة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const checkScheduleConflict = async (req, res) => {
  try {
    const { guildId, channelId, hour, minute, day } = req.body;
    const result = await AdsService.checkScheduleConflict(guildId, channelId, hour, minute, day);
    send(res, { data: { hasConflict: result } }, result ? 'يوجد تضارب في الجدولة' : 'لا يوجد تضارب في الجدولة', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في التحقق من تضارب الجدولة', 500);
  }
};

/**
 * إنشاء أو تحديث إعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const upsertAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdsService.upsertAd(adId, req.body);
    send(res, { data: result }, 'تم إنشاء أو تحديث الإعلان بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إنشاء أو تحديث الإعلان', 500);
  }
};

/**
 * نسخ إعلان
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const copyAd = async (req, res) => {
  try {
    const { sourceAdId, newAdId } = req.params;
    const { overrideData } = req.body;
    const result = await AdsService.copyAd(sourceAdId, newAdId, overrideData);
    if (!result) {
      send(res, {}, 'لم يتم العثور على الإعلان المصدر', 404);
    } else {
      send(res, { data: result }, 'تم نسخ الإعلان بنجاح', 201);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في نسخ الإعلان', 500);
  }
};