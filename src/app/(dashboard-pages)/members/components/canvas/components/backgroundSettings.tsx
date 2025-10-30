// backgroundSettings.tsx
"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DraggableRectanglesRef } from '@/app/(dashboard-pages)/members/components/canvas/preview/canvasPixi';
import { 
  Palette,
  Eye,
  Sun,
  Contrast,
  Move,
  X,
  Image,
  Droplets,
  Square,
} from 'lucide-react';
import ColorPickerComponent from '@/components/ColorPickerComponent';


interface BackgroundSettings {
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

interface BackgroundSettingsTriggerProps {
  layerId: string;
  backgroundSettings: BackgroundSettings;
  wrapperRef: React.RefObject<HTMLDivElement>;
  onBackgroundChange: (settings: BackgroundSettings) => void;
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

export default function BackgroundSettingsTrigger({ 
  backgroundSettings, 
  onBackgroundChange, 
  wrapperRef,
  layerId,
  canvasRef
}: BackgroundSettingsTriggerProps) {
  
  // استخدام useRef للحفاظ على أحدث الإعدادات بدون إعادة render
  const latestSettingsRef = useRef<BackgroundSettings>(backgroundSettings);
  const colorPickerParentRef = useRef<HTMLDivElement>(null);
  const bottomPaddingRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState('#ffffff');
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
  }, [wrapperRef.current, colorPickerParentRef.current, bottomPaddingRef.current, layerId]);
  
  // تحديث المرجع عندما تتغير الـ props
  useEffect(() => {
    latestSettingsRef.current = backgroundSettings;
  }, [backgroundSettings]);

  const [localSettings, setLocalSettings] = useState<BackgroundSettings>(backgroundSettings);
  const [widthValue, setWidthValue] = useState(backgroundSettings.width);
  const [heightValue, setHeightValue] = useState(backgroundSettings.height);
  const [xValue, setXValue] = useState(backgroundSettings.x);
  const [yValue, setYValue] = useState(backgroundSettings.y);

  // تحديث الحالة المحلية عند تغيير البروبس
  useEffect(() => {
    setLocalSettings(backgroundSettings);
    setWidthValue(backgroundSettings.width);
    setHeightValue(backgroundSettings.height);
    setXValue(backgroundSettings.x);
    setYValue(backgroundSettings.y);
  }, [backgroundSettings]);

  // دالة محسنة للتحديث مع debounce للسلايدر
  const handleSettingChange = useCallback((updates: Partial<BackgroundSettings>) => {
    const newSettings = {
      ...latestSettingsRef.current,
      ...updates
    };
    
    setLocalSettings(newSettings);
    latestSettingsRef.current = newSettings;
    
    // تحديث Canvas فوراً
    canvasRef.current?.updateRectangleSettings(layerId, newSettings);
    
    // إخطار المكون الأب
    // onBackgroundChange(newSettings);
  }, [layerId/*, onBackgroundChange*/, canvasRef]);

  // دالة مع debounce خاصة للسلايدر
  const debouncedHandleChange = useDebounce(handleSettingChange, 1);

  // تحويل رقم اللون إلى HEX للعرض
  const numberToHex = useCallback((color: number): string => {
    return `#${color.toString(16).padStart(6, '0')}`;
  }, []);

  // تحويل لون HEX إلى رقم
  const hexToNumber = useCallback((hex: string): number => {
    if (!hex || !hex.startsWith('#')) return 0xd0d4d8;
    const hexValue = hex.replace('#', '');
    return parseInt(hexValue, 16);
  }, []);

  // معالجة تغيير اللون من المكون الجديد
  const handleColorChange = useCallback((hexColor: string) => {
    setSelectedColor(hexColor);
    const colorNumber = hexToNumber(hexColor);
    if (!isNaN(colorNumber)) {
      handleSettingChange({ color: colorNumber });
    }
  }, [handleSettingChange]);

  // انقل الدوال هنا خارج الـ useEffect
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
      
