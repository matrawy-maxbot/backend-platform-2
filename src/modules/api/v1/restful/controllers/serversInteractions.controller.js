import send from '../../../../../utils/responseHandler.util.js';
import { ServersInteractionsService } from '../../../../../modules/database/postgreSQL/index.js';

// الحصول على جميع التفاعلات
export async function getAllInteractions(req, res) {
    try {
        const interactions = await ServersInteractionsService.getAllInteractions();
        send(res, { data: interactions }, 'تم جلب جميع التفاعلات بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التفاعلات', 500);
    }
}

// الحصول على تفاعل بواسطة معرف المستخدم ومعرف الخادم
export async function getInteractionByUserAndGuild(req, res) {
    try {
        const { userId, guildId } = req.params;
        const interaction = await ServersInteractionsService.getInteractionByUserAndGuild(userId, guildId);
        if (interaction) {
            send(res, { data: interaction }, 'تم جلب التفاعل بنجاح', 200);
        } else {
            send(res, {}, 'التفاعل غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التفاعل', 500);
    }
}

// الحصول على جميع تفاعلات مستخدم معين
export async function getInteractionsByUser(req, res) {
    try {
        const { userId } = req.params;
        const interactions = await ServersInteractionsService.getInteractionsByUser(userId);
        send(res, { data: interactions }, 'تم جلب تفاعلات المستخدم بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب تفاعلات المستخدم', 500);
    }
}

// الحصول على جميع تفاعلات خادم معين
export async function getInteractionsByGuild(req, res) {
    try {
        const { guildId } = req.params;
        const interactions = await ServersInteractionsService.getInteractionsByGuild(guildId);
        send(res, { data: interactions }, 'تم جلب تفاعلات الخادم بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب تفاعلات الخادم', 500);
    }
}

// الحصول على التفاعلات بناءً على مستوى الدردشة
export async function getInteractionsByChatLevel(req, res) {
    try {
        const { minLevel } = req.params;
        const { maxLevel } = req.query;
        const interactions = await ServersInteractionsService.getInteractionsByChatLevel(
            parseInt(minLevel), 
            maxLevel ? parseInt(maxLevel) : null
        );
        send(res, { data: interactions }, 'تم جلب التفاعلات بناءً على مستوى الدردشة بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التفاعلات بناءً على مستوى الدردشة', 500);
    }
}

// الحصول على التفاعلات بناءً على مستوى الصوت
export async function getInteractionsByVoiceLevel(req, res) {
    try {
        const { minLevel } = req.params;
        const { maxLevel } = req.query;
        const interactions = await ServersInteractionsService.getInteractionsByVoiceLevel(
            parseInt(minLevel), 
            maxLevel ? parseInt(maxLevel) : null
        );
        send(res, { data: interactions }, 'تم جلب التفاعلات بناءً على مستوى الصوت بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التفاعلات بناءً على مستوى الصوت', 500);
    }
}

// إنشاء تفاعل جديد
export async function createInteraction(req, res) {
    try {
        const newInteraction = await ServersInteractionsService.createInteraction(req.body);
        if (newInteraction) {
            send(res, { data: newInteraction }, 'تم إنشاء التفاعل بنجاح', 201);
        } else {
            send(res, {}, 'فشل في إنشاء التفاعل', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في إنشاء التفاعل', 400);
    }
}

// تحديث تفاعل موجود
export async function updateInteraction(req, res) {
    try {
        const { userId, guildId } = req.params;
        const updatedInteraction = await ServersInteractionsService.updateInteraction(userId, guildId, req.body);
        if (updatedInteraction) {
            send(res, { data: updatedInteraction }, 'تم تحديث التفاعل بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث التفاعل', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث التفاعل', 400);
    }
}

// تحديث نقاط الدردشة
export async function updateChatPoints(req, res) {
    try {
        const { userId, guildId } = req.params;
        const { points } = req.body;
        const updatedInteraction = await ServersInteractionsService.updateChatPoints(userId, guildId, points);
        if (updatedInteraction) {
            send(res, { data: updatedInteraction }, 'تم تحديث نقاط الدردشة بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث نقاط الدردشة', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث نقاط الدردشة', 400);
    }
}

// تحديث نقاط الصوت
export async function updateVoicePoints(req, res) {
    try {
        const { userId, guildId } = req.params;
        const { points } = req.body;
        const updatedInteraction = await ServersInteractionsService.updateVoicePoints(userId, guildId, points);
        if (updatedInteraction) {
            send(res, { data: updatedInteraction }, 'تم تحديث نقاط الصوت بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث نقاط الصوت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث نقاط الصوت', 400);
    }
}

// زيادة نقاط الدردشة
export async function incrementChatPoints(req, res) {
    try {
        const { userId, guildId } = req.params;
        const { increment } = req.body;
        const updatedInteraction = await ServersInteractionsService.incrementChatPoints(
            userId, 
            guildId, 
            increment || 1
        );
        if (updatedInteraction) {
            send(res, { data: updatedInteraction }, 'تم زيادة نقاط الدردشة بنجاح', 200);
        } else {
            send(res, {}, 'فشل في زيادة نقاط الدردشة', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في زيادة نقاط الدردشة', 400);
    }
}

// زيادة نقاط الصوت
export async function incrementVoicePoints(req, res) {
    try {
        const { userId, guildId } = req.params;
        const { increment } = req.body;
        const updatedInteraction = await ServersInteractionsService.incrementVoicePoints(
            userId, 
            guildId, 
            increment || 1
        );
        if (updatedInteraction) {
            send(res, { data: updatedInteraction }, 'تم زيادة نقاط الصوت بنجاح', 200);
        } else {
            send(res, {}, 'فشل في زيادة نقاط الصوت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في زيادة نقاط الصوت', 400);
    }
}

// حذف تفاعل
export async function deleteInteraction(req, res) {
    try {
        const { userId, guildId } = req.params;
        const deletedInteraction = await ServersInteractionsService.deleteInteraction(userId, guildId);
        if (deletedInteraction) {
            send(res, {}, 'تم حذف التفاعل بنجاح', 200);
        } else {
            send(res, {}, 'فشل في حذف التفاعل', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في حذف التفاعل', 400);
    }
}

// حذف جميع تفاعلات مستخدم معين
export async function deleteUserInteractions(req, res) {
    try {
        const { userId } = req.params;
        const deletedInteractions = await ServersInteractionsService.deleteUserInteractions(userId);
        if (deletedInteractions) {
            send(res, {}, 'تم حذف جميع تفاعلات المستخدم بنجاح', 200);
        } else {
            send(res, {}, 'فشل في حذف تفاعلات المستخدم', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في حذف تفاعلات المستخدم', 400);
    }
}

// حذف جميع تفاعلات خادم معين
export async function deleteGuildInteractions(req, res) {
    try {
        const { guildId } = req.params;
        const deletedInteractions = await ServersInteractionsService.deleteGuildInteractions(guildId);
        if (deletedInteractions) {
            send(res, {}, 'تم حذف جميع تفاعلات الخادم بنجاح', 200);
        } else {
            send(res, {}, 'فشل في حذف تفاعلات الخادم', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في حذف تفاعلات الخادم', 400);
    }
}

// الحصول على إحصائيات التفاعلات
export async function getInteractionStats(req, res) {
    try {
        const { guildId } = req.query;
        const stats = await ServersInteractionsService.getInteractionStats(guildId || null);
        send(res, { data: stats }, 'تم جلب إحصائيات التفاعلات بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب إحصائيات التفاعلات', 500);
    }
}