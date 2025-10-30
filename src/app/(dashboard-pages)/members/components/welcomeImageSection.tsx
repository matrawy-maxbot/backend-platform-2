"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Image,
  Type,
  Palette,
  RotateCcw,
  MessageSquare,
  Settings,
  Eye,
  ArrowLeftRight,
  ArrowUpDown,
  User,
  Info,
  X,
} from 'lucide-react';

import { MobileCanvasSettings } from '@/app/(dashboard-pages)/members/components/canvas/welcomeImage-canvas-settings';

export default function WelcomeImageSection({ 
    setShowDiscordPreview,
    resetBackground,
    resetAvatar,
    resetText,
    resetLayers,
    resetCanvas,
    selectedElement,
    getCanvasStyle,
    handleMouseMove,
    handleMouseUp,
    setSelectedElement,
    setActiveTab,
    showGrid,
    gridSize,
    layers,
    backgroundSettings,
    handleMouseDown,
    handleElementClick,
    avatarSettings,
    setIsResizing,
    setIsDragging,
    setDragStart,
    textSettings,
    processText,
    customCanvasDimensions,
    selectedLayer,
    setBackgroundSettings,
    setAvatarSettings,
    setTextSettings,
    setCustomCanvasDimensions,
    handleLayerVisibilityChange,
    handleLayerOrderChange,
    handleLayerAdd,
    handleLayerDelete,
    setSelectedLayer,
    showDesignTip,
    setShowDesignTip,
    updateLayerSettings,
    getLayerSettings
}) {
  return  (
    <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Image className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                    <CardTitle className="text-white">Welcome Image Designer</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                    Design custom welcome images for your Discord server
                    </CardDescription>
                </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Designer</span>
                </div>
            </div>
            </div>
        </CardHeader>
        <CardContent className="p-6">
            {/* Enhanced Designer Toolbar */}
            <div className="space-y-4 mb-6">
            {/* Primary Action Bar */}
            <div className="bg-gradient-to-r from-gray-800/40 via-gray-800/60 to-gray-800/40 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Main Action */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#5865f2]/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-[#5865f2]" />
                    </div>
                    <div>
                    <h3 className="text-sm font-medium text-white">Live Preview</h3>
                    <p className="text-xs text-gray-400">See your design in Discord</p>
                    </div>

                    
                    {/* Design Tools - Simplified Layout */}
                    <div className="flex items-center gap-3 ml-4">
                    {/* Preview Button - Primary Action */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-[#5865f2]/20 to-[#4752c4]/20 rounded-lg p-2 border border-[#5865f2]/30">
                        <Button
                        onClick={() => setShowDiscordPreview(true)}
                        className="bg-gradient-to-r from-[#5865f2] to-[#4752c4] hover:from-[#4752c4] hover:to-[#3c4396] text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                        size="sm"
                        >
                        <Eye className="h-4 w-4 mr-2" />
                        معاينة مباشرة
                        </Button>
                    </div>
                    
                    {/* Separator */}
                    <div className="w-px h-8 bg-gray-600"></div>
                    
                    {/* Reset Button - Matching Preview Style */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-2 border border-red-500/30">
                        <Button
                        onClick={() => {
                            resetBackground();
                            resetAvatar();
                            resetText();
                            resetLayers();
                            resetCanvas();
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                        size="sm"
                        >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        إعادة تعيين
                        </Button>
                    </div>
                    </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Auto-save enabled</span>
                    </div>
                    <div className="w-px h-4 bg-gray-600"></div>
                    <span>Canvas: 400×256</span>
                </div>
                </div>
            </div>
            </div>
            {/* Full Width Content */}
            <div className="space-y-6">
            {/* Design Canvas */}
            <div className="space-y-4">
                <div className="relative w-full flex justify-center">
                <div 
                    className={`design-canvas relative bg-gray-800 rounded-lg border-2 border-dashed cursor-crosshair transition-all duration-200 ${
                    selectedElement ? 'border-blue-400' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    style={getCanvasStyle()}
                >
                {/* Discord Preview Button */}
                <Button
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDiscordPreview(true);
                }}
                className="absolute top-2 left-2 z-20 bg-[#5865f2] hover:bg-[#4752c4] text-white border-0 text-xs px-2 py-1 h-7"
                >
                <MessageSquare className="h-3 w-3 mr-1" />
                Discord Preview
                </Button>
                

                
                {/* Grid Overlay */}
                {showGrid && (
                <div 
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                    }}
                />
                )}
                

                </div>
                </div>
                
            </div>
            
            {/* Canvas Settings - Full Width */}
            <div className="mt-6 w-full">
                <MobileCanvasSettings
                selectedElement={selectedElement}
                backgroundSettings={backgroundSettings}
                avatarSettings={avatarSettings}
                textSettings={textSettings}
                customCanvasDimensions={customCanvasDimensions}
                layers={layers}
                selectedLayer={selectedLayer}
                onBackgroundChange={setBackgroundSettings}
                onAvatarChange={setAvatarSettings}
                onTextChange={setTextSettings}
                onCanvasDimensionsChange={setCustomCanvasDimensions}
                onElementSelect={setSelectedElement}
                onLayerVisibilityChange={handleLayerVisibilityChange}
                onLayerOrderChange={handleLayerOrderChange}
                onLayerAdd={handleLayerAdd}
                onLayerDelete={handleLayerDelete}
                onLayerSelect={setSelectedLayer}
                updateLayerSettings={updateLayerSettings}
                getLayerSettings={getLayerSettings}
                />
            </div>
            
            {/* Enhanced Design Tip Alert */}
            {showDesignTip && (
                <div className="relative bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-500/40 rounded-xl p-4 sm:p-5 mt-6 backdrop-blur-md shadow-2xl overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 animate-pulse" />
                
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Info className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                        <h3 className="text-white font-bold text-lg">Design Tip</h3>
                        <p className="text-blue-300/80 text-sm">Pro tips for better control</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDesignTip(false)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-200 mb-5 leading-relaxed">
                    If you have difficulty controlling elements with the mouse, you can use the sliders in the control settings to move the image, text, and background with greater precision.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-lg p-3 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200">
                        <div className="p-1.5 bg-blue-500/20 rounded">
                            <User className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-200 font-medium">Avatar Sliders</span>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-900/30 to-green-800/20 rounded-lg p-3 border border-green-500/20 hover:border-green-400/30 transition-all duration-200">
                        <div className="p-1.5 bg-green-500/20 rounded">
                            <Type className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="text-sm text-gray-200 font-medium">Text Sliders</span>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-lg p-3 border border-purple-500/20 hover:border-purple-400/30 transition-all duration-200">
                        <div className="p-1.5 bg-purple-500/20 rounded">
                            <Palette className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-200 font-medium">Background Sliders</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Precise Control:</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                        <ArrowLeftRight className="h-4 w-4" />
                        <span className="text-xs">Horizontal</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                        <ArrowUpDown className="h-4 w-4" />
                        <span className="text-xs">Vertical</span>
                        </div>
                    </div>
                </div>
                </div>
            )}
            </div>
        </CardContent>
    </Card>
  )
};