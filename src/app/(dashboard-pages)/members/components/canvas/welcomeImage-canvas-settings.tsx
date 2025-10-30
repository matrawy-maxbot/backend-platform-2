// file : CanvasSettings.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion } from '@/components/ui/accordion';
import { 
  Smartphone,
  Save,
  Wand2,
  RefreshCw,
  Layers,
  Image,
  User,
  Type,
  Plus,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Edit3,
  X
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

import CanvasDimensionsTrigger from './components/canvasDimensions';
import LayersPanelTrigger from './components/layersPanel';
import BackgroundSettingsTrigger from './components/backgroundSettings';
import AvatarSettingsTrigger from './components/avatarSettings';
import TextSettingsTrigger from './components/textSettings';

import sharp from 'sharp';

// استيراد المكون الجديد
import DraggableRectangles, { DraggableRectanglesRef, LayerElement, RectangleSettings, TextSettings } from './preview/canvasPixi';

interface DimensionWindowProps {
  onClose: () => void;
  onSelect?: (option: any) => void;
}

const DimensionWindow: React.FC<DimensionWindowProps> = ({ onClose, onSelect }) => {
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const dimensionOptions = [
    {
      id: '1',
      title: 'Square Small',
      width: 350,
      height: 350,
      icon: '⬜',
      aspectRatio: '1:1'
    },
    {
      id: '2',
      title: 'Landscape Wide',
      width: 550,
      height: 309,
      icon: '🏞️',
      aspectRatio: '16:9'
    },
    {
      id: '3',
      title: 'Portrait Tall',
      width: 292,
      height: 350,
      icon: '📱',
      aspectRatio: '5:6'
    },
    {
      id: '4',
      title: 'Classic 4:3',
      width: 467,
      height: 350,
      icon: '📺',
      aspectRatio: '4:3'
    },
    {
      id: '5',
      title: 'Banner Wide',
      width: 550,
      height: 183,
      icon: '📊',
      aspectRatio: '3:1'
    },
    {
      id: '6',
      title: 'Cinematic',
      width: 550,
      height: 236,
      icon: '🎬',
      aspectRatio: '21:9'
    },
    {
      id: '7',
      title: 'Square Medium',
      width: 450,
      height: 450,
      icon: '🔲',
      aspectRatio: '1:1'
    }
  ];

  const getAspectRatioClass = (aspectRatio: string) => {
    const sizes = {
      '1:1': 'w-6 h-6',
      '16:9': 'w-8 h-5',
      '5:6': 'w-5 h-7',
      '4:3': 'w-7 h-6',
      '3:1': 'w-9 h-4',
      '21:9': 'w-9 h-4',
      '2:3': 'w-5 h-7'
    };
    return sizes[aspectRatio as keyof typeof sizes] || 'w-6 h-6';
  };

  const handleDimensionSelect = (option: any) => {
    if (onSelect) {
      onSelect(option);
    }
    onClose();
  };

  const handleCustomDimensionSubmit = () => {
    const widthNum = parseInt(customWidth);
    const heightNum = parseInt(customHeight);
    
    if (customWidth && customHeight && widthNum > 0 && heightNum > 0) {
      const customOption = {
        id: 'custom',
        title: 'أبعاد مخصصة',
        dimensions: `${widthNum} x ${heightNum} px`,
        dpi: '',
        icon: '🎯',
        aspectRatio: widthNum === heightNum ? 'square' : (widthNum > heightNum ? 'landscape' : 'portrait'),
        width: widthNum,
        height: heightNum
      };
      
      if (onSelect) {
        onSelect(customOption);
      }
    }
    onClose();
  };

  return (
    <div 
      className="fixed left-0 top-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2"
      onClick={onClose}
    >
      <div 
        className="fixed bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 w-full max-w-2xl max-h-[75vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">اختر الأبعاد</h2>
          <button 
            className="text-gray-400 hover:text-white transition-colors text-lg p-1 hover:bg-gray-700/30 rounded"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
          {dimensionOptions.map((option) => (
            <div
               key={option.id}
               onClick={() => handleDimensionSelect(option)}
               className="group cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 rounded-md p-3 transition-all duration-200 hover:scale-105 w-full max-w-[120px]"
             >
              <div className="flex flex-col items-center text-center space-y-2">
                {/* Icon representation */}
                <div className="w-10 h-12 border border-gray-500/50 rounded flex items-center justify-center text-lg bg-gray-700/30">
                  <div className={`
                    border border-gray-400 rounded-sm bg-gray-600/20
                    ${getAspectRatioClass(option.aspectRatio)}
                  `}></div>
                </div>
                {/* Title */}
                <h3 className="text-white font-medium text-xs">{option.title}</h3>
                
                {/* Dimensions */}
                <div className="text-xs text-gray-400">
                  <div>{`${option.width} x ${option.height}`}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom Dimension Section */}
        <div className="mt-4 border-t border-gray-700/50 pt-3">
          <h3 className="text-xs font-medium text-gray-300 mb-2 text-center">أو أدخل أبعاد مخصصة</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={customWidth}
              max={550}
              min={150}
              onChange={(e) => setCustomWidth(e.target.value)}
              onBlur={() => setCustomWidth(Math.max(Math.min(Number.parseInt(customWidth), 550), 150).toString())}
              placeholder="العرض"
              className="px-2 py-1.5 bg-gray-700/50 border border-gray-600/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-xs"
            />
            <input
              type="number"
              value={customHeight}
              max={350}
              min={150}
              onChange={(e) => setCustomHeight(e.target.value)}
              onBlur={() => setCustomHeight(Math.max(Math.min(Number.parseInt(customHeight), 350), 150).toString())}
              placeholder="الارتفاع"
              className="px-2 py-1.5 bg-gray-700/50 border border-gray-600/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-xs"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors border border-gray-600/30 hover:border-gray-500/50 rounded text-sm"
          >
            إلغاء
          </button>
          <button 
            onClick={handleCustomDimensionSubmit}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium text-sm"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};

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
  layers: LayerElement[];
  selectedLayer?: string;
  onBackgroundChange: (settings: any) => void;
  onAvatarChange: (settings: any) => void;
  onTextChange: (settings: any) => void;
  onCanvasDimensionsChange: (dimensions: any) => void;
  onElementSelect: (element: string | null) => void;
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  onLayerOrderChange: (layerId: string, direction: 'up' | 'down') => void;
  onLayerSelect: (layerId: string) => void;
  onLayerAdd?: (layer: LayerElement) => void;
  onLayerDelete?: (layerId: string) => void;
  updateLayerSettings?: (layerId: string, settings: any) => void;
  getLayerSettings?: (layerId: string) => any;
}

// مكون لوحة الطبقات المحسن - نفس اللي في الملف الأول
const EnhancedLayersPanel: React.FC<{
  layers: LayerElement[];
  selectedLayer?: string;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  onLayerOrderChange: (layerId: string, direction: 'up' | 'down') => void;
  onLayerDelete: (layerId: string) => void;
  onLayerRename?: (layerId: string, name: string) => void;
  canvasRef: React.RefObject<DraggableRectanglesRef>;
}> = ({ layers, selectedLayer, onLayerSelect, onLayerVisibilityChange, onLayerOrderChange, onLayerDelete, onLayerRename, canvasRef }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim() && onLayerRename) {
      onLayerRename(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  // ترتيب الطبقات من الأعلى (أعلى zIndex) إلى الأسفل (أقل zIndex)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  console.log('🔍 الطبقات المُرتبة:', sortedLayers);
  console.log('🔍 الطبقات الحااليـــة:', canvasRef.current.getLayers());

  const getLayerIcon = (specialist: string) => {
    switch (specialist) {
      case 'background':
        return <Image className="h-4 w-4" />;
      case 'avatar':
        return <User className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  const getLayerColor = (specialist: string) => {
    switch (specialist) {
      case 'background':
        return 'bg-blue-500';
      case 'avatar':
        return 'bg-green-500';
      case 'text':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-400" />
          الطبقات
        </h3>
        <div className="text-xs text-gray-400">
          {sortedLayers.length} عناصر
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedLayers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد عناصر</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer group
                  ${selectedLayer === layer.id 
                    ? 'bg-blue-500/20 border-blue-500/50' 
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                  }
                  ${!layer.visible ? 'opacity-60' : ''}
                `}
                onClick={() => onLayerSelect(layer.id)}
                onDoubleClick={() => onLayerRename && handleStartEdit(layer.id, layer.name)}
              >
                {/* Layer Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0
                  ${getLayerColor(layer.specialist || 'background')}
                `}>
                  {getLayerIcon(layer.specialist || 'background')}
                </div>

                {/* Layer Name */}
                <div className="flex-1 min-w-0">
                  {editingId === layer.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleSaveEdit(layer.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(layer.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-white text-sm"
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm truncate">
                          {layer.name}
                        </span>
                        {!layer.visible && (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400 capitalize">
                        {layer.specialist === 'background' ? 'صورة' : 
                         layer.specialist === 'avatar' ? 'صورة شخصية' : 'نص'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Layer Actions */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerVisibilityChange(layer.id, !layer.visible);
                    }}
                    className="p-1.5 rounded hover:bg-gray-600 transition-colors"
                    title={layer.visible ? 'إخفاء' : 'إظهار'}
                  >
                    {layer.visible ? (
                      <Eye className="h-4 w-4 text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Move Up */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerOrderChange(layer.id, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1.5 rounded hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="تحريك لأعلى"
                  >
                    <MoveUp className="h-4 w-4 text-blue-400" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerOrderChange(layer.id, 'down');
                    }}
                    disabled={index === sortedLayers.length - 1}
                    className="p-1.5 rounded hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="تحريك لأسفل"
                  >
                    <MoveDown className="h-4 w-4 text-blue-400" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                    className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                    title="حذف"
                  >
                    <X className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer Statistics */}
      {sortedLayers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>الخلفيات: {sortedLayers.filter(l => l.specialist === 'background').length}</span>
            <span>النصوص: {sortedLayers.filter(l => l.specialist === 'text').length}</span>
            <span>المخفية: {sortedLayers.filter(l => !l.visible).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

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
  onLayerSelect,
  onLayerAdd,
  onLayerDelete,
  updateLayerSettings,
  getLayerSettings
}: MobileCanvasSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccordionSections, setActiveAccordionSections] = useState<string[]>([]);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [addLayerDropdownOpen, setAddLayerDropdownOpen] = useState(false);
  const [layersAddToggle, setLayersAddToggle] = useState(0);
  const [showDimensionWindow, setShowDimensionWindow] = useState(false);
  const [showMobileLayersPanel, setShowMobileLayersPanel] = useState(false);
  
  // استخدام useRef للوصول إلى دوال canvasPixi
  const canvasRef = useRef<DraggableRectanglesRef>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    console.log("handleResize !", canvasWrapperRef.current, canvasParentRef.current);
    if (!canvasWrapperRef.current || !canvasParentRef.current) return;
    const canvasWrapper = canvasWrapperRef.current;
    const canvasParent = canvasParentRef.current;
    if(window.innerWidth < (canvasParent.clientWidth + 20)){
      const scale = window.innerWidth / (canvasParent.clientWidth + 20);
      canvasParent.style.transform = `scale(${scale})`;
      canvasWrapper.style.height = `${canvasParent.clientHeight * scale + 20}px`;
    }
    if(canvasWrapper.clientHeight < canvasParent.clientHeight){
      console.log("the height of the canvas wrapper is smaller than the height of the canvas parent");
      const scale = Math.abs(canvasWrapper.clientHeight / (canvasParent.clientHeight + 20));
      console.log(canvasParent.clientHeight , canvasWrapper.clientHeight, scale);
      canvasParent.style.transform = `scale(${scale})`;
    }
    console.log("window has resized : ", window.innerWidth, canvasWrapper.clientWidth, canvasWrapper.clientHeight, canvasParent.clientWidth, canvasParent.clientHeight );
  }, [canvasWrapperRef, canvasParentRef]);

  // useEffect لمراقبة توفر العناصر وتطبيق handleResize
  useEffect(() => {
    if (canvasWrapperRef.current && canvasParentRef.current) {
      handleResize();
    }
  }, [canvasWrapperRef.current, canvasParentRef.current, handleResize, canvasRef.current]);
      
  // useEffect لإضافة مستمع حدث إعادة تحجيم الشاشة
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  layers = canvasRef.current?.getLayersRef() || [];

  useEffect(() => {
    if (!canvasRef.current) return;
    layers = canvasRef.current?.getLayers() || [];
    console.log('layers ::: ', layers);
  }, [layersAddToggle]);

  // دالة للتحقق من الدوال المتاحة في canvasRef
  const checkAvailableMethods = () => {
    if (canvasRef.current) {
      const methods = [
        'moveLayerUp',
        'moveLayerDown', 
        'toggleLayerVisibility',
        'updateLayerName',
        'getLayers',
        'removeText',
        'removeRectangle'
      ];
      
      console.log('🔍 الدوال المتاحة في canvasRef:');
      methods.forEach(method => {
        console.log(`  ${method}: ${!!(canvasRef.current as any)[method]}`);
      });
    }
  };

  // استدعاء الدالة عند فتح اللوحة
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      setTimeout(checkAvailableMethods, 1000);
    }
  }, [isOpen]);

  // دوال التحكم في الطبقات - باستخدام دوال canvasPixi
  const handleLayerVisibilityChange = (layerId: string, visible: boolean) => {
    console.log(`🔄 تغيير رؤية الطبقة ${layerId} إلى: ${visible}`);
    
    // 1. تحديث الـ state الأساسي
    onLayerVisibilityChange(layerId, visible);
    
    // 2. تحديث في canvasPixi باستخدام الدالة الصحيحة
    if (canvasRef.current && canvasRef.current.toggleLayerVisibility) {
      // نعمل toggle فقط إذا الرؤية الحالية مختلفة عن المطلوبة
      const currentLayers = canvasRef.current.getLayers();
      console.log('🔍 الطبقات الحالية:', currentLayers);
      const currentLayer = currentLayers.find(l => l.id === layerId);
      if (currentLayer && currentLayer.visible !== visible) {
        canvasRef.current.toggleLayerVisibility(layerId);
        console.log(`✅ تم تفعيل toggleLayerVisibility للطبقة ${layerId}`);
      }
    } else {
      console.log('❌ الدالة toggleLayerVisibility غير متاحة في canvasRef');
      // استخدام alpha كبديل
      if (layerId.startsWith('text-')) {
        canvasRef.current?.updateText(layerId, { alpha: visible ? 1 : 0.1 } as any);
      } else {
        canvasRef.current?.updateRectangleSettings(layerId, { alpha: visible ? 1 : 0.1 } as any);
      }
    }
  };

  const handleLayerOrderChange = (layerId: string, direction: 'up' | 'down') => {
    console.log(`🔄 تحريك الطبقة ${layerId} ${direction}`);


    
    // 1. تحديث الـ state الأساسي
    onLayerOrderChange(layerId, direction);
    
    // 2. تحديث في canvasPixi باستخدام الدوال الصحيحة
    if (canvasRef.current) {
      if (direction === 'up' && canvasRef.current.moveLayerUp) {
        canvasRef.current.moveLayerUp(layerId);
        console.log(`✅ تم تفعيل moveLayerUp للطبقة ${layerId}`);
      } else if (direction === 'down' && canvasRef.current.moveLayerDown) {
        canvasRef.current.moveLayerDown(layerId);
        console.log(`✅ تم تفعيل moveLayerDown للطبقة ${layerId}`);
      } else {
        console.log('❌ دوال التحريك غير متاحة في canvasRef');
      }
    }
  };

  const handleLayerRename = (layerId: string, newName: string) => {
    console.log(`🔄 إعادة تسمية الطبقة ${layerId} إلى: ${newName}`);
    
    // تحديث في canvasPixi إذا الدالة متاحة
    if (canvasRef.current && canvasRef.current.updateLayerName) {
      canvasRef.current.updateLayerName(layerId, newName);
      console.log(`✅ تم تفعيل updateLayerName للطبقة ${layerId}`);
    } else {
      console.log('❌ الدالة updateLayerName غير متاحة في canvasRef');
    }
  };

  const handleLayerDelete = (layerId: string) => {
    console.log(`🗑️ حذف الطبقة: ${layerId}`);
    
    // 1. تحديث الـ state الأساسي
    if (onLayerDelete) {
      onLayerDelete(layerId);
    }
    
    // 2. حذف العنصر من canvasPixi باستخدام الدوال الصحيحة
    if (canvasRef.current) {
      if (layerId.startsWith('text-') && canvasRef.current.removeText) {
        canvasRef.current.removeText(layerId);
        console.log(`✅ تم تفعيل removeText للطبقة ${layerId}`);
      } else if ((layerId.startsWith('rect-') || layerId.startsWith('background-') || layerId.startsWith('avatar-')) && canvasRef.current.removeRectangle) {
        canvasRef.current.removeRectangle(layerId);
        console.log(`✅ تم تفعيل removeRectangle للطبقة ${layerId}`);
      } else {
        console.log('❌ دوال الحذف غير متاحة في canvasRef');
      }
    }
    
    // إذا كانت الطبقة المحذوفة هي المحددة، نلغي التحديد
    if (selectedLayer === layerId) {
      onLayerSelect('');
      setActiveAccordionSections([]);
    }
  };

  const importImageToFile = async (imageName?: string): Promise<File> => {
    try {
      console.log('🔗 جاري تحميل الصورة عبر API:', imageName);
      
      const response = await fetch(imageName ? `/api/images?name=${encodeURIComponent(imageName)}` : `https://picsum.photos/550/350.jpg`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      const file = new File([blob], imageName || 'image.jpg', {
        type: blob.type || 'image/jpeg'
      });
      
      console.log('✅ تم تحميل الصورة عبر API:', file.name);
      return file;
      
    } catch (error) {
      console.error('❌ فشل في تحميل الصورة:', error);
      throw error;
    }
  };

  // Layer management functions
  const addNewLayer = async (specialist: 'background' | 'avatar' | 'text') => {
    if (onLayerAdd && canvasRef.current) {
      const newLayer: LayerElement = {
        id: `${specialist}-${Date.now()}`,
        name: specialist === 'background' ? 'new background' : specialist === 'avatar' ? 'new avatar' : 'new text',
        type: specialist === 'text' ? 'text' : 'rectangle',
        specialist,
        visible: true,
        zIndex: layers.length
      };
      
      // إنشاء العنصر المناسب في canvasPixi بناءً على النوع
      if (specialist === 'text') {
        const textId = canvasRef.current.createText({
          text: newLayer.name,
          fontSize: 24,
          color: 0xffffff,
          fontFamily: 'Arial',
          x: canvasRef.current.getCanvasDimensions().width / 2,
          y: canvasRef.current.getCanvasDimensions().height / 2,
          specialist
        });
        newLayer.id = textId;
        console.log('✅ تم إنشاء نص جديد:', textId);
      } else if (specialist === 'background') {
        const imageFile = await importImageToFile();
        console.log('✅ تم إنشاء ملف صورة جديدة:', imageFile);
        const rectId = await canvasRef.current.createRectangle({
          width: customCanvasDimensions.width,
          height: customCanvasDimensions.height,
          color: 0xd0d4d8,
          cornerRadius: 0,
          x: canvasRef.current.getCanvasDimensions().width / 2,
          y: canvasRef.current.getCanvasDimensions().height / 2,
          specialist,
          imageFit:"cover",
          imageFile: imageFile,
          showBorder:false,
          borderWidth:0,
        });
        newLayer.id = rectId;
        console.log('✅ تم إنشاء خلفية جديدة:', rectId);
      } else if (specialist === 'avatar') {
        const rectId = await canvasRef.current.createRectangle({
          width: 100,
          height: 100,
          color: 0x3498db,
          cornerRadius: 50,
          x: canvasRef.current.getCanvasDimensions().width / 2,
          y: canvasRef.current.getCanvasDimensions().height / 2,
          specialist,
          imageFit:"cover",
          showBorder:false,
          borderColor:0xffffff,
          borderWidth:2,
          imageUrl:`https://cdn.discordapp.com/embed/avatars/${Math.max(1, Math.floor(Math.random() * 5))}.png`,
        });
        newLayer.id = rectId;
        console.log('✅ تم إنشاء صورة شخصية جديدة:', rectId);
      }
      
      // تحديث layersAddToggle لإعادة تحميل الطبقات
      setLayersAddToggle(prev => prev + 1);
      onLayerAdd(newLayer);
      setAddLayerDropdownOpen(false);
      handleSectionToggle(newLayer.id, true);
      
      // تحديد الطبقة الجديدة تلقائياً وفتح إعداداتها
      setTimeout(() => {
        onLayerSelect(newLayer.id);
        setActiveAccordionSections([newLayer.id]);
      }, 100);
    }
  };

  // Get layer icon based on specialist
  const getLayerIcon = (specialist: string) => {
    switch (specialist) {
      case 'background':
        return <Image className="h-4 w-4" />;
      case 'avatar':
        return <User className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  // دالة للتحكم في فتح وإغلاق أقسام الـ Accordion
  const handleSectionToggle = useCallback((sectionId: string, selectForce?: boolean) => {
    if (selectForce === undefined) selectForce = false;
    
    setActiveAccordionSections(prev => {
      console.log('✅ handleSectionToggle  :  ', sectionId, prev);
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [sectionId];
      }
    });
    
    if (canvasRef.current && selectForce) {
      canvasRef.current.selectElement(sectionId);
    }
  }, []);

  useEffect(() => {
    console.log('✅ useEffect  :  ', canvasRef.current);
    canvasRef.current?.onMouseDown((e) => {
      console.log('✅ تم الضغط على العنصر:', e);
      if(e.id) {
        handleSectionToggle(e.id, false);
      }
    })
  }, [canvasRef.current, handleSectionToggle])

  // دالة لتحديث إعدادات الطبقات في canvasPixi
  const updateCanvasLayerSettings = (layerId: string, settings: any) => {
    if (!canvasRef.current) return;

    if (layerId.startsWith('text-')) {
      // تحديث إعدادات النص
      canvasRef.current.updateTextSettings(layerId, {
        text: settings.text,
        fontSize: settings.fontSize,
        color: settings.color,
        fontFamily: settings.fontFamily,
        ...settings
        // إرسال جميع الإعدادات المهمة
      });

    } else if (layerId.startsWith('rect-') || layerId.startsWith('background-') || layerId.startsWith('avatar-')) {

      console.log('🔮 تم تحديث إعدادات المستطيل:', layerId, settings);

      // تحديث إعدادات المستطيل
      canvasRef.current.updateRectangleSettings(layerId, {
        color: settings.color,
        width: settings.width,
        height: settings.height,
        cornerRadius: settings.cornerRadius,
        ...settings
      });
    }
  };

  // Reset all settings
  const resetAll = () => {
    if (canvasRef.current) {
      canvasRef.current.clearAll();
    }
    
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
      width: 550,
      height: 350,
      useCustom: false
    });
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
                    onClick={() => {/* سيتم التعامل مع الحفظ لاحقاً */}}
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
            
            {/* Live Preview with Vertical Triggers - Takes exactly half the screen */}
            <div className="h-1/2 max-h-1/2 p-3 border-b border-gray-700/50 bg-gray-800/20 flex-shrink-0 relative" ref={canvasWrapperRef}>
              
              {/* Dynamic Layer Triggers - Responsive positioning */}
              <div className="absolute left-3 top-3 bottom-3 z-10 flex flex-wrap flex-col justify-center gap-2 max-[900px]:hidden">
                {/* Layer-based triggers */}
                {layers.map((layer) => (
                  <Tooltip
                    key={layer.id}
                    content={`${layer.name} - ${layer.specialist === 'background' ? 'صورة' : layer.specialist === 'avatar' ? 'صورة شخصية' : 'نص'}`}
                    side="right"
                  >
                    <button
                      onClick={() => handleSectionToggle(layer.id, true)}
                      className={`
                        w-12 h-12 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm
                        flex items-center justify-center
                        ${activeAccordionSections.includes(layer.id)
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500 border-purple-400 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/80 border-gray-600/50 text-gray-300 hover:bg-gray-700/80 hover:border-gray-500'
                        }
                        ${!layer.visible ? 'opacity-50' : ''}
                      `}
                    >
                      {getLayerIcon(layer.specialist || 'background')}
                    </button>
                  </Tooltip>
                ))}
                
                {/* Add Layer Button */}
                <div className="relative group">
                  <button 
                    onClick={() => setAddLayerDropdownOpen(!addLayerDropdownOpen)}
                    className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-500/50 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center text-gray-400 hover:text-gray-300"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  
                  {/* Add Layer Dropdown */}
                  {addLayerDropdownOpen && (
                    <div className="absolute left-14 top-0 flex-col gap-1 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-gray-600/50 p-2 shadow-xl z-30">
                      <button
                        onClick={() => addNewLayer('background')}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors whitespace-nowrap"
                      >
                        <Image className="h-4 w-4" />
                        <span>صورة</span>
                      </button>
                      <button
                        onClick={() => addNewLayer('avatar')}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors whitespace-nowrap"
                      >
                        <User className="h-4 w-4" />
                        <span>صورة شخصية</span>
                      </button>
                      <button
                        onClick={() => addNewLayer('text')}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors whitespace-nowrap"
                      >
                        <Type className="h-4 w-4" />
                        <span>نص</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Layer Triggers - Carousel style below canvas for screens 900px and smaller */}
              <div className="hidden max-[900px]:block absolute top-[calc(100%+0.5rem)] left-1/2 transform -translate-x-1/2 z-10 w-[calc(100vw-1.5rem)] max-w-md">
                <div className="flex bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-3 shadow-2xl">
                  {/* Scrollable container */}
                  {/* Add Layer Button */}
                  <div className="relative group flex-shrink-0 mr-3">
                    <button 
                      onClick={() => setAddLayerDropdownOpen(!addLayerDropdownOpen)}
                      className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-500/50 bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 flex items-center justify-center text-gray-400 hover:text-gray-300 hover:scale-105"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    
                    {/* Add Layer Dropdown - Mobile */}
                    {addLayerDropdownOpen && (
                      <div className="absolute bottom-14 left-0 flex flex-col gap-1 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-600/50 p-2 shadow-xl z-30 min-w-[140px]">
                        <button
                          onClick={() => addNewLayer('background')}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <Image className="h-4 w-4" />
                          <span>صورة</span>
                        </button>
                        <button
                          onClick={() => addNewLayer('avatar')}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <User className="h-4 w-4" />
                          <span>صورة شخصية</span>
                        </button>
                        <button
                          onClick={() => addNewLayer('text')}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <Type className="h-4 w-4" />
                          <span>نص</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Layers Panel Button */}
                  <div className="relative group flex-shrink-0 mr-3">
                    <button 
                      onClick={() => setShowMobileLayersPanel(!showMobileLayersPanel)}
                      className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center hover:scale-105 overflow-hidden group ${
                        showMobileLayersPanel 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500 border-purple-400 text-white shadow-lg shadow-purple-500/25' 
                          : 'border-gray-500/50 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-gray-300 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Layers className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      {showMobileLayersPanel && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
                    <div className="flex flex-row items-center gap-3 pb-1" style={{ width: 'max-content' }}>
                      {/* Layer-based triggers */}
                      {layers.map((layer) => (
                        <Tooltip
                          key={layer.id}
                          content={`${layer.name} - ${layer.specialist === 'background' ? 'صورة' : layer.specialist === 'avatar' ? 'صورة شخصية' : 'نص'}`}
                          side="top"
                        >
                          <button
                            onClick={() => handleSectionToggle(layer.id, true)}
                            className={`
                              flex-shrink-0 w-12 h-12 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm
                              flex items-center justify-center relative
                              ${activeAccordionSections.includes(layer.id)
                                ? 'bg-gradient-to-br from-purple-500 to-blue-500 border-purple-400 text-white shadow-lg shadow-purple-500/25 scale-105'
                                : 'bg-gray-700/80 border-gray-600/50 text-gray-300 hover:bg-gray-600/80 hover:border-gray-500 hover:scale-105'
                              }
                              ${!layer.visible ? 'opacity-50' : ''}
                            `}
                          >
                            {getLayerIcon(layer.specialist || 'background')}
                            {/* Active indicator */}
                            {activeAccordionSections.includes(layer.id) && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border-2 border-gray-800"></div>
                            )}
                          </button>
                        </Tooltip>
                      ))}
                      
                      
                    </div>
                  </div>
                </div>
                {/* Mobile Layers Panel - Centered Modal */}
                {showMobileLayersPanel && (
                  <div className="absolute bottom-[calc(100%+0.4rem)] bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                    {/* Layers Content */}
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                      <EnhancedLayersPanel
                        layers={layers}
                        selectedLayer={selectedLayer}
                        onLayerSelect={(layerId) => {
                          console.log(`🎯 تحديد الطبقة: ${layerId}`);
                          onLayerSelect(layerId);
                          setActiveAccordionSections([layerId]);
                        }}
                        onLayerVisibilityChange={handleLayerVisibilityChange}
                        onLayerOrderChange={handleLayerOrderChange}
                        onLayerDelete={handleLayerDelete}
                        onLayerRename={handleLayerRename}
                        canvasRef={canvasRef as React.RefObject<DraggableRectanglesRef>}

                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CanvasPixi Preview - Centered */}
              <div className="h-full flex items-center justify-center px-20">
                <div ref={canvasParentRef} onLoad={handleResize}>
                  <DraggableRectangles
                    ref={canvasRef}
                    width={customCanvasDimensions.useCustom ? customCanvasDimensions.width : 550}
                    height={customCanvasDimensions.useCustom ? customCanvasDimensions.height : 350}
                    backgroundColor={0x1e2939}
                    onLoad={handleResize}
                    onDimensionButtonClick={() => setShowDimensionWindow(true)}
                  />
                </div>
              </div>

              {/* Layers Panel Toggle Button - Absolute Right - Hidden on mobile */}
              <div className="absolute right-3 top-3 bottom-3 z-10 flex items-center max-[900px]:hidden">
                <button
                  onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
                  className={`
                    h-full w-12 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm border
                    ${isLayersPanelOpen 
                      ? 'bg-blue-500/20 border-blue-500/50' 
                      : 'bg-gray-800/80 border-gray-600/50 hover:bg-gray-700/80'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Layers className={`h-5 w-5 ${isLayersPanelOpen ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span className="text-xs text-gray-400">{layers.length}</span>
                  </div>
                </button>
              </div>

              {/* Enhanced Layers Panel Content - Slides from right - Hidden on mobile */}
              {isLayersPanelOpen && (
                <div className="absolute right-16 top-3 bottom-3 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 z-20 shadow-2xl max-[900px]:hidden">
                  <EnhancedLayersPanel
                    layers={layers}
                    selectedLayer={selectedLayer}
                    onLayerSelect={(layerId) => {
                      console.log(`🎯 تحديد الطبقة: ${layerId}`);
                      onLayerSelect(layerId);
                      setActiveAccordionSections([layerId]);
                    }}
                    onLayerVisibilityChange={handleLayerVisibilityChange}
                    onLayerOrderChange={handleLayerOrderChange}
                    onLayerDelete={handleLayerDelete}
                    onLayerRename={handleLayerRename}
                    canvasRef={canvasRef as React.RefObject<DraggableRectanglesRef>}
                  />
                </div>
              )}
            </div>

            {showDimensionWindow && (
              <DimensionWindow
                onClose={() => setShowDimensionWindow(false)}
                onSelect={(option) => {
                  console.log('Selected dimension:', option);
                  
                  const width = Math.max(Math.min(Number.parseInt(option.width), 550), 150);
                  const height = Math.max(Math.min(Number.parseInt(option.height), 350), 150);
                  
                  // استخدم setCanvasDimensions فقط - لا حاجة لـ app.renderer.resize
                  canvasRef.current?.setCanvasDimensions(width, height);
                  
                  // تحديث الإعدادات في الـ state
                  onCanvasDimensionsChange({
                    width,
                    height,
                    useCustom: true
                  });
                  
                  // إعادة رسم الـ resize border إذا كان هناك عنصر محدد
                  setTimeout(() => {
                    handleResize();
                  }, 100);
                }}
              />
            )}

            {/* Settings Content - Takes exactly half the screen */}
            <div className="h-1/2 overflow-y-auto p-3 max-[900px]:mt-20">
              <div className="space-y-2 sm:space-y-3" ref={wrapperRef}>
                {activeAccordionSections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <Wand2 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-white font-medium text-lg mb-2">اختر إعداداً للتخصيص</h3>
                      <p className="text-gray-400 text-sm">
                        استخدم الأزرار الجانبية لاختيار القسم الذي تريد تخصيصه
                      </p>
                    </div>
                  </div>
                ) : (
                  <Accordion 
                     type="single" 
                     value={activeAccordionSections[0] || ''} 
                     onValueChange={(value) => setActiveAccordionSections(value ? [value] : [])}
                     className="space-y-2 sm:space-y-3"
                     collapsible
                     defaultValue={activeAccordionSections[0] || ''}
                   >
                    {/* Dynamic Layer Settings */}
                    {layers.map((layer) => {
                      if (!activeAccordionSections.includes(layer.id)) return null;
                      
                      const layerSettings = canvasRef.current?.getSelectedElement(layer.id)?.settings || {};
                      console.log('layerSettings ::$:: ', layerSettings);
                      
                      switch (layer.specialist) {
                        case 'background':
                          return (
                            <BackgroundSettingsTrigger
                              key={layer.id}
                              layerId={layer.id}
                              backgroundSettings={layerSettings}
                              wrapperRef={wrapperRef as React.RefObject<HTMLDivElement>}
                              onBackgroundChange={(settings) => {
                                if (updateLayerSettings) {
                                  updateLayerSettings(layer.id, settings);
                                }
                                updateCanvasLayerSettings(layer.id, settings);
                              }}
                              canvasRef={canvasRef as React.RefObject<DraggableRectanglesRef>}
                            />
                          );
                        case 'avatar':
                          return (
                            <AvatarSettingsTrigger
                              key={layer.id}
                              layerId={layer.id}
                              avatarSettings={layerSettings}
                              wrapperRef={wrapperRef as React.RefObject<HTMLDivElement>}
                              onAvatarChange={(settings) => {
                                if (updateLayerSettings) {
                                  updateLayerSettings(layer.id, settings);
                                }
                                updateCanvasLayerSettings(layer.id, settings);
                              }}
                              canvasRef={canvasRef as React.RefObject<DraggableRectanglesRef>}
                            />
                          );
                        case 'text':
                          return (
                            <TextSettingsTrigger
                              key={layer.id}
                              layerId={layer.id}
                              textSettings={layerSettings}
                              wrapperRef={wrapperRef as React.RefObject<HTMLDivElement>}
                              onTextChange={(settings) => {
                                if (updateLayerSettings) {
                                  updateLayerSettings(layer.id, settings);
                                }
                                updateCanvasLayerSettings(layer.id, settings);
                              }}
                              canvasRef={canvasRef as React.RefObject<DraggableRectanglesRef>}
                            />
                          );
                        default:
                          return null;
                      }
                    })}

                    {/* Canvas Dimensions */}
                    {activeAccordionSections.includes('canvas') && (
                      <CanvasDimensionsTrigger
                        customCanvasDimensions={customCanvasDimensions}
                        onCanvasDimensionsChange={onCanvasDimensionsChange}
                      />
                    )}

                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}