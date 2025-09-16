// src/modules/api/v1/restful/routes/profileTasks.routes.js
import { Router } from 'express';
const router = Router();
import { 
    getProfileTask, 
    getAllProfileTasks,
    getProfileTasksByProfileId,
    getProfileTasksByGuildId,
    createProfileTask, 
    updateProfileTask, 
    deleteProfileTask 
} from '../controllers/profileTasks.controller.js';
import { 
    getProfileTaskSchema, 
    createProfileTaskSchema, 
    updateProfileTaskSchema,
    getProfileTasksByProfileIdSchema,
    getProfileTasksByGuildIdSchema
} from '../validators/profileTasks.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

// الحصول على جميع مهام الملفات الشخصية
router.get('/', getAllProfileTasks);

// الحصول على مهمة ملف شخصي بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getProfileTaskSchema, 'params'), getProfileTask);

// الحصول على مهام الملفات الشخصية بواسطة معرف الملف الشخصي
router.get('/profile/:profileId', validationMiddlewareFactory(getProfileTasksByProfileIdSchema, 'params'), getProfileTasksByProfileId);

// الحصول على مهمة ملف شخصي بواسطة معرف الخادم
router.get('/guild/:guildId', validationMiddlewareFactory(getProfileTasksByGuildIdSchema, 'params'), getProfileTasksByGuildId);

// إنشاء مهمة ملف شخصي جديدة
router.post('/', validationMiddlewareFactory(createProfileTaskSchema, 'body'), createProfileTask);

// تحديث مهمة ملف شخصي
router.put('/:id', validationMiddlewareFactory(getProfileTaskSchema, 'params'), validationMiddlewareFactory(updateProfileTaskSchema, 'body'), updateProfileTask);

// حذف مهمة ملف شخصي
router.delete('/:id', validationMiddlewareFactory(getProfileTaskSchema, 'params'), deleteProfileTask);

export default router;