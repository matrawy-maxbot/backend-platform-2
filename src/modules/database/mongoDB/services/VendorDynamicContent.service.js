import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorDynamicContent } from '../models/index.js';

/**
 * خدمة إدارة المحتوى الديناميكي للبائعين
 * VendorDynamicContent Service
 */

// إنشاء محتوى ديناميكي جديد للبائع
export const createVendorDynamicContent = async (vendorId, contentData) => {
  try {
    const newContent = {
      vendor_id: vendorId,
      ...contentData
    };

    const result = await mDBinsert(VendorDynamicContent, newContent);
    return result;
  } catch (error) {
    throw new Error(`Error creating vendor dynamic content: ${error.message}`);
  }
};

// الحصول على المحتوى الديناميكي للبائع
export const getVendorDynamicContent = async (vendorId) => {
  try {
    const filter = { vendor_id: vendorId };
    const result = await mDBselectAll(VendorDynamicContent, filter);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(`Error fetching vendor dynamic content: ${error.message}`);
  }
};

// تحديث المحتوى الديناميكي للبائع
export const updateVendorDynamicContent = async (vendorId, updateData) => {
  try {
    const filter = { vendor_id: vendorId };
    const result = await mDBupdate(VendorDynamicContent, filter, updateData);
    return result;
  } catch (error) {
    throw new Error(`Error updating vendor dynamic content: ${error.message}`);
  }
};

// حذف المحتوى الديناميكي للبائع
export const deleteVendorDynamicContent = async (vendorId) => {
  try {
    const filter = { vendor_id: vendorId };
    const result = await mDBdelete(VendorDynamicContent, filter);
    return result;
  } catch (error) {
    throw new Error(`Error deleting vendor dynamic content: ${error.message}`);
  }
};

// إضافة بانر جديد للصفحة الرئيسية
export const addHomepageBanner = async (vendorId, bannerData) => {
  try {
    const filter = { vendor_id: vendorId };
    const update = {
      $push: { homepage_banners: bannerData }
    };
    const result = await mDBupdate(VendorDynamicContent, filter, update);
    return result;
  } catch (error) {
    throw new Error(`Error adding homepage banner: ${error.message}`);
  }
};

// إزالة بانر من الصفحة الرئيسية
export const removeHomepageBanner = async (vendorId, bannerId) => {
  try {
    const filter = { vendor_id: vendorId };
    const update = {
      $pull: { homepage_banners: { _id: bannerId } }
    };
    const result = await mDBupdate(VendorDynamicContent, filter, update);
    return result;
  } catch (error) {
    throw new Error(`Error removing homepage banner: ${error.message}`);
  }
};

// تحديث المنتجات المميزة
export const updateFeaturedProducts = async (vendorId, productIds) => {
  try {
    const filter = { vendor_id: vendorId };
    const update = { featured_products: productIds };
    const result = await mDBupdate(VendorDynamicContent, filter, update);
    return result;
  } catch (error) {
    throw new Error(`Error updating featured products: ${error.message}`);
  }
};

// تحديث روابط التواصل الاجتماعي
export const updateSocialLinks = async (vendorId, socialLinks) => {
  try {
    const filter = { vendor_id: vendorId };
    const update = { social_links: socialLinks };
    const result = await mDBupdate(VendorDynamicContent, filter, update);
    return result;
  } catch (error) {
    throw new Error(`Error updating social links: ${error.message}`);
  }
};

// الحصول على البانرات النشطة للبائع
export const getActiveHomepageBanners = async (vendorId) => {
  try {
    const content = await getVendorDynamicContent(vendorId);
    if (!content || !content.homepage_banners) {
      return [];
    }
    
    return content.homepage_banners
      .filter(banner => banner.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch (error) {
    throw new Error(`Error fetching active homepage banners: ${error.message}`);
  }
};