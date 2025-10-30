import sequelize from '../config/db.config.js';
import Admin from './Admin.model.js';
import ScheduleMessage from './ScheduleMessage.model.js';
import ChannelContent from './ChannelContent.model.js';
import Link from './Link.model.js';
import BadWord from './BadWord.model.js';
import Protection from './Protection.model.js';

// تعريف العلاقات بين الـ Models

sequelize.sync().then(() => {
  console.log('All models were synchronized successfully.');
});

export { 
  Admin,
  ScheduleMessage,
  ChannelContent,
  Link,
  BadWord,
  Protection,
};