'use client';

import React from 'react';
import CanvasTest from '../components/canvas/preview/canvasComponent';

export default function CanvasTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            اختبار Canvas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            صفحة اختبار للمكون الجديد مع الدوائر التفاعلية
          </p>
        </div>
        
        <div className="flex justify-center">
          <CanvasTest />
        </div>
      </div>
    </div>
  );
}