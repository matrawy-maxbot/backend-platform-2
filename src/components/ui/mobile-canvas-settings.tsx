'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import LiveCanvasPreview from '@/components/ui/live-canvas-preview';
import { 
  Settings,
  Palette,
  User,
  Type,
  Layout,
  Eye,
  Sun,
  Contrast,
  ZoomIn,
  Move,
  RotateCcw,
  Circle,
  Square,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sliders,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  Download,
  Upload,
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  RefreshCw,
  Image,
  Layers,
  EyeOff
} from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  type: 'background' | 'avatar' | 'text';
  visible: boolean;
  order: number;
}

interface MobileCanvasSettingsProps {
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

export function MobileCanvasSettings({
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
}: MobileCanvasSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string[]>(['canvas']);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showPreview, setShowPreview] = useState(true);
  const [presets, setPresets] = useState<any[]>([]);

  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('mobile-canvas-presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.warn('Failed to load presets');
      }
    }
  }, []);

  // Save preset
  const savePreset = () => {
    const preset = {
      id: Date.now(),
      name: `إعداد ${presets.length + 1}`,
      background: backgroundSettings,
      avatar: avatarSettings,
      text: textSettings,
      canvas: customCanvasDimensions,
      timestamp: new Date().toISOString()
    };
    
    const newPresets = [...presets, preset];
    setPresets(newPresets);
    localStorage.setItem('mobile-canvas-presets', JSON.stringify(newPresets));
  };

  // Load preset
  const loadPreset = (preset: any) => {
    onBackgroundChange(preset.background);
    onAvatarChange(preset.avatar);
    onTextChange(preset.text);
    onCanvasDimensionsChange(preset.canvas);
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
      rotation: 0
    });
    
    onAvatarChange({
      size: 100,
      borderRadius: 50,
      borderWidth: 0,
      borderColor: '#ffffff',
      position: { x: 0, y: 0 }
    });
    
    onTextChange({
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      position: { x: 0, y: 0 },
      textAlign: 'center'
    });

    onCanvasDimensionsChange({
      width: 400,
      height: 400,
      useCustom: false
    });
  };

  // Quick position presets
  const quickPositions = {
    avatar: {
      center: { x: 0, y: 0 },
      topLeft: { x: -100, y: -100 },
      topRight: { x: 100, y: -100 },
      bottomLeft: { x: -100, y: 100 },
      bottomRight: { x: 100, y: 100 }
    },
    text: {
      center: { x: 0, y: 0 },
      top: { x: 0, y: -150 },
      bottom: { x: 0, y: 150 },
      left: { x: -150, y: 0 },
      right: { x: 150, y: 0 }
    }
  };

  return (
    <div className="w-full">
      {/* Mobile-First Trigger Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg border-0 rounded-xl h-14 text-lg font-medium transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="flex items-center justify-center gap-3 relative z-10">
              <Wand2 className="h-6 w-6" />
              <span>إعدادات الكانفاس المتقدمة</span>
              <Smartphone className="h-5 w-5 opacity-70" />
            </div>
          </Button>
        </SheetTrigger>

        <SheetContent 
          side="bottom" 
          className="h-screen bg-gradient-to-br from-gray-900/98 to-gray-800/95 backdrop-blur-xl border-t-2 border-purple-500/40 rounded-t-3xl p-0 overflow-hidden"
        >
          <div className="h-full flex flex-col">
            {/* Header - Compact */}
            <SheetHeader className="p-3 pb-2 border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Wand2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-white text-lg font-bold text-right">
                      إعدادات الكانفاس
                    </SheetTitle>
                  </div>
                </div>
                
                {/* Quick Actions - Compact */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    onClick={savePreset}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    حفظ
                  </Button>
                  <Button
                    size="sm"
                    onClick={resetAll}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-2 py-1 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            </SheetHeader>
            
            {/* Live Preview - Takes exactly half the screen */}
            <div className="h-1/2 p-3 border-b border-gray-700/50 bg-gray-800/20 flex-shrink-0">
              <div className="h-full flex items-center justify-center">
                <LiveCanvasPreview
                  canvasDimensions={customCanvasDimensions.useCustom ? customCanvasDimensions : { width: 400, height: 256 }}
                  backgroundSettings={backgroundSettings}
                  avatarSettings={avatarSettings}
                  textSettings={textSettings}
                  layers={layers}
                  memberData={{
                    username: 'أحمد محمد',
                    displayName: 'Ahmed Mohamed',
                    joinDate: new Date().toLocaleDateString('ar-SA'),
                    memberNumber: '1234'
                  }}
                  selectedElement={selectedElement}
                  onElementSelect={onElementSelect}
                  onBackgroundChange={onBackgroundChange}
                  onAvatarChange={onAvatarChange}
                  onTextChange={onTextChange}
                />
              </div>
            </div>

            {/* Settings Content - Takes exactly half the screen */}
            <div className="h-1/2 overflow-y-auto p-3">
              <Accordion 
                type="multiple" 
                value={activeSection} 
                onValueChange={setActiveSection}
                className="space-y-2 sm:space-y-3"
              >
                {/* Canvas Dimensions */}
                <AccordionItem value="canvas" className="border border-gray-700/50 rounded-xl bg-gray-800/30">
                  <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Layout className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium text-sm sm:text-base">أبعاد الكانفاس</div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {customCanvasDimensions.useCustom 
                            ? `${customCanvasDimensions.width} × ${customCanvasDimensions.height}` 
                            : 'أبعاد تلقائية'
                          }
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Custom Dimensions Toggle */}
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                        <Label className="text-gray-300 font-medium text-sm sm:text-base">استخدام أبعاد مخصصة</Label>
                        <Switch
                          checked={customCanvasDimensions.useCustom}
                          onCheckedChange={(checked) => 
                            onCanvasDimensionsChange({ ...customCanvasDimensions, useCustom: checked })
                          }
                        />
                      </div>

                      {customCanvasDimensions.useCustom && (
                        <div className="space-y-3 sm:space-y-4">
                          {/* Width */}
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center justify-between text-sm sm:text-base">
                              <span className="flex items-center gap-1 sm:gap-2">
                                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                العرض
                              </span>
                              <span className="text-indigo-400 font-bold text-sm sm:text-base">{customCanvasDimensions.width}px</span>
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
                            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                              {[300, 400, 500, 550].map(width => (
                                <Button
                                  key={width}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onCanvasDimensionsChange({ ...customCanvasDimensions, width })}
                                  className="text-xs h-7 sm:h-8"
                                >
                                  {width}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Height */}
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <ArrowUp className="h-4 w-4" />
                                <ArrowDown className="h-4 w-4" />
                                الارتفاع
                              </span>
                              <span className="text-indigo-400 font-bold">{customCanvasDimensions.height}px</span>
                            </Label>
                            <Slider
                              value={[customCanvasDimensions.height]}
                              onValueChange={([value]) => 
                                onCanvasDimensionsChange({ ...customCanvasDimensions, height: Math.round(value) })
                              }
                              min={200}
                              max={350}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex gap-2">
                              {[250, 300, 350].map(height => (
                                <Button
                                  key={height}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onCanvasDimensionsChange({ ...customCanvasDimensions, height })}
                                  className="flex-1 text-xs"
                                >
                                  {height}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Layers Panel */}
                <AccordionItem value="layers" className="border border-gray-700/50 rounded-xl bg-gray-800/30">
                  <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Layers className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium text-sm sm:text-base">إدارة الطبقات</div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {layers.filter(l => l.visible).length} من {layers.length}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="space-y-2 sm:space-y-3">
                      {layers.sort((a, b) => b.order - a.order).map((layer, index) => {
                        const getLayerIcon = (type: LayerItem['type']) => {
                          switch (type) {
                            case 'background':
                              return <Image className="h-4 w-4 text-blue-400" />;
                            case 'avatar':
                              return <User className="h-4 w-4 text-green-400" />;
                            case 'text':
                              return <Type className="h-4 w-4 text-purple-400" />;
                            default:
                              return <Layers className="h-4 w-4 text-gray-400" />;
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
                            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                              selectedLayer === layer.id
                                ? 'bg-blue-500/20 border-blue-500/50'
                                : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/30'
                            }`}
                            onClick={() => onLayerSelect(layer.id)}
                          >
                            {/* Layer Icon */}
                            <div className="flex-shrink-0">
                              {getLayerIcon(layer.type)}
                            </div>
                            
                            {/* Layer Name */}
                            <div className="flex-1 min-w-0">
                              <Label className="text-gray-300 text-sm sm:text-base truncate block">
                                {getLayerName(layer.type)}
                              </Label>
                            </div>
                            
                            {/* Visibility Toggle */}
                            <div className="flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-600/50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLayerVisibilityChange(layer.id, !layer.visible);
                                }}
                              >
                                {layer.visible ? (
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                                ) : (
                                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                            
                            {/* Order Controls */}
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 sm:h-5 sm:w-5 p-0 hover:bg-gray-600/50"
                                disabled={index === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLayerOrderChange(layer.id, 'up');
                                }}
                              >
                                <ArrowUp className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 sm:h-5 sm:w-5 p-0 hover:bg-gray-600/50"
                                disabled={index === sortedLayers.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLayerOrderChange(layer.id, 'down');
                                }}
                              >
                                <ArrowDown className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      
                      {layers.length === 0 && (
                        <div className="text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                          لا توجد طبقات متاحة
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Background Settings */}
                <AccordionItem value="background" className="border border-gray-700/50 rounded-xl bg-gray-800/30">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Palette className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">إعدادات الخلفية</div>
                        <div className="text-gray-400 text-sm">
                          شفافية {backgroundSettings.opacity}% • سطوع {backgroundSettings.brightness}%
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">


                      {/* Opacity */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            الشفافية
                          </span>
                          <span className="text-purple-400 font-bold">{backgroundSettings.opacity}%</span>
                        </Label>
                        <Slider
                          value={[backgroundSettings.opacity]}
                          onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, opacity: Math.round(value) })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Brightness */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            السطوع
                          </span>
                          <span className="text-purple-400 font-bold">{backgroundSettings.brightness}%</span>
                        </Label>
                        <Slider
                          value={[backgroundSettings.brightness]}
                          onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, brightness: Math.round(value) })}
                          min={0}
                          max={200}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Contrast */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Contrast className="h-4 w-4" />
                            التباين
                          </span>
                          <span className="text-purple-400 font-bold">{backgroundSettings.contrast}%</span>
                        </Label>
                        <Slider
                          value={[backgroundSettings.contrast]}
                          onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, contrast: Math.round(value) })}
                          min={0}
                          max={200}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Scale */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <ZoomIn className="h-4 w-4" />
                            المقياس
                          </span>
                          <span className="text-purple-400 font-bold">{(backgroundSettings.scale || 1).toFixed(1)}x</span>
                        </Label>
                        <Slider
                          value={[backgroundSettings.scale || 1]}
                          onValueChange={([value]) => onBackgroundChange({ ...backgroundSettings, scale: parseFloat(value.toFixed(1)) })}
                          min={0.1}
                          max={3}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      {/* Background Image Upload */}
                      <div className="space-y-3">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          صورة الخلفية
                        </Label>
                        
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
                              className="bg-gray-700 border-gray-600 text-white flex-1 text-sm"
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
                              <Label className="text-gray-300 text-sm">نمط العرض</Label>
                              <Select
                                value={backgroundSettings.objectFit || 'cover'}
                                onValueChange={(value) => onBackgroundChange({ ...backgroundSettings, objectFit: value })}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                  <SelectItem value="cover" className="text-white hover:bg-gray-600">
                                    تغطية كاملة (Cover)
                                  </SelectItem>
                                  <SelectItem value="contain" className="text-white hover:bg-gray-600">
                                    احتواء كامل (Contain)
                                  </SelectItem>
                                  <SelectItem value="fill" className="text-white hover:bg-gray-600">
                                    ملء كامل (Fill)
                                  </SelectItem>
                                  <SelectItem value="scale-down" className="text-white hover:bg-gray-600">
                                    تصغير تلقائي (Scale Down)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          الموضع
                        </Label>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">X: {backgroundSettings.position?.x || 0}</Label>
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
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">Y: {backgroundSettings.position?.y || 0}</Label>
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
                            />
                          </div>
                        </div>
                        
                        {/* Quick Position Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onBackgroundChange({ 
                              ...backgroundSettings, 
                              position: { x: 0, y: 0 } 
                            })}
                            className="text-xs"
                          >
                            وسط
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onBackgroundChange({ 
                              ...backgroundSettings, 
                              position: { x: -50, y: -50 } 
                            })}
                            className="text-xs"
                          >
                            أعلى يسار
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onBackgroundChange({ 
                              ...backgroundSettings, 
                              position: { x: 50, y: 50 } 
                            })}
                            className="text-xs"
                          >
                            أسفل يمين
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Avatar Settings */}
                <AccordionItem value="avatar" className="border border-gray-700/50 rounded-xl bg-gray-800/30">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <User className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">إعدادات الأفاتار</div>
                        <div className="text-gray-400 text-sm">
                          حجم {avatarSettings.size} • استدارة {avatarSettings.borderRadius}%
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {/* Avatar Image Upload */}
                      <div className="space-y-3">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          صورة الأفاتار
                        </Label>
                        
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

                      {/* Size */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <ZoomIn className="h-4 w-4" />
                            الحجم
                          </span>
                          <span className="text-blue-400 font-bold">{avatarSettings.size}px</span>
                        </Label>
                        <Slider
                          value={[avatarSettings.size]}
                          onValueChange={([value]) => onAvatarChange({ ...avatarSettings, size: Math.round(value) })}
                          min={50}
                          max={300}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          {[80, 100, 120, 150, 200].map(size => (
                            <Button
                              key={size}
                              size="sm"
                              variant="outline"
                              onClick={() => onAvatarChange({ ...avatarSettings, size })}
                              className="flex-1 text-xs"
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            الاستدارة
                          </span>
                          <span className="text-blue-400 font-bold">{avatarSettings.borderRadius}%</span>
                        </Label>
                        <Slider
                          value={[avatarSettings.borderRadius]}
                          onValueChange={([value]) => onAvatarChange({ ...avatarSettings, borderRadius: Math.round(value) })}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAvatarChange({ ...avatarSettings, borderRadius: 0 })}
                            className="flex-1 text-xs"
                          >
                            مربع
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAvatarChange({ ...avatarSettings, borderRadius: 25 })}
                            className="flex-1 text-xs"
                          >
                            مستدير قليلاً
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAvatarChange({ ...avatarSettings, borderRadius: 50 })}
                            className="flex-1 text-xs"
                          >
                            دائري
                          </Button>
                        </div>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          الموضع
                        </Label>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">X: {avatarSettings.position?.x || 0}</Label>
                            <Slider
                              value={[avatarSettings.position?.x || 0]}
                              onValueChange={([value]) => onAvatarChange({ 
                                ...avatarSettings, 
                                position: { ...avatarSettings.position, x: value } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">Y: {avatarSettings.position?.y || 0}</Label>
                            <Slider
                              value={[avatarSettings.position?.y || 0]}
                              onValueChange={([value]) => onAvatarChange({ 
                                ...avatarSettings, 
                                position: { ...avatarSettings.position, y: value } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        {/* Quick Position Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(quickPositions.avatar).map(([key, position]) => (
                            <Button
                              key={key}
                              size="sm"
                              variant="outline"
                              onClick={() => onAvatarChange({ 
                                ...avatarSettings, 
                                position 
                              })}
                              className="text-xs"
                            >
                              {key === 'center' ? 'وسط' :
                               key === 'topLeft' ? 'أعلى يسار' :
                               key === 'topRight' ? 'أعلى يمين' :
                               key === 'bottomLeft' ? 'أسفل يسار' :
                               'أسفل يمين'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Text Settings */}
                <AccordionItem value="text" className="border border-gray-700/50 rounded-xl bg-gray-800/30">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Type className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">إعدادات النص</div>
                        <div className="text-gray-400 text-sm">
                          حجم {textSettings.fontSize} • {textSettings.fontFamily}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {/* Text Content Input */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">محتوى النص</Label>
                        <textarea
                          value={textSettings.content || ''}
                          onChange={(e) => onTextChange({ ...textSettings, content: e.target.value })}
                          placeholder="مرحباً {username}!\nأهلاً بك في {server}"
                          rows={3}
                          className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-xs text-gray-400 space-y-2">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                            <div className="text-blue-300 font-medium mb-1">📝 تنسيق النص:</div>
                            <div className="space-y-1">
                              <div>• السطر الأول: النص الرئيسي (حجم خط كبير)</div>
                              <div>• السطر الثاني: النص الفرعي (حجم خط أصغر)</div>
                              <div className="text-xs text-gray-500 mt-1">استخدم Enter للانتقال للسطر التالي</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-300 font-medium mb-1">متغيرات الديسكورد المتاحة:</div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <span>{'{username}'} - اسم المستخدم</span>
                              <span>{'{displayName}'} - الاسم المعروض</span>
                              <span>{'{server}'} - اسم الخادم</span>
                              <span>{'{member_count}'} - عدد الأعضاء</span>
                              <span>{'{joinDate}'} - تاريخ الانضمام</span>
                              <span>{'{memberNumber}'} - رقم العضو</span>
                            </div>
                          </div>
                        </div>
                      </div>
                       
                       <Separator className="bg-gray-600" />
                       
                        {/* Font Size */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            حجم النص الرئيسي
                          </span>
                          <span className="text-green-400 font-bold">{textSettings.fontSize}px</span>
                        </Label>
                        <Slider
                          value={[textSettings.fontSize]}
                          onValueChange={([value]) => onTextChange({ ...textSettings, fontSize: Math.round(value) })}
                          min={12}
                          max={72}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          {[16, 20, 24, 32, 48].map(size => (
                            <Button
                              key={size}
                              size="sm"
                              variant="outline"
                              onClick={() => onTextChange({ ...textSettings, fontSize: size })}
                              className="flex-1 text-xs"
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Sub Font Size */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            حجم النص الفرعي
                          </span>
                          <span className="text-blue-400 font-bold">{textSettings.subFontSize || textSettings.fontSize}px</span>
                        </Label>
                        <Slider
                          value={[textSettings.subFontSize || textSettings.fontSize]}
                          onValueChange={([value]) => onTextChange({ ...textSettings, subFontSize: Math.round(value) })}
                          min={8}
                          max={48}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          {[12, 14, 16, 18, 20].map(size => (
                            <Button
                              key={size}
                              size="sm"
                              variant="outline"
                              onClick={() => onTextChange({ ...textSettings, subFontSize: size })}
                              className="flex-1 text-xs"
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Font Family */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">نوع الخط</Label>
                        <Select
                          value={textSettings.fontFamily}
                          onValueChange={(value) => onTextChange({ ...textSettings, fontFamily: value })}
                        >
                          <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">لون النص</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={textSettings.color}
                            onChange={(e) => onTextChange({ ...textSettings, color: e.target.value })}
                            className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                          />
                          <Input
                            type="text"
                            value={textSettings.color}
                            onChange={(e) => onTextChange({ ...textSettings, color: e.target.value })}
                            className="flex-1 bg-gray-700 border-gray-600 text-white"
                            placeholder="#ffffff"
                          />
                        </div>
                        <div className="flex gap-2">
                          {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                            <Button
                              key={color}
                              size="sm"
                              variant="outline"
                              onClick={() => onTextChange({ ...textSettings, color })}
                              className="flex-1 h-8"
                              style={{ backgroundColor: color, opacity: 0.8 }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          الموضع
                        </Label>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">X: {textSettings.position?.x || 0}</Label>
                            <Slider
                              value={[textSettings.position?.x || 0]}
                              onValueChange={([value]) => onTextChange({ 
                                ...textSettings, 
                                position: { ...textSettings.position, x: value } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">Y: {textSettings.position?.y || 0}</Label>
                            <Slider
                              value={[textSettings.position?.y || 0]}
                              onValueChange={([value]) => onTextChange({ 
                                ...textSettings, 
                                position: { ...textSettings.position, y: value } 
                              })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        {/* Quick Position Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(quickPositions.text).map(([key, position]) => (
                            <Button
                              key={key}
                              size="sm"
                              variant="outline"
                              onClick={() => onTextChange({ 
                                ...textSettings, 
                                position 
                              })}
                              className="text-xs"
                            >
                              {key === 'center' ? 'وسط' :
                               key === 'top' ? 'أعلى' :
                               key === 'bottom' ? 'أسفل' :
                               key === 'left' ? 'يسار' :
                               'يمين'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Presets */}
                {presets.length > 0 && (
                  <AccordionItem value="presets" className="border border-gray-700/50 rounded-xl bg-gray-800/30">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Sparkles className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">الإعدادات المحفوظة</div>
                          <div className="text-gray-400 text-sm">
                            {presets.length} إعداد محفوظ
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {presets.map((preset) => (
                          <div key={preset.id} className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex-1">
                              <div className="text-white font-medium">{preset.name}</div>
                              <div className="text-gray-400 text-xs">
                                {new Date(preset.timestamp).toLocaleDateString('ar')}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => loadPreset(preset)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              تطبيق
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}