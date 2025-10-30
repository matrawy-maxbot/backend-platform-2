"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"

const errors: Record<string, string> = {
  Configuration: "هناك مشكلة في إعدادات الخادم.",
  AccessDenied: "تم رفض الوصول. ليس لديك صلاحية للوصول.",
  Verification: "الرمز المميز منتهي الصلاحية أو تم استخدامه بالفعل.",
  Default: "حدث خطأ غير متوقع أثناء تسجيل الدخول.",
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")
  
  const errorMessage = error && errors[error] ? errors[error] : errors.Default

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            خطأ في تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {errorMessage}
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            العودة لتسجيل الدخول
          </Link>
        </div>
        
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}