"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  User,
  Type,
  Eye,
  ArrowUp,
  ArrowDown,
  Image,
  Layers,
  EyeOff,
  Trash2,
  Shield
} from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  type: 'background' | 'avatar' | 'text';
  visible: boolean;
  order: number;
}

interface LayersPanelTriggerProps {
  layers: LayerItem[];
  selectedLayer?: string;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  onLayerOrderChange: (layerId: string, direction: 'up' | 'down') => void;
  onLayerDelete?: (layerId: string) => void;
  avatarElementId?: string;
  backgroundElementId?: string;
}

export default function LayersPanelTrigger({ 
  layers, 
  selectedLayer, 
  onLayerSelect, 
  onLayerVisibilityChange, 
  onLayerOrderChange,
  onLayerDelete,
  avatarElementId,
  backgroundElementId
}: LayersPanelTriggerProps) {
  
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

  const getLayerName = (layer: LayerItem) => {
    if (layer.name && layer.name !== '') {
      return layer.name;
    }
    
    switch (layer.type) {
      case 'background':
        return 'خلفية';
      case 'avatar':
        return 'صورة شخصية';
      case 'text':
        return 'نص';
      default:
        return 'طبقة جديدة';
    }
  };

  // التحقق إذا كانت الطبقة أساسية (لا يمكن حذفها)
  const isProtectedLayer = (layerId: string) => {
    return layerId === avatarElementId || layerId === backgroundElementId;
  };

  // ترتيب الطبقات حسب الترتيب (الأعلى أولاً)
  const sortedLayers = [...layers].sort((a, b) => b.order - a.order);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700/50" dir='rtl'>
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Layers className="h-5 w-5 text-blue-400" />
        </div>
        <div className="text-right">
          <div className="text-white font-medium text-base">إدارة الطبقات</div>
          <div className="text-gray-400 text-sm">
            {layers.length} طبقات
          </div>
        </div>
      </div>
      
      {/* Layers List */}
      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
        {sortedLayers.map((layer, index) => {
          const isProtected = isProtectedLayer(layer.id);
          
          return (
            <div
              key={layer.id}
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                selectedLayer === layer.id
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/30'
              } ${isProtected ? 'border-green-500/30' : ''}`}
              onClick={() => onLayerSelect(layer.id)}
            >
              {/* Layer Icon */}
              <div className="flex-shrink-0">
                {getLayerIcon(layer.type)}
              </div>
              
              {/* Layer Name and Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-300 text-sm sm:text-base truncate block">
                    {getLayerName(layer)}
                  </Label>
                  {isProtected && (
                    <Shield className="h-3 w-3 text-green-400 flex-shrink-0" />
                  )}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {layer.type === 'background' ? 'خلفية' : 
                   layer.type === 'avatar' ? 'صورة شخصية' : 'نص'}
                  {isProtected && ' • محمي'}
                </div>
              </div>
              
              {/* Controls Container */}
              <div className="flex items-center gap-1 flex-shrink-0">
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

                {/* Delete Button - لا يظهر للطبقات المحمية */}
                {!isProtected && onLayerDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {layers.length === 0 && (
          <div className="text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
            لا توجد طبقات متاحة
          </div>
        )}

        {/* معلومات الطبقات المحمية */}
        {(avatarElementId || backgroundElementId) && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-xs text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-green-400" />
                <span>الطبقات ذات الدرع محمية ولا يمكن حذفها</span>
              </div>
              <div className="text-gray-500 text-xs">
                • الخلفية الأساسية
                <br />
                • صورة الشخصية (Avatar)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};