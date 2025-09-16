import { Router } from 'express';
import BackupController from '../controllers/backup.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createBackupSchema,
  createServerBackupSchema,
  getBackupByGuildIdSchema,
  getBackupsByServerNameSchema,
  getBackupsByInactiveChannelSchema,
  getBackupsByInactiveTimeoutSchema,
  getBackupsBySystemMessagesSchema,
  getBackupsByDateRangeSchema,
  getRecentBackupsSchema,
  updateBackupSchema,
  updateServerNameSchema,
  updateInactiveChannelSchema,
  updateInactiveTimeoutSchema,
  updateSystemMessagesSchema,
  updateCategoriesSchema,
  updateChatChannelsSchema,
  updateVoiceChannelsSchema,
  updateAnnouncementChannelsSchema,
  updateStageChannelsSchema,
  updateRolesSchema,
  updateTimeStampSchema,
  deleteBackupSchema,
  deleteOldBackupsSchema,
  deleteBackupsByServerNameSchema,
  existsBackupSchema,
  isBackupCompleteSchema,
  getBackupSizeSchema,
  upsertBackupSchema,
  restoreBackupSchema,
  compareBackupsSchema
} from '../validators/backup.validator.js';

const router = Router();

// إنشاء النسخ الاحتياطية
router.post('/', validationMiddlewareFactory(createBackupSchema, 'body'), BackupController.createBackup);
router.post('/server/:guildId/:serverName', 
  validationMiddlewareFactory(createServerBackupSchema, 'params'),
  BackupController.createServerBackup
);

// الحصول على النسخ الاحتياطية
router.get('/', BackupController.getAllBackups);
router.get('/guild/:guildId', 
  validationMiddlewareFactory(getBackupByGuildIdSchema, 'params'),
  BackupController.getBackupByGuildId
);
router.get('/server/:serverName', 
  validationMiddlewareFactory(getBackupsByServerNameSchema, 'params'),
  BackupController.getBackupsByServerName
);
router.get('/inactive-channel/:inactiveChannel', 
  validationMiddlewareFactory(getBackupsByInactiveChannelSchema, 'params'),
  BackupController.getBackupsByInactiveChannel
);
router.get('/inactive-timeout/:timeout', 
  validationMiddlewareFactory(getBackupsByInactiveTimeoutSchema, 'params'),
  BackupController.getBackupsByInactiveTimeout
);
router.get('/system-messages/:systemMessages', 
  validationMiddlewareFactory(getBackupsBySystemMessagesSchema, 'params'),
  BackupController.getBackupsBySystemMessages
);
router.get('/date-range', 
  validationMiddlewareFactory(getBackupsByDateRangeSchema, 'query'),
  BackupController.getBackupsByDateRange
);
router.get('/recent', 
  validationMiddlewareFactory(getRecentBackupsSchema, 'query'),
  BackupController.getRecentBackups
);
router.get('/with-categories', BackupController.getBackupsWithCategories);
router.get('/with-chat-channels', BackupController.getBackupsWithChatChannels);
router.get('/with-voice-channels', BackupController.getBackupsWithVoiceChannels);
router.get('/with-roles', BackupController.getBackupsWithRoles);
router.get('/complete', BackupController.getCompleteBackups);

