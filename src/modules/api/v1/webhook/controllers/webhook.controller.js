// src/modules/api/v1/webhook/controllers/webhook.controller.js
import status from '../../../../../config/status.config.js';

exports.handleWebhook = async (req, res) => {
     try {
       console.log('Webhook received:', req.body);
       res.status(status.OK).json({ message: 'Webhook received' });
     } catch (error) {
       res.status(status.INTERNAL_SERVER_ERROR).json({ message: error.message });
     }
   };