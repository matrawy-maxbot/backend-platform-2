import { Router } from 'express';
import {
  createMission,
  getAllMissions,
  getMissionById,
  getMissionsByChatPoints,
  getMissionsByVoicePoints,
  getMissionsByRewardType,
  getActiveMissions,
  updateMission,
  updateMissionPoints,
  updatePassedMissions,
  updateActiveMission,
  updateRewards,
  activateReward,
  deactivateReward,
  deleteMission,
  deleteMissionsByChatPointsRange,
  deleteInactiveMissions,
  getMissionsStats
} from '../controllers/missions.controller.js';
import {
  createMissionSchema,
  updateMissionSchema,
  updateMissionPointsSchema,
  updatePassedMissionsSchema,
  updateActiveMissionSchema,
  updateRewardsSchema,
  activateRewardSchema,
  deactivateRewardSchema,
  getMissionByIdSchema,
  getMissionsByChatPointsSchema,
  getMissionsByVoicePointsSchema,
  getMissionsByRewardTypeSchema,
  deleteMissionsByChatPointsRangeSchema
} from '../validators/missions.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = Router();

// إنشاء مهمة جديدة
router.post(
  '/',
  validationMiddlewareFactory(createMissionSchema, 'body'),
  createMission
);

// الحصول على جميع المهام
router.get('/', getAllMissions);

// الحصول على مهمة بواسطة المعرف
router.get(
  '/:id',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  getMissionById
);

// الحصول على المهام بواسطة نقاط الدردشة
router.get(
  '/chat-points/range',
  validationMiddlewareFactory(getMissionsByChatPointsSchema, 'query'),
  getMissionsByChatPoints
);

// الحصول على المهام بواسطة نقاط الصوت
router.get(
  '/voice-points/range',
  validationMiddlewareFactory(getMissionsByVoicePointsSchema, 'query'),
  getMissionsByVoicePoints
);

// الحصول على المهام بواسطة نوع المكافأة
router.get(
  '/reward-type/filter',
  validationMiddlewareFactory(getMissionsByRewardTypeSchema, 'query'),
  getMissionsByRewardType
);

// الحصول على المهام النشطة
router.get('/active/list', getActiveMissions);

// الحصول على إحصائيات المهام
router.get('/stats/overview', getMissionsStats);

// تحديث مهمة
router.put(
  '/:id',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(updateMissionSchema, 'body'),
  updateMission
);

// تحديث نقاط المهمة
router.put(
  '/:id/points',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(updateMissionPointsSchema, 'body'),
  updateMissionPoints
);

// تحديث المهام المكتملة
router.put(
  '/:id/passed-missions',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(updatePassedMissionsSchema, 'body'),
  updatePassedMissions
);

// تحديث المهمة النشطة
router.put(
  '/:id/active-mission',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(updateActiveMissionSchema, 'body'),
  updateActiveMission
);

// تحديث المكافآت
router.put(
  '/:id/rewards',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(updateRewardsSchema, 'body'),
  updateRewards
);

// تفعيل مكافأة معينة
router.patch(
  '/:id/rewards/activate',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(activateRewardSchema, 'body'),
  activateReward
);

// إلغاء تفعيل مكافأة معينة
router.patch(
  '/:id/rewards/deactivate',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  validationMiddlewareFactory(deactivateRewardSchema, 'body'),
  deactivateReward
);

// حذف مهمة
router.delete(
  '/:id',
  validationMiddlewareFactory(getMissionByIdSchema, 'params'),
  deleteMission
);

// حذف المهام بواسطة نطاق نقاط الدردشة
router.delete(
  '/chat-points/range',
  validationMiddlewareFactory(deleteMissionsByChatPointsRangeSchema, 'body'),
  deleteMissionsByChatPointsRange
);

// حذف المهام غير النشطة
router.delete('/inactive/cleanup', deleteInactiveMissions);

export default router;