// تحديث النسخ الاحتياطية
router.put('/:guildId', 
  validationMiddlewareFactory(updateBackupSchema, 'params'),
  validationMiddlewareFactory(updateBackupSchema, 'body'),
  BackupController.updateBackup
);
router.put('/:guildId/server-name', 
  validationMiddlewareFactory(updateServerNameSchema, 'params'),
  validationMiddlewareFactory(updateServerNameSchema, 'body'),
  BackupController.updateServerName
);
router.put('/:guildId/inactive-channel', 
  validationMiddlewareFactory(updateInactiveChannelSchema, 'params'),
  validationMiddlewareFactory(updateInactiveChannelSchema, 'body'),
  BackupController.updateInactiveChannel
);
router.put('/:guildId/inactive-timeout', 
  validationMiddlewareFactory(updateInactiveTimeoutSchema, 'params'),
  validationMiddlewareFactory(updateInactiveTimeoutSchema, 'body'),
  BackupController.updateInactiveTimeout
);
router.put('/:guildId/system-messages', 
  validationMiddlewareFactory(updateSystemMessagesSchema, 'params'),
  validationMiddlewareFactory(updateSystemMessagesSchema, 'body'),
  BackupController.updateSystemMessages
);
router.put('/:guildId/categories', 
  validationMiddlewareFactory(updateCategoriesSchema, 'params'),
  validationMiddlewareFactory(updateCategoriesSchema, 'body'),
  BackupController.updateCategories
);
router.put('/:guildId/chat-channels', 
  validationMiddlewareFactory(updateChatChannelsSchema, 'params'),
  validationMiddlewareFactory(updateChatChannelsSchema, 'body'),
  BackupController.updateChatChannels
);
router.put('/:guildId/voice-channels', 
  validationMiddlewareFactory(updateVoiceChannelsSchema, 'params'),
  validationMiddlewareFactory(updateVoiceChannelsSchema, 'body'),
  BackupController.updateVoiceChannels
);
router.put('/:guildId/announcement-channels', 
  validationMiddlewareFactory(updateAnnouncementChannelsSchema, 'params'),
  validationMiddlewareFactory(updateAnnouncementChannelsSchema, 'body'),
  BackupController.updateAnnouncementChannels
);
router.put('/:guildId/stage-channels', 
  validationMiddlewareFactory(updateStageChannelsSchema, 'params'),
  validationMiddlewareFactory(updateStageChannelsSchema, 'body'),
  BackupController.updateStageChannels
);
router.put('/:guildId/roles', 
  validationMiddlewareFactory(updateRolesSchema, 'params'),
  validationMiddlewareFactory(updateRolesSchema, 'body'),
  BackupController.updateRoles
);
router.put('/:guildId/timestamp', 
  validationMiddlewareFactory(updateTimeStampSchema, 'params'),
  validationMiddlewareFactory(updateTimeStampSchema, 'body'),
  BackupController.updateTimeStamp
);

// حذف النسخ الاحتياطية
router.delete('/:guildId', 
  validationMiddlewareFactory(deleteBackupSchema, 'params'),
  BackupController.deleteBackup
);
router.delete('/old', 
  validationMiddlewareFactory(deleteOldBackupsSchema, 'query'),
  BackupController.deleteOldBackups
);
router.delete('/empty', BackupController.deleteEmptyBackups);
router.delete('/server/:serverName', 
  validationMiddlewareFactory(deleteBackupsByServerNameSchema, 'params'),
  BackupController.deleteBackupsByServerName
);
router.delete('/all', BackupController.deleteAllBackups);

// إحصائيات ووظائف أخرى
router.get('/stats', BackupController.getBackupsStats);
router.get('/exists/:guildId', 
  validationMiddlewareFactory(existsBackupSchema, 'params'),
  BackupController.existsBackup
);
router.get('/complete/:guildId', 
  validationMiddlewareFactory(isBackupCompleteSchema, 'params'),
  BackupController.isBackupComplete
);
router.get('/size/:guildId', 
  validationMiddlewareFactory(getBackupSizeSchema, 'params'),
  BackupController.getBackupSize
);
router.put('/upsert/:guildId', 
  validationMiddlewareFactory(upsertBackupSchema, 'params'),
  validationMiddlewareFactory(upsertBackupSchema, 'body'),
  BackupController.upsertBackup
);
router.post('/restore/:guildId', 
  validationMiddlewareFactory(restoreBackupSchema, 'params'),
  BackupController.restoreBackup
);
router.get('/compare/:guildId1/:guildId2', 
  validationMiddlewareFactory(compareBackupsSchema, 'params'),
  BackupController.compareBackups
);

export default router;