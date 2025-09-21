import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  business_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  business_email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  business_phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^[0-9+\-\s()]{10,20}$/
    }
  },
  business_logo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  business_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended', 'rejected'),
    defaultValue: 'pending'
  },
  verification_status: {
    type: DataTypes.ENUM('unverified', 'verified', 'rejected'),
    defaultValue: 'unverified'
  },
  approved_by: {
    type: DataTypes.STRING(15),
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'vendors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['verification_status']
    },
    {
      fields: ['business_email']
    },
    {
      fields: ['approved_by']
    }
  ]
});

export default Vendor;