import { initializeDatabase, readServersData, writeServersData } from '../../../src/lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Skip authentication for testing
    console.log('Enable ads API called');

    const { adType } = req.body;

    await initializeDatabase();
    
    // Read current server data
    const serversData = await readServersData();
    const serverIds = Object.keys(serversData);
    
    if (serverIds.length === 0) {
      return res.status(404).json({ error: 'No servers found' });
    }

    const serverId = serverIds[0];
    const serverData = serversData[serverId];
    
    if (!serverData || !serverData.ads || !serverData.ads.ads) {
      return res.status(404).json({ error: 'No ads data found' });
    }

    let enabledAds = [];
    let modifiedCount = 0;

    if (adType === 'immediate') {
      // Enable all disabled immediate ads
      serverData.ads.ads.forEach(ad => {
        if (ad.publishType === 'immediate' && !ad.enabled) {
          ad.enabled = true;
          enabledAds.push(ad);
          modifiedCount++;
        }
      });
      
      // Update timestamp
      serverData.updatedAt = new Date().toISOString();
      
      // Save back to database
      await writeServersData(serversData);
    }

    console.log(`✅ Enabled ${enabledAds.length} immediate ads`);

    return res.status(200).json({ 
      success: true,
      message: `Successfully enabled ${enabledAds.length} immediate ads`,
      enabledAds: enabledAds,
      modifiedCount: modifiedCount
    });

  } catch (error) {
    console.error('Error enabling ads:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}