import { AddressService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم العناوين
 * @module AddressesController
 */

/**
 * الحصول على جميع العناوين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllAddresses = async (req, res, next) => {
  try {
    let addresses = await AddressService.getAllAddresses();
    addresses = resolveDatabaseResult(addresses);
    
    send(res, {
      success: true,
      data: addresses
    }, 'تم جلب جميع العناوين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على عنوان بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let address = await AddressService.getAddressById(id);
    address = resolveDatabaseResult(address);
    
    let status = 200;
    if (address.length < 1) status = 404;

    send(res, {
      success: true,
      data: address
    }, 'تم جلب العنوان بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء عنوان جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createAddress = async (req, res, next) => {
  try {
    const addressData = req.body;

    let newAddress = await AddressService.createAddress(addressData);
    newAddress = resolveDatabaseResult(newAddress);
    
    send(res, {
      success: true,
      data: newAddress
    }, 'تم إنشاء العنوان بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث العنوان
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedAddress = await AddressService.updateAddress(id, updateData);
    updatedAddress = resolveDatabaseResult(updatedAddress);
    
    send(res, {
      success: true,
      data: updatedAddress
    }, 'تم تحديث العنوان بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف العنوان
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await AddressService.deleteAddress(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف العنوان بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};