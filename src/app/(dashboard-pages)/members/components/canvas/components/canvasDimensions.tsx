"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Layout,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

export default function CanvasDimensionsTrigger({ customCanvasDimensions, onCanvasDimensionsChange }) {
  return  (
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
  )
};