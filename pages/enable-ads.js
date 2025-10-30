import { useState, useEffect } from 'react';
import { useAuth } from '../src/hooks/useAuth';
import { useRouter } from 'next/router';

export default function EnableAds() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState({});

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchServers();
  }, [session, isLoading]);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      if (response.ok) {
        const data = await response.json();
        setServers(data.servers || []);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableAd = async (serverId, adId) => {
    setEnabling(prev => ({ ...prev, [`${serverId}-${adId}`]: true }));
    
    try {
      const response = await fetch('/api/ads/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serverId, adId }),
      });

      if (response.ok) {
        // Refresh servers data
        await fetchServers();
        alert('تم تفعيل الإعلان بنجاح!');
      } else {
        alert('فشل في تفعيل الإعلان');
      }
    } catch (error) {
      console.error('Error enabling ad:', error);
      alert('حدث خطأ أثناء تفعيل الإعلان');
    } finally {
      setEnabling(prev => ({ ...prev, [`${serverId}-${adId}`]: false }));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">تفعيل الإعلانات المعطلة</h1>
        
        {servers.length === 0 ? (
          <div className="text-center text-gray-400">لا توجد خوادم</div>
        ) : (
          servers.map(server => {
            const disabledAds = server.ads?.ads?.filter(ad => !ad.enabled && ad.publishType === 'immediate') || [];
            
            if (disabledAds.length === 0) {
              return null;
            }

            return (
              <div key={server.serverId} className="mb-8 bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  الخادم: {server.serverName || server.serverId}
                </h2>
                
                <div className="grid gap-4">
                  {disabledAds.map(ad => (
                    <div key={ad.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{ad.title}</h3>
                        <p className="text-gray-300 text-sm mt-1">{ad.content}</p>
                        <div className="text-xs text-gray-400 mt-2">
                          تاريخ الإنشاء: {new Date(ad.createdAt).toLocaleString('ar-SA')}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-600 text-xs rounded">فوري</span>
                          <span className="px-2 py-1 bg-red-600 text-xs rounded">معطل</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => enableAd(server.serverId, ad.id)}
                        disabled={enabling[`${server.serverId}-${ad.id}`]}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {enabling[`${server.serverId}-${ad.id}`] ? 'جاري التفعيل...' : 'تفعيل الإعلان'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    </div>
  );
}