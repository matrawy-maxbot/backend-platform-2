"use client"

import React from 'react';
import { Settings } from 'lucide-react';

export default function EnhancedHeaderSection({ Users }) {
  return  (
    <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8">
        <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Members Management
            </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Design custom welcome messages and manage member settings for your Discord server
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Preview</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Settings className="h-3 w-3" />
                <span>Real-time Editing</span>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
};