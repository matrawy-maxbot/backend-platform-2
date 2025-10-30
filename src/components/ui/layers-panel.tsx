'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Image, 
  Type, 
  User 
} from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  type: 'background' | 'avatar' | 'text';
  visible: boolean;
  order: number;
}

interface LayersPanelProps {
  layers: LayerItem[];
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  onLayerOrderChange: (layerId: string, direction: 'up' | 'down') => void;
  selectedLayer?: string;
  onLayerSelect: (layerId: string) => void;
}

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

export function LayersPanel({ 
  layers, 
  onLayerVisibilityChange, 
  onLayerOrderChange, 
  selectedLayer, 
  onLayerSelect 
}: LayersPanelProps) {
  const sortedLayers = [...layers].sort((a, b) => b.order - a.order);

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-xs sm:text-sm">
          <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          لوحة الطبقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 sm:space-y-2">
        {sortedLayers.map((layer, index) => (
          <div
            key={layer.id}
            className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
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
              <Label className="text-gray-300 text-xs sm:text-sm truncate block">
                {layer.name}
              </Label>
            </div>
            
            {/* Visibility Toggle */}
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-gray-600/50"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerVisibilityChange(layer.id, !layer.visible);
                }}
              >
                {layer.visible ? (
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400" />
                ) : (
                  <EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
                )}
              </Button>
            </div>
            
            {/* Order Controls */}
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-gray-600/50"
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerOrderChange(layer.id, 'up');
                }}
              >
                <ArrowUp className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-gray-600/50"
                disabled={index === sortedLayers.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerOrderChange(layer.id, 'down');
                }}
              >
                <ArrowDown className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-gray-400" />
              </Button>
            </div>
          </div>
        ))}
        
        {layers.length === 0 && (
          <div className="text-center py-3 sm:py-4 text-gray-500 text-xs">
            لا توجد طبقات متاحة
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LayersPanel;