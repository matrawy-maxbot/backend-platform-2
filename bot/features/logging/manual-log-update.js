const express = require('express');
const router = express.Router();

let manualLogSystemInstance = null;

// Set ManualLogSystem instance
function setManualLogSystem(instance) {
  manualLogSystemInstance = instance;
}

// POST /api/manual-log/update - Update Manual Log settings
router.post('/manual-log/update', async (req, res) => {
  try {
    const { serverId, settings } = req.body;
    
    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: 'Server ID is required'
      });
    }
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        error: 'Settings are required'
      });
    }
    
    if (!manualLogSystemInstance) {
      return res.status(503).json({
        success: false,
        error: 'Manual Log system is not available'
      });
    }
    
    // Save settings in Manual Log system
    const success = await manualLogSystemInstance.saveServerSettings(serverId, settings);
    
    if (success) {
      console.log(`✅ Manual Log settings updated for server ${serverId}`);
      
      res.json({
        success: true,
        message: 'Manual Log settings updated successfully',
        serverId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save Manual Log settings'
      });
    }
    
  } catch (error) {
    console.error('❌ Error updating Manual Log settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/manual-log/status - Manual Log system status
router.get('/manual-log/status', (req, res) => {
  try {
    const isAvailable = manualLogSystemInstance !== null;
    
    res.json({
      success: true,
      available: isAvailable,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error checking Manual Log status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/manual-log/settings/:serverId - Retrieve specific server settings
router.get('/manual-log/settings/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    
    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: 'Server ID is required'
      });
    }
    
    if (!manualLogSystemInstance) {
      return res.status(503).json({
        success: false,
        error: 'Manual Log system is not available'
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
    console.error('❌ Error retrieving Manual Log settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = {
  router,
  setManualLogSystem
};