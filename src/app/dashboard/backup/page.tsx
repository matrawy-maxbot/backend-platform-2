'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Shield, 
  Clock, 
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

interface BackupFile {
  name: string
  size?: number
  date?: string
}

interface BackupStats {
  totalBackups: number
  latestBackup: string | null
  oldestBackup: string | null
}

interface SchedulerTask {
  name: string
  running: boolean
  scheduled: boolean
}

interface SchedulerStatus {
  initialized: boolean
  totalTasks: number
  tasks: SchedulerTask[]
}

interface ChangeLog {
  id: string
  serverId: string
  section: string
  action: 'create' | 'update' | 'delete'
  userId: string
  timestamp: string
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [stats, setStats] = useState<BackupStats | null>(null)
  const [scheduler, setScheduler] = useState<SchedulerStatus | null>(null)
  const [logs, setLogs] = useState<ChangeLog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // تحميل البيانات
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/backup')
      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups || [])
        setStats(data.stats)
        setScheduler(data.scheduler)
        setLogs(data.recentLogs || [])
      } else {
        toast.error('فشل في تحميل بيانات النسخ الاحتياطية')
      }
    } catch (error) {
      console.error('Error fetching backup data:', error)
      toast.error('حدث خطأ أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // إنشاء نسخة احتياطية
  const createBackup = async (serverId?: string) => {
    try {
      setActionLoading('create')
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-backup', serverId })
      })

      if (response.ok) {
        toast.success('تم إنشاء النسخة الاحتياطية بنجاح')
        fetchData()
      } else {
        toast.error('فشل في إنشاء النسخة الاحتياطية')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء النسخة الاحتياطية')
    } finally {
      setActionLoading(null)
    }
  }

  // استرداد من نسخة احتياطية
  const restoreBackup = async (backupFileName: string) => {
    if (!confirm('هل أنت متأكد من استرداد هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.')) {
      return
    }

    try {
      setActionLoading('restore')
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore-backup', backupFileName })
      })

      if (response.ok) {
        toast.success('تم استرداد البيانات بنجاح')
        fetchData()
      } else {
        toast.error('فشل في استرداد البيانات')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء استرداد البيانات')
    } finally {
      setActionLoading(null)
    }
  }

  // حذف نسخة احتياطية
  const deleteBackup = async (backupFileName: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      return
    }

    try {
      setActionLoading('delete')
      const response = await fetch(`/api/backup?backup=${backupFileName}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('تم حذف النسخة الاحتياطية بنجاح')
        fetchData()
      } else {
        toast.error('فشل في حذف النسخة الاحتياطية')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف النسخة الاحتياطية')
    } finally {
      setActionLoading(null)
    }
  }

  // تشغيل فحص صحة البيانات
  const runHealthCheck = async () => {
    try {
      setActionLoading('health')
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health-check' })
      })

      if (response.ok) {
        toast.success('تم إجراء فحص صحة البيانات بنجاح')
      } else {
        toast.error('فشل في إجراء فحص صحة البيانات')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء فحص صحة البيانات')
    } finally {
      setActionLoading(null)
    }
  }

  // تنظيف النسخ القديمة
  const cleanupOldBackups = async () => {
    try {
      setActionLoading('cleanup')
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' })
      })

      if (response.ok) {
        toast.success('تم تنظيف النسخ القديمة بنجاح')
        fetchData()
      } else {
        toast.error('فشل في تنظيف النسخ القديمة')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تنظيف النسخ القديمة')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة النسخ الاحتياطية</h1>
          <p className="text-muted-foreground mt-2">
            إدارة النسخ الاحتياطية ومراقبة صحة البيانات
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => createBackup()} disabled={actionLoading === 'create'}>
            {actionLoading === 'create' ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            إنشاء نسخة احتياطية
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">إجمالي النسخ</p>
                <p className="text-2xl font-bold">{stats?.totalBackups || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">آخر نسخة</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.latestBackup ? new Date(stats.latestBackup).toLocaleDateString('ar') : 'لا توجد'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">المجدول</p>
                <Badge variant={scheduler?.initialized ? 'default' : 'destructive'}>
                  {scheduler?.initialized ? 'نشط' : 'متوقف'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">المهام النشطة</p>
                <p className="text-2xl font-bold">{scheduler?.totalTasks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">النسخ الاحتياطية</TabsTrigger>
          <TabsTrigger value="scheduler">المجدول</TabsTrigger>
          <TabsTrigger value="logs">سجل التغييرات</TabsTrigger>
          <TabsTrigger value="maintenance">الصيانة</TabsTrigger>
        </TabsList>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle>قائمة النسخ الاحتياطية</CardTitle>
              <CardDescription>
                جميع النسخ الاحتياطية المتاحة مرتبة حسب التاريخ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backups.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    لا توجد نسخ احتياطية متاحة. قم بإنشاء نسخة احتياطية أولاً.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {backups.map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{backup.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {backup.date ? new Date(backup.date).toLocaleString('ar') : 'تاريخ غير محدد'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreBackup(backup.name)}
                          disabled={actionLoading === 'restore'}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          استرداد
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBackup(backup.name)}
                          disabled={actionLoading === 'delete'}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler">
          <Card>
            <CardHeader>
              <CardTitle>حالة المجدول</CardTitle>
              <CardDescription>
                مراقبة المهام المجدولة للنسخ الاحتياطي التلقائي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">حالة المجدول العامة</h3>
                    <p className="text-sm text-muted-foreground">
                      {scheduler?.initialized ? 'المجدول يعمل بشكل طبيعي' : 'المجدول متوقف'}
                    </p>
                  </div>
                  <Badge variant={scheduler?.initialized ? 'default' : 'destructive'}>
                    {scheduler?.initialized ? 'نشط' : 'متوقف'}
                  </Badge>
                </div>

                {scheduler?.tasks && scheduler.tasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">المهام المجدولة:</h4>
                    {scheduler.tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">{task.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.running ? 'default' : 'secondary'}>
                            {task.running ? 'يعمل' : 'متوقف'}
                          </Badge>
                          {task.scheduled ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>سجل التغييرات الأخيرة</CardTitle>
              <CardDescription>
                آخر 10 تغييرات تم إجراؤها على بيانات السيرفرات
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    لا توجد تغييرات مسجلة حتى الآن.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">
                          {log.action === 'create' ? 'إنشاء' : log.action === 'update' ? 'تحديث' : 'حذف'} 
                          - {log.section}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          السيرفر: {log.serverId} | المستخدم: {log.userId}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('ar')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>أدوات الصيانة</CardTitle>
              <CardDescription>
                أدوات لصيانة وفحص صحة البيانات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={runHealthCheck}
                  disabled={actionLoading === 'health'}
                  className="h-20 flex-col"
                >
                  {actionLoading === 'health' ? (
                    <RefreshCw className="h-6 w-6 animate-spin mb-2" />
                  ) : (
                    <Shield className="h-6 w-6 mb-2" />
                  )}
                  فحص صحة البيانات
                </Button>

                <Button
                  variant="outline"
                  onClick={cleanupOldBackups}
                  disabled={actionLoading === 'cleanup'}
                  className="h-20 flex-col"
                >
                  {actionLoading === 'cleanup' ? (
                    <RefreshCw className="h-6 w-6 animate-spin mb-2" />
                  ) : (
                    <Trash2 className="h-6 w-6 mb-2" />
                  )}
                  تنظيف النسخ القديمة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}