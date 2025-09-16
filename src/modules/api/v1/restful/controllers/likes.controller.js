import { LikesService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم Likes - إدارة عمليات الإعجابات
 */

/**
 * إنشاء سجل إعجابات جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createLikes = async (req, res) => {
  try {
    const likesData = req.body;
    const result = await LikesService.createLikes(likesData);
    send(res, { data: result }, 'تم إنشاء سجل الإعجابات بنجاح', 201);
  } catch (error) {
    console.error('خطأ في إنشاء سجل الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إنشاء سجل إعجابات جديد للمستخدم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createUserLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const likesData = req.body.likes || {};
    const result = await LikesService.createUserLikes(id, likesData);
    send(res, { data: result }, 'تم إنشاء سجل إعجابات المستخدم بنجاح', 201);
  } catch (error) {
    console.error('خطأ في إنشاء سجل إعجابات المستخدم:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على جميع سجلات الإعجابات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllLikes = async (req, res) => {
  try {
    const options = req.query;
    const result = await LikesService.getAllLikes(options);
    send(res, { data: result }, 'تم جلب جميع سجلات الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في جلب جميع سجلات الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجل الإعجابات بواسطة المعرف
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLikesById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LikesService.getLikesById(id);
    if (result) {
      send(res, { data: result }, 'تم جلب سجل الإعجابات بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجل الإعجابات', 404);
    }
  } catch (error) {
    console.error('خطأ في جلب سجل الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * البحث في سجلات الإعجابات بواسطة محتوى الإعجابات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const searchLikesByContent = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const result = await LikesService.searchLikesByContent(searchTerm);
    send(res, { data: result }, 'تم البحث في سجلات الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في البحث في سجلات الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجلات الإعجابات بواسطة نطاق زمني
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLikesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await LikesService.getLikesByDateRange(new Date(startDate), new Date(endDate));
    send(res, { data: result }, 'تم جلب سجلات الإعجابات بواسطة النطاق الزمني بنجاح', 200);
  } catch (error) {
    console.error('خطأ في جلب سجلات الإعجابات بواسطة النطاق الزمني:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على أحدث سجلات الإعجابات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getRecentLikes = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await LikesService.getRecentLikes(parseInt(limit));
    send(res, { data: result }, 'تم جلب أحدث سجلات الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في جلب أحدث سجلات الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث سجل الإعجابات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await LikesService.updateLikes(id, updateData);
    send(res, { data: result }, 'تم تحديث سجل الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في تحديث سجل الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث بيانات الإعجابات فقط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateLikesData = async (req, res) => {
  try {
    const { id } = req.params;
    const { likes } = req.body;
    const result = await LikesService.updateLikesData(id, likes);
    send(res, { data: result }, 'تم تحديث بيانات الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في تحديث بيانات الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إضافة إعجاب جديد لسجل موجود
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const addLikeToRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { likeKey, likeValue } = req.body;
    const result = await LikesService.addLikeToRecord(id, likeKey, likeValue);
    send(res, { data: result }, 'تم إضافة الإعجاب للسجل بنجاح', 200);
  } catch (error) {
    console.error('خطأ في إضافة إعجاب للسجل:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إزالة إعجاب من سجل موجود
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const removeLikeFromRecord = async (req, res) => {
  try {
    const { id, likeKey } = req.params;
    const result = await LikesService.removeLikeFromRecord(id, likeKey);
    send(res, { data: result }, 'تم إزالة الإعجاب من السجل بنجاح', 200);
  } catch (error) {
    console.error('خطأ في إزالة إعجاب من السجل:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * دمج بيانات إعجابات جديدة مع الموجودة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const mergeLikesData = async (req, res) => {
  try {
    const { id } = req.params;
    const { newLikesData } = req.body;
    const result = await LikesService.mergeLikesData(id, newLikesData);
    send(res, { data: result }, 'تم دمج بيانات الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في دمج بيانات الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف سجل الإعجابات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LikesService.deleteLikes(id);
    if (result) {
      send(res, { data: result }, 'تم حذف سجل الإعجابات بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجل الإعجابات', 404);
    }
  } catch (error) {
    console.error('خطأ في حذف سجل الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف سجلات الإعجابات القديمة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteOldLikes = async (req, res) => {
  try {
    const { daysOld = 90 } = req.body;
    const result = await LikesService.deleteOldLikes(parseInt(daysOld));
    if (result) {
      send(res, { data: result }, 'تم حذف سجلات الإعجابات القديمة بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجلات إعجابات قديمة للحذف', 404);
    }
  } catch (error) {
    console.error('خطأ في حذف سجلات الإعجابات القديمة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف سجلات الإعجابات الفارغة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteEmptyLikes = async (req, res) => {
  try {
    const result = await LikesService.deleteEmptyLikes();
    if (result) {
      send(res, { data: result }, 'تم حذف سجلات الإعجابات الفارغة بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجلات إعجابات فارغة للحذف', 404);
    }
  } catch (error) {
    console.error('خطأ في حذف سجلات الإعجابات الفارغة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف سجلات الإعجابات بواسطة نطاق زمني
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteLikesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await LikesService.deleteLikesByDateRange(new Date(startDate), new Date(endDate));
    if (result) {
      send(res, { data: result }, 'تم حذف سجلات الإعجابات بواسطة النطاق الزمني بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجلات إعجابات في النطاق الزمني المحدد', 404);
    }
  } catch (error) {
    console.error('خطأ في حذف سجلات الإعجابات بواسطة النطاق الزمني:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على إحصائيات الإعجابات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLikesStats = async (req, res) => {
  try {
    const result = await LikesService.getLikesStats();
    send(res, { data: result }, 'تم جلب إحصائيات الإعجابات بنجاح', 200);
  } catch (error) {
    console.error('خطأ في جلب إحصائيات الإعجابات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * التحقق من وجود إعجاب معين في السجل
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const hasLike = async (req, res) => {
  try {
    const { id, likeKey } = req.params;
    const result = await LikesService.hasLike(id, likeKey);
    send(res, { data: { exists: result } }, 'تم التحقق من وجود الإعجاب بنجاح', 200);
  } catch (error) {
    console.error('خطأ في التحقق من وجود الإعجاب:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على قيمة إعجاب معين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLikeValue = async (req, res) => {
  try {
    const { id, likeKey } = req.params;
    const result = await LikesService.getLikeValue(id, likeKey);
    if (result !== null) {
      send(res, { data: { value: result } }, 'تم جلب قيمة الإعجاب بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على الإعجاب', 404);
    }
  } catch (error) {
    console.error('خطأ في جلب قيمة الإعجاب:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};