// src/modules/api/v1/restful/routes/profile.routes.js
import { Router } from 'express';
const router = Router();
import { getProfile, createProfile, updateProfile, deleteProfile } from '../controllers/profile.controller.js';
import { getProfileSchema, createProfileSchema, updateProfileSchema } from '../validators/profile.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

router.get('/:id', validationMiddlewareFactory(getProfileSchema, 'params'), getProfile);
router.post('/', validationMiddlewareFactory(createProfileSchema, 'body'), createProfile);
router.put('/:id', validationMiddlewareFactory(updateProfileSchema, 'body'), updateProfile);
router.delete('/:id', validationMiddlewareFactory(getProfileSchema, 'params'), deleteProfile);

export default router;