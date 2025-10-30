import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج سجلات الأحداث - Log Model
 * يحتوي على سجلات جميع الأحداث التي تحدث في خوادم Discord
 * @module LogModel
 */
const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'معرف السجل الفريد - Log ID'
    },
    server_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'معرف خادم Discord - Discord Server ID'
    },
    log_type: {
        type: DataTypes.ENUM(
            'member_join',
            'member_leave',
            'role_change',
            'member_kick',
            'member_ban',
            'channel_create',
            'channel_delete',
            'channel_update',
            'member_update',
            'message_delete',
            'message_edit',
            'server_settings_update'
        ),
        allowNull: false,
        comment: 'نوع حدث السجل - Type of log event'
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'معرف المستخدم المشارك في الحدث - Discord User ID involved in the event'
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'اسم المستخدم المشارك - Username of the user involved'
    },
    target_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'معرف الهدف (قناة، دور، رسالة، إلخ) - Target ID (channel, role, message, etc.)'
    },
    target_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'اسم الهدف - Target name'
    },
    old_value: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'القيمة القديمة قبل التغيير - Old value before change'
    },
    new_value: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'القيمة الجديدة بعد التغيير - New value after change'
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'سبب الإجراء - Reason for the action'
    },
    executor_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'معرف المستخدم الذي نفذ الإجراء - ID of the user who executed the action'
    },
    executor_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'اسم المستخدم الذي نفذ الإجراء - Name of the user who executed the action'
    },
    channel_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'معرف القناة التي حدث فيها الحدث - Channel ID where the event occurred'
    },
    additional_data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'بيانات إضافية بصيغة JSON - Additional data in JSON format'
    }
}, {
    tableName: 'logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
        {
            fields: ['server_id']
        },
        {
            fields: ['log_type']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['created_at']
        },
        {
            fields: ['server_id', 'log_type']
        },
        {
            fields: ['server_id', 'created_at']
        }
    ],
    comment: 'جدول سجلات الأحداث - Logs Table'
});

export default Log;