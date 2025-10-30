'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LiveCanvasPreview from '@/components/ui/live-canvas-preview';
import { 
  Eye, 
  EyeOff, 
  Sun, 
  Contrast, 
  Move, 
  ZoomIn, 
  ZoomOut,
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Palette,
  Type,
  User,
  Settings,
  X,
  RotateCcw,
  Upload,
  Circle,
  Square,
  GripVertical,
  Maximize2,
  Minimize2,
  Save,
  Download,
  Sparkles,
  Layers,
  Filter,
  Droplets,
  Brush,
  Image,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Sliders,
  Wand2,
  Paintbrush,
  Gradient,
  Contrast as ContrastIcon,
  Palette as SaturationIcon,
  Hue,
  Opacity,
  Spacing,
  Layout
} from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  type: 'background' | 'avatar' | 'text';
  visible: boolean;
  order: number;
}

interface AdvancedCanvasSettingsProps {
  selectedElement: string | null;
  backgroundSettings: any;
  avatarSettings: any;
  textSettings: any;
  customCanvasDimensions: {
    width: number;
    height: number;
    useCustom: boolean;
  };
  layers: LayerItem[];
  selectedLayer?: string;
  onBackgroundChange: (settings: any) => void;
  onAvatarChange: (settings: any) => void;
  onTextChange: (settings: any) => void;
  onCanvasDimensionsChange: (dimensions: any) => void;
  onElementSelect: (element: string | null) => void;
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  onLayerOrderChange: (layerId: string, direction: 'up' | 'down') => void;
  onLayerSelect: (layerId: string) => void;
}

