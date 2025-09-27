import { SessionService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الجلسات
 * @module SessionController
 */

/**
 * الحصول على جميع الجلسات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllSessions = async (req, res, next) => {
  try {
    let sessions = await SessionService.getUserSessions();
    sessions = resolveDatabaseResult(sessions);
    
    send(res, {
      success: true,
      data: sessions
    }, 'تم جلب جميع الجلسات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على جلسة بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let session = await SessionService.getSessionByToken(id);
    session = resolveDatabaseResult(session);
    
    let status = 200;
    if (session.length < 1) status = 404;

    send(res, {
      success: true,
      data: session
    }, 'تم جلب الجلسة بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء جلسة جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createSession = async (req, res, next) => {
  try {
    const sessionData = req.body;

    let newSession = await SessionService.createSession(sessionData);
    newSession = resolveDatabaseResult(newSession);
    
    send(res, {
      success: true,
      data: newSession
    }, 'تم إنشاء الجلسة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الجلسة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedSession = await SessionService.updateSession(id, updateData);
    updatedSession = resolveDatabaseResult(updatedSession);
    
    send(res, {
      success: true,
      data: updatedSession
    }, 'تم تحديث الجلسة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الجلسة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await SessionService.deleteSession(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الجلسة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};