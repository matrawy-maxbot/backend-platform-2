import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج المشرفين - Admin Model
 * يحتوي على معلومات المشرفين في خوادم Discord
 * @module AdminModel
 */
const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'معرف المشرف الفريد - Admin ID'
    },
    admin_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'معرف المستخدم في Discord للمشرف - Discord User ID of the admin'
    },
    server_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'معرف خادم Discord - Discord Server ID'
    }
}, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['admin_id', 'server_id'],
            name: 'unique_admin_server'
        },
        {
            fields: ['server_id']
        },
        {
            fields: ['admin_id']
        }
    ],
    comment: 'جدول المشرفين - Admins Table'
});

export default Admin;