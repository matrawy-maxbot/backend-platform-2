// src/modules/api/v1/restful/controllers/topThree.controller.js

import { TopThreeService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
/**
 * الحصول على جميع عناصر أفضل ثلاثة
 */
export const getAllTopThree = async (req, res) => {
  try {
    const topThree = await TopThreeService.getAllTopThree();
    send(res, topThree, 'تم الحصول على عناصر أفضل ثلاثة بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على عنصر أفضل ثلاثة بواسطة المعرف
 */
export const getTopThreeById = async (req, res) => {
  try {
    const { id } = req.params;
    const topThree = await TopThreeService.getTopThreeById(id);
    
    if (!topThree) {
      return send(res, null, 'العنصر غير موجود', 404);
    }
    
    send(res, topThree, 'تم الحصول على العنصر بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إنشاء عنصر جديد في أفضل ثلاثة
 */
export const createTopThree = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    const topThree = await TopThreeService.createTopThreeItem(id, name, description);
    send(res, topThree, 'تم إنشاء العنصر بنجاح', 201);
  } catch (error) {
    send(res, null, error.message, 400);
  }
};

/**
 * تحديث عنصر أفضل ثلاثة
 */
export const updateTopThree = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const topThree = await TopThreeService.updateTopThree(id, updateData);
    send(res, topThree, 'تم تحديث العنصر بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 400);
  }
};

/**
 * حذف عنصر أفضل ثلاثة
 */
export const deleteTopThree = async (req, res) => {
  try {
    const { id } = req.params;
    await TopThreeService.deleteTopThree(id);
    send(res, null, 'تم حذف العنصر بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 400);
  }
};

/**
 * الحصول على إحصائيات أفضل ثلاثة
 */
export const getTopThreeStats = async (req, res) => {
  try {
    const stats = await TopThreeService.getTopThreeStats();
    send(res, stats, 'تم الحصول على الإحصائيات بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * البحث في عناصر أفضل ثلاثة
 */
export const searchTopThree = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const results = await TopThreeService.searchTopThree(searchTerm);
    send(res, results, 'تم البحث بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إعادة تعيين قائمة أفضل ثلاثة للبيانات الافتراضية
 */
export const resetTopThreeToDefault = async (req, res) => {
  try {
    const defaultItems = await TopThreeService.resetToDefault();
    send(res, defaultItems, 'تم إعادة تعيين القائمة بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};