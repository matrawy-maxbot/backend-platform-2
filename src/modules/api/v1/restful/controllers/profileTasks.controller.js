import send from '../../../../../utils/responseHandler.util.js';
import { ProfileTasksService } from '../../../../../modules/database/postgreSQL/index.js';

// الحصول على جميع مهام الملفات الشخصية
export async function getAllProfileTasks(req, res) {
    try {
        const profileTasks = await ProfileTasksService.getAllProfileTasks();
        send(res, { data: profileTasks }, 'تم جلب جميع مهام الملفات الشخصية بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب مهام الملفات الشخصية', 500);
    }
}

// الحصول على مهمة ملف شخصي بواسطة المعرف
export async function getProfileTask(req, res) {
    try {
        const profileTask = await ProfileTasksService.getProfileTaskById(req.params.id);
        if (profileTask) {
            send(res, { data: profileTask }, 'تم جلب مهمة الملف الشخصي بنجاح', 200);
        } else {
            send(res, {}, 'مهمة الملف الشخصي غير موجودة', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب مهمة الملف الشخصي', 500);
    }
}

// الحصول على مهام الملفات الشخصية بواسطة معرف الملف الشخصي
export async function getProfileTasksByProfileId(req, res) {
    try {
        const profileTasks = await ProfileTasksService.getProfileTasksByProfileId(req.params.profileId);
        send(res, { data: profileTasks }, 'تم جلب مهام الملف الشخصي بنجاح', 200);
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب مهام الملف الشخصي', 500);
    }
}

// الحصول على مهمة ملف شخصي بواسطة معرف الخادم
export async function getProfileTasksByGuildId(req, res) {
    try {
        const profileTask = await ProfileTasksService.getProfileTaskByGuildId(req.params.guildId);
        if (profileTask) {
            send(res, { data: profileTask }, 'تم جلب مهمة الملف الشخصي للخادم بنجاح', 200);
        } else {
            send(res, {}, 'مهمة الملف الشخصي للخادم غير موجودة', 404);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في جلب مهمة الملف الشخصي للخادم', 500);
    }
}

// إنشاء مهمة ملف شخصي جديدة
export async function createProfileTask(req, res) {
    try {
        const newProfileTask = await ProfileTasksService.createProfileTask(req.body);
        if (newProfileTask) {
            send(res, { data: newProfileTask }, 'تم إنشاء مهمة الملف الشخصي بنجاح', 201);
        } else {
            send(res, {}, 'فشل في إنشاء مهمة الملف الشخصي', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في إنشاء مهمة الملف الشخصي', 400);
    }
}

// تحديث مهمة ملف شخصي
export async function updateProfileTask(req, res) {
    try {
        const updatedProfileTask = await ProfileTasksService.updateProfileTask(req.params.id, req.body);
        if (updatedProfileTask) {
            send(res, { data: updatedProfileTask }, 'تم تحديث مهمة الملف الشخصي بنجاح', 200);
        } else {
            send(res, {}, 'فشل في تحديث مهمة الملف الشخصي', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في تحديث مهمة الملف الشخصي', 400);
    }
}

// حذف مهمة ملف شخصي
export async function deleteProfileTask(req, res) {
    try {
        const deletedProfileTask = await ProfileTasksService.deleteProfileTask(req.params.id);
        if (deletedProfileTask) {
            send(res, {}, 'تم حذف مهمة الملف الشخصي بنجاح', 200);
        } else {
            send(res, {}, 'فشل في حذف مهمة الملف الشخصي', 400);
        }
    } catch (error) {
        send(res, { error: error.message }, 'فشل في حذف مهمة الملف الشخصي', 400);
    }
}