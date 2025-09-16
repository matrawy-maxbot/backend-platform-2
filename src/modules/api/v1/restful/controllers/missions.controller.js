import { MissionsService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * إنشاء مهمة جديدة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createMission = async (req, res) => {
  try {
    const result = await MissionsService.createMission(req.body);
    send(res, { data: result }, 'تم إنشاء المهمة بنجاح', 201);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على جميع المهام
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllMissions = async (req, res) => {
  try {
    const result = await MissionsService.getAllMissions(req.query);
    if (result && result.length > 0) {
      send(res, { data: result }, 'تم الحصول على المهام بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على مهام', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على مهمة بواسطة المعرف
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MissionsService.getMissionById(id);
    if (result) {
      send(res, { data: result }, 'تم الحصول على المهمة بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على المهمة', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على المهام بواسطة نقاط الدردشة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMissionsByChatPoints = async (req, res) => {
  try {
    const { minChatPoints, maxChatPoints } = req.query;
    const result = await MissionsService.getMissionsByChatPoints(
      parseInt(minChatPoints),
      maxChatPoints ? parseInt(maxChatPoints) : null
    );
    if (result && result.length > 0) {
      send(res, { data: result }, 'تم الحصول على المهام بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على مهام', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على المهام بواسطة نقاط الصوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMissionsByVoicePoints = async (req, res) => {
  try {
    const { minVoicePoints, maxVoicePoints } = req.query;
    const result = await MissionsService.getMissionsByVoicePoints(
      parseInt(minVoicePoints),
      maxVoicePoints ? parseInt(maxVoicePoints) : null
    );
    if (result && result.length > 0) {
      send(res, { data: result }, 'تم الحصول على المهام بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على مهام', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على المهام بواسطة نوع المكافأة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMissionsByRewardType = async (req, res) => {
  try {
    const { rewardType, hasReward } = req.query;
    const result = await MissionsService.getMissionsByRewardType(
      rewardType,
      hasReward === 'true'
    );
    if (result && result.length > 0) {
      send(res, { data: result }, 'تم الحصول على المهام بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على مهام', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على المهام النشطة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getActiveMissions = async (req, res) => {
  try {
    const result = await MissionsService.getActiveMissions();
    if (result && result.length > 0) {
      send(res, { data: result }, 'تم الحصول على المهام النشطة بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على مهام نشطة', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث مهمة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateMission = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MissionsService.updateMission(id, req.body);
    send(res, { data: result }, 'تم تحديث المهمة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث نقاط المهمة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateMissionPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatPoints, voicePoints } = req.body;
    const result = await MissionsService.updateMissionPoints(id, chatPoints, voicePoints);
    send(res, { data: result }, 'تم تحديث نقاط المهمة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث المهام المكتملة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updatePassedMissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { passedMissions } = req.body;
    const result = await MissionsService.updatePassedMissions(id, passedMissions);
    send(res, { data: result }, 'تم تحديث المهام المكتملة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث المهمة النشطة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateActiveMission = async (req, res) => {
  try {
    const { id } = req.params;
    const { activeMission } = req.body;
    const result = await MissionsService.updateActiveMission(id, activeMission);
    send(res, { data: result }, 'تم تحديث المهمة النشطة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث المكافآت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateRewards = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MissionsService.updateRewards(id, req.body);
    send(res, { data: result }, 'تم تحديث المكافآت بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تفعيل مكافأة معينة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const activateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const { rewardType } = req.body;
    const result = await MissionsService.activateReward(id, rewardType);
    send(res, { data: result }, 'تم تفعيل المكافأة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إلغاء تفعيل مكافأة معينة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deactivateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const { rewardType } = req.body;
    const result = await MissionsService.deactivateReward(id, rewardType);
    send(res, { data: result }, 'تم إلغاء تفعيل المكافأة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف مهمة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteMission = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MissionsService.deleteMission(id);
    if (result) {
      send(res, { data: result }, 'تم حذف المهمة بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على المهمة', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف المهام بواسطة نطاق نقاط الدردشة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteMissionsByChatPointsRange = async (req, res) => {
  try {
    const { minChatPoints, maxChatPoints } = req.body;
    const result = await MissionsService.deleteMissionsByChatPointsRange(
      parseInt(minChatPoints),
      parseInt(maxChatPoints)
    );
    send(res, { data: result }, 'تم حذف المهام بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف المهام غير النشطة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteInactiveMissions = async (req, res) => {
  try {
    const result = await MissionsService.deleteInactiveMissions();
    send(res, { data: result }, 'تم حذف المهام غير النشطة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على إحصائيات المهام
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMissionsStats = async (req, res) => {
  try {
    const result = await MissionsService.getMissionsStats();
    send(res, { data: result }, 'تم الحصول على إحصائيات المهام بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};