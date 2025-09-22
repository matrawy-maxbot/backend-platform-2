import { InventoryService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم المخزون
 * @module InventoryController
 */

/**
 * الحصول على جميع سجلات المخزون
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllInventory = async (req, res, next) => {
  try {
    let inventory = await InventoryService.getAllInventory();
    inventory = resolveDatabaseResult(inventory);
    
    send(res, {
      success: true,
      data: inventory
    }, 'تم جلب جميع سجلات المخزون بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجل مخزون بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let inventory = await InventoryService.getInventoryById(id);
    inventory = resolveDatabaseResult(inventory);
    
    let status = 200;
    if (inventory.length < 1) status = 404;

    send(res, {
      success: true,
      data: inventory
    }, 'تم جلب سجل المخزون بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء سجل مخزون جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createInventory = async (req, res, next) => {
  try {
    const inventoryData = req.body;

    let newInventory = await InventoryService.createInventory(inventoryData);
    newInventory = resolveDatabaseResult(newInventory);
    
    send(res, {
      success: true,
      data: newInventory
    }, 'تم إنشاء سجل المخزون بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث سجل المخزون
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedInventory = await InventoryService.updateInventory(id, updateData);
    updatedInventory = resolveDatabaseResult(updatedInventory);
    
    send(res, {
      success: true,
      data: updatedInventory
    }, 'تم تحديث سجل المخزون بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف سجل المخزون
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await InventoryService.deleteInventory(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف سجل المخزون بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};