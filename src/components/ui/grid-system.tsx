'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Grid3X3, 
  Move
} from 'lucide-react';

interface GridSystemProps {
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  snapToGrid: boolean;
  onSnapToGridChange: (snap: boolean) => void;
}

export function GridSystem({
  showGrid,
  onShowGridChange,
  gridSize,
  onGridSizeChange,
  snapToGrid,
  onSnapToGridChange
}: GridSystemProps) {
  // Helper function to prevent event interference with sliders
  const getSliderProps = () => ({
    style: { pointerEvents: 'auto' as const },
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation()
  });
  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-white text-sm sm:text-lg flex items-center gap-2">
          <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
            <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
          </div>
          <span className="hidden sm:inline">الشبكة والمحاذاة</span>
        <span className="sm:hidden">Grid</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Grid Settings */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white text-xs sm:text-sm font-medium">إظهار الشبكة</Label>
            <Switch
              checked={showGrid}
              onCheckedChange={onShowGridChange}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white text-xs sm:text-sm font-medium">حجم الشبكة: {gridSize}px</Label>
            <Slider
              value={[gridSize]}
              onValueChange={(value) => onGridSizeChange(value[0])}
              min={10}
              max={50}
              step={5}
              className="w-full"
              {...getSliderProps()}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-white text-xs sm:text-sm font-medium">الالتصاق بالشبكة</Label>
            <Switch
              checked={snapToGrid}
              onCheckedChange={onSnapToGridChange}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}