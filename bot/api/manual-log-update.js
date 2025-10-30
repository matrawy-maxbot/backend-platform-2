const express = require('express');
const router = express.Router();

let manualLogSystemInstance = null;

// تعيين instance من ManualLogSystem
function setManualLogSystem(instance) {
  manualLogSystemInstance = instance;
}

// POST /api/manual-log/update - تحديث إعدادات Manual Log
router.post('/manual-log/update', async (req, res) => {
  try {
    const { serverId, settings } = req.body;
    
    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: 'معرف الخادم مطلوب'
      });
    }
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        error: 'الإعدادات مطلوبة'
      });
    }
    
    if (!manualLogSystemInstance) {
      return res.status(503).json({
        success: false,
        error: 'نظام Manual Log غير متاح'
      });
    }
    
    // حفظ الإعدادات في نظام Manual Log
    const success = await manualLogSystemInstance.saveServerSettings(serverId, settings);
    
    if (success) {
      console.log(`✅ تم تحديث إعدادات Manual Log للخادم ${serverId}`);
      
      res.json({
        success: true,
        message: 'تم تحديث إعدادات Manual Log بنجاح',
        serverId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'فشل في حفظ إعدادات Manual Log'
      });
    }
    
  } catch (error) {
    console.error('❌ خطأ في تحديث إعدادات Manual Log:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي'
    });
  }
});

// GET /api/manual-log/status - حالة نظام Manual Log
router.get('/manual-log/status', (req, res) => {
  try {
    const isAvailable = manualLogSystemInstance !== null;
    
    res.json({
      success: true,
      available: isAvailable,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من حالة Manual Log:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي'
    });
  }
});

// GET /api/manual-log/settings/:serverId - استرجاع إعدادات خادم معين
router.get('/manual-log/settings/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    
    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: 'معرف الخادم مطلوب'
      });
    }
    
    if (!manualLogSystemInstance) {
      return res.status(503).json({
        success: false,
        error: 'نظام Manual Log غير متاح'
      });
    }
    
    const settings = await manualLogSystemInstance.loadServerSettings(serverId);
    
    res.json({
      success: true,
      data: settings,
      serverId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ خطأ في استرجاع إعدادات Manual Log:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي'
    });
  }
});

module.exports = {
  router,
  setManualLogSystem
};