import AuditTrailsService from '../../../../database/mongoDB/services/AuditTrails.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم سجلات التدقيق
 * @module AuditTrailsController
 */

/**
 * الحصول على جميع سجلات التدقيق
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllAuditTrails = async (req, res, next) => {
  try {
    let auditTrails = await AuditTrailsService.getAllAuditTrails();
    auditTrails = resolveDatabaseResult(auditTrails);
    
    send(res, {
      success: true,
      data: auditTrails
    }, 'تم جلب جميع سجلات التدقيق بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجل تدقيق بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAuditTrailById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let auditTrail = await AuditTrailsService.getAuditTrailById(id);
    auditTrail = resolveDatabaseResult(auditTrail);
    
    let status = 200;
    if (auditTrail.length < 1) status = 404;

    send(res, {
      success: true,
      data: auditTrail
    }, 'تم جلب سجل التدقيق بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء سجل تدقيق جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createAuditTrail = async (req, res, next) => {
  try {
    const auditTrailData = req.body;

    let newAuditTrail = await AuditTrailsService.createAuditTrail(auditTrailData);
    newAuditTrail = resolveDatabaseResult(newAuditTrail);
    
    send(res, {
      success: true,
      data: newAuditTrail
    }, 'تم إنشاء سجل التدقيق بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث سجل التدقيق
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateAuditTrail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedAuditTrail = await AuditTrailsService.updateAuditTrail(id, updateData);
    updatedAuditTrail = resolveDatabaseResult(updatedAuditTrail);
    
    send(res, {
      success: true,
      data: updatedAuditTrail
    }, 'تم تحديث سجل التدقيق بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف سجل التدقيق
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteAuditTrail = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await AuditTrailsService.deleteAuditTrail(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف سجل التدقيق بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};