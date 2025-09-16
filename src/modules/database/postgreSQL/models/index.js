import sequelize from '../config/db.config.js';
import Admins from './Admins.model.js';
// تعريف العلاقات بين الـ Models هنا (لو في علاقات)


sequelize.sync().then(() => {
  console.log('All models were synchronized successfully.');
});

export { 
  Admins, 
};