      // onBackgroundChange(newSettings);
    }
  }, [canvasRef/*, onBackgroundChange*/]);

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
      
      // onBackgroundChange(newSettings);
    }
  }, [canvasRef/*, onBackgroundChange*/]);

  // تطبيق debounce على resize بمدة 100ms
  const debouncedResizeHandler = useDebounce(handleElementResize, 100);

  // ثم الـ useEffect يصبح هكذا:
  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.onMouseUp(handleMouseUp);
    canvasRef.current.onElementResize(debouncedResizeHandler);

  }, [canvasRef, handleMouseUp, debouncedResizeHandler]);

  const handleImageUpload = useCallback((file: File) => {
    const newSettings = { 
      ...latestSettingsRef.current, 
      imageFile: file,
      imageUrl: undefined
    };
    
    setLocalSettings(newSettings);
    latestSettingsRef.current = newSettings;
    // onBackgroundChange(newSettings);
    canvasRef.current?.setRectangleImageFromFile(layerId, file);
  }, [layerId/*, onBackgroundChange*/, canvasRef]);

  const getXdifference = useCallback(() => {
    console.log(canvasRef.current?.getCanvasDimensions().width, widthValue, (canvasRef.current?.getCanvasDimensions().width - widthValue) / 2);
    return ((canvasRef.current?.getCanvasDimensions().width - widthValue) / 2);
  }, [canvasRef, widthValue]);

  const getYdifference = useCallback(() => {
    console.log(canvasRef.current?.getCanvasDimensions().height, heightValue, (canvasRef.current?.getCanvasDimensions().height - heightValue) / 2);
    return ((canvasRef.current?.getCanvasDimensions().height - heightValue) / 2);
  }, [canvasRef, heightValue]);

  const quickPositions = [
    { name: 'وسط', x: canvasRef.current?.getCanvasDimensions().width / 2 || 0, y: canvasRef.current?.getCanvasDimensions().height / 2 || 0 },
    { name: 'أعلى يسار', x: (canvasRef.current?.getCanvasDimensions().width / 2) - getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) - getYdifference() || 0 },
    { name: 'أعلى يمين', x: (canvasRef.current?.getCanvasDimensions().width / 2) + getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) - getYdifference() || 0 },
    { name: 'أسفل يسار', x: (canvasRef.current?.getCanvasDimensions().width / 2) - getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) + getYdifference() || 0 },
    { name: 'أسفل يمين', x: (canvasRef.current?.getCanvasDimensions().width / 2) + getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) + getYdifference() || 0 }
  ];

  return (
    <AccordionItem value={layerId || "background"} className="border border-gray-700/50 rounded-xl bg-gray-800/30">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Palette className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-right">
            <div className="text-white font-medium">إعدادات الخلفية</div>
            <div className="text-gray-400 text-sm">
              {localSettings.imageUrl || localSettings.imageFile ? 'صورة' : 'لون'} • شفافية {(localSettings.opacity || 1) * 100}%
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4" ref={bottomPaddingRef}>
        <div className="space-y-4">

          {/* لون الخلفية */}
          <div className="space-y-2">
            <div className="flex gap-2" ref={colorPickerParentRef}>
              <ColorPickerComponent
                value={selectedColor}
                onChange={handleColorChange}
                label="Color"
                showManualInput={true}
              />
            </div>
          </div>

          {/* الأبعاد */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Square className="h-4 w-4" />
                العرض
              </Label>
              <Input
                type="number"
                value={widthValue}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value) || 0;
                  setWidthValue(newWidth);
                  handleSettingChange({ width: newWidth });
                }}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Square className="h-4 w-4" />
                الارتفاع
              </Label>
              <Input
                type="number"
                value={heightValue}
                onChange={(e) => {
                  const newHeight = parseInt(e.target.value) || 0;
                  setHeightValue(newHeight);
                  handleSettingChange({ height: newHeight });
                }}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* زوايا دائرية */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                زوايا دائرية
              </span>
              <span className="text-purple-400 font-bold">{localSettings.cornerRadius}%</span>
            </Label>
            <Slider
              value={[localSettings.cornerRadius]}
              onValueChange={([value]) => {
                debouncedHandleChange({ cornerRadius: Math.round(value) });
              }}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                الشفافية
              </span>
              <span className="text-purple-400 font-bold">{(localSettings.opacity || 1) * 100}%</span>
            </Label>
            <Slider
              value={[localSettings.opacity || 1]}
              onValueChange={([value]) => {
                debouncedHandleChange({ opacity: parseFloat(value.toString()) });
              }}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* الفلاتر - كما كانت ولكن محسنة الأداء */}
          <div className="space-y-3 border-t border-gray-600 pt-3">
            <Label className="text-gray-300 text-lg">الفلاتر</Label>
            
            {/* Brightness */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  السطوع
                </span>
                <span className="text-purple-400 font-bold">{((localSettings.filters?.brightness || 1) * 100).toFixed(0)}%</span>
              </Label>
              <Slider
                value={[localSettings.filters?.brightness || 1]}
                onValueChange={([value]) => {
                  debouncedHandleChange({
                    filters: {
                      ...localSettings.filters,
                      brightness: parseFloat(value.toString())
                    }
                  });
                }}
                min={0}
                max={3}
                step={0.01}
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
                <span className="text-purple-400 font-bold">{((localSettings.filters?.contrast || 1) * 100).toFixed(0)}%</span>
              </Label>
              <Slider
                value={[localSettings.filters?.contrast || 1]}
                onValueChange={([value]) => {
                  debouncedHandleChange({
                    filters: {
                      ...localSettings.filters,
                      contrast: parseFloat(value.toString())
                    }
                  });
                }}
                min={0}
                max={3}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  التشبع
                </span>
                <span className="text-purple-400 font-bold">{((localSettings.filters?.saturation || 1) * 100).toFixed(0)}%</span>
              </Label>
              <Slider
                value={[localSettings.filters?.saturation || 1]}
                onValueChange={([value]) => {
                  debouncedHandleChange({
                    filters: {
                      ...localSettings.filters,
                      saturation: parseFloat(value.toString())
                    }
                  });
                }}
                min={0}
                max={3}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Blur */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  التمويه
                </span>
                <span className="text-purple-400 font-bold">{localSettings.filters?.blur || 0}px</span>
              </Label>
              <Slider
                value={[localSettings.filters?.blur || 0]}
                onValueChange={([value]) => {
                  debouncedHandleChange({
                    filters: {
                      ...localSettings.filters,
                      blur: Math.round(value)
                    }
                  });
                }}
                min={0}
                max={50}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Hue */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  درجة اللون
                </span>
                <span className="text-purple-400 font-bold">{localSettings.filters?.hue || 0}°</span>
              </Label>
              <Slider
                value={[localSettings.filters?.hue || 0]}
                onValueChange={([value]) => {
                  debouncedHandleChange({
                    filters: {
                      ...localSettings.filters,
                      hue: Math.round(value)
                    }
                  });
                }}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Background Image Upload */}
          <div className="space-y-3 border-t border-gray-600 pt-3">
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
              
              {(localSettings.imageUrl || localSettings.imageFile) && (
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">نمط العرض</Label>
                  <Select
                    value={localSettings.imageFit}
                    onValueChange={(value: 'fill' | 'cover' | 'contain') => 
                      handleSettingChange({ imageFit: value })
                    }
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
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-3 border-t border-gray-600 pt-3">
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
              {quickPositions.map((pos) => (
                <Button
                  key={pos.name}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSettingChange({ 
                    x: pos.x, 
                    y: pos.y 
                  })}
                  className="text-xs"
                >
                  {pos.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={() => {
              const defaultSettings:BackgroundSettings = {
                x: 0,
                y: 0,
                color: 0xd0d4d8,
                width: 400,
                height: 300,
                cornerRadius: 0,
                text: '',
                imageUrl: undefined,
                imageFile: undefined,
                imageFit: 'cover',
                showBorder: false,
                borderColor: 0xffff00,
                borderWidth: 0,
                specialist: '',
                opacity: 1,
                filters: {
                  blur: 0,
                  brightness: 1,
                  contrast: 1,
                  saturation: 1,
                  hue: 0,
                }
              };
              setLocalSettings(defaultSettings);
              // onBackgroundChange(defaultSettings);
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