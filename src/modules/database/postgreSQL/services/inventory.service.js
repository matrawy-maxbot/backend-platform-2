import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import Inventory from '../models/Inventory.model.js';
import ProductVariant from '../models/ProductVariant.model.js';
import VendorSiteSetting from '../models/VendorSiteSetting.model.js';

/**
 * خدمة إدارة المخزون - Inventory Service
 * تحتوي على الوظائف الأساسية لإدارة المخزون
 */
class InventoryService {
  
  /**
   * إنشاء سجل مخزون جديد - Create new inventory record
   * @param {Object} inventoryData - بيانات المخزون
   * @returns {Promise<Object>} - السجل المُنشأ
   */
  static async createInventory(inventoryData) {
    try {
      // التحقق من وجود متغير المنتج والموقع
      const productVariant = await ProductVariant.findByPk(inventoryData.product_variant_id);
      if (!productVariant) {
        throw new Error('متغير المنتج غير موجود - Product variant not found');
      }

      const site = await VendorSiteSetting.findByPk(inventoryData.site_id);
      if (!site) {
        throw new Error('الموقع غير موجود - Site not found');
      }

      // التحقق من عدم وجود سجل مخزون مكرر لنفس المنتج والموقع
      const existingInventory = await Inventory.findOne({
        where: {
          product_variant_id: inventoryData.product_variant_id,
          site_id: inventoryData.site_id
        }
      });

      if (existingInventory) {
        throw new Error('سجل المخزون موجود بالفعل لهذا المنتج في هذا الموقع - Inventory record already exists for this product at this site');
      }

      const result = await PGinsert(Inventory, inventoryData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المخزون: ${error.message}`);
    }
  }

  /**
   * تحديث سجل المخزون - Update inventory record
   * @param {number} inventoryId - معرف المخزون
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateInventory(inventoryId, updateData) {
    try {
      const inventory = await Inventory.findByPk(inventoryId);
      if (!inventory) {
        throw new Error('سجل المخزون غير موجود - Inventory record not found');
      }

      const result = await PGupdate(Inventory, updateData, { id: inventoryId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المخزون: ${error.message}`);
    }
  }

  /**
   * حذف سجل المخزون - Delete inventory record
   * @param {number} inventoryId - معرف المخزون
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteInventory(inventoryId) {
    try {
      const inventory = await Inventory.findByPk(inventoryId);
      if (!inventory) {
        throw new Error('سجل المخزون غير موجود - Inventory record not found');
      }

      const result = await PGdelete(Inventory, { id: inventoryId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المخزون: ${error.message}`);
    }
  }

  /**
   * البحث في المخزون - Search inventory records
   * @param {Object} searchCriteria - معايير البحث
   * @returns {Promise<Array>} - قائمة سجلات المخزون
   */
  static async searchInventory(searchCriteria = {}) {
    try {
      const result = await PGselectAll(Inventory, {
        where: searchCriteria,
        include: [
          {
            model: ProductVariant,
            as: 'productVariant'
          },
          {
            model: VendorSiteSetting,
            as: 'site'
          }
        ]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في المخزون: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل مخزون بالمعرف - Get inventory by ID
   * @param {number} inventoryId - معرف المخزون
   * @returns {Promise<Object>} - سجل المخزون
   */
  static async getInventoryById(inventoryId) {
    try {
      const inventory = await Inventory.findByPk(inventoryId, {
        include: [
          {
            model: ProductVariant,
            as: 'productVariant'
          },
          {
            model: VendorSiteSetting,
            as: 'site'
          }
        ]
      });

      if (!inventory) {
        throw new Error('سجل المخزون غير موجود - Inventory record not found');
      }

      return inventory;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المخزون: ${error.message}`);
    }
  }

  /**
   * تحديث كمية المخزون - Update stock quantity
   * @param {number} inventoryId - معرف المخزون
   * @param {number} quantity - الكمية الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateStockQuantity(inventoryId, quantity) {
    try {
      if (quantity < 0) {
        throw new Error('كمية المخزون لا يمكن أن تكون سالبة - Stock quantity cannot be negative');
      }

      const result = await this.updateInventory(inventoryId, { 
        stock_quantity: quantity,
        last_restocked_at: new Date()
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث كمية المخزون: ${error.message}`);
    }
  }

  /**
   * حجز كمية من المخزون - Reserve inventory quantity
   * @param {number} inventoryId - معرف المخزون
   * @param {number} quantity - الكمية المراد حجزها
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async reserveQuantity(inventoryId, quantity) {
    try {
      const inventory = await this.getInventoryById(inventoryId);
      
      if (inventory.availableQuantity < quantity) {
        throw new Error('الكمية المطلوبة غير متاحة في المخزون - Requested quantity not available in stock');
      }

      const newReservedQuantity = inventory.reserved_quantity + quantity;
      
      const result = await this.updateInventory(inventoryId, { 
        reserved_quantity: newReservedQuantity 
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حجز الكمية: ${error.message}`);
    }
  }

  /**
   * إلغاء حجز كمية من المخزون - Release reserved quantity
   * @param {number} inventoryId - معرف المخزون
   * @param {number} quantity - الكمية المراد إلغاء حجزها
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async releaseReservedQuantity(inventoryId, quantity) {
    try {
      const inventory = await this.getInventoryById(inventoryId);
      
      if (inventory.reserved_quantity < quantity) {
        throw new Error('الكمية المحجوزة أقل من الكمية المطلوب إلغاء حجزها - Reserved quantity is less than requested release quantity');
      }

      const newReservedQuantity = inventory.reserved_quantity - quantity;
      
      const result = await this.updateInventory(inventoryId, { 
        reserved_quantity: newReservedQuantity 
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في إلغاء حجز الكمية: ${error.message}`);
    }
  }

  /**
   * الحصول على المخزون المنخفض - Get low stock items
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Array>} - قائمة المنتجات ذات المخزون المنخفض
   */
  static async getLowStockItems(siteId) {
    try {
      const result = await PGselectAll(Inventory, {
        where: {
          site_id: siteId
        },
        include: [
          {
            model: ProductVariant,
            as: 'productVariant'
          }
        ]
      });

      // تصفية العناصر ذات المخزون المنخفض
      const lowStockItems = result.filter(item => item.isLowStock);
      return lowStockItems;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المخزون المنخفض: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات المخزون - Get inventory statistics
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object>} - إحصائيات المخزون
   */
  static async getInventoryStats(siteId) {
    try {
      const inventoryItems = await this.searchInventory({ site_id: siteId });
      
      const stats = {
        totalItems: inventoryItems.length,
        totalStock: inventoryItems.reduce((sum, item) => sum + item.stock_quantity, 0),
        totalReserved: inventoryItems.reduce((sum, item) => sum + item.reserved_quantity, 0),
        totalSold: inventoryItems.reduce((sum, item) => sum + item.sold_quantity, 0),
        lowStockCount: inventoryItems.filter(item => item.isLowStock).length,
        outOfStockCount: inventoryItems.filter(item => item.stock_quantity === 0).length
      };

      return stats;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات المخزون: ${error.message}`);
    }
  }
}

export default InventoryService;