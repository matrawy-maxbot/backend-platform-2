"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { numberToHex, hexToNumber, DraggableRectanglesRef } from '@/app/(dashboard-pages)/members/components/canvas/preview/canvasPixi';

import { 
  Type,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
} from 'lucide-react';
import ColorPickerComponent, { ColorPickerComponentProps } from '@/components/ColorPickerComponent';

interface TextSettings {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  breakWords?: boolean;
  fontStyle?: 'normal' | 'bold' | 'italic';
  showBorder?: boolean;
  borderColor?: number;
  borderWidth?: number;
  specialist?: string;
  // إعدادات حاوية النص الجديدة
  containerWidth?: number;      // عرض الحاوية
  containerHeight?: number;     // ارتفاع الحاوية
}

interface QuickPositions {
  text: {
    [key: string]: { x: number; y: number };
  };
}

interface TextSettingsTriggerProps {
  layerId: string;
  textSettings: TextSettings;
  wrapperRef: React.RefObject<HTMLDivElement>;
  onTextChange: (settings: TextSettings) => void;
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

export default function TextSettingsTrigger({ 
  textSettings, 
  onTextChange,
  wrapperRef,
  layerId,
  canvasRef
}: TextSettingsTriggerProps) {
  
  // استخدام useRef للحفاظ على أحدث الإعدادات
  const latestSettingsRef = useRef<TextSettings>(textSettings);
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
    latestSettingsRef.current = textSettings;
  }, [textSettings]);

  const [localSettings, setLocalSettings] = useState<TextSettings>(textSettings);
  const [xValue, setXValue] = useState(textSettings.x);
  const [yValue, setYValue] = useState(textSettings.y);

  // تحديث الحالة المحلية عند تغيير البروبس
  useEffect(() => {
    setLocalSettings(textSettings);
    setXValue(textSettings.x);
    setYValue(textSettings.y);
  }, [textSettings]);

  // دالة محسنة للتحديث مع debounce
  const handleSettingChange = useCallback((updates: Partial<TextSettings>) => {
    const newSettings = {
      ...latestSettingsRef.current,
      ...updates
    };
    
    setLocalSettings(newSettings);
    latestSettingsRef.current = newSettings;
    
    // تحديث Canvas فوراً
    canvasRef.current?.updateTextSettings(layerId, newSettings);
    
    // إخطار المكون الأب
    // onTextChange(newSettings);
  }, [layerId/*, onTextChange*/, canvasRef]);

  // دالة مع debounce خاصة للسلايدر
  const debouncedHandleChange = useDebounce(handleSettingChange, 1);

  // معالجة أحداث Canvas
  const handleMouseUp = useCallback((e: any) => {
    const elementSettings = canvasRef.current?.getSelectedElement(e.id);
    
    if (elementSettings?.settings) {
      const newSettings = {
        ...latestSettingsRef.current,
        x: elementSettings.settings.x,
        y: elementSettings.settings.y,
        fontSize: elementSettings.settings.fontSize,
        containerWidth: elementSettings.settings.containerWidth,
        containerHeight: elementSettings.settings.containerHeight,
      };
      
      setLocalSettings(newSettings);
      latestSettingsRef.current = newSettings;
      setXValue(newSettings.x);
      setYValue(newSettings.y);
      
      // onTextChange(newSettings);
    }
  }, [canvasRef/*, onTextChange*/]);

  const handleElementResize = useCallback((e: any) => {
    console.log('resize !!!!!!!!!!!$$$$$$$$$$$^^^^^^^^^^^ :: ', e);
    const elementSettings = canvasRef.current?.getSelectedElement(e.id);
    console.log('elementSettings :: ', elementSettings);
    
    if (elementSettings?.settings) {
      const newSettings = {
        ...latestSettingsRef.current,
        x: elementSettings.settings.x,
        y: elementSettings.settings.y,
        fontSize: elementSettings.settings.fontSize,
        containerWidth: elementSettings.settings.containerWidth,
        containerHeight: elementSettings.settings.containerHeight,
      };
      
      setLocalSettings(newSettings);
      latestSettingsRef.current = newSettings;
      setXValue(newSettings.x);
      setYValue(newSettings.y);
      
      // onTextChange(newSettings);
    }
  }, [canvasRef/*, onTextChange*/]);

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

  const handleTextAlignChange = useCallback((align: 'left' | 'center' | 'right') => {
    handleSettingChange({ align });
  }, [handleSettingChange]);

  const handleFontStyleChange = useCallback((style: 'normal' | 'bold' | 'italic') => {
    handleSettingChange({ fontStyle: style });
  }, [handleSettingChange]);

  const handleColorChange = useCallback((hexColor: string) => {
    setSelectedColor(hexColor);
    const colorNumber = hexToNumber(hexColor);
    if (!isNaN(colorNumber)) {
      handleSettingChange({ color: colorNumber });
    }
  }, [handleSettingChange]);

  const handleBorderColorChange = useCallback((hexColor: string) => {
    const colorNumber = hexToNumber(hexColor);
    if (!isNaN(colorNumber)) {
      handleSettingChange({ borderColor: colorNumber });
    }
  }, [handleSettingChange]);

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS',
    'Tahoma',
    'Arial Arabic',
    'Traditional Arabic'
  ];

  const quickColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const getXdifference = useCallback(() => {
    console.log(canvasRef.current?.getCanvasDimensions().width, canvasRef.current.getTextSettings(layerId)?.containerWidth, (canvasRef.current?.getCanvasDimensions().width - (canvasRef.current.getTextSettings(layerId)?.containerWidth || 0)) / 2);
    return ((canvasRef.current?.getCanvasDimensions().width - (canvasRef.current.getTextSettings(layerId)?.containerWidth || 0)) / 2);
  }, [canvasRef, canvasRef.current.getTextSettings(layerId)]);

  const getYdifference = useCallback(() => {
    console.log(canvasRef.current?.getCanvasDimensions().height, canvasRef.current.getTextSettings(layerId)?.containerHeight, (canvasRef.current?.getCanvasDimensions().height - (canvasRef.current.getTextSettings(layerId)?.containerHeight || 0)) / 2);
    return ((canvasRef.current?.getCanvasDimensions().height - (canvasRef.current.getTextSettings(layerId)?.containerHeight || 0)) / 2);
  }, [canvasRef, canvasRef.current.getTextSettings(layerId)]);

  const quickPositions = {
    center: { x: canvasRef.current?.getCanvasDimensions().width / 2 || 0, y: canvasRef.current?.getCanvasDimensions().height / 2 || 0 },
    topLeft: { x: (canvasRef.current?.getCanvasDimensions().width / 2) - getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) - getYdifference() || 0 },
    topRight: { x: (canvasRef.current?.getCanvasDimensions().width / 2) + getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) - getYdifference() || 0 },
    bottomLeft: { x: (canvasRef.current?.getCanvasDimensions().width / 2) - getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) + getYdifference() || 0 },
    bottomRight: { x: (canvasRef.current?.getCanvasDimensions().width / 2) + getXdifference() || 0, y: (canvasRef.current?.getCanvasDimensions().height / 2) + getYdifference() || 0 }
  };

  return (
    <AccordionItem value={layerId || "text"} className="border border-gray-700/50 rounded-xl bg-gray-800/30">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Type className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-right">
            <div className="text-white font-medium">إعدادات النص</div>
            <div className="text-gray-400 text-sm">
              حجم {localSettings.fontSize} • {localSettings.fontFamily}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4" ref={bottomPaddingRef}>

          {/* Text Content Input */}
          <div className="space-y-2">
            <Label className="text-gray-300">محتوى النص</Label>
            <textarea
              value={localSettings.text}
              onChange={(e) => handleSettingChange({ text: e.target.value })}
              placeholder="مرحباً {username}!\nأهلاً بك في {server}"
              rows={3}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="text-xs text-gray-400 space-y-2">
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

          {/* Font Size - Main Text */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                حجم النص الرئيسي
              </span>
              <span className="text-green-400 font-bold">{localSettings.fontSize}px</span>
            </Label>
            <Slider
              value={[localSettings.fontSize || 16]}
              onValueChange={([value]) => {
                debouncedHandleChange({ fontSize: Math.round(value) });
              }}
              min={12}
              max={72}
              step={1}
              className="w-full"
            />
            <div className="flex gap-2 flex-wrap">
              {[16, 20, 24, 32, 48].map(size => (
                <Button
                  key={size}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSettingChange({ fontSize: size })}
                  className="flex-1 min-w-[50px] text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Font Family and Style */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-300">نوع الخط</Label>
              <Select
                value={localSettings.fontFamily}
                onValueChange={(value) => handleSettingChange({ fontFamily: value })}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                  {fontFamilies.map(font => (
                    <SelectItem key={font} value={font} className="text-white hover:bg-gray-600">
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-gray-300">لون النص</Label>
            <div className="flex gap-2" ref={colorPickerParentRef}>
              <ColorPickerComponent
                value={selectedColor}
                onChange={handleColorChange}
                label=""
                showAlpha={false}
                showManualInput={true}
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <Label className="text-gray-300">المحاذاة</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={localSettings.align === 'left' ? 'default' : 'outline'}
                onClick={() => handleTextAlignChange('left')}
                className="flex-1"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={localSettings.align === 'center' ? 'default' : 'outline'}
                onClick={() => handleTextAlignChange('center')}
                className="flex-1"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={localSettings.align === 'right' ? 'default' : 'outline'}
                onClick={() => handleTextAlignChange('right')}
                className="flex-1"
              >
                <AlignRight className="h-4 w-4" />
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
                  max={550}
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
              const defaultSettings: TextSettings = {
                x: 0,
                y: 0,
                text: 'مرحباً {username}!\nأهلاً بك في {server}',
                fontSize: 24,
                fontFamily: 'Arial',
                color: hexToNumber('#ffffff'),
                maxWidth: 400,
                align: 'center',
                breakWords: true,
                fontStyle: 'normal',
                showBorder: false,
                borderColor: hexToNumber('#000000'),
                borderWidth: 1,
                specialist: ''
              };
              setLocalSettings(defaultSettings);
              // onTextChange(defaultSettings);
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