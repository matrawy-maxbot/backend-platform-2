import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول المستخدمين - User Model
 * يحتوي على معلومات المستخدمين الأساسية
 * @module UserModel
 */
const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING(15),
        primaryKey: true,
        defaultValue: () => {
            // إنشاء ID فريد: آخر 8 أرقام من timestamp + 4 أرقام عشوائية
            const timestamp = new Date().getTime().toString().slice(-8);
            const random = Math.floor(Math.random() * 8999 + 1000).toString();
            return timestamp + random;
        },
        comment: 'معرف المستخدم الفريد - User ID'
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        },
        comment: 'البريد الإلكتروني للمستخدم - User Email'
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true,
            isBefore: new Date().toISOString().split('T')[0] // يجب أن يكون تاريخ الميلاد في الماضي
        },
        comment: 'تاريخ ميلاد المستخدم - User Birth Date'
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'كلمة المرور المشفرة - Hashed Password'
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'الاسم الكامل للمستخدم - Full Name'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[0-9+\-\s()]{10,20}$/ // فورمات رقم التليفون
        },
        comment: 'رقم الهاتف - Phone Number'
    },
    avatar_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isUrl: true
        },
        comment: 'رابط صورة المستخدم - Avatar URL'
    },
    is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'حالة تأكيد البريد الإلكتروني - Email Verification Status'
    },
    is_phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'حالة تأكيد رقم الهاتف - Phone Verification Status'
    }
}, {
    tableName: 'users',
    timestamps: true, // إضافة createdAt و updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['full_name']
        },
        {
            fields: ['phone']
        },
        {
            fields: ['created_at']
        }
    ],
    comment: 'جدول المستخدمين - Users Table'
});

export default User;