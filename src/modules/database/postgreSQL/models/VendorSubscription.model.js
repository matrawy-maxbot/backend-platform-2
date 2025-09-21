import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول اشتراكات البائعين - VendorSubscription Model
 * يحتوي على معلومات اشتراكات البائعين في الخطط المختلفة
 */
const VendorSubscription = sequelize.define('VendorSubscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'معرف اشتراك البائع الفريد - Vendor Subscription ID'
    },
    site_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendor_site_settings',
            key: 'id'
        },
        comment: 'معرف الموقع المرتبط بالاشتراك - Associated site identifier'
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendors',
            key: 'id'
        },
        comment: 'معرف البائع المرتبط بالاشتراك - Associated vendor identifier'
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'subscription_plans',
            key: 'id'
        },
        comment: 'معرف خطة الاشتراك - Subscription plan identifier'
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'تاريخ بداية الاشتراك - Subscription start date'
    },
    auto_renew: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'التجديد التلقائي للاشتراك - Auto renewal status'
    },
    payment_gateway: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'بوابة الدفع المستخدمة - Payment gateway used'
    },
    gateway_subscription_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'معرف الاشتراك في بوابة الدفع - Gateway subscription identifier'
    }
}, {
    tableName: 'vendor_subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['site_id']
        },
        {
            fields: ['vendor_id']
        },
        {
            fields: ['plan_id']
        },
        {
            fields: ['start_date']
        },
        {
            fields: ['auto_renew']
        }
    ],
    comment: 'جدول اشتراكات البائعين - Vendor Subscriptions Table'
});

// Virtual field عشان نحسب end_date
VendorSubscription.prototype.getEndDate = function() {
    if (!this.start_date || !this.SubscriptionPlan?.duration_days) {
        return null;
    }
    
    const endDate = new Date(this.start_date);
    endDate.setDate(endDate.getDate() + this.SubscriptionPlan.duration_days);
    return endDate;
};

// Instance method عشان نcheck إذا الاشتراك لسه شغال
VendorSubscription.prototype.isActive = function() {
    const endDate = this.getEndDate();
    if (!endDate) return false;
    
    return new Date() < endDate;
};

// Instance method لحساب الأيام المتبقية في الاشتراك
VendorSubscription.prototype.getDaysRemaining = function() {
    const endDate = this.getEndDate();
    if (!endDate) return 0;
    
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff : 0;
};

// Instance method للتحقق من انتهاء الاشتراك قريباً
VendorSubscription.prototype.isExpiringSoon = function(daysThreshold = 7) {
    const daysRemaining = this.getDaysRemaining();
    return daysRemaining > 0 && daysRemaining <= daysThreshold;
};

export default VendorSubscription;