import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج أفضل ثلاثة - Top Three Model
 * يحتوي على معرف العنصر واسمه ووصفه
 */
const TopThree = sequelize.define('TopThree', {
  // معرف العنصر
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'معرف العنصر'
  },
  
  // اسم العنصر
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'اسم العنصر'
  },
  
  // وصف العنصر
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'وصف العنصر'
  }
}, {
  tableName: 'top_three',
  timestamps: true, // إضافة createdAt و updatedAt
  indexes: [
    {
      fields: ['id'],
      unique: true
    },
    {
      fields: ['name']
    }
  ],
  comment: 'جدول أفضل ثلاثة عناصر',
  hooks: {
    // إضافة البيانات الافتراضية بعد إنشاء الجدول
    afterSync: async () => {
      const count = await TopThree.count();
      if (count === 0) {
        await TopThree.bulkCreate([
          {
            id: '423067123225722891',
            name: 'R7 Clan',
            description: 'dsf ssgdsgdsg sd'
          },
          {
            id: '520341040931143692',
            name: 'Wizard',
            description: 'erydrgfd gfddfryfdh fchfdfdhgfd fdhfdhd hdhfdhdghdfrf'
          },
          {
            id: '520346922876141598',
            name: 'Programmers group',
            description: 'rgdrser eryery erertreryer fdg'
          }
        ]);
        console.log('تم إدراج البيانات الافتراضية لجدول top_three');
      }
    }
  }
});

export default TopThree;