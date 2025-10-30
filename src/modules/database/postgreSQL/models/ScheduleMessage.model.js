import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج الرسائل المجدولة - ScheduleMessage Model
 * يحتوي على معلومات الرسائل والإعلانات المجدولة في خوادم Discord
 * @module ScheduleMessageModel
 */
const ScheduleMessage = sequelize.define('ScheduleMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'معرف الرسالة المجدولة الفريد - Schedule Message ID'
    },
    server_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'معرف خادم Discord - Discord Server ID'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'عنوان الإعلان - Advertisement title'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'محتوى الإعلان - Advertisement content'
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'رابط الصورة للإعلان - Image URL for the advertisement'
    },
    link_url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'رابط الإعلان - Link URL for the advertisement'
    },
    channels: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        comment: 'مصفوفة معرفات القنوات المستهدفة - Array of target channel IDs'
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        comment: 'مصفوفة معرفات الأدوار المستهدفة - Array of target role IDs'
    },
    
    // إعدادات نوع النشر - Publish Type Settings
    publish_type: {
        type: DataTypes.ENUM('immediate', 'scheduled'),
        defaultValue: 'immediate',
        comment: 'نوع النشر - Type of publishing'
    },
    
    // إعدادات وضع الجدولة - Schedule Mode Settings
    schedule_mode: {
        type: DataTypes.ENUM('specific_time', 'delay_from_now'),
        defaultValue: 'specific_time',
        comment: 'نوع وضع الجدولة - Schedule mode type'
    },
    
    // التاريخ والوقت المحدد - Specific Date & Time
    scheduled_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'الوقت المجدول المحدد - Specific scheduled time'
    },
    
    // إعدادات التأخير من الآن - Delay from Now Settings
    delay_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'مقدار التأخير للجدولة - Delay amount for scheduling'
    },
    delay_unit: {
        type: DataTypes.ENUM('minutes', 'hours', 'days'),
        defaultValue: 'minutes',
        comment: 'وحدة التأخير للجدولة - Delay unit for scheduling'
    },
    
    // إعدادات نوع الجدولة - Schedule Type Settings
    schedule_type: {
        type: DataTypes.ENUM('one_time', 'recurring'),
        defaultValue: 'one_time',
        comment: 'نوع الجدولة - Type of schedule'
    },
    
    // إعدادات التكرار - Recurring Settings
    recurring_type: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: true,
        comment: 'نوع التكرار - Type of recurrence'
    },
    
    // مستوى الأولوية - Priority Level
    priority_level: {
        type: DataTypes.ENUM('low', 'normal', 'high'),
        defaultValue: 'normal',
        comment: 'مستوى أولوية الرسالة - Priority level of the message'
    }
}, {
    tableName: 'schedule_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
        {
            fields: ['server_id']
        },
        {
            fields: ['scheduled_time']
        },
        {
            fields: ['priority_level']
        },
        {
            fields: ['publish_type']
        },
        {
            fields: ['schedule_type']
        },
        {
            fields: ['server_id', 'scheduled_time']
        }
    ],
    comment: 'جدول الرسائل المجدولة - Schedule Messages Table'
});

export default ScheduleMessage;