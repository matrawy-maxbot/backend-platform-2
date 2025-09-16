import { Router } from 'express';
import DashLogController from '../controllers/dashlog.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createLogSchema,
  createGuildUserLogSchema,
  getLogByIdSchema,
  getLogsByGuildIdSchema,
  getLogsByUserIdSchema,
  getLogsByPageNameSchema,
  getLogsByDateRangeSchema,
  getRecentLogsSchema,
  getGuildUserLogsSchema,
  searchLogsSchema,
  updateLogSchema,
  updatePageNameSchema,
  updateEventTimeSchema,
  deleteLogSchema,
  deleteGuildLogsSchema,
  deleteUserLogsSchema,
  deleteOldLogsSchema,
  deleteLogsByPageNameSchema,
  deleteLogsByDateRangeSchema,
  countGuildLogsSchema,
  countUserLogsSchema,
  countPageLogsSchema,
  logExistsSchema,
  getMostVisitedPagesSchema,
  getMostActiveUsersSchema,
  getMostActiveGuildsSchema,
  upsertLogSchema,
  exportGuildLogsSchema,
  importGuildLogsSchema
} from '../validators/dashlog.validator.js';

const router = Router();

// مسارات إنشاء السجلات
router.post(
  '/',
  validationMiddlewareFactory(createLogSchema, 'body'),
  DashLogController.createLog
);

router.post(
  '/guild-user',
  validationMiddlewareFactory(createGuildUserLogSchema, 'body'),
  DashLogController.createGuildUserLog
);

// مسارات الحصول على السجلات
router.get(
  '/',
  DashLogController.getAllLogs
);

router.get(
  '/stats',
  DashLogController.getLogStats
);

router.get(
  '/count',
  DashLogController.countAllLogs
);

router.get(
  '/count/today',
  DashLogController.countTodayLogs
);

router.get(
  '/count/guilds',
  DashLogController.countUniqueGuilds
);

router.get(
  '/count/users',
  DashLogController.countUniqueUsers
);

router.get(
  '/count/pages',
  DashLogController.countUniquePages
);

router.get(
  '/count/recent',
  DashLogController.countRecentLogs
);

router.get(
  '/recent',
  validationMiddlewareFactory(getRecentLogsSchema, 'query'),
  DashLogController.getRecentLogs
);

router.get(
  '/today',
  DashLogController.getTodayLogs
);

router.get(
  '/search',
  validationMiddlewareFactory(searchLogsSchema, 'query'),
  DashLogController.searchLogs
);

router.get(
  '/date-range',
  validationMiddlewareFactory(getLogsByDateRangeSchema, 'query'),
  DashLogController.getLogsByDateRange
);

router.get(
  '/most-visited-pages',
  validationMiddlewareFactory(getMostVisitedPagesSchema, 'query'),
  DashLogController.getMostVisitedPages
);

router.get(
  '/most-active-users',
  validationMiddlewareFactory(getMostActiveUsersSchema, 'query'),
  DashLogController.getMostActiveUsers
);

router.get(
  '/most-active-guilds',
  validationMiddlewareFactory(getMostActiveGuildsSchema, 'query'),
  DashLogController.getMostActiveGuilds
);

router.get(
  '/activity-distribution',
  DashLogController.getActivityDistributionByHour
);

router.get(
  '/:id',
  validationMiddlewareFactory(getLogByIdSchema, 'params'),
  DashLogController.getLogById
);

router.get(
  '/:id/exists',
  validationMiddlewareFactory(logExistsSchema, 'params'),
  DashLogController.logExists
);

router.get(
  '/guild/:guildId',
  validationMiddlewareFactory(getLogsByGuildIdSchema, 'params'),
  DashLogController.getLogsByGuildId
);

router.get(
  '/guild/:guildId/count',
  validationMiddlewareFactory(countGuildLogsSchema, 'params'),
  DashLogController.countGuildLogs
);

router.get(
  '/guild/:guildId/export',
  validationMiddlewareFactory(exportGuildLogsSchema, 'params'),
  DashLogController.exportGuildLogs
);

router.get(
  '/guild/:guildId/user/:userId',
  validationMiddlewareFactory(getGuildUserLogsSchema, 'params'),
  DashLogController.getGuildUserLogs
);

router.get(
  '/user/:userId',
  validationMiddlewareFactory(getLogsByUserIdSchema, 'params'),
  DashLogController.getLogsByUserId
);

router.get(
  '/user/:userId/count',
  validationMiddlewareFactory(countUserLogsSchema, 'params'),
  DashLogController.countUserLogs
);

router.get(
  '/page/:pageName',
  validationMiddlewareFactory(getLogsByPageNameSchema, 'params'),
  DashLogController.getLogsByPageName
);

router.get(
  '/page/:pageName/count',
  validationMiddlewareFactory(countPageLogsSchema, 'params'),
  DashLogController.countPageLogs
);

// مسارات تحديث السجلات
router.put(
  '/:id',
  validationMiddlewareFactory(updateLogSchema, 'params'),
  validationMiddlewareFactory(updateLogSchema, 'body'),
  DashLogController.updateLog
);

router.patch(
  '/:id/page-name',
  validationMiddlewareFactory(updatePageNameSchema, 'params'),
  validationMiddlewareFactory(updatePageNameSchema, 'body'),
  DashLogController.updatePageName
);

router.patch(
  '/:id/event-time',
  validationMiddlewareFactory(updateEventTimeSchema, 'params'),
  validationMiddlewareFactory(updateEventTimeSchema, 'body'),
  DashLogController.updateEventTime
);

// مسار إنشاء أو تحديث السجل
router.post(
  '/upsert',
  validationMiddlewareFactory(upsertLogSchema, 'body'),
  DashLogController.upsertLog
);

// مسار استيراد سجلات الخادم
router.post(
  '/guild/:guildId/import',
  validationMiddlewareFactory(importGuildLogsSchema, 'params'),
  validationMiddlewareFactory(importGuildLogsSchema, 'body'),
  DashLogController.importGuildLogs
);

// مسارات حذف السجلات
router.delete(
  '/:id',
  validationMiddlewareFactory(deleteLogSchema, 'params'),
  DashLogController.deleteLog
);

router.delete(
  '/guild/:guildId',
  validationMiddlewareFactory(deleteGuildLogsSchema, 'params'),
  DashLogController.deleteGuildLogs
);

router.delete(
  '/user/:userId',
  validationMiddlewareFactory(deleteUserLogsSchema, 'params'),
  DashLogController.deleteUserLogs
);

router.delete(
  '/page/:pageName',
  validationMiddlewareFactory(deleteLogsByPageNameSchema, 'params'),
  DashLogController.deleteLogsByPageName
);

router.delete(
  '/old-logs',
  validationMiddlewareFactory(deleteOldLogsSchema, 'query'),
  DashLogController.deleteOldLogs
);

router.delete(
  '/date-range',
  validationMiddlewareFactory(deleteLogsByDateRangeSchema, 'query'),
  DashLogController.deleteLogsByDateRange
);

router.delete(
  '/all',
  DashLogController.deleteAllLogs
);

export default router;