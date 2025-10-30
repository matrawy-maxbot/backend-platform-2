'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function TestLogoutPage() {
  const handleLogout = async () => {
    try {
      console.log('Attempting to sign out...');
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">اختبار زر تسجيل الخروج</h1>
        <p className="text-gray-600 mb-6 text-center">
          اضغط على الزر أدناه لاختبار وظيفة تسجيل الخروج
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            size="lg"
          >
            تسجيل الخروج
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          سيتم توجيهك إلى الصفحة الرئيسية بعد تسجيل الخروج
        </p>
      </div>
    </div>
  );
}