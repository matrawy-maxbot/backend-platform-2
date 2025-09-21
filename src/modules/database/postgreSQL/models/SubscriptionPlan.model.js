import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول خطط الاشتراك - SubscriptionPlan Model
 * يحتوي على معلومات خطط الاشتراك المختلفة
 */
const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'معرف خطة الاشتراك الفريد - Subscription Plan ID'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // بقى unique عادي من غير site_id
        validate: {
            notEmpty: true
        },
        comment: 'اسم خطة الاشتراك - Subscription Plan Name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'وصف خطة الاشتراك - Subscription Plan Description'
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        comment: 'سعر خطة الاشتراك - Subscription Plan Price'
    },
    duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        },
        comment: 'مدة الاشتراك بالأيام - Subscription Duration in Days'
    },
    features: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'مميزات خطة الاشتراك - Subscription Plan Features'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'حالة تفعيل خطة الاشتراك - Subscription Plan Active Status'
    }
}, {
    tableName: 'subscription_plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['is_active']
        },
        {
            fields: ['price']
        },
        {
            fields: ['name']
        },
        {
            fields: ['duration_days']
        }
    ],
    comment: 'جدول خطط الاشتراك - Subscription Plans Table'
});

export default SubscriptionPlan;