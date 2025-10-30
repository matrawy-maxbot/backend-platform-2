const fs = require('fs').promises;
const path = require('path');

// مسار قاعدة البيانات الصحيح
const SERVERS_DB = path.join(process.cwd(), '..', 'data', 'servers.json');

// قراءة بيانات السيرفرات
async function readServersData() {
  try {
    const data = await fs.readFile(SERVERS_DB, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading servers data:', error);
    return {};
  }
}

// كتابة بيانات السيرفرات
async function writeServersData(data) {
  try {
    await fs.writeFile(SERVERS_DB, JSON.stringify(data, null, 2));
    console.log('✅ Data saved successfully');
  } catch (error) {
    console.error('Error writing servers data:', error);
    throw error;
  }
}

async function enableImmediateAds() {
  try {
    console.log('Enabling immediate ads directly in database...');
    
    // Read current server data
    const serversData = await readServersData();
    
    // Find the first server (assuming single server setup)
    const serverIds = Object.keys(serversData);
    if (serverIds.length === 0) {
      console.log('❌ No servers found in database');
      return;
    }
    
    const serverId = serverIds[0];
    const serverData = serversData[serverId];
    
    if (!serverData.ads || !serverData.ads.ads) {
      console.log('❌ No ads found');
      return;
    }
    
    // Find disabled immediate ads
    const disabledAds = serverData.ads.ads.filter(ad => 
      ad.publishType === 'immediate' && !ad.enabled
    );
    
    if (disabledAds.length === 0) {
      console.log('✅ No disabled immediate ads found');
      return;
    }
    
    // Enable all disabled immediate ads
    serverData.ads.ads.forEach(ad => {
      if (ad.publishType === 'immediate' && !ad.enabled) {
        ad.enabled = true;
        console.log(`✅ Enabled ad: ${ad.title} (ID: ${ad.id})`);
      }
    });
    
    // Update timestamp
    serverData.updatedAt = new Date().toISOString();
    
    // Save back to database
    await writeServersData(serversData);
    
    console.log(`✅ Successfully enabled ${disabledAds.length} immediate ads`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the function
enableImmediateAds();