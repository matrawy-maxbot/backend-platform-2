"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import AnimatedBackground from "@/components/animated-background"
import { useAuth } from "@/hooks/useAuth"
import { useAdminPermissions } from "@/hooks/useAdminPermissions"
import { 
  AlertCircle, 
  ArrowLeft, 
  Key, 
  CheckCircle,
  XCircle,
  Shield,
  Loader2,
  Crown
} from "lucide-react"

type VerificationStatus = 'idle' | 'checking' | 'validating' | 'success' | 'error' | 'auto-redirecting'

export default function AdminVerificationPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const serverId = searchParams.get("serverId")
  
  // إضافة hooks للتحقق من صلاحيات الأدمن
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { canAccessProtectedPages, isOwner, isCurrentAdmin, isLoading: permissionsLoading } = useAdminPermissions()

  // التحقق التلقائي من صلاحيات الأدمن عند تحميل الصفحة
  useEffect(() => {
    // إذا كان المستخدم مسجل دخول ولديه صلاحيات الوصول للصفحات المحمية
    if (isAuthenticated && !authLoading && !permissionsLoading && canAccessProtectedPages) {
      setVerificationStatus('auto-redirecting')
      setCurrentStep("Admin access detected - redirecting...")
      setProgress(100)
      
      // توجيه مباشر للداشبورد بعد ثانيتين
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [isAuthenticated, authLoading, permissionsLoading, canAccessProtectedPages, router])

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    setIsLoading(true)
    setError("")
    setVerificationStatus('checking')
    setProgress(0)

    try {
      // مرحلة 1: فحص تنسيق الكود
      setCurrentStep("Checking code format...")
      setProgress(20)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // مرحلة 2: التحقق من صحة الكود
      setCurrentStep("Validating code...")
      setVerificationStatus('validating')
      setProgress(50)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // مرحلة 3: التحقق من الصلاحيات
      setCurrentStep("Checking permissions...")
      setProgress(80)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // التحقق من الكود (مؤقت - يجب استبداله بنظام حقيقي)
      if (verificationCode === "123456") {
        setCurrentStep("Verification successful!")
        setVerificationStatus('success')
        setProgress(100)
        
        // انتظار قصير لإظهار رسالة النجاح
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // التوجه إلى لوحة التحكم
        router.push('/dashboard')
      } else {
        setVerificationStatus('error')
        setError("Invalid verification code")
        setProgress(0)
      }
    } catch (err) {
      setVerificationStatus('error')
      setError("An error occurred during verification")
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  // تفاعل مع كتابة المستخدم في الوقت الفعلي
  useEffect(() => {
    if (verificationCode.length === 0) {
      setVerificationStatus('idle')
      setProgress(0)
      setCurrentStep("Enter your verification code")
      setError("")
    } else if (verificationCode.length > 0 && verificationCode.length < 6) {
      setVerificationStatus('checking')
      setProgress((verificationCode.length / 6) * 50) // تقدم حتى 50% أثناء الكتابة
      setCurrentStep(`Entering code... (${verificationCode.length}/6)`)
      setError("")
    } else if (verificationCode.length === 6) {
      setVerificationStatus('validating')
      setProgress(75)
      setCurrentStep("Code complete - ready to verify")
      setError("")
    }
  }, [verificationCode])

  // إذا كان في حالة تحميل للتحقق من الصلاحيات
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center space-y-4 relative z-10">
          <div className="mx-auto mb-4 relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 backdrop-blur-sm mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
              <Loader2 className="h-8 w-8 text-blue-400 relative z-10 animate-spin" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
          </div>
          <h2 className="text-xl font-bold text-white">Checking Admin Permissions</h2>
          <p className="text-gray-400">Please wait while we verify your access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button - Fixed Position */}
      <div className="absolute top-6 left-6 z-10">
        <Button 
          variant="ghost"
          onClick={() => router.push("/servers")}
          className="bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Servers
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          {/* Logo/Icon Section */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 backdrop-blur-sm mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                <Key className="h-8 w-8 text-blue-400 relative z-10" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Identity Verification
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the verification code to access protected areas
            </p>
          </div>

          {/* Main Verification Card */}
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            
            {/* Progress Bar - Always Visible */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50">
              <div 
                className={`h-full transition-all duration-500 ease-out ${
                  verificationStatus === 'success' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : verificationStatus === 'auto-redirecting'
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                    : verificationStatus === 'error'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                {/* Verification Status Indicator - Always Visible */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    {verificationStatus === 'idle' && (
                      <div className="relative">
                        <Key className="h-8 w-8 text-gray-400 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-gray-400/20 animate-pulse"></div>
                      </div>
                    )}
                    {verificationStatus === 'checking' && (
                      <div className="relative">
                        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                        <div className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-pulse"></div>
                      </div>
                    )}
                    {verificationStatus === 'validating' && (
                      <div className="relative">
                        <Shield className="h-8 w-8 text-yellow-400 animate-pulse" />
                        <div className="absolute -inset-2 bg-yellow-400/20 rounded-full animate-ping"></div>
                      </div>
                    )}
                    {verificationStatus === 'success' && (
                      <div className="relative">
                        <CheckCircle className="h-8 w-8 text-green-400 animate-bounce" />
                        <div className="absolute -inset-2 bg-green-400/20 rounded-full animate-ping"></div>
                      </div>
                    )}
                    {verificationStatus === 'auto-redirecting' && (
                      <div className="relative">
                        <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
                        <div className="absolute -inset-2 bg-yellow-400/20 rounded-full animate-ping"></div>
                      </div>
                    )}
                    {verificationStatus === 'error' && (
                      <div className="relative">
                        <XCircle className="h-8 w-8 text-red-400 animate-pulse" />
                        <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{currentStep || "Enter your verification code"}</p>
                  <div className="mt-2 text-xs text-gray-400">{progress}%</div>
                  
                  {/* 6-Character Dot Counter */}
                  <div className="flex justify-center gap-2 mt-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                          index < verificationCode.length
                            ? verificationStatus === 'success'
                              ? 'bg-green-400 border-green-400 shadow-lg shadow-green-400/50'
                              : verificationStatus === 'error'
                              ? 'bg-red-400 border-red-400 shadow-lg shadow-red-400/50'
                              : 'bg-blue-400 border-blue-400 shadow-lg shadow-blue-400/50'
                            : 'border-gray-600 bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-code" className="text-white font-medium flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-400" />
                    Verification Code
                  </Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={`bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 h-12 focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300 ${
                      verificationStatus === 'success' ? 'border-green-400/50 focus:border-green-400/50 focus:ring-green-400/20' :
                      verificationStatus === 'error' ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20' : ''
                    }`}
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>
                
                {/* Success Message */}
                {verificationStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3 backdrop-blur-sm animate-pulse">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 animate-bounce" />
                    <span className="text-sm font-medium">Verification successful! Redirecting...</span>
                  </div>
                )}
                
                {/* Auto-Redirect Message for Admins */}
                {verificationStatus === 'auto-redirecting' && (
                  <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 backdrop-blur-sm animate-pulse">
                    <Crown className="h-4 w-4 flex-shrink-0 animate-bounce" />
                    <span className="text-sm font-medium">Admin access detected! Redirecting to dashboard...</span>
                  </div>
                )}
                
                {/* Error Message */}
                {error && verificationStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm animate-pulse">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleVerification}
                    disabled={isLoading || !verificationCode.trim() || verificationStatus === 'success' || verificationStatus === 'auto-redirecting'}
                    className={`w-full h-12 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${
                      verificationStatus === 'success' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : verificationStatus === 'auto-redirecting'
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700'
                        : verificationStatus === 'error'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    } text-white`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    {isLoading ? (
                      <div className="flex items-center gap-2 relative z-10">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {verificationStatus === 'checking' && 'Checking code...'}
                        {verificationStatus === 'validating' && 'Verifying...'}
                        {verificationStatus === 'success' && 'Success!'}
                      </div>
                    ) : verificationStatus === 'success' ? (
                      <div className="flex items-center gap-2 relative z-10">
                        <CheckCircle className="h-4 w-4" />
                        Verification Successful
                      </div>
                    ) : verificationStatus === 'auto-redirecting' ? (
                      <div className="flex items-center gap-2 relative z-10">
                        <Crown className="h-4 w-4 animate-pulse" />
                        Admin Access Detected
                      </div>
                    ) : verificationStatus === 'error' ? (
                      <div className="flex items-center gap-2 relative z-10">
                        <XCircle className="h-4 w-4" />
                        Retry
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative z-10">
                        <Key className="h-4 w-4" />
                        Verify Code
                      </div>
                    )}
                  </Button>
                  
                  {verificationStatus === 'idle' && (
                    <>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">or</p>
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/5 h-10 backdrop-blur-sm transition-all duration-300 hover:border-white/30"
                        disabled={isLoading}
                      >
                        Verify
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Security Notice */}
                <div className={`bg-gradient-to-r border rounded-lg p-3 backdrop-blur-sm transition-all duration-500 ${
                  verificationStatus === 'success' 
                    ? 'from-green-500/10 to-emerald-500/10 border-green-500/20'
                    : verificationStatus === 'error'
                    ? 'from-red-500/10 to-rose-500/10 border-red-500/20'
                    : 'from-amber-500/10 to-orange-500/10 border-amber-500/20'
                }`}>
                  <div className="flex items-start gap-2">
                    {verificationStatus === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    ) : verificationStatus === 'error' ? (
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-xs">
                      {verificationStatus === 'success' ? (
                        <>
                          <p className="font-medium mb-1 text-green-400">Verification Successful!</p>
                          <p className="text-green-200/90">• Identity verified • Permissions confirmed • Redirecting to dashboard</p>
                        </>
                      ) : verificationStatus === 'error' ? (
                        <>
                          <p className="font-medium mb-1 text-red-400">Verification Failed!</p>
                          <p className="text-red-200/90">• Check code accuracy • Verify connection • Try again</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium mb-1 text-amber-400">Security Notice:</p>
                          <p className="text-amber-200/90">• Keep your code private • Don't share with others • Valid for single use only</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}