import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isUppercase: true // علشان الكود يبقي uppercase دايماً
    }
  },
  discount_type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false
  },
  discount_value: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  min_order_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  max_discount_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    }
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['code']
    },
    {
      fields: ['valid_until']
    },
    {
      fields: ['is_active']
    }
  ],
  getterMethods: {
    isValid() {
      const now = new Date();
      return this.is_active &&
             now >= this.valid_from &&
             now <= this.valid_until &&
             (!this.usage_limit || this.used_count < this.usage_limit);
    },
    remainingUses() {
      return this.usage_limit ? this.usage_limit - this.used_count : null;
    }
  }
});

export default Coupon;