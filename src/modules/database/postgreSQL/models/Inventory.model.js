import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج المخزون (Inventory Model)
 * يدير كميات المنتجات المتاحة والمحجوزة والمباعة
 * Manages product quantities: available, reserved, and sold
 */
const Inventory = sequelize.define('Inventory', {
  // المعرف الفريد - Unique identifier
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف فريد للمخزون - Unique inventory identifier'
  },

  // كمية المخزون المتاحة - Available stock quantity
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'كمية المخزون يجب أن تكون أكبر من أو تساوي صفر - Stock quantity must be greater than or equal to zero'
      }
    },
    comment: 'الكمية الإجمالية المتاحة في المخزون - Total available quantity in stock'
  },

  // حد التنبيه للمخزون المنخفض - Low stock alert threshold
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: {
        args: [0],
        msg: 'حد التنبيه يجب أن يكون أكبر من أو يساوي صفر - Low stock threshold must be greater than or equal to zero'
      }
    },
    comment: 'الحد الأدنى للتنبيه عند انخفاض المخزون - Minimum threshold for low stock alert'
  },

  // الكمية المحجوزة - Reserved quantity (for pending orders)
  reserved_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'الكمية المحجوزة يجب أن تكون أكبر من أو تساوي صفر - Reserved quantity must be greater than or equal to zero'
      }
    },
    comment: 'الكمية المحجوزة للطلبات المعلقة - Quantity reserved for pending orders'
  },

  // الكمية المباعة - Total sold quantity
  sold_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'الكمية المباعة يجب أن تكون أكبر من أو تساوي صفر - Sold quantity must be greater than or equal to zero'
      }
    },
    comment: 'إجمالي الكمية المباعة - Total quantity sold'
  },

  // تاريخ آخر تجديد للمخزون - Last restocking date
  last_restocked_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'تاريخ آخر تجديد للمخزون - Date of last inventory restocking'
  },

  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالمخزون - Associated site identifier'
  },

  // معرف متغير المنتج (Foreign Key) - Product Variant ID
  product_variant_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'product_variants',
      key: 'id'
    },
    comment: 'معرف متغير المنتج المرتبط بالمخزون - Associated product variant identifier'
  }
}, {
  // إعدادات الجدول - Table settings
  tableName: 'inventory',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',

  // الفهارس لتحسين الأداء - Indexes for performance optimization
  indexes: [
    {
      fields: ['site_id'],
      name: 'idx_inventory_site_id'
    },
    {
      fields: ['product_variant_id'],
      name: 'idx_inventory_product_variant_id'
    },
    {
      fields: ['site_id', 'product_variant_id'],
      unique: true,
      name: 'idx_inventory_site_variant_unique'
    },
    {
      fields: ['stock_quantity'],
      name: 'idx_inventory_stock_quantity'
    },
    {
      fields: ['low_stock_threshold'],
      name: 'idx_inventory_low_stock_threshold'
    }
  ],

  // الطرق المحسوبة - Computed getter methods
  getterMethods: {
    /**
     * حساب الكمية المتاحة الفعلية (المخزون - المحجوز)
     * Calculate actual available quantity (stock - reserved)
     * @returns {number} الكمية المتاحة للبيع
     */
    availableQuantity() {
      return this.stock_quantity - this.reserved_quantity;
    },

    /**
     * فحص ما إذا كان المخزون منخفض
     * Check if inventory is running low
     * @returns {boolean} true إذا كان المخزون منخفض
     */
    isLowStock() {
      return this.availableQuantity <= this.low_stock_threshold;
    },

    /**
     * حساب نسبة المخزون المتاحة
     * Calculate available stock percentage
     * @returns {number} نسبة المخزون المتاحة من إجمالي المخزون
     */
    availabilityPercentage() {
      if (this.stock_quantity === 0) return 0;
      return Math.round((this.availableQuantity / this.stock_quantity) * 100);
    },

    /**
     * حالة المخزون (متاح، منخفض، نفد)
     * Stock status (available, low, out of stock)
     * @returns {string} حالة المخزون
     */
    stockStatus() {
      const available = this.availableQuantity;
      if (available <= 0) return 'out_of_stock'; // نفد المخزون
      if (available <= this.low_stock_threshold) return 'low_stock'; // مخزون منخفض
      return 'in_stock'; // متوفر
    }
  },

  // التحقق من صحة البيانات على مستوى النموذج - Model-level validations
  validate: {
    /**
     * التأكد من أن الكمية المحجوزة لا تتجاوز المخزون المتاح
     * Ensure reserved quantity doesn't exceed available stock
     */
    reservedNotExceedingStock() {
      if (this.reserved_quantity > this.stock_quantity) {
        throw new Error('الكمية المحجوزة لا يمكن أن تتجاوز كمية المخزون المتاحة - Reserved quantity cannot exceed available stock');
      }
    }
  }
});

export default Inventory;