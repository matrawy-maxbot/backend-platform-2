'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LiveCanvasPreviewProps {
  canvasDimensions: {
    width: number;
    height: number;
  };
  backgroundSettings: {
    image: string;
    opacity: number;
    blur: number;
    brightness: number;
    contrast: number;
    position: { x: number; y: number };
    scale: number;
    objectFit?: string;
    backgroundSize?: string;
  };
  avatarSettings: {
    image: string;
    size: number;
    position: { x: number; y: number };
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
  };
  textSettings: {
    content: string;
    fontSize: number;
    subFontSize?: number;
    fontFamily: string;
    color: string;
    fontWeight: number;
    textAlign: string;
    position: { x: number; y: number };
    textShadow: boolean;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    shadowColor: string;
  };
  layers?: Array<{
    id: string;
    name: string;
    type: 'background' | 'avatar' | 'text';
    visible: boolean;
    order: number;
  }>;
  memberData?: {
    username?: string;
    displayName?: string;
    joinDate?: string;
    memberNumber?: string;
  };
  selectedElement?: string | null;
  onElementSelect?: (element: string | null) => void;
  onBackgroundChange?: (settings: any) => void;
  onAvatarChange?: (settings: any) => void;
  onTextChange?: (settings: any) => void;
}

export default function LiveCanvasPreview({
  canvasDimensions,
  backgroundSettings,
  avatarSettings,
  textSettings,
  layers,
  memberData,
  selectedElement,
  onElementSelect,
  onBackgroundChange,
  onAvatarChange,
  onTextChange
}: LiveCanvasPreviewProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = React.useState(false);

  // Get dynamic zIndex based on layer order
  const getLayerZIndex = (layerType: 'background' | 'avatar' | 'text') => {
    if (!layers) return 0;
    const layer = layers.find(l => l.type === layerType);
    return layer ? layer.order : 0;
  };

  const handleMouseDown = (e: React.MouseEvent, element: string) => {
    if (!onElementSelect) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsResizing(false);
    setDragStart({ x: e.clientX, y: e.clientY });
    onElementSelect(element);
  };

  const handleTouchStart = (e: React.TouchEvent, element: string) => {
    if (!onElementSelect) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setIsResizing(false);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    onElementSelect(element);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (selectedElement === 'background' && onBackgroundChange) {
      onBackgroundChange({
        ...backgroundSettings,
        position: {
          x: backgroundSettings.position.x + deltaX,
          y: backgroundSettings.position.y + deltaY
        }
      });
    } else if (selectedElement === 'avatar' && onAvatarChange) {
      onAvatarChange({
        ...avatarSettings,
        position: {
          x: avatarSettings.position.x + deltaX,
          y: avatarSettings.position.y + deltaY
        }
      });
    } else if (selectedElement === 'text' && onTextChange) {
      onTextChange({
        ...textSettings,
        position: {
          x: textSettings.position.x + deltaX,
          y: textSettings.position.y + deltaY
        }
      });
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !selectedElement) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    if (selectedElement === 'background' && onBackgroundChange) {
      onBackgroundChange({
        ...backgroundSettings,
        position: {
          x: backgroundSettings.position.x + deltaX,
          y: backgroundSettings.position.y + deltaY
        }
      });
    } else if (selectedElement === 'avatar' && onAvatarChange) {
      onAvatarChange({
        ...avatarSettings,
        position: {
          x: avatarSettings.position.x + deltaX,
          y: avatarSettings.position.y + deltaY
        }
      });
    } else if (selectedElement === 'text' && onTextChange) {
      onTextChange({
        ...textSettings,
        position: {
          x: textSettings.position.x + deltaX,
          y: textSettings.position.y + deltaY
        }
      });
    }
    
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleElementClick = (element: string) => {
    if (onElementSelect) {
      onElementSelect(element);
    }
  };

  const processText = (content: string) => {
    if (!content) return 'مرحباً بك!';
    
    const processedText = content
      .replace(/\{username\}/g, memberData?.username || 'اسم_المستخدم')
      .replace(/\{displayName\}/g, memberData?.displayName || 'الاسم_المعروض')
      .replace(/\{joinDate\}/g, memberData?.joinDate || 'تاريخ_الانضمام')
      .replace(/\{memberNumber\}/g, memberData?.memberNumber || 'رقم_العضو')
      .replace(/\{user\}/g, 'أحمد محمد')
      .replace(/\{server\}/g, 'خادم المجتمع')
      .replace(/\{member_count\}/g, '1,234')
      .replace(/\{date\}/g, new Date().toLocaleDateString('ar-SA'));
    
    // Handle line breaks with different font sizes
    return processedText.split('\n').map((line, index) => (
      <div 
        key={index}
        style={{
          fontSize: index === 0 ? textSettings.fontSize : (textSettings.subFontSize || textSettings.fontSize)
        }}
      >
        {line}
      </div>
    ));
  };
  
  return (
    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm sm:text-base">معاينة مباشرة</h3>
            <Badge variant="outline" className="text-xs">
              {canvasDimensions.width} × {canvasDimensions.height}
            </Badge>
          </div>

          {/* Live Preview - Exact replica of main canvas */}
          <div className="relative bg-gray-900 rounded-lg p-2 sm:p-3 border border-gray-600">
            <div 
              className="design-canvas-preview relative w-full bg-gray-800 rounded border-2 border-dashed border-gray-600 mx-auto overflow-hidden"
              style={{
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`,
                maxWidth: '100%',
                aspectRatio: `${canvasDimensions.width} / ${canvasDimensions.height}`
              }}
              onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
            >
              {/* Background */}
              {(!layers || layers.find(l => l.id === 'background')?.visible !== false) && (
                <div
                  className="absolute inset-0 transition-all duration-200"
                  style={{
                    backgroundImage: `url(${backgroundSettings.image})`,
                    backgroundSize: backgroundSettings.objectFit || backgroundSettings.backgroundSize || 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: backgroundSettings.opacity / 100,
                    filter: `blur(${backgroundSettings.blur}px) brightness(${backgroundSettings.brightness}%) contrast(${backgroundSettings.contrast}%)`,
                    transform: `translate(${backgroundSettings.position.x}px, ${backgroundSettings.position.y}px) scale(${backgroundSettings.scale})`,
                    zIndex: getLayerZIndex('background'),
                    cursor: selectedElement === 'background' ? 'move' : 'pointer',
                    border: selectedElement === 'background' ? '2px solid #3b82f6' : 'none',
                    boxShadow: selectedElement === 'background' ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'background')}
                      onTouchStart={(e) => handleTouchStart(e, 'background')}
                      onClick={() => handleElementClick('background')}
                />
              )}
              
              {/* Avatar - Exact match to main canvas */}
              {(!layers || layers.find(l => l.id === 'avatar')?.visible !== false) && (
                <div
                  className="absolute transition-all duration-200"
                  style={{
                    left: `calc(50% + ${avatarSettings.position.x}px)`,
                    top: `calc(30% + ${avatarSettings.position.y}px)`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: getLayerZIndex('avatar'),
                    cursor: selectedElement === 'avatar' ? 'move' : 'pointer',
                    border: selectedElement === 'avatar' ? '2px solid #3b82f6' : 'none',
                    borderRadius: selectedElement === 'avatar' ? `${avatarSettings.borderRadius}%` : '0',
                    boxShadow: selectedElement === 'avatar' ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
                    padding: selectedElement === 'avatar' ? '2px' : '0'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'avatar')}
                      onTouchStart={(e) => handleTouchStart(e, 'avatar')}
                      onClick={() => handleElementClick('avatar')}
                >
                  <img
                    src={avatarSettings.image}
                    alt="Avatar"
                    className="transition-all duration-200"
                    style={{
                      width: avatarSettings.size,
                      height: avatarSettings.size,
                      minWidth: avatarSettings.size,
                      minHeight: avatarSettings.size,
                      maxWidth: avatarSettings.size,
                      maxHeight: avatarSettings.size,
                      borderRadius: `${avatarSettings.borderRadius}%`,
                      border: `${avatarSettings.borderWidth}px solid ${avatarSettings.borderColor}`,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      aspectRatio: '1 / 1',
                      display: 'block'
                    }}
                  />
                </div>
              )}
              
              {/* Text - Exact match to main canvas */}
              {(!layers || layers.find(l => l.id === 'text')?.visible !== false) && (
                <div
                    className="absolute transition-all duration-200"
                    style={{
                      left: `calc(50% + ${textSettings.position.x}px)`,
                      top: `calc(70% + ${textSettings.position.y}px)`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: getLayerZIndex('text'),
                      fontFamily: textSettings.fontFamily,
                      color: textSettings.color,
                      fontWeight: textSettings.fontWeight,
                      textAlign: textSettings.textAlign as any,
                      textShadow: textSettings.textShadow 
                        ? `${textSettings.shadowOffsetX}px ${textSettings.shadowOffsetY}px ${textSettings.shadowBlur}px ${textSettings.shadowColor}`
                        : 'none',
                      whiteSpace: 'nowrap',
                      minWidth: 'max-content',
                      width: 'auto',
                      height: 'auto',
                      cursor: selectedElement === 'text' ? 'move' : 'pointer',
                      border: selectedElement === 'text' ? '2px solid #3b82f6' : 'none',
                      borderRadius: selectedElement === 'text' ? '4px' : '0',
                      boxShadow: selectedElement === 'text' ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
                      padding: selectedElement === 'text' ? '4px 8px' : '0'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'text')}
                     onTouchStart={(e) => handleTouchStart(e, 'text')}
                     onClick={() => handleElementClick('text')}
                  >
                    {processText(textSettings.content)}
                  </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}