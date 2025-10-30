'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Server, Users } from 'lucide-react'

interface BotGuild {
  id: string
  name: string
  memberCount: number
}

export default function BotStatusPage() {
  const [guilds, setGuilds] = useState<BotGuild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [botStatus, setBotStatus] = useState<string>('غير متصل')

  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/bot-status')
        
        if (!response.ok) {
          throw new Error('فشل في جلب حالة البوت')
        }
        
        const data = await response.json()
        setGuilds(data.guilds || [])
        setBotStatus(data.status || 'غير متصل')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
      } finally {
        setLoading(false)
      }
    }

    fetchBotStatus()
    
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(fetchBotStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل حالة البوت...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">خطأ في تحميل البيانات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">حالة البوت</h1>
        <p className="text-muted-foreground">
          عرض السيرفرات المتصلة حالياً بالبوت
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              معلومات البوت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">الحالة</p>
                <Badge variant={botStatus === 'متصل' ? 'default' : 'destructive'}>
                  {botStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عدد السيرفرات</p>
                <p className="text-2xl font-bold">{guilds.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>السيرفرات المتصلة</CardTitle>
            <CardDescription>
              قائمة بجميع السيرفرات التي يتواجد بها البوت حالياً
            </CardDescription>
          </CardHeader>
          <CardContent>
            {guilds.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                لا توجد سيرفرات متصلة حالياً
              </p>
            ) : (
              <div className="grid gap-4">
                {guilds.map((guild) => (
                  <div
                    key={guild.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{guild.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {guild.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{guild.memberCount} عضو</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}