export function AdvancedCanvasSettings({
  selectedElement,
  backgroundSettings,
  avatarSettings,
  textSettings,
  customCanvasDimensions,
  layers,
  selectedLayer,
  onBackgroundChange,
  onAvatarChange,
  onTextChange,
  onCanvasDimensionsChange,
  onElementSelect,
  onLayerVisibilityChange,
  onLayerOrderChange,
  onLayerSelect
}: AdvancedCanvasSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('background');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [windowSize, setWindowSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [presets, setPresets] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    sepia: 0,
    invert: 0,
    grayscale: 0,
    dropShadow: { enabled: false, x: 0, y: 0, blur: 0, color: '#000000' }
  });
  
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Load position and size from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('advanced-canvas-settings-position');
    const savedSize = localStorage.getItem('advanced-canvas-settings-size');
    
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.warn('Failed to load position from localStorage');
      }
    }
    
    if (savedSize) {
      try {
        setWindowSize(savedSize as 'small' | 'medium' | 'large');
      } catch (e) {
        console.warn('Failed to load size from localStorage');
      }
    }
  }, []);
  
  // Save position and size to localStorage
  useEffect(() => {
    localStorage.setItem('advanced-canvas-settings-position', JSON.stringify(position));
  }, [position]);
  
  useEffect(() => {
    localStorage.setItem('advanced-canvas-settings-size', windowSize);
  }, [windowSize]);
  
  // Handle drag functionality
  const handleDragStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('button') || target.closest('[role="slider"]')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPosition({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);
  
  // Get window dimensions based on size
  const getWindowDimensions = () => {
    switch (windowSize) {
      case 'small':
        return { width: 360, height: 480 };
      case 'medium':
        return { width: 480, height: 600 };
      case 'large':
        return { width: 640, height: 720 };
      default:
        return { width: 480, height: 600 };
    }
  };
  
  // Helper function for slider props
  const getSliderProps = () => ({
    style: { pointerEvents: 'auto' as const },
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation()
  });
  
  // Save current settings as preset
  const savePreset = () => {
    const preset = {
      id: Date.now(),
      name: `إعداد ${presets.length + 1}`,
      background: backgroundSettings,
      avatar: avatarSettings,
      text: textSettings,
      timestamp: new Date().toISOString()
    };
    
    const newPresets = [...presets, preset];
    setPresets(newPresets);
    localStorage.setItem('canvas-presets', JSON.stringify(newPresets));
  };
  
  // Load preset
  const loadPreset = (preset: any) => {
    onBackgroundChange(preset.background);
    onAvatarChange(preset.avatar);
    onTextChange(preset.text);
  };
  
  // Reset all settings
  const resetAll = () => {
    onBackgroundChange({
      opacity: 100,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      position: { x: 0, y: 0 },
      scale: 1,
      rotation: 0,
      filter: 'none',
      gradient: {
        enabled: false,
        type: 'linear',
        colors: ['#000000', '#ffffff'],
        direction: 'to-right'
      }
    });
    
    onAvatarChange({
      size: 100,
      borderRadius: 50,
      borderWidth: 0,
      borderColor: '#ffffff',
      position: { x: 0, y: 0 },
      shadow: {
        enabled: false,
        x: 0,
        y: 0,
        blur: 0,
        color: '#000000'
      },
      filter: 'none'
    });
    
    onTextChange({
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      position: { x: 0, y: 0 },
      textAlign: 'center',
      lineHeight: 1.5,
      letterSpacing: 0,
      textShadow: {
        enabled: false,
        x: 0,
        y: 0,
        blur: 0,
        color: '#000000'
      },
      stroke: {
        enabled: false,
        width: 0,
        color: '#000000'
      }
    });
  };
  
  if (!isOpen) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg border-0 rounded-lg h-12 transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
          style={{ width: '100%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <div className="flex items-center justify-center gap-3 relative z-10">
            <Sliders className="h-5 w-5" />
            <span className="font-medium">إعدادات الكانفاس المتقدمة</span>
          </div>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        ref={panelRef}
        className="absolute bg-gradient-to-br from-gray-900/98 to-gray-800/95 backdrop-blur-xl border-2 border-purple-500/40 rounded-2xl shadow-2xl z-[100] pointer-events-auto transition-all duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? '320px' : `${getWindowDimensions().width}px`,
          height: isMinimized ? '60px' : `${getWindowDimensions().height}px`,
          cursor: isDragging ? 'grabbing' : 'default',
          maxWidth: windowSize === 'small' ? '320px' : 'none',
          overflowX: windowSize === 'small' ? 'hidden' : 'visible'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-700/50 cursor-grab hover:cursor-grabbing"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">إعدادات الكانفاس المتقدمة</h3>
              <p className="text-gray-400 text-sm">تحكم كامل في جميع العناصر</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Window Size Controls */}
            <div className="flex items-center gap-1 mr-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setWindowSize('small')}
                className={`h-8 w-8 p-0 rounded-lg transition-all ${
                  windowSize === 'small' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="نافذة صغيرة"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setWindowSize('medium')}
                className={`h-8 w-8 p-0 rounded-lg transition-all ${
                  windowSize === 'medium' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="نافذة متوسطة"
              >
                <Square className="h-3 w-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setWindowSize('large')}
                className={`h-8 w-8 p-0 rounded-lg transition-all ${
                  windowSize === 'large' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="نافذة كبيرة"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
              title={isMinimized ? 'توسيع النافذة' : 'تصغير النافذة'}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
              title="إغلاق النافذة"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!isMinimized && (
          <div className={`h-[calc(100%-80px)] flex flex-col ${
            windowSize === 'small' ? 'p-2' : windowSize === 'large' ? 'p-6' : 'p-4'
          }`} style={{
            wordBreak: windowSize === 'small' ? 'break-word' : 'normal',
            overflowWrap: windowSize === 'small' ? 'break-word' : 'normal',
            maxWidth: windowSize === 'small' ? '100%' : 'none'
          }}>
            {/* Live Canvas Preview - Fixed at top */}
            <div className={`flex-shrink-0 mb-4 ${
              windowSize === 'small' ? 'mb-2' : windowSize === 'large' ? 'mb-6' : 'mb-4'
            }`}>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader className={`pb-2 ${
                  windowSize === 'small' ? 'p-2' : 'p-4'
                }`}>
                  <CardTitle className={`text-white flex items-center gap-2 ${
                    windowSize === 'small' ? 'text-sm' : 'text-base'
                  }`}>
                    <Eye className="h-4 w-4" />
                    معاينة مباشرة
                  </CardTitle>
                </CardHeader>
                <CardContent className={windowSize === 'small' ? 'p-2' : 'p-4'}>
                  <div className={`bg-gray-900/50 rounded-lg p-2 ${
                    windowSize === 'small' ? 'h-40' : windowSize === 'large' ? 'h-64' : 'h-52'
                  }`}>
                    <LiveCanvasPreview
                      canvasDimensions={customCanvasDimensions}
                      backgroundSettings={backgroundSettings}
                      avatarSettings={avatarSettings}
                      textSettings={textSettings}
                      layers={layers}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Settings Tabs - Scrollable bottom section */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className={`h-full flex flex-col ${
                windowSize === 'small' ? 'text-xs' : ''
              }`} style={{
                maxWidth: windowSize === 'small' ? '100%' : 'none'
              }}>
              <div className={`flex-shrink-0 ${windowSize === 'small' ? 'overflow-x-auto' : ''}`} style={{
                ...(windowSize === 'small' && {
                  '--input-max-width': '120px',
                  '--select-max-width': '140px'
                })
              }}>
                <TabsList className={`${windowSize === 'small' ? 'flex w-max min-w-full' : 'grid w-full'} bg-gray-800/50 border border-gray-600 ${
                  windowSize === 'small' 
                    ? 'text-xs gap-1 p-1' 
                    : windowSize === 'large' 
                      ? 'grid-cols-5 text-sm' 
                      : 'grid-cols-5 text-sm'
                }`}>
                  <TabsTrigger value="canvas" className={`data-[state=active]:bg-indigo-500 data-[state=active]:text-white ${
                    windowSize === 'small' ? 'flex-shrink-0 px-2 py-1' : ''
                  }`}>
                    <Layout className={`h-4 w-4 ${windowSize !== 'small' ? 'mr-2' : ''}`} />
                    {windowSize !== 'small' && 'الكانفاس'}
                  </TabsTrigger>
                  <TabsTrigger value="background" className={`data-[state=active]:bg-purple-500 data-[state=active]:text-white ${
                    windowSize === 'small' ? 'flex-shrink-0 px-2 py-1' : ''
                  }`}>
                    <Palette className={`h-4 w-4 ${windowSize !== 'small' ? 'mr-2' : ''}`} />
                    {windowSize !== 'small' && 'الخلفية'}
                  </TabsTrigger>
                  <TabsTrigger value="avatar" className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white ${
                    windowSize === 'small' ? 'flex-shrink-0 px-2 py-1' : ''
                  }`}>
                    <User className={`h-4 w-4 ${windowSize !== 'small' ? 'mr-2' : ''}`} />
                    {windowSize !== 'small' && 'الأفاتار'}
                  </TabsTrigger>
                  <TabsTrigger value="text" className={`data-[state=active]:bg-green-500 data-[state=active]:text-white ${
                    windowSize === 'small' ? 'flex-shrink-0 px-2 py-1' : ''
                  }`}>
                    <Type className={`h-4 w-4 ${windowSize !== 'small' ? 'mr-2' : ''}`} />
                    {windowSize !== 'small' && 'النص'}
                  </TabsTrigger>
                  <TabsTrigger value="layers" className={`data-[state=active]:bg-orange-500 data-[state=active]:text-white ${
                    windowSize === 'small' ? 'flex-shrink-0 px-2 py-1' : ''
                  }`}>
                    <Layers className={`h-4 w-4 ${windowSize !== 'small' ? 'mr-2' : ''}`} />
                    {windowSize !== 'small' && 'الطبقات'}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className={`flex-1 overflow-y-auto mt-4 space-y-2 ${
                windowSize === 'small' ? 'space-y-1' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
              }`} style={{
                ...(windowSize === 'small' && {
                  maxWidth: '100%',
                  overflow: 'hidden'
                })
              }}>
                {/* Canvas Settings Tab */}
                <TabsContent value="canvas" className={`mt-0 ${
                  windowSize === 'small' ? 'space-y-2' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
                }`} style={{
                  ...(windowSize === 'small' && {
                    '--input-width': '100px',
                    '--select-width': '120px'
                  })
                }}>
                  <Card className="bg-gray-800/50 border-gray-600 overflow-hidden">
                    <CardHeader className={windowSize === 'small' ? 'pb-2' : 'pb-3'}>
                      <CardTitle className={`text-white flex items-center gap-2 ${
                        windowSize === 'small' ? 'text-sm' : windowSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        <Layout className={`text-indigo-400 ${
                          windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                        }`} />
                        إعدادات أبعاد الكانفاس
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`${
                      windowSize === 'small' ? 'space-y-1 p-3' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
                    }`}>
                      {/* Custom Dimensions Toggle */}
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          استخدام أبعاد مخصصة
                        </Label>
                        <Switch
                          checked={customCanvasDimensions.useCustom}
                          onCheckedChange={(checked) => 
                            onCanvasDimensionsChange({ ...customCanvasDimensions, useCustom: checked })
                          }
                        />
                      </div>
                      
                      {customCanvasDimensions.useCustom && (
                        <>
                          {/* Width Control */}
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <ArrowLeft className="h-3 w-3" />
                                <ArrowRight className="h-3 w-3" />
                                العرض
                              </span>
                              <span className="text-indigo-400 font-medium">{customCanvasDimensions.width}px</span>
                            </Label>
                            <Slider
                              value={[customCanvasDimensions.width]}
                              onValueChange={([value]) => 
                                onCanvasDimensionsChange({ ...customCanvasDimensions, width: Math.round(value) })
                              }
                              min={200}
                              max={550}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>200px</span>
                              <span>550px</span>
                            </div>
                          </div>
                          
                          {/* Height Control */}
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <ArrowUp className="h-3 w-3" />
                                <ArrowDown className="h-3 w-3" />
                                الارتفاع
                              </span>
                              <span className="text-indigo-400 font-medium">{customCanvasDimensions.height}px</span>
                            </Label>
                            <Slider
                              value={[customCanvasDimensions.height]}
                              onValueChange={([value]) => 
                                onCanvasDimensionsChange({ ...customCanvasDimensions, height: Math.round(value) })
                              }
                              min={150}
                              max={350}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>150px</span>
                              <span>350px</span>
                            </div>
                          </div>
                          
                          {/* Quick Size Presets */}
                          <div className={windowSize === 'small' ? 'space-y-2' : 'space-y-3'}>
                            <Label className={`text-gray-300 flex items-center gap-2 ${
                              windowSize === 'small' ? 'text-xs' : ''
                            }`}>
                              <Sparkles className={windowSize === 'small' ? 'h-3 w-3' : 'h-4 w-4'} />
                              أحجام سريعة
                            </Label>
                            <div className={`grid gap-2 ${
                              windowSize === 'small' ? 'grid-cols-1' : 'grid-cols-2'
                            }`}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCanvasDimensionsChange({ ...customCanvasDimensions, width: 375, height: 667 })}
                                className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                📱 موبايل
                                <span className="text-gray-400 ml-1">375×667</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCanvasDimensionsChange({ ...customCanvasDimensions, width: 768, height: 1024 })}
                                className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                📱 تابلت
                                <span className="text-gray-400 ml-1">768×1024</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCanvasDimensionsChange({ ...customCanvasDimensions, width: 1920, height: 1080 })}
                                className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                🖥️ ديسكتوب
                                <span className="text-gray-400 ml-1">1920×1080</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCanvasDimensionsChange({ ...customCanvasDimensions, width: 400, height: 256 })}
                                className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                🎨 افتراضي
                                <span className="text-gray-400 ml-1">400×256</span>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Manual Input */}
                          <div className={`grid gap-3 ${
                            windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                          }`}>
                            <div className="space-y-2">
                              <Label className={`text-gray-300 ${
                                windowSize === 'small' ? 'text-xs' : 'text-xs'
                              }`}>العرض (px)</Label>
                              <Input
                                type="number"
                                value={customCanvasDimensions.width}
                                onChange={(e) => 
                                  onCanvasDimensionsChange({ 
                                    ...customCanvasDimensions, 
                                    width: Math.max(200, Math.min(1200, parseInt(e.target.value) || 400)) 
                                  })
                                }
                                className={`bg-gray-700 border-gray-600 text-white text-sm ${
                                  windowSize === 'small' ? 'max-w-full' : ''
                                }`}
                                style={{
                                  maxWidth: windowSize === 'small' ? '100px' : 'none'
                                }}
                                min={200}
                                max={1200}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className={`text-gray-300 ${
                                windowSize === 'small' ? 'text-xs' : 'text-xs'
                              }`}>الارتفاع (px)</Label>
                              <Input
                                type="number"
                                value={customCanvasDimensions.height}
                                onChange={(e) => 
                                  onCanvasDimensionsChange({ 
                                    ...customCanvasDimensions, 
                                    height: Math.max(200, Math.min(800, parseInt(e.target.value) || 400)) 
                                  })
                                }
                                className={`bg-gray-700 border-gray-600 text-white text-sm ${
                                  windowSize === 'small' ? 'max-w-full' : ''
                                }`}
                                style={{
                                  maxWidth: windowSize === 'small' ? '100px' : 'none'
                                }}
                                min={150}
                                max={800}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {!customCanvasDimensions.useCustom && (
                        <div className="text-center py-8">
                          <Layout className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">
                            قم بتفعيل الأبعاد المخصصة للتحكم في عرض وارتفاع الكانفاس
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Background Settings Tab */}
                <TabsContent value="background" className={`mt-0 ${
                  windowSize === 'small' ? 'space-y-2' : 'space-y-4'
                }`}>
                  <Card className="bg-gray-800/50 border-gray-600 overflow-hidden">
                    <CardHeader className={windowSize === 'small' ? 'pb-2' : 'pb-3'}>
                      <CardTitle className={`text-white flex items-center gap-2 ${
                        windowSize === 'small' ? 'text-sm' : windowSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        <Palette className={`text-purple-400 ${
                          windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                        }`} />
                        إعدادات الخلفية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`${
                      windowSize === 'small' ? 'space-y-2 p-3' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
                    }`}>
                      {/* Basic Controls */}
                      <div className={`grid gap-4 ${
                        windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                      }`}>
                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            الشفافية: {backgroundSettings.opacity}%
                          </Label>
                          <Slider
                            value={[backgroundSettings.opacity]}
                            onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, opacity: Math.round(value) })}
                            max={100}
                            step={1}
                            className="w-full"
                            {...getSliderProps()}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            التمويه: {backgroundSettings.blur}px
                          </Label>
                          <Slider
                            value={[backgroundSettings.blur]}
                            onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, blur: Math.round(value * 10) / 10 })}
                            max={20}
                            step={1}
                            className="w-full"
                            {...getSliderProps()}
                          />
                        </div>
                      </div>
                      
                      {/* Advanced Filters */}
                      <Separator className="bg-gray-600" />
                      <div className="space-y-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          الفلاتر المتقدمة
                        </h4>
                        
                        <div className={`grid gap-4 ${
                          windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                        }`}>
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              السطوع: {backgroundSettings.brightness || 100}%
                            </Label>
                            <Slider
                              value={[backgroundSettings.brightness || 100]}
                              onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, brightness: Math.round(value) })}
                              min={0}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                              <ContrastIcon className="h-4 w-4" />
                              التباين: {backgroundSettings.contrast || 100}%
                            </Label>
                            <Slider
                              value={[backgroundSettings.contrast || 100]}
                              onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, contrast: Math.round(value) })}
                              min={0}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                              <SaturationIcon className="h-4 w-4" />
                              التشبع: {backgroundSettings.saturation || 100}%
                            </Label>
                            <Slider
                              value={[backgroundSettings.saturation || 100]}
                              onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, saturation: Math.round(value) })}
                              min={0}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                              <RotateCcw className="h-4 w-4" />
                              الدوران: {backgroundSettings.rotation || 0}°
                            </Label>
                            <Slider
                              value={[backgroundSettings.rotation || 0]}
                              onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, rotation: Math.round(value) })}
                              min={0}
                              max={360}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                              <ZoomIn className="h-4 w-4" />
                              المقياس: {(backgroundSettings.scale || 1).toFixed(1)}x
                            </Label>
                            <Slider
                              value={[backgroundSettings.scale || 1]}
                              onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, scale: Math.round(value * 2) / 2 })}
                              min={1}
                              max={5}
                              step={0.5}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Image Upload */}
                      <Separator className="bg-gray-600" />
                      <div className="space-y-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          صورة الخلفية
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    onBackgroundChange({ 
                                      ...backgroundSettings, 
                                      image: event.target?.result 
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="bg-gray-700 border-gray-600 text-white flex-1"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onBackgroundChange({ ...backgroundSettings, image: null })}
                              className="border-gray-600 text-gray-300 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {backgroundSettings.image && (
                            <div className="space-y-2">
                              <Label className="text-gray-300">نمط العرض</Label>
                              <Select
                                value={backgroundSettings.objectFit || 'cover'}
                                onValueChange={(value) => onBackgroundChange({ ...backgroundSettings, objectFit: value })}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                  <SelectItem value="cover" className="text-white hover:bg-gray-600">Cover - ملء الشاشة</SelectItem>
                                  <SelectItem value="contain" className="text-white hover:bg-gray-600">Contain - احتواء كامل</SelectItem>
                                  <SelectItem value="fill" className="text-white hover:bg-gray-600">Fill - تمدد</SelectItem>
                                  <SelectItem value="scale-down" className="text-white hover:bg-gray-600">Scale Down - تصغير</SelectItem>
                                  <SelectItem value="none" className="text-white hover:bg-gray-600">None - الحجم الأصلي</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Position Controls */}
                      <Separator className="bg-gray-600" />
                      <div className="space-y-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          الموضع والحجم
                        </h4>
                        
                        <div className={`grid gap-4 ${
                          windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                        }`}>
                          <div className="space-y-2">
                            <Label className="text-gray-300">X: {backgroundSettings.position?.x || 0}</Label>
                            <Slider
                              value={[backgroundSettings.position?.x || 0]}
                              onValueChange={([value]) => onBackgroundChange({ 
                                ...backgroundSettings, 
                                position: { ...backgroundSettings.position, x: value } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300">Y: {backgroundSettings.position?.y || 0}</Label>
                            <Slider
                              value={[backgroundSettings.position?.y || 0]}
                              onValueChange={([value]) => onBackgroundChange({ 
                                ...backgroundSettings, 
                                position: { ...backgroundSettings.position, y: value } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                        </div>
                      </div>
                      

                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Avatar Settings Tab */}
                <TabsContent value="avatar" className={`mt-0 ${
                  windowSize === 'small' ? 'space-y-2' : 'space-y-4'
                }`}>
                  <Card className="bg-gray-800/50 border-gray-600 overflow-hidden">
                    <CardHeader className={windowSize === 'small' ? 'pb-2' : 'pb-3'}>
                      <CardTitle className={`text-white flex items-center gap-2 ${
                        windowSize === 'small' ? 'text-sm' : windowSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        <User className={`text-blue-400 ${
                          windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                        }`} />
                        إعدادات الأفاتار
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`${
                      windowSize === 'small' ? 'space-y-2 p-3' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
                    }`}>
                      {/* Avatar Image Upload */}
                      <div className="space-y-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          صورة الأفاتار
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    onAvatarChange({ 
                                      ...avatarSettings, 
                                      image: event.target?.result 
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="bg-gray-700 border-gray-600 text-white flex-1"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAvatarChange({ ...avatarSettings, image: null })}
                              className="border-gray-600 text-gray-300 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-600" />
                      
                      {/* Size and Shape */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                            <ZoomIn className="h-4 w-4" />
                            الحجم: {avatarSettings.size}px
                          </Label>
                          <Slider
                            value={[avatarSettings.size]}
                            onValueChange={([value]) => onAvatarChange({ ...avatarSettings, size: Math.round(value) })}
                            min={50}
                            max={300}
                            step={1}
                            className="w-full"
                            {...getSliderProps()}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            الاستدارة: {avatarSettings.borderRadius}%
                          </Label>
                          <Slider
                            value={[avatarSettings.borderRadius]}
                            onValueChange={([value]) => onAvatarChange({ ...avatarSettings, borderRadius: Math.round(value) })}
                            max={50}
                            step={1}
                            className="w-full"
                            {...getSliderProps()}
                          />
                        </div>
                      </div>
                      
                      {/* Border Settings */}
                      <Separator className="bg-gray-600" />
                      <div className="space-y-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          إعدادات الحدود
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">عرض الحدود: {avatarSettings.borderWidth}px</Label>
                            <Slider
                              value={[avatarSettings.borderWidth]}
                              onValueChange={([value]) => onAvatarChange({ ...avatarSettings, borderWidth: Math.round(value * 10) / 10 })}
                              max={20}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300">لون الحدود</Label>
                            <Input
                              type="color"
                              value={avatarSettings.borderColor || '#ffffff'}
                              onChange={(e) => onAvatarChange({ ...avatarSettings, borderColor: e.target.value })}
                              className="w-full h-10 bg-gray-700 border-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Position */}
                      <Separator className="bg-gray-600" />
                      <div className="space-y-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          الموضع
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">X: {avatarSettings.position?.x || 0}</Label>
                            <Slider
                              value={[avatarSettings.position?.x || 0]}
                              onValueChange={([value]) => onAvatarChange({ 
                                ...avatarSettings, 
                                position: { ...avatarSettings.position, x: Math.round(value) } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300">Y: {avatarSettings.position?.y || 0}</Label>
                            <Slider
                              value={[avatarSettings.position?.y || 0]}
                              onValueChange={([value]) => onAvatarChange({ 
                                ...avatarSettings, 
                                position: { ...avatarSettings.position, y: Math.round(value) } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Text Settings Tab */}
                <TabsContent value="text" className={`mt-0 ${
                  windowSize === 'small' ? 'space-y-2' : 'space-y-4'
                }`}>
                  <Card className="bg-gray-800/50 border-gray-600 overflow-hidden">
                    <CardHeader className={windowSize === 'small' ? 'pb-2' : 'pb-3'}>
                      <CardTitle className={`text-white flex items-center gap-2 ${
                        windowSize === 'small' ? 'text-sm' : windowSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        <Type className={`text-green-400 ${
                          windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                        }`} />
                        إعدادات النص
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`${
                      windowSize === 'small' ? 'space-y-2 p-3' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
                    }`}>
                      {/* Font Settings */}
                      <div className={`grid gap-4 ${
                        windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                      }`}>
                        <div className="space-y-2">
                          <Label className={`text-gray-300 ${
                            windowSize === 'small' ? 'text-xs' : ''
                          }`}>حجم النص الرئيسي: {textSettings.fontSize}px</Label>
                          <Slider
                            value={[textSettings.fontSize]}
                            onValueChange={([value]) => onTextChange({ ...textSettings, fontSize: Math.round(value) })}
                            min={12}
                            max={72}
                            step={1}
                            className="w-full"
                            {...getSliderProps()}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className={`text-gray-300 ${
                            windowSize === 'small' ? 'text-xs' : ''
                          }`}>حجم النص الفرعي: {textSettings.subFontSize || textSettings.fontSize}px</Label>
                          <Slider
                            value={[textSettings.subFontSize || textSettings.fontSize]}
                            onValueChange={([value]) => onTextChange({ ...textSettings, subFontSize: Math.round(value) })}
                            min={8}
                            max={48}
                            step={1}
                            className="w-full"
                            {...getSliderProps()}
                          />
                        </div>
                      </div>
                      
                      <div className={`grid gap-4 ${
                        windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-1'
                      }`}>
                        <div className="space-y-2">
                          <Label className={`text-gray-300 ${
                            windowSize === 'small' ? 'text-xs' : ''
                          }`}>لون النص</Label>
                          <Input
                            type="color"
                            value={textSettings.color}
                            onChange={(e) => onTextChange({ ...textSettings, color: e.target.value })}
                            className={`w-full bg-gray-700 border-gray-600 ${
                              windowSize === 'small' ? 'h-8' : 'h-10'
                            }`}
                          />
                        </div>
                      </div>
                      
                      {/* Font Style */}
                      <Separator className="bg-gray-600" />
                      <div className={windowSize === 'small' ? 'space-y-2' : 'space-y-3'}>
                        <h4 className={`text-white font-medium flex items-center gap-2 ${
                          windowSize === 'small' ? 'text-sm' : ''
                        }`}>
                          <Brush className="h-4 w-4" />
                          نمط الخط
                        </h4>
                        
                        <div className={`grid gap-4 ${
                          windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                        }`}>
                          <div className="space-y-2">
                            <Label className={`text-gray-300 ${
                              windowSize === 'small' ? 'text-xs' : ''
                            }`}>عائلة الخط</Label>
                            <Select
                              value={textSettings.fontFamily || 'Arial'}
                              onValueChange={(value) => onTextChange({ ...textSettings, fontFamily: value })}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                                <SelectItem value="Courier New">Courier New</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className={`text-gray-300 ${
                              windowSize === 'small' ? 'text-xs' : ''
                            }`}>وزن الخط</Label>
                            <Select
                              value={textSettings.fontWeight || 'normal'}
                              onValueChange={(value) => onTextChange({ ...textSettings, fontWeight: value })}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="normal">عادي</SelectItem>
                                <SelectItem value="bold">عريض</SelectItem>
                                <SelectItem value="lighter">خفيف</SelectItem>
                                <SelectItem value="bolder">عريض جداً</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Text Effects */}
                      <Separator className="bg-gray-600" />
                      <div className={windowSize === 'small' ? 'space-y-2' : 'space-y-3'}>
                        <h4 className={`text-white font-medium flex items-center gap-2 ${
                          windowSize === 'small' ? 'text-sm' : ''
                        }`}>
                          <Sparkles className="h-4 w-4" />
                          تأثيرات النص
                        </h4>
                        
                        <div className={`grid gap-4 ${
                          windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                        }`}>
                          <div className="space-y-2">
                            <Label className={`text-gray-300 ${
                              windowSize === 'small' ? 'text-xs' : ''
                            }`}>ارتفاع السطر: {textSettings.lineHeight || 1.5}</Label>
                            <Slider
                              value={[textSettings.lineHeight || 1.5]}
                              onValueChange={([value]) => onTextChange({ ...textSettings, lineHeight: value })}
                              min={0.8}
                              max={3}
                              step={0.1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className={`text-gray-300 ${
                              windowSize === 'small' ? 'text-xs' : ''
                            }`}>المسافة بين الحروف: {textSettings.letterSpacing || 0}px</Label>
                            <Slider
                              value={[textSettings.letterSpacing || 0]}
                              onValueChange={([value]) => onTextChange({ ...textSettings, letterSpacing: value })}
                              min={-5}
                              max={10}
                              step={0.5}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                        </div>
                        
                        {/* Text Shadow */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-gray-300">ظل النص</Label>
                            <Switch
                              checked={textSettings.textShadow?.enabled || false}
                              onCheckedChange={(checked) => onTextChange({
                                ...textSettings,
                                textShadow: { ...textSettings.textShadow, enabled: checked }
                              })}
                            />
                          </div>
                          
                          {textSettings.textShadow?.enabled && (
                            <div className={`grid gap-3 ${
                              windowSize === 'small' ? 'grid-cols-1' : 'grid-cols-2'
                            }`}>
                              <div className="space-y-2">
                                <Label className="text-gray-300 text-xs">الإزاحة الأفقية: {textSettings.textShadow?.x || 0}px</Label>
                                <Slider
                                  value={[textSettings.textShadow?.x || 0]}
                                  onValueChange={([value]) => onTextChange({
                                    ...textSettings,
                                    textShadow: { ...textSettings.textShadow, x: value }
                                  })}
                                  min={-20}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                  {...getSliderProps()}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300 text-xs">الإزاحة العمودية: {textSettings.textShadow?.y || 0}px</Label>
                                <Slider
                                  value={[textSettings.textShadow?.y || 0]}
                                  onValueChange={([value]) => onTextChange({
                                    ...textSettings,
                                    textShadow: { ...textSettings.textShadow, y: value }
                                  })}
                                  min={-20}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                  {...getSliderProps()}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300 text-xs">التمويه: {textSettings.textShadow?.blur || 0}px</Label>
                                <Slider
                                  value={[textSettings.textShadow?.blur || 0]}
                                  onValueChange={([value]) => onTextChange({
                                    ...textSettings,
                                    textShadow: { ...textSettings.textShadow, blur: value }
                                  })}
                                  min={0}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                  {...getSliderProps()}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300 text-xs">لون الظل</Label>
                                <Input
                                  type="color"
                                  value={textSettings.textShadow?.color || '#000000'}
                                  onChange={(e) => onTextChange({
                                    ...textSettings,
                                    textShadow: { ...textSettings.textShadow, color: e.target.value }
                                  })}
                                  className="w-full h-8 bg-gray-700 border-gray-600"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Text Stroke */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-gray-300">حدود النص</Label>
                            <Switch
                              checked={textSettings.stroke?.enabled || false}
                              onCheckedChange={(checked) => onTextChange({
                                ...textSettings,
                                stroke: { ...textSettings.stroke, enabled: checked }
                              })}
                            />
                          </div>
                          
                          {textSettings.stroke?.enabled && (
                            <div className={`grid gap-3 ${
                              windowSize === 'small' ? 'grid-cols-1' : 'grid-cols-2'
                            }`}>
                              <div className="space-y-2">
                                <Label className="text-gray-300 text-xs">عرض الحدود: {textSettings.stroke?.width || 0}px</Label>
                                <Slider
                                  value={[textSettings.stroke?.width || 0]}
                                  onValueChange={([value]) => onTextChange({
                                    ...textSettings,
                                    stroke: { ...textSettings.stroke, width: value }
                                  })}
                                  min={0}
                                  max={10}
                                  step={0.5}
                                  className="w-full"
                                  {...getSliderProps()}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300 text-xs">لون الحدود</Label>
                                <Input
                                  type="color"
                                  value={textSettings.stroke?.color || '#000000'}
                                  onChange={(e) => onTextChange({
                                    ...textSettings,
                                    stroke: { ...textSettings.stroke, color: e.target.value }
                                  })}
                                  className="w-full h-8 bg-gray-700 border-gray-600"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Text Alignment */}
                      <Separator className="bg-gray-600" />
                      <div className={windowSize === 'small' ? 'space-y-2' : 'space-y-3'}>
                        <h4 className={`text-white font-medium flex items-center gap-2 ${
                          windowSize === 'small' ? 'text-sm' : ''
                        }`}>
                          <AlignCenter className="h-4 w-4" />
                          محاذاة النص
                        </h4>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={textSettings.textAlign === 'left' ? 'default' : 'outline'}
                            onClick={() => onTextChange({ ...textSettings, textAlign: 'left' })}
                            className="flex-1"
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={textSettings.textAlign === 'center' ? 'default' : 'outline'}
                            onClick={() => onTextChange({ ...textSettings, textAlign: 'center' })}
                            className="flex-1"
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={textSettings.textAlign === 'right' ? 'default' : 'outline'}
                            onClick={() => onTextChange({ ...textSettings, textAlign: 'right' })}
                            className="flex-1"
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Text Position */}
                      <Separator className="bg-gray-600" />
                      <div className={windowSize === 'small' ? 'space-y-2' : 'space-y-3'}>
                        <h4 className={`text-white font-medium flex items-center gap-2 ${
                          windowSize === 'small' ? 'text-sm' : ''
                        }`}>
                          <Move className="h-4 w-4" />
                          موضع النص
                        </h4>
                        
                        <div className={`grid gap-4 ${
                          windowSize === 'small' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                        }`}>
                          <div className="space-y-2">
                            <Label className={`text-gray-300 ${
                              windowSize === 'small' ? 'text-xs' : ''
                            }`}>الموضع الأفقي (X): {textSettings.position?.x || 0}px</Label>
                            <Slider
                              value={[(() => {
                                // Convert actual X position to slider percentage (0-100)
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
                                const fontSize = textSettings.fontSize || 24;
                                const textContent = textSettings.text || 'النص';
                                const textWidth = Math.max(textContent.length * fontSize * 0.6, 50);
                                const safetyMarginX = 30;
                                const maxX = (canvasWidth / 2) - (textWidth / 2) - safetyMarginX;
                                const minX = -(canvasWidth / 2) + (textWidth / 2) + safetyMarginX;
                                
                                // Convert X position to percentage: minX = 0%, maxX = 100%
                                const percentage = ((textSettings.position?.x || 0) - minX) / (maxX - minX) * 100;
                                return Math.max(0, Math.min(100, percentage));
                              })()]}
                              onValueChange={([percentage]) => {
                                // Calculate dynamic boundaries
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
                                const fontSize = textSettings.fontSize || 24;
                                const textContent = textSettings.text || 'النص';
                                const textWidth = Math.max(textContent.length * fontSize * 0.6, 50);
                                const safetyMarginX = 30;
                                const maxX = (canvasWidth / 2) - (textWidth / 2) - safetyMarginX;
                                const minX = -(canvasWidth / 2) + (textWidth / 2) + safetyMarginX;
                                
                                // Convert percentage to actual X position: 0% = minX (left), 100% = maxX (right)
                                const actualX = minX + (percentage / 100) * (maxX - minX);
                                
                                onTextChange({ ...textSettings, position: { ...textSettings.position, x: actualX } });
                              }}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300">الموضع العمودي (Y): {textSettings.position?.y || 0}px</Label>
                            <Slider
                              value={[(() => {
                                // Convert actual Y position to slider percentage (0-100)
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                 const textHeight = textSettings.fontSize || 24;
                                 const safetyMarginY = 5; // Reduced margin for better top reach
                                 const maxY = (canvasHeight / 2) - safetyMarginY;
                                 const minY = -(canvasHeight / 2) + safetyMarginY;
                                
                                // Convert Y position to percentage: minY = 0%, maxY = 100%
                                const percentage = ((textSettings.position?.y || 0) - minY) / (maxY - minY) * 100;
                                return Math.max(0, Math.min(100, percentage));
                              })()]}
                              onValueChange={([percentage]) => {
                                // Calculate dynamic boundaries
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                 const textHeight = textSettings.fontSize || 24;
                                 const safetyMarginY = 5; // Reduced margin for better top reach
                                 const maxY = (canvasHeight / 2) - safetyMarginY;
                                 const minY = -(canvasHeight / 2) + safetyMarginY;
                                
                                // Convert percentage to actual Y position: 0% = minY (top), 100% = maxY (bottom)
                                const actualY = minY + (percentage / 100) * (maxY - minY);
                                
                                onTextChange({ ...textSettings, position: { ...textSettings.position, y: actualY } });
                              }}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                              {...getSliderProps()}
                            />
                          </div>
                        </div>
                        
                        {/* Quick Position Buttons */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">مواضع سريعة</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                const fontSize = textSettings.fontSize || 24;
                                const textContent = textSettings.text || 'النص';
                                const textWidth = Math.max(textContent.length * fontSize * 0.6, 50);
                                const textHeight = fontSize;
                                const safetyMarginX = 30;
                                 const safetyMarginY = 5; // Reduced margin for better top reach
                                 const x = -(canvasWidth / 2) + (textWidth / 2) + safetyMarginX;
                                 const y = -(canvasHeight / 2) + safetyMarginY;
                                onTextChange({ ...textSettings, position: { x, y } });
                              }}
                              className="text-xs"
                            >
                              أعلى يسار
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                const textHeight = textSettings.fontSize || 24;
                                const safetyMarginY = 5; // Reduced margin for better top reach
                                 const y = -(canvasHeight / 2) + safetyMarginY;
                                onTextChange({ ...textSettings, position: { x: 0, y } });
                              }}
                              className="text-xs"
                            >
                              أعلى وسط
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                const fontSize = textSettings.fontSize || 24;
                                const textContent = textSettings.text || 'النص';
                                const textWidth = Math.max(textContent.length * fontSize * 0.6, 50);
                                const textHeight = fontSize;
                                const safetyMarginX = 30;
                                 const safetyMarginY = 5; // Reduced margin for better top reach
                                 const x = (canvasWidth / 2) - (textWidth / 2) - safetyMarginX;
                                 const y = -(canvasHeight / 2) + safetyMarginY;
                                onTextChange({ ...textSettings, position: { x, y } });
                              }}
                              className="text-xs"
                            >
                              أعلى يمين
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                const fontSize = textSettings.fontSize || 24;
                                const textContent = textSettings.text || 'النص';
                                const textWidth = Math.max(textContent.length * fontSize * 0.6, 50);
                                const textHeight = fontSize;
                                const safetyMarginX = 30;
                                 const safetyMarginY = 5; // Reduced margin for better reach
                                 const x = -(canvasWidth / 2) + (textWidth / 2) + safetyMarginX;
                                 const y = (canvasHeight / 2) - safetyMarginY;
                                onTextChange({ ...textSettings, position: { x, y } });
                              }}
                              className="text-xs"
                            >
                              أسفل يسار
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                const textHeight = textSettings.fontSize || 24;
                                const safetyMarginY = 5; // Reduced margin for better reach
                                 const y = (canvasHeight / 2) - safetyMarginY;
                                onTextChange({ ...textSettings, position: { x: 0, y } });
                              }}
                              className="text-xs"
                            >
                              أسفل وسط
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
                                const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
                                const canvasHeight = canvasElement ? canvasElement.clientHeight : 400;
                                const fontSize = textSettings.fontSize || 24;
                                const textContent = textSettings.text || 'النص';
                                const textWidth = Math.max(textContent.length * fontSize * 0.6, 50);
                                const textHeight = fontSize;
                                const safetyMarginX = 30;
                                 const safetyMarginY = 5; // Reduced margin for better reach
                                 const x = (canvasWidth / 2) - (textWidth / 2) - safetyMarginX;
                                 const y = (canvasHeight / 2) - safetyMarginY;
                                onTextChange({ ...textSettings, position: { x, y } });
                              }}
                              className="text-xs"
                            >
                              أسفل يمين
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Layers Tab */}
                <TabsContent value="layers" className={`mt-0 ${
                  windowSize === 'small' ? 'space-y-2' : windowSize === 'large' ? 'space-y-6' : 'space-y-4'
                }`}>
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader className={`pb-2 ${
                      windowSize === 'small' ? 'px-3 py-2' : windowSize === 'large' ? 'px-6 py-4' : 'px-4 py-3'
                    }`}>
                      <CardTitle className={`text-white flex items-center gap-2 ${
                        windowSize === 'small' ? 'text-sm' : windowSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        <Layers className={`text-orange-400 ${
                          windowSize === 'small' ? 'h-4 w-4' : windowSize === 'large' ? 'h-6 w-6' : 'h-5 w-5'
                        }`} />
                        إدارة الطبقات
                      </CardTitle>
                      <CardDescription className={`text-gray-400 ${
                        windowSize === 'small' ? 'text-xs' : 'text-sm'
                      }`}>
                        تحكم في ترتيب وإظهار طبقات التصميم
                      </CardDescription>
                    </CardHeader>
                    <CardContent className={`space-y-3 ${
                      windowSize === 'small' ? 'px-3 pb-3 space-y-2' : windowSize === 'large' ? 'px-6 pb-6 space-y-4' : 'px-4 pb-4'
                    }`}>
                      {/* Layers Summary */}
                      <div className={`flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 ${
                        windowSize === 'small' ? 'p-2' : ''
                      }`}>
                        <div className="flex items-center gap-2">
                          <Eye className={`text-green-400 ${
                            windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                          }`} />
                          <Label className={`text-gray-300 ${
                            windowSize === 'small' ? 'text-sm' : 'text-base'
                          }`}>
                            الطبقات المرئية
                          </Label>
                        </div>
                        <div className={`text-orange-400 font-bold ${
                          windowSize === 'small' ? 'text-sm' : 'text-base'
                        }`}>
                          {layers.filter(l => l.visible).length} من {layers.length}
                        </div>
                      </div>

                      {/* Layers List */}
                      <div className={`space-y-2 ${
                        windowSize === 'small' ? 'space-y-1' : windowSize === 'large' ? 'space-y-3' : ''
                      }`}>
                        {layers.sort((a, b) => b.order - a.order).map((layer, index) => {
                          const getLayerIcon = (type: LayerItem['type']) => {
                            switch (type) {
                              case 'background':
                                return <Image className={`text-blue-400 ${
                                  windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                                }`} />;
                              case 'avatar':
                                return <User className={`text-green-400 ${
                                  windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                                }`} />;
                              case 'text':
                                return <Type className={`text-purple-400 ${
                                  windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                                }`} />;
                              default:
                                return <Layers className={`text-gray-400 ${
                                  windowSize === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                                }`} />;
                            }
                          };

                          const getLayerName = (type: LayerItem['type']) => {
                            switch (type) {
                              case 'background':
                                return 'الخلفية';
                              case 'avatar':
                                return 'الصورة الشخصية';
                              case 'text':
                                return 'النص';
                              default:
                                return layer.name;
                            }
                          };

                          const sortedLayers = layers.sort((a, b) => b.order - a.order);

                          return (
                            <div
                              key={layer.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                selectedLayer === layer.id
                                  ? 'bg-orange-500/20 border-orange-500/50'
                                  : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/30'
                              } ${
                                windowSize === 'small' ? 'gap-2 p-2' : windowSize === 'large' ? 'gap-4 p-4' : ''
                              }`}
                              onClick={() => onLayerSelect(layer.id)}
                            >
                              {/* Layer Icon */}
                              <div className="flex-shrink-0">
                                {getLayerIcon(layer.type)}
                              </div>
                              
                              {/* Layer Info */}
                              <div className="flex-1 min-w-0">
                                <Label className={`text-gray-300 truncate block ${
                                  windowSize === 'small' ? 'text-sm' : windowSize === 'large' ? 'text-lg font-medium' : 'text-base'
                                }`}>
                                  {getLayerName(layer.type)}
                                </Label>
                                <div className={`text-gray-500 ${
                                  windowSize === 'small' ? 'text-xs' : 'text-sm'
                                }`}>
                                  ترتيب: {layer.order}
                                </div>
                              </div>
                              
                              {/* Visibility Toggle */}
                              <div className="flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`p-0 hover:bg-gray-600/50 ${
                                    windowSize === 'small' ? 'h-6 w-6' : windowSize === 'large' ? 'h-10 w-10' : 'h-8 w-8'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLayerVisibilityChange(layer.id, !layer.visible);
                                  }}
                                >
                                  {layer.visible ? (
                                    <Eye className={`text-green-400 ${
                                      windowSize === 'small' ? 'h-3 w-3' : windowSize === 'large' ? 'h-5 w-5' : 'h-4 w-4'
                                    }`} />
                                  ) : (
                                    <EyeOff className={`text-gray-500 ${
                                      windowSize === 'small' ? 'h-3 w-3' : windowSize === 'large' ? 'h-5 w-5' : 'h-4 w-4'
                                    }`} />
                                  )}
                                </Button>
                              </div>
                              
                              {/* Order Controls */}
                              <div className={`flex flex-col gap-1 ${
                                windowSize === 'small' ? 'gap-0.5' : windowSize === 'large' ? 'gap-2' : ''
                              }`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`p-0 hover:bg-gray-600/50 ${
                                    windowSize === 'small' ? 'h-4 w-4' : windowSize === 'large' ? 'h-6 w-6' : 'h-5 w-5'
                                  }`}
                                  disabled={index === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLayerOrderChange(layer.id, 'up');
                                  }}
                                >
                                  <ArrowUp className={`text-gray-400 ${
                                    windowSize === 'small' ? 'h-2 w-2' : windowSize === 'large' ? 'h-3 w-3' : 'h-2.5 w-2.5'
                                  }`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`p-0 hover:bg-gray-600/50 ${
                                    windowSize === 'small' ? 'h-4 w-4' : windowSize === 'large' ? 'h-6 w-6' : 'h-5 w-5'
                                  }`}
                                  disabled={index === sortedLayers.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLayerOrderChange(layer.id, 'down');
                                  }}
                                >
                                  <ArrowDown className={`text-gray-400 ${
                                    windowSize === 'small' ? 'h-2 w-2' : windowSize === 'large' ? 'h-3 w-3' : 'h-2.5 w-2.5'
                                  }`} />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        
                        {layers.length === 0 && (
                          <div className={`text-center py-4 text-gray-500 ${
                            windowSize === 'small' ? 'py-3 text-xs' : windowSize === 'large' ? 'py-6 text-base' : 'text-sm'
                          }`}>
                            لا توجد طبقات متاحة
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
              </div>
            </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}