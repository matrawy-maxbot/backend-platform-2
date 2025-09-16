import send from '../../../../../utils/responseHandler.util.js';
import { VotesService } from '../../../../../modules/database/postgreSQL/index.js';

/**
 * الحصول على جميع التصويتات
 */
export async function getAllVotes(req, res) {
    try {
        const votes = await VotesService.getAllVotes();
        send(res, { data: votes }, 'تم جلب جميع التصويتات بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويتات', 500);
    }
}

/**
 * الحصول على تصويت بواسطة المعرف
 */
export async function getVoteById(req, res) {
    try {
        const vote = await VotesService.getVoteById(req.params.id);
        if (vote) {
            send(res, { data: vote }, 'تم جلب التصويت بنجاح', 200);
        } else {
            send(res, {}, 'التصويت غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويت', 500);
    }
}

/**
 * الحصول على تصويت بواسطة معرف الخادم
 */
export async function getVoteByGuildId(req, res) {
    try {
        const vote = await VotesService.getVoteByGuildId(req.params.guildId);
        if (vote) {
            send(res, { data: vote }, 'تم جلب التصويت بنجاح', 200);
        } else {
            send(res, {}, 'التصويت غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويت', 500);
    }
}

/**
 * الحصول على تصويت بواسطة معرف القناة
 */
export async function getVoteByChannelId(req, res) {
    try {
        const vote = await VotesService.getVoteByChannelId(req.params.channelId);
        if (vote) {
            send(res, { data: vote }, 'تم جلب التصويت بنجاح', 200);
        } else {
            send(res, {}, 'التصويت غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويت', 500);
    }
}

/**
 * الحصول على تصويت بواسطة معرف الرسالة
 */
export async function getVoteByMessageId(req, res) {
    try {
        const vote = await VotesService.getVoteByMessageId(req.params.messageId);
        if (vote) {
            send(res, { data: vote }, 'تم جلب التصويت بنجاح', 200);
        } else {
            send(res, {}, 'التصويت غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويت', 500);
    }
}

/**
 * الحصول على تصويت بواسطة معرف رسالة الترتيب
 */
export async function getVoteByRankMessageId(req, res) {
    try {
        const vote = await VotesService.getVoteByRankMessageId(req.params.rankMessageId);
        if (vote) {
            send(res, { data: vote }, 'تم جلب التصويت بنجاح', 200);
        } else {
            send(res, {}, 'التصويت غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويت', 500);
    }
}

/**
 * الحصول على تصويت بواسطة معرف الخادم والقناة
 */
export async function getVoteByGuildAndChannel(req, res) {
    try {
        const { guildId, channelId } = req.params;
        const vote = await VotesService.getVoteByGuildAndChannel(guildId, channelId);
        if (vote) {
            send(res, { data: vote }, 'تم جلب التصويت بنجاح', 200);
        } else {
            send(res, {}, 'التصويت غير موجود', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب التصويت', 500);
    }
}

/**
 * البحث في التصويتات
 */
export async function searchVotes(req, res) {
    try {
        const { searchTerm } = req.query;
        const votes = await VotesService.searchVotes(searchTerm);
        send(res, { data: votes }, 'تم البحث بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في البحث', 500);
    }
}

/**
 * إنشاء تصويت جديد
 */
export async function createVote(req, res) {
    try {
        const newVote = await VotesService.createVote(req.body);
        if (newVote) {
            send(res, { data: newVote }, 'تم إنشاء التصويت بنجاح', 201);
        } else {
            send(res, {}, 'فشل في إنشاء التصويت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في إنشاء التصويت', 400);
    }
}

/**
 * تحديث تصويت
 */
export async function updateVote(req, res) {
    try {
        const updatedVote = await VotesService.updateVote(req.params.id, req.body);
        if (updatedVote) {
            send(res, { data: updatedVote }, 'تم تحديث التصويت بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث التصويت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث التصويت', 400);
    }
}

/**
 * تحديث معرف الرسالة
 */
export async function updateMessageId(req, res) {
    try {
        const { messageId } = req.body;
        const updatedVote = await VotesService.updateMessageId(req.params.id, messageId);
        if (updatedVote) {
            send(res, { data: updatedVote }, 'تم تحديث معرف الرسالة بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث معرف الرسالة', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث معرف الرسالة', 400);
    }
}

/**
 * تحديث معرف رسالة الترتيب
 */
export async function updateRankMessageId(req, res) {
    try {
        const { rankMessageId } = req.body;
        const updatedVote = await VotesService.updateRankMessageId(req.params.id, rankMessageId);
        if (updatedVote) {
            send(res, { data: updatedVote }, 'تم تحديث معرف رسالة الترتيب بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث معرف رسالة الترتيب', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث معرف رسالة الترتيب', 400);
    }
}

/**
 * تحديث معرف القناة
 */
export async function updateChannelId(req, res) {
    try {
        const { channelId } = req.body;
        const updatedVote = await VotesService.updateChannelId(req.params.id, channelId);
        if (updatedVote) {
            send(res, { data: updatedVote }, 'تم تحديث معرف القناة بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث معرف القناة', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث معرف القناة', 400);
    }
}

/**
 * حذف تصويت
 */
export async function deleteVote(req, res) {
    try {
        const deletedVote = await VotesService.deleteVote(req.params.id);
        if (deletedVote) {
            send(res, {}, 'تم حذف التصويت بنجاح', 200);
        } else {
            send(res, {}, 'فشل في حذف التصويت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في حذف التصويت', 400);
    }
}

/**
 * حذف تصويت بواسطة معرف الخادم
 */
export async function deleteVoteByGuildId(req, res) {
    try {
        const deletedVote = await VotesService.deleteVoteByGuildId(req.params.guildId);
        if (deletedVote) {
            send(res, {}, 'تم حذف التصويت بنجاح', 200);
        } else {
            send(res, {}, 'فشل في حذف التصويت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في حذف التصويت', 400);
    }
}

/**
 * الحصول على إحصائيات التصويتات
 */
export async function getVoteStats(req, res) {
    try {
        const stats = await VotesService.getVoteStats();
        send(res, { data: stats }, 'تم الحصول على الإحصائيات بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في الحصول على الإحصائيات', 500);
    }
}

/**
 * التحقق من وجود تصويت
 */
export async function checkVoteExists(req, res) {
    try {
        const exists = await VotesService.checkVoteExists(req.params.id);
        send(res, { data: { exists } }, 'تم التحقق بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في التحقق', 500);
    }
}

/**
 * التحقق من وجود تصويت بواسطة معرف الخادم
 */
export async function checkVoteExistsByGuildId(req, res) {
    try {
        const exists = await VotesService.checkVoteExistsByGuildId(req.params.guildId);
        send(res, { data: { exists } }, 'تم التحقق بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في التحقق', 500);
    }
}

/**
 * إنشاء أو تحديث تصويت
 */
export async function createOrUpdateVote(req, res) {
    try {
        const vote = await VotesService.createOrUpdateVote(req.body);
        if (vote) {
            send(res, { data: vote }, 'تم إنشاء أو تحديث التصويت بنجاح', 200);
        } else {
            send(res, {}, 'فشل في إنشاء أو تحديث التصويت', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في إنشاء أو تحديث التصويت', 400);
    }
}