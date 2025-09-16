import sequelize from '../config/db.config.js';
import Profile from './Profile.model.js';
import ProfileTasks from './ProfileTasks.model.js';
import ServersInteractions from './ServersInteractions.model.js';
import Missions from './Missions.model.js';
import Likes from './Likes.model.js';
import Daily from './Daily.model.js';
import TopThree from './TopThree.model.js';
import VerifyDur from './VerifyDur.model.js';
import Votes from './Votes.model.js';
import Welcome from './Welcome.model.js';
import MuteChat from './MuteChat.model.js';
import MuteVoice from './MuteVoice.model.js';
import Links from './Links.model.js';
import Admins from './Admins.model.js';
import Ads from './Ads.model.js';
import Areply from './Areply.model.js';
import Backup from './Backup.model.js';
import Codes from './Codes.model.js';
import DashLog from './DashLog.model.js';
import Deafen from './Deafen.model.js';
import Events from './Events.model.js';
import Giveaway from './Giveaway.model.js';
import GuildsI from './GuildsI.model.js';
import GToggles from './GToggles.model.js';
import KB from './KB.model.js';

// تعريف العلاقات بين الـ Models هنا (لو في علاقات)


sequelize.sync().then(() => {
  console.log('All models were synchronized successfully.');
});

export { 
  Profile, 
  ProfileTasks, 
  ServersInteractions, 
  Missions, 
  Likes, 
  Daily, 
  TopThree, 
  VerifyDur, 
  Votes, 
  Welcome, 
  MuteChat, 
  MuteVoice, 
  Links, 
  Admins, 
  Ads, 
  Areply, 
  Backup, 
  Codes, 
  DashLog, 
  Deafen, 
  Events, 
  Giveaway, 
  GuildsI, 
  GToggles, 
  KB 
};