// src/modules/api/v1/webhook/routes/webhook.routes.js
import { Router } from 'express';
const router = Router();
import { handleWebhook } from '../controllers/webhook.controller';

router.post('/', handleWebhook);

export default router;