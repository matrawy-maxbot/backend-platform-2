"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DraggableRectanglesRef } from '@/app/(dashboard-pages)/members/components/canvas/preview/canvasPixi';
import { 
  User,
  ZoomIn,
  Move,
  Circle,
  X,
  Image,
  Square,
  Circle as CircleIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import ColorPickerComponent from '@/components/ColorPickerComponent';

interface AvatarSettings {
  x: number;
  y: number;
  color: number;
  width: number;
  height: number;
  cornerRadius: number;
  text?: string;
  imageUrl?: string;
  imageFile?: File;
  imageFit?: 'fill' | 'cover' | 'contain';
  showBorder?: boolean;
  borderColor?: number;
  borderWidth?: number;
  specialist?: string;
  opacity?: number;
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
}

interface QuickPositions {
  avatar: {
    [key: string]: { x: number; y: number };
  };
}

interface AvatarSettingsTriggerProps {
  layerId: string;
  avatarSettings: AvatarSettings;
  wrapperRef: React.RefObject<HTMLDivElement>;
  onAvatarChange: (settings: AvatarSettings) => void;
  canvasRef: React.RefObject<DraggableRectanglesRef>;
}

// دالة debounce لتحسين أداء السلايدر
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export default function AvatarSettingsTrigger({ 
  avatarSettings, 
  onAvatarChange, 
  wrapperRef,
  layerId,
  canvasRef
}: AvatarSettingsTriggerProps) {
  
  // استخدام useRef للحفاظ على أحدث الإعدادات
  const latestSettingsRef = useRef<AvatarSettings>(avatarSettings);
  const colorPickerParentRef = useRef<HTMLDivElement>(null);
  const bottomPaddingRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  
  // تحديث المرجع عندما تتغير الـ props
  useEffect(() => {
    latestSettingsRef.current = avatarSettings;
  }, [avatarSettings]);

  const [localSettings, setLocalSettings] = useState<AvatarSettings>(avatarSettings);
  const [widthValue, setWidthValue] = useState(avatarSettings.width);
  const [heightValue, setHeightValue] = useState(avatarSettings.height);
  const [xValue, setXValue] = useState(avatarSettings.x);
  const [yValue, setYValue] = useState(avatarSettings.y);

  useEffect(() => {
    if (wrapperRef.current && colorPickerParentRef.current) {
      const requiredSpace = colorPickerParentRef.current?.offsetTop + colorPickerParentRef.current?.clientHeight + 370;
      const realSpace = wrapperRef.current?.clientHeight + wrapperRef.current?.offsetTop;
      if(realSpace < (requiredSpace + 20)) {
        bottomPaddingRef.current?.style.setProperty('padding-bottom', Math.floor(((requiredSpace + 20) - realSpace)).toString() + 'px');
      } else {
        bottomPaddingRef.current?.style.setProperty('padding-bottom', '0px');
      }
      console.log("hihihihihhi :::::: ", requiredSpace, realSpace, realSpace > (requiredSpace + 20));
    }
  }, [wrapperRef.current, colorPickerParentRef.current, bottomPaddingRef.current, localSettings.showBorder, layerId]);

  // تحديث الحالة المحلية عند تغيير البروبس
  useEffect(() => {
    setLocalSettings(avatarSettings);
    setWidthValue(avatarSettings.width);
    setHeightValue(avatarSettings.height);
    setXValue(avatarSettings.x);
    setYValue(avatarSettings.y);
  }, [avatarSettings]);

  // دالة محسنة للتحديث مع debounce
  const handleSettingChange = useCallback((updates: Partial<AvatarSettings>) => {
    const newSettings = {
      ...latestSettingsRef.current,
      ...updates
    };
    
    setLocalSettings(newSettings);
    latestSettingsRef.current = newSettings;
    
    // تحديث Canvas فوراً
    canvasRef.current?.updateRectangleSettings(layerId, newSettings);
    
    // إخطار المكون الأب
    // onAvatarChange(newSettings);
  }, [layerId/*, onAvatarChange*/, canvasRef]);

  // دالة مع debounce خاصة للسلايدر
  const debouncedHandleChange = useDebounce(handleSettingChange, 1);

  // دالة لتحويل الألوان من number إلى hex string
  const numberToHexColor = useCallback((color: number): string => {
    return `#${color.toString(16).padStart(6, '0')}`;
  }, []);

  const hexColorToNumber = useCallback((hex: string): number => {
    return parseInt(hex.replace('#', ''), 16);
  }, []);

  // معالجة أحداث Canvas
  const handleMouseUp = useCallback((e: any) => {
    const elementSettings = canvasRef.current?.getSelectedElement(e.id);
    
    if (elementSettings?.settings) {
      const newSettings = {
        ...latestSettingsRef.current,
        x: elementSettings.settings.x,
        y: elementSettings.settings.y,
        width: elementSettings.settings.width,
        height: elementSettings.settings.height,
      };
      
      setLocalSettings(newSettings);
      latestSettingsRef.current = newSettings;
      setWidthValue(newSettings.width);
      setHeightValue(newSettings.height);
      setXValue(newSettings.x);
      setYValue(newSettings.y);
      
      // onAvatarChange(newSettings);
    }
  }, [canvasRef/*, onAvatarChange*/]);

  const handleElementResize = useCallback((e: any) => {
    const elementSettings = canvasRef.current?.getSelectedElement(e.id);
    
    if (elementSettings?.settings) {
      const newSettings = {
        ...latestSettingsRef.current,
        x: elementSettings.settings.x,
        y: elementSettings.settings.y,
        width: elementSettings.settings.width,
        height: elementSettings.settings.height,
      };
      
      setLocalSettings(newSettings);
      latestSettingsRef.current = newSettings;
      setWidthValue(newSettings.width);
      setHeightValue(newSettings.height);
      setXValue(newSettings.x);
      setYValue(newSettings.y);
      
      // onAvatarChange(newSettings);
    }
  }, [canvasRef/*, onAvatarChange*/]);

  // تطبيق debounce على resize
  const debouncedResizeHandler = useDebounce(handleElementResize, 100);

  // الاشتراك في أحداث Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.onMouseUp(handleMouseUp);
    canvasRef.current.onElementResize(debouncedResizeHandler);

    return () => {
      // تنظيف الـ event listeners إذا لزم الأمر
    };
  }, [canvasRef, handleMouseUp, debouncedResizeHandler]);

  const handleImageUpload = useCallback((file: File) => {
    const newSettings = { 
      ...latestSettingsRef.current, 
      imageFile: file,
      imageUrl: undefined
    };
    
    setLocalSettings(newSettings);
    latestSettingsRef.current = newSettings;
    // onAvatarChange(newSettings);
    canvasRef.current?.setRectangleImageFromFile(layerId, file);
  }, [layerId/*, onAvatarChange*/, canvasRef]);

  const quickShapes = [
    { name: 'مربع', value: 0, icon: <Square className="h-4 w-4" /> },
    { name: 'مستدير قليلاً', value: 15, icon: <Circle className="h-4 w-4" /> },
    { name: 'دائري', value: 50, icon: <CircleIcon className="h-4 w-4" /> }
  ];

  const quickSizes = [80, 100, 120, 150, 200];

  const handleColorChange = useCallback((hexColor: string) => {
    setSelectedColor(hexColor);
    const colorNumber = hexColorToNumber(hexColor);
    if (!isNaN(colorNumber)) {
      handleSettingChange({ borderColor: colorNumber });
    }
  }, [handleSettingChange]);

  const getXdifference = useCallback(() => {
    console.log(canvasRef.current?.getCanvasDimensions().width, widthValue, (canvasRef.current?.getCanvasDimensions().width - widthValue) / 2);
    return ((canvasRef.current?.getCanvasDimensions().width - widthValue) / 2);
  }, [canvasRef, widthValue]);

  const getYdifference = useCallback(() => {
    console.log(canvasRef.current?.getCanvasDimensions().height, heightValue, (canvasRef.current?.getCanvasDimensions().height - heightValue) / 2);
    return ((canvasRef.current?.getCanvasDimensions().height - heightValue) / 2);
  }, [canvasRef, heightValue]);

  const quickPositions = {
    center: { x: canvasRef.current?.getCanvasDimensions().width / 2 || 0, y: canvasRef.current?.getCanvasDimensions().height / 2 || 0 },
    topLeft: { x: (canvasRef.current?.getCanvasDimensions().width / 2) - getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) - getYdifference() || 0 },
    topRight: { x: (canvasRef.current?.getCanvasDimensions().width / 2) + getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) - getYdifference() || 0 },
    bottomLeft: { x: (canvasRef.current?.getCanvasDimensions().width / 2) - getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) + getYdifference() || 0 },
    bottomRight: { x: (canvasRef.current?.getCanvasDimensions().width / 2) + getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) + getYdifference() || 0 }
  };

  return (
    <AccordionItem value={layerId || "avatar"} className="border border-gray-700/50 rounded-xl bg-gray-800/30">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-right">
            <div className="text-white font-medium">إعدادات الصورة الشخصية</div>
            <div className="text-gray-400 text-sm">
              حجم {localSettings.width}×{localSettings.height} • استدارة {localSettings.cornerRadius}%
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4" ref={bottomPaddingRef}>
        <div className="space-y-4">

          {/* Avatar Image Upload */}
          <div className="space-y-3">
            <Label className="text-gray-300 flex items-center gap-2">
              <Image className="h-4 w-4" />
              صورة الشخصية
            </Label>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-white flex-1 text-sm"
                />
                {(localSettings.imageUrl || localSettings.imageFile) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSettingChange({ 
                      imageUrl: undefined,
                      imageFile: undefined 
                    })}
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                الحجم
              </span>
              <span className="text-blue-400 font-bold">{localSettings.width}×{localSettings.height}</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm">العرض: {widthValue}px</Label>
                <Slider
                  value={[widthValue]}
                  onValueChange={([value]) => {
                    setWidthValue(value);
                    handleSettingChange({ width: value });
                  }}
                  min={50}
                  max={300}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm">الارتفاع: {heightValue}px</Label>
                <Slider
                  value={[heightValue]}
                  onValueChange={([value]) => {
                    setHeightValue(value);
                    handleSettingChange({ height: value });
                  }}
                  min={50}
                  max={300}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {quickSizes.map(size => (
                <Button
                  key={size}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSettingChange({ width: size, height: size })}
                  className="flex-1 min-w-[60px] text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Corner Radius */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                الاستدارة
              </span>
              <span className="text-blue-400 font-bold">{localSettings.cornerRadius}%</span>
            </Label>
            <Slider
              value={[localSettings.cornerRadius]}
              onValueChange={([value]) => {
                debouncedHandleChange({ cornerRadius: Math.round(value) });
              }}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex gap-2">
              {quickShapes.map(shape => (
                <Button
                  key={shape.value}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSettingChange({ cornerRadius: shape.value })}
                  className="flex-1 text-xs flex items-center gap-1"
                >
                  {shape.icon}
                  <span>{shape.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                الشفافية
              </span>
              <span className="text-blue-400 font-bold">{(localSettings.opacity || 1) * 100}%</span>
            </Label>
            <Slider
              value={[localSettings.opacity || 1]}
              onValueChange={([value]) => {
                debouncedHandleChange({ opacity: parseFloat(value.toString()) });
              }}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Border Settings */}
          <div className="space-y-3">
            <Label className="text-gray-300 flex items-center gap-2">
              <Square className="h-4 w-4" />
              إعدادات الإطار
            </Label>
            
            <div className="flex items-center gap-3 mb-3">
              <Label className="text-gray-300 text-sm flex items-center gap-2">
                إظهار الإطار:
                <Button
                  size="sm"
                  variant={localSettings.showBorder ? "default" : "outline"}
                  onClick={() => handleSettingChange({ showBorder: !localSettings.showBorder })}
                  className="h-8"
                >
                  {localSettings.showBorder ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </Label>
            </div>

            {localSettings.showBorder && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm">سمك الإطار: {localSettings.borderWidth}px</Label>
                  <Slider
                    value={[localSettings.borderWidth || 1]}
                    onValueChange={([value]) => {
                      debouncedHandleChange({ borderWidth: Math.round(value) });
                    }}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2" ref={colorPickerParentRef}>
                  <Label className="text-gray-400 text-sm">لون الإطار</Label>
                  <ColorPickerComponent
                    value={selectedColor}
                    onChange={handleColorChange}
                    showAlpha={false}
                    label=""
                    showManualInput={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Position */}
          <div className="space-y-3">
            <Label className="text-gray-300 flex items-center gap-2">
              <Move className="h-4 w-4" />
              الموضع
            </Label>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm">X: {xValue}</Label>
                <Slider
                  value={[xValue]}
                  onValueChange={([value]) => {
                    setXValue(value);
                    handleSettingChange({ x: value });
                  }}
                  min={0}
                  max={550}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm">Y: {yValue}</Label>
                <Slider
                  value={[yValue]}
                  onValueChange={([value]) => {
                    setYValue(value);
                    handleSettingChange({ y: value });
                  }}
                  min={0}
                  max={350}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Quick Position Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(quickPositions).map(([key, position]) => (
                <Button
                  key={key}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSettingChange(position)}
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

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={() => {
              const defaultSettings: AvatarSettings = {
                x: 0,
                y: 0,
                color: 0xFFFFFF,
                width: 120,
                height: 120,
                cornerRadius: 0,
                text: '',
                imageUrl: undefined,
                imageFile: undefined,
                imageFit: 'cover',
                showBorder: false,
                borderColor: 0x000000,
                borderWidth: 1,
                specialist: '',
                opacity: 1,
                filters: {
                  blur: 0,
                  brightness: 1,
                  contrast: 1,
                  saturation: 1,
                  hue: 0
                }
              };
              setLocalSettings(defaultSettings);
              // onAvatarChange(defaultSettings);
            }}
            className="w-full border-gray-600 text-gray-300 hover:text-white mt-4"
          >
            إعادة تعيين الإعدادات
          </Button>

        </div>
      </AccordionContent>
    </AccordionItem>
  );
};