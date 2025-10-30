// file : canvasPixi.tsx
import React, { useCallback, useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { 
  Application, Graphics, Text, Point, Sprite, Texture, Assets, TextStyle, BlurFilter, AlphaFilter, ColorMatrixFilter
} from 'pixi.js';
import {
  AdjustmentFilter
} from 'pixi-filters';
import { Maximize2 } from 'lucide-react';

interface DimensionButtonProps {
  width: number;
  height: number;
  onClick?: () => void;
}

const DimensionButton: React.FC<DimensionButtonProps> = ({ width, height, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900/20 hover:bg-gray-800/30 border border-gray-400/30 hover:border-gray-300/50 rounded-lg text-gray-200 hover:text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
    >
      <Maximize2 className="h-4 w-4 text-blue-400" />
      <span className="text-gray-300">الأبعاد:</span>
      <span className="text-white font-semibold">{width} × {height}</span>
    </button>
  );
};

interface DraggableRectanglesProps {
  width: number;
  height: number;
  backgroundColor?: number;
  onDimensionButtonClick?: () => void;
  onLoad?: () => void;
}

interface RectangleConfig {
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
  isTextContainer?: boolean;
}

interface TextConfig {
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
  containerWidth?: number;
  containerHeight?: number;
}

interface TextContainer {
  container: Graphics;
  text: Text;
  elementId: string;
  originalWidth: number;
  originalHeight: number;
  currentWidth: number;
  currentHeight: number;
  fontSize: number;
  fontFamily: string;
  textContent: string;
  maxFontSize?: number;
  minFontSize?: number;
  showBorder?: boolean;
  borderColor?: number;
  borderWidth?: number;
}

interface ResizeBorder {
  visible: boolean;
  target: Graphics | TextContainer | null;
  border: Graphics | null;
  handles: Graphics[];
}

interface RectangleSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
  color: number;
  imageUrl?: string;
  imageFit?: 'fill' | 'cover' | 'contain';
  showBorder?: boolean;
  borderColor?: number;
  borderWidth?: number;
  opacity?: number;
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
  isTextContainer?: boolean;
}

interface TextSettings {
  x: number;
  y: number;
  fontSize: number;
  color: number;
  fontFamily: string;
  fontStyle: 'normal' | 'bold' | 'italic';
  align: 'left' | 'center' | 'right';
  text: string;
  showBorder?: boolean;
  borderColor?: number;
  borderWidth?: number;
  containerWidth?: number;
  containerHeight?: number;
}

interface LayerElement {
  id: string;
  type: 'rectangle' | 'text';
  name: string;
  visible: boolean;
  zIndex: number;
  specialist?: string;
}

interface LayerManager {
  layers: LayerElement[];
  addLayer: (element: Omit<LayerElement, 'zIndex'>) => void;
  removeLayer: (id: string) => void;
  updateLayerVisibility: (id: string, visible: boolean) => void;
  updateLayerOrder: (id: string, newIndex: number) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  getLayers: () => LayerElement[];
  getLayer: (id: string) => LayerElement | undefined;
}

interface DraggableRectanglesRef {
  createRectangle: (config: Omit<RectangleConfig, 'x' | 'y'> & { x?: number; y?: number }) => Promise<string>;
  createText: (config: Omit<TextConfig, 'x' | 'y'> & { x?: number; y?: number }) => string;
  removeRectangle: (id: string) => void;
  removeText: (id: string) => void;
  clearAll: () => void;
  getRectangles: () => Graphics[];
  getTexts: () => TextContainer[];
  setRectangleImage: (id: string, imageUrl: string) => void;
  setRectangleImageFromFile: (id: string, file: File) => void;
  updateText: (id: string, updates: Partial<TextConfig>) => void;
  getAppRef: () => Application | null;
  
  getRectangleSettings: (id: string) => RectangleSettings | null;
  getTextSettings: (id: string) => TextSettings | null;
  updateRectangleSettings: (id: string, settings: Partial<RectangleSettings>) => void;
  updateTextSettings: (id: string, settings: Partial<TextSettings>) => void;
  
  getSelectedElement: (id?: string) => { type: string; id: string; settings: any } | null;
  selectElement: (id: string) => boolean;
  
  setRectangleBorder: (id: string, borderConfig: { showBorder?: boolean; borderColor?: number; borderWidth?: number }) => void;
  setTextBorder: (id: string, borderConfig: { showBorder?: boolean; borderColor?: number; borderWidth?: number }) => void;
  getBorderSettings: (id: string) => { showBorder: boolean; borderColor: number; borderWidth: number } | null;
  
  getLayers: () => LayerElement[];
  getLayersRef: () => LayerElement[];
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  updateLayerName: (id: string, name: string) => void;
  getLayerManager: () => LayerManager;

  onMouseDown: (callback: (element: { type: string; id: string; x: number; y: number; target: any }) => void) => void;
  onMouseMove: (callback: (element: { type: string; id: string; x: number; y: number; target: any }) => void) => void;
  onMouseUp: (callback: (element: { type: string; id: string; x: number; y: number; target: any }) => void) => void;
  onElementResize: (callback: (element: { type: string; id: string; width: number; height: number; x: number; y: number; target: any }) => void) => void;
  
  setCanvasDimensions: (width: number, height: number) => void;
  getCanvasDimensions: () => { width: number; height: number };

  removeAllListeners: () => void;
}

const MAX_TEXT_LENGTH = 50;
const MAX_RECTANGLE_WIDTH = 600;
const MAX_RECTANGLE_HEIGHT = 400;

// دالة لتحويل اللون من الصيغة المدمجة إلى { color, alpha }
const parseColorWithAlpha = (colorWithAlpha: number): { color: number; alpha: number } => {
  if (colorWithAlpha === undefined || colorWithAlpha === null) {
    return { color: 0x3498db, alpha: 1 };
  }
  
  // إذا كان اللون أقل من 0xFFFFFF (24-bit) فهو لا يحتوي على alpha
  if (colorWithAlpha <= 0xFFFFFF) {
    return { color: colorWithAlpha, alpha: 1 };
  }
  
  // استخراج قيمة alpha من آخر byteين (0-255) وتحويلها إلى (0-1)
  const alphaValue = (colorWithAlpha & 0xFF) / 255;
  // استخراج قيمة اللون من أول 6 خانات (24-bit)
  const colorValue = (colorWithAlpha >> 8) & 0xFFFFFF;
  
  return {
    color: colorValue,
    alpha: Math.max(0, Math.min(1, alphaValue))
  };
};

// دالة عكسية لتحويل { color, alpha } إلى صيغة مدمجة
const combineColorWithAlpha = (color: number, alpha: number): number => {
  const validatedAlpha = Math.max(0, Math.min(1, alpha));
  const alphaByte = Math.round(validatedAlpha * 255);
  
  return (color << 8) | alphaByte;
};

// دالة مساعدة لتحويل اللون إلى hex مع alpha
const numberToHexWithAlpha = (color: number | undefined): string => {
  if (color === undefined || color === null || isNaN(color)) {
    return '#3498dbff';
  }
  
  if (color <= 0xFFFFFF) {
    return `#${color.toString(16).padStart(6, '0')}ff`;
  }
  
  const colorValue = (color >> 8) & 0xFFFFFF;
  const alphaValue = color & 0xFF;
  
  return `#${colorValue.toString(16).padStart(6, '0')}${alphaValue.toString(16).padStart(2, '0')}`;
};

// دالة عكسية لتحويل hex مع alpha إلى number
const hexWithAlphaToNumber = (hex: string): number => {
  if (!hex || !hex.startsWith('#')) {
    return 0x3498dbff;
  }
  
  const hexValue = hex.replace('#', '');
  
  if (hexValue.length === 6) {
    const colorValue = parseInt(hexValue, 16);
    return (colorValue << 8) | 0xFF;
  } else if (hexValue.length === 8) {
    const colorValue = parseInt(hexValue.substring(0, 6), 16);
    const alphaValue = parseInt(hexValue.substring(6, 8), 16);
    return (colorValue << 8) | alphaValue;
  }
  
  return 0x3498dbff;
};

const DraggableRectangles = forwardRef<DraggableRectanglesRef, DraggableRectanglesProps>(({
  width,
  height,
  backgroundColor = 0x2c3e50,
  onDimensionButtonClick,
  onLoad
}, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application>(null);
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const rectanglesRef = useRef<Graphics[]>([]);
  const textContainersRef = useRef<TextContainer[]>([]);
  const dragTargetRef = useRef<Graphics | TextContainer | null>(null);
  const dragOffsetRef = useRef<Point>(new Point());
  const rectangleIdCounter = useRef(0);
  const textIdCounter = useRef(0);
  const activeElementRef = useRef<Graphics | TextContainer | null>(null);
  const resizeBorderPadding = 2;

  // useEffect(() => {
  //   if (!appRef.current || !appRef.current.renderer) return;
    
  //   setCanvasWidth(Math.floor(appRef.current.renderer.width));
  //   setCanvasHeight(Math.floor(appRef.current.renderer.height));
  // }, [appRef.current, appRef.current?.renderer.width, appRef.current?.renderer.height]);

  const resizeBorderRef = useRef<ResizeBorder>({
    visible: false,
    target: null,
    border: null,
    handles: []
  });

  const layersRef = useRef<LayerElement[]>([]);
  const layerIdCounter = useRef(0);
  const [showDimensionWindow, setShowDimensionWindow] = useState(false);

  const mouseDownCallbacksRef = useRef<((element: any) => void)[]>([]);
  const mouseMoveCallbacksRef = useRef<((element: any) => void)[]>([]);
  const mouseUpCallbacksRef = useRef<((element: any) => void)[]>([]);
  const elementResizeCallbacksRef = useRef<((element: any) => void)[]>([]);

  const triggerMouseDown = useCallback((element: any) => {
    mouseDownCallbacksRef.current.forEach(callback => callback(element));
  }, []);

  const triggerMouseMove = useCallback((element: any) => {
    mouseMoveCallbacksRef.current.forEach(callback => callback(element));
  }, []);

  const triggerMouseUp = useCallback((element: any) => {
    mouseUpCallbacksRef.current.forEach(callback => callback(element));
  }, []);

  const triggerElementResize = useCallback((element: any) => {
    elementResizeCallbacksRef.current.forEach(callback => callback(element));
  }, []);

  const isValidImageUrl = useCallback((url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
      const pathname = parsedUrl.pathname.toLowerCase();
      
      return imageExtensions.some(ext => pathname.endsWith(ext));
    } catch {
      return false;
    }
  }, []);

  const createErrorTexture = useCallback((): Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('خطأ في الصورة', 50, 50);
    }
    
    return Texture.from(canvas);
  }, []);

  const loadAndValidateImage = useCallback(async (imageUrl: string): Promise<Texture> => {
    try {
      console.log('جاري تحميل الصورة:', imageUrl);
      
      if (!imageUrl || imageUrl.trim() === '') {
        throw new Error('رابط الصورة غير صالح أو فارغ');
      }

      if (!isValidImageUrl(imageUrl)) {
        throw new Error('رابط الصورة غير مدعوم');
      }

      const timeoutPromise = new Promise<Texture>((_, reject) => {
        setTimeout(() => reject(new Error('انتهى وقت تحميل الصورة')), 10000);
      });

      const loadPromise = Assets.load(imageUrl);
      const texture = await Promise.race([loadPromise, timeoutPromise]);
      
      if (!texture || texture === Texture.EMPTY) {
        throw new Error('فشل في تحميل الصورة - texture غير صالح');
      }

      if (!texture.baseTexture || texture.baseTexture.width === 0 || texture.baseTexture.height === 0) {
        throw new Error('الصورة المحملة غير صالحة (أبعاد صفرية)');
      }

      console.log('✅ تم تحميل الصورة بنجاح:', {
        عرض: texture.width,
        ارتفاع: texture.height,
        الرابط: imageUrl
      });

      return texture;

    } catch (error) {
      console.error('❌ فشل في تحميل الصورة:', error);
      const fallbackTexture = createErrorTexture();
      return fallbackTexture;
    }
  }, [isValidImageUrl, createErrorTexture]);

  const loadImageFromFile = useCallback((file: File): Promise<Texture> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            console.log('📸 تحميل الصورة من الملف:', {
              name: file.name,
              type: file.type,
              size: file.size
            });
            
            const img = new Image();
            img.onload = () => {
              try {
                const texture = Texture.from(img);
                console.log('✅ تم تحميل texture بنجاح:', {
                  width: texture.width,
                  height: texture.height
                });
                resolve(texture);
              } catch (error) {
                console.error('❌ خطأ في إنشاء texture:', error);
                reject(new Error('فشل في إنشاء texture من الصورة'));
              }
            };
            
            img.onerror = () => {
              console.error('❌ فشل في تحميل الصورة');
              reject(new Error('فشل في تحميل الملف - صورة تالفة'));
            };
            
            img.src = e.target.result as string;
            
          } catch (error) {
            console.error('❌ خطأ في معالجة الصورة:', error);
            reject(error);
          }
        } else {
          reject(new Error('فشل في قراءة الملف'));
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ خطأ في قراءة الملف:', error);
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const applyImageFilters = useCallback((sprite: Sprite, filters: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  } = {}) => {
    
    sprite.filters = [];

    const newFilters: any[] = [];

    if (filters.blur && filters.blur > 0) {
      const blurFilter = new BlurFilter({
        strength: filters.blur * 2,
        quality: 6,
        kernelSize: 5
      });
      newFilters.push(blurFilter);
    }

    if (filters.brightness || filters.contrast || filters.saturation) {
      const adjustmentFilter = new AdjustmentFilter({
        brightness: filters.brightness !== undefined ? filters.brightness : 1,
        contrast: filters.contrast !== undefined ? filters.contrast : 1,
        saturation: filters.saturation !== undefined ? filters.saturation : 1,
      });
      newFilters.push(adjustmentFilter);
    }

    if (filters.hue !== undefined && filters.hue !== 0) {
      const colorMatrixFilter = new ColorMatrixFilter();
      colorMatrixFilter.hue(filters.hue, false);
      if (colorMatrixFilter) {
        newFilters.push(colorMatrixFilter);
      }
    }

    sprite.filters = newFilters.length > 0 ? newFilters : null;
    
    console.log('🎨 تم تطبيق الفلاتر باستخدام pixi-filters:', {
      blur: filters.blur,
      brightness: filters.brightness,
      contrast: filters.contrast,
      saturation: filters.saturation,
      hue: filters.hue,
      numberOfFilters: newFilters.length
    });

  }, []);

  const applyRectangleOpacity = useCallback((rectangle: Graphics, opacity: number = 1) => {
    const validOpacity = Math.max(0, Math.min(1, opacity));
    
    if (validOpacity < 1) {
      const alphaFilter = new AlphaFilter({alpha: validOpacity});
      rectangle.filters = [alphaFilter];
    } else {
      rectangle.filters = null;
    }

    console.log('🔮 تم تطبيق opacity باستخدام AlphaFilter:', validOpacity, rectangle.filters);
    
  }, []);

  const addImageToRectangle = useCallback(async (rectangle: Graphics, texture: Texture, imageFit: 'fill' | 'cover' | 'contain' = 'fill') => {
    if (!texture || texture === Texture.EMPTY) {
      console.warn('Invalid texture provided');
      const errorTexture = createErrorTexture();
      await addImageToRectangle(rectangle, errorTexture, imageFit);
      return;
    }

    const existingSprite = rectangle.children.find(child => child instanceof Sprite) as Sprite;
    if (existingSprite) {
      rectangle.removeChild(existingSprite);
      existingSprite.destroy();
    }

    const existingMask = rectangle.children.find(child => (child as any).isMask) as Graphics;
    if (existingMask) {
      rectangle.removeChild(existingMask);
      existingMask.destroy();
    }

    try {
      const sprite = new Sprite(texture);
      
      const rectWidth = (rectangle as any).currentWidth || (rectangle as any).originalWidth;
      const rectHeight = (rectangle as any).currentHeight || (rectangle as any).originalHeight;
      const actualCornerRadius = (rectangle as any).actualCornerRadius || 0;
      
      console.log('🎨 إضافة الصورة إلى المستطيل:', {
        rectWidth,
        rectHeight,
        textureWidth: texture.width,
        textureHeight: texture.height,
        cornerRadius: actualCornerRadius,
        imageFit
      });
      
      let spriteWidth = rectWidth;
      let spriteHeight = rectHeight;
      let spriteX = 0;
      let spriteY = 0;

      const textureAspect = texture.width / texture.height;
      const rectAspect = rectWidth / rectHeight;

      switch (imageFit) {
        case 'fill':
          spriteWidth = rectWidth;
          spriteHeight = rectHeight;
          break;
        
        case 'contain':
          if (textureAspect > rectAspect) {
            spriteWidth = rectWidth;
            spriteHeight = rectWidth / textureAspect;
          } else {
            spriteHeight = rectHeight;
            spriteWidth = rectHeight * textureAspect;
          }
          break;
        
        case 'cover':
          if (textureAspect > rectAspect) {
            spriteHeight = rectHeight;
            spriteWidth = rectHeight * textureAspect;
          } else {
            spriteWidth = rectWidth;
            spriteHeight = rectWidth / textureAspect;
          }
          break;
      }

      sprite.width = spriteWidth;
      sprite.height = spriteHeight;
      sprite.anchor.set(0.5);
      
      const storedOpacity = (rectangle as any).opacity ?? 1;
      if (storedOpacity < 1) {
        const alphaFilter = new AlphaFilter(storedOpacity);
        sprite.filters = [alphaFilter];
      }
      
      const storedFilters = (rectangle as any).filters || {};
      applyImageFilters(sprite, storedFilters);
      
      const mask = new Graphics();
      mask.roundRect(
        -rectWidth / 2,
        -rectHeight / 2,
        rectWidth,
        rectHeight,
        actualCornerRadius
      );
      mask.fill({
        color: 0xFFFFFF,
        alpha: 0,
      });
      (mask as any).isMask = true;
      
      sprite.mask = mask;
      
      rectangle.addChild(sprite);
      rectangle.addChild(mask);
      
      (rectangle as any).imageSprite = sprite;
      (rectangle as any).imageMask = mask;
      (rectangle as any).imageFit = imageFit;
      
      console.log('✅ تم إضافة الصورة بنجاح مع وضع:', imageFit);
      
    } catch (error) {
      console.error('❌ Failed to add image to rectangle:', error);
      const errorTexture = createErrorTexture();
      const errorSprite = new Sprite(errorTexture);
      
      const rectWidth = (rectangle as any).currentWidth || (rectangle as any).originalWidth;
      const rectHeight = (rectangle as any).currentHeight || (rectangle as any).originalHeight;
      const actualCornerRadius = (rectangle as any).actualCornerRadius || 0;
      
      errorSprite.width = rectWidth;
      errorSprite.height = rectHeight;
      errorSprite.anchor.set(0.5);
      
      const mask = new Graphics();
      mask.roundRect(
        -rectWidth / 2,
        -rectHeight / 2,
        rectWidth,
        rectHeight,
        actualCornerRadius
      );
      mask.fill({
        color: 0xFFFFFF,
        alpha: 0,
      });
      (mask as any).isMask = true;
      
      errorSprite.mask = mask;
      
      rectangle.addChild(errorSprite);
      rectangle.addChild(mask);
      (rectangle as any).imageSprite = errorSprite;
      (rectangle as any).imageMask = mask;
      (rectangle as any).imageFit = 'fill';
    }
  }, [createErrorTexture, applyImageFilters]);

  const redrawRectangle = useCallback((rectangle: Graphics, newWidth: number, newHeight: number) => {
    const isTextContainer = (rectangle as any).isTextContainer;
    
    const validatedWidth = isTextContainer ? newWidth : Math.min(newWidth, MAX_RECTANGLE_WIDTH);
    const validatedHeight = isTextContainer ? newHeight : Math.min(newHeight, MAX_RECTANGLE_HEIGHT);
    
    rectangle.clear();
    
    const cornerRadiusPercentage = (rectangle as any).cornerRadius || 0;
    const minDimension = Math.min(validatedWidth, validatedHeight);
    const actualCornerRadius = (cornerRadiusPercentage * minDimension) / 100;
    
    const showBorder = (rectangle as any).showBorder !== false;
    const borderWidth = (rectangle as any).borderWidth || 2;
    const borderColorConfig = (rectangle as any).borderColor || 0xffffff;
    const fillColorConfig = (rectangle as any).fillColor || (rectangle as any).fill?.color || 0x3498db;
    
    // تحويل الألوان لاستخراج الشفافية
    const fillColorParsed = parseColorWithAlpha(fillColorConfig);
    const borderColorParsed = parseColorWithAlpha(borderColorConfig);
    
    console.log('إعادة رسم المستطيل مع الشفافية:', {
      fillColor: fillColorParsed,
      borderColor: borderColorParsed,
      showBorder,
      borderWidth
    });
    
    rectangle.roundRect(
      -validatedWidth / 2,
      -validatedHeight / 2,
      validatedWidth,
      validatedHeight,
      actualCornerRadius
    );
    
    // استخدام fill مع alpha منفصل
    rectangle.fill({
      color: fillColorParsed.color,
      alpha: fillColorParsed.alpha
    });
    
    if (showBorder) {
      rectangle.stroke({ 
        width: borderWidth, 
        color: borderColorParsed.color,
        alpha: borderColorParsed.alpha
      });
    }
    
    (rectangle as any).currentWidth = validatedWidth;
    (rectangle as any).currentHeight = validatedHeight;
    (rectangle as any).actualCornerRadius = actualCornerRadius;
    
    const sprite = (rectangle as any).imageSprite as Sprite;
    const mask = (rectangle as any).imageMask as Graphics;
    const imageFit = (rectangle as any).imageFit || 'fill';
    
    if (sprite && sprite.texture) {
      console.log("تحديث حجم الصورة والـ mask في redrawRectangle:", validatedWidth, validatedHeight);
      
      const texture = sprite.texture;
      let spriteWidth = validatedWidth;
      let spriteHeight = validatedHeight;

      const textureAspect = texture.width / texture.height;
      const rectAspect = validatedWidth / validatedHeight;

      switch (imageFit) {
        case 'fill':
          spriteWidth = validatedWidth;
          spriteHeight = validatedHeight;
          break;
        
        case 'contain':
          if (textureAspect > rectAspect) {
            spriteWidth = validatedWidth;
            spriteHeight = validatedWidth / textureAspect;
          } else {
            spriteHeight = validatedHeight;
            spriteWidth = validatedHeight * textureAspect;
          }
          break;
        
        case 'cover':
          if (textureAspect > rectAspect) {
            spriteHeight = validatedHeight;
            spriteWidth = validatedHeight * textureAspect;
          } else {
            spriteWidth = validatedWidth;
            spriteHeight = validatedWidth / textureAspect;
          }
          break;
      }

      sprite.width = spriteWidth;
      sprite.height = spriteHeight;
      sprite.anchor.set(0.5);
      
      if (mask) {
        mask.clear();
        mask.roundRect(
          -validatedWidth / 2,
          -validatedHeight / 2,
          validatedWidth,
          validatedHeight,
          actualCornerRadius
        );
        mask.fill(0xFFFFFF);
      }
    }

    const storedImageUrl = (rectangle as any).imageUrl;
    if (storedImageUrl && !sprite) {
      console.log("إعادة تحميل الصورة المخزنة مع الأبعاد الجديدة");
      loadAndValidateImage(storedImageUrl).then(texture => {
        addImageToRectangle(rectangle, texture, imageFit);
      }).catch(error => {
        console.error('فشل في إعادة تحميل الصورة:', error);
      });
    }

    const storedOpacity = (rectangle as any).opacity ?? 1;
    if (storedOpacity < 1) {
        applyRectangleOpacity(rectangle, storedOpacity);
    }
    
  }, [loadAndValidateImage, addImageToRectangle, applyRectangleOpacity, applyImageFilters]);

  const createRectangle = useCallback(async (config: RectangleConfig, id: string): Promise<Graphics> => {
    const rectangle = new Graphics();
    
    console.log("إنشاء مستطيل جديد:", config);
    
    const isTextContainer = config.isTextContainer;
    
    const validatedWidth = isTextContainer 
      ? config.width 
      : Math.min(config.width, MAX_RECTANGLE_WIDTH);
    
    const validatedHeight = isTextContainer
      ? config.height
      : Math.min(config.height, MAX_RECTANGLE_HEIGHT);
    
    const cornerRadiusPercentage = config.cornerRadius || 0;
    const minDimension = Math.min(validatedWidth, validatedHeight);
    const actualCornerRadius = (cornerRadiusPercentage * minDimension) / 100;
    
    const borderWidth = config.borderWidth || 2;
    const borderColorConfig = config.borderColor || 0xffffff;
    const showBorder = config.showBorder !== false;
    const fillColorConfig = config.color;
    
    // تحويل الألوان لاستخراج الشفافية
    const fillColorParsed = parseColorWithAlpha(fillColorConfig);
    const borderColorParsed = parseColorWithAlpha(borderColorConfig);
    
    console.log('إنشاء مستطيل مع الشفافية:', {
      fillColor: fillColorParsed,
      borderColor: borderColorParsed
    });
    
    rectangle.roundRect(
      -validatedWidth / 2,
      -validatedHeight / 2,
      validatedWidth,
      validatedHeight,
      actualCornerRadius
    );
    
    // استخدام fill مع alpha منفصل
    rectangle.fill({
      color: fillColorParsed.color,
      alpha: fillColorParsed.alpha
    });
    
    if (showBorder) {
      rectangle.stroke({ 
        width: borderWidth, 
        color: borderColorParsed.color,
        alpha: borderColorParsed.alpha
      });
    }
    
    rectangle.x = config.x;
    rectangle.y = config.y;
    
    if (config.opacity !== undefined) {
      applyRectangleOpacity(rectangle, config.opacity);
    }
    
    (rectangle as any).rectangleId = id;
    (rectangle as any).originalWidth = validatedWidth;
    (rectangle as any).originalHeight = validatedHeight;
    (rectangle as any).currentWidth = validatedWidth;
    (rectangle as any).currentHeight = validatedHeight;
    (rectangle as any).cornerRadius = cornerRadiusPercentage;
    (rectangle as any).actualCornerRadius = actualCornerRadius;
    (rectangle as any).fillColor = fillColorConfig; // تخزين بالصيغة المدمجة
    (rectangle as any).showBorder = showBorder;
    (rectangle as any).borderColor = borderColorConfig; // تخزين بالصيغة المدمجة
    (rectangle as any).borderWidth = borderWidth;
    (rectangle as any).imageFit = config.imageFit || 'fill';
    (rectangle as any).opacity = config.opacity ?? 1;
    (rectangle as any).filters = config.filters || {};
    (rectangle as any).isTextContainer = config.isTextContainer || false;
    
    if (config.imageUrl) {
      if (!isValidImageUrl(config.imageUrl)) {
        console.warn('⚠️ رابط الصورة غير صالح:', config.imageUrl);
      } else {
        try {
          const imageTexture = await loadAndValidateImage(config.imageUrl);
          await addImageToRectangle(rectangle, imageTexture, config.imageFit || 'fill');
          (rectangle as any).imageUrl = config.imageUrl;
          
          if (config.filters) {
            const sprite = (rectangle as any).imageSprite as Sprite;
            if (sprite) {
              applyImageFilters(sprite, config.filters);
            }
          }
          
          console.log('✅ تم إضافة الصورة للمستطيل الجديد مع وضع:', config.imageFit || 'fill');
        } catch (error) {
          console.error('❌ فشل في إضافة الصورة للمستطيل:', error);
        }
      }
    } else if (config.imageFile){
      try {
        console.log('📁 معالجة imageFile:', {
          name: config.imageFile.name,
          type: config.imageFile.type,
          size: config.imageFile.size
        });
        
        const objectUrl = URL.createObjectURL(config.imageFile);
        
        const imageTexture = await loadImageFromFile(config.imageFile);
        
        if (!imageTexture || imageTexture === Texture.EMPTY) {
          throw new Error('Texture غير صالح بعد التحويل');
        }
        
        await addImageToRectangle(rectangle, imageTexture, config.imageFit || 'fill');
        
        (rectangle as any).imageUrl = objectUrl;
        (rectangle as any).imageFile = config.imageFile;
        
        if (config.filters) {
          const sprite = (rectangle as any).imageSprite as Sprite;
          if (sprite) {
            applyImageFilters(sprite, config.filters);
          }
        }
        
        console.log('✅ تم إضافة الصورة من الملف بنجاح:', config.imageFile.name);
        
      } catch (error) {
        console.error('❌ فشل في إضافة الصورة من الملف:', error);
        
        const errorTexture = createErrorTexture();
        await addImageToRectangle(rectangle, errorTexture, config.imageFit || 'fill');
      }
    }
    
    rectangle.eventMode = 'static';
    rectangle.cursor = 'pointer';
    
    return rectangle;
  }, [loadAndValidateImage, isValidImageUrl, addImageToRectangle, applyRectangleOpacity, applyImageFilters]);

  const isTextFitting = useCallback((textElement: Text, containerWidth: number, containerHeight: number): boolean => {
    const metrics = textElement.getLocalBounds();
    const safetyMargin = 5;
    
    return metrics.width <= containerWidth - safetyMargin && 
           metrics.height <= containerHeight - safetyMargin;
  }, []);

  const measureText = useCallback((textConfig: {
      text: string;
      fontSize: number;
      fontFamily: string;
      fontStyle?: string;
      maxWidth?: number;
      align?: string;
      breakWords?: boolean;
  }): { width: number; height: number; fontSize: number } => {
      
      const {
          text,
          fontSize,
          fontFamily,
          fontStyle = 'normal',
          align = 'center',
          breakWords = false
      } = textConfig;

      const textStyle: any = {
          fontFamily,
          fontSize,
          fill: 0x000000,
          align,
          breakWords,
      };

      if (fontStyle === 'bold') {
          textStyle.fontWeight = 'bold';
      } else if (fontStyle === 'italic') {
          textStyle.fontStyle = 'italic';
      }

      const tempText = new Text({
          text,
          style: new TextStyle(textStyle)
      });

      const metrics = tempText.getLocalBounds();
      tempText.destroy();

      return {
          width: metrics.width,
          height: metrics.height,
          fontSize: fontSize
      };
  }, []);

  const findOptimalFontSizeBinary = useCallback((config: {
      text: string;
      fontFamily: string;
      fontStyle?: string;
      containerWidth: number;
      containerHeight: number;
      minFontSize?: number;
      maxFontSize?: number;
      align?: string;
      breakWords?: boolean;
      padding?: number;
  }): { 
      optimalFontSize: number; 
      actualWidth: number; 
      actualHeight: number;
      fitsPerfectly: boolean;
      iterations: number;
  } => {
      
      const {
          text,
          fontFamily,
          fontStyle = 'normal',
          containerWidth,
          containerHeight,
          minFontSize = 8,
          maxFontSize = 120,
          align = 'center',
          breakWords = true,
          padding = 20
      } = config;

      console.log('🎯 بدء البحث الثنائي عن الحجم الأمثل:', {
          containerWidth: Math.round(containerWidth),
          containerHeight: Math.round(containerHeight),
          minFontSize,
          maxFontSize,
          padding
      });

      const measurementCache:any = new Map<number, ReturnType<typeof measureTextSize>>();
      
      const measureTextSize = (fontSize: number) => {
        if (measurementCache.has(fontSize)) {
          return measurementCache.get(fontSize)!;
        }

        const textStyle: any = {
            fontFamily,
            fontSize,
            fill: 0x000000,
            align,
            breakWords,
            wordWrap: true,
            wordWrapWidth: containerWidth - padding
        };

        if (fontStyle === 'bold') {
            textStyle.fontWeight = 'bold';
        } else if (fontStyle === 'italic') {
            textStyle.fontStyle = 'italic';
        }

        const tempText = new Text({
            text,
            style: new TextStyle(textStyle)
        });

        const metrics = tempText.getLocalBounds();
        const actualWidth = metrics.width;
        const actualHeight = metrics.height;

        tempText.destroy();

        const fitsWidth = actualWidth <= containerWidth - (padding / 2);
        const fitsHeight = actualHeight <= containerHeight - (padding / 2);
        const fitsPerfectly = fitsWidth && fitsHeight;

        const result = {
            actualWidth,
            actualHeight,
            fitsWidth,
            fitsHeight,
            fitsPerfectly
        };

        measurementCache.set(fontSize, result);
        return result;
      };

      let low = minFontSize;
      let high = maxFontSize;
      let optimalFontSize = minFontSize;
      let iterations = 0;
      let bestFit = {
          fontSize: minFontSize,
          width: 0,
          height: 0,
          fitsPerfectly: false
      };

      while (low <= high) {
          iterations++;
          const mid = Math.floor((low + high) / 2);
          
          console.log(`🔄 التكرار ${iterations}: [${low}, ${high}] -> اختبار الحجم ${mid}px`);

          const measurements = measureTextSize(mid);
          
          console.log(`   القياسات: ${Math.round(measurements.actualWidth)}x${Math.round(measurements.actualHeight)} - يناسب: ${measurements.fitsPerfectly ? 'نعم' : 'لا'}`);

          if (measurements.fitsPerfectly) {
              bestFit = {
                  fontSize: mid,
                  width: measurements.actualWidth,
                  height: measurements.actualHeight,
                  fitsPerfectly: true
              };
              optimalFontSize = mid;
              low = mid + 1;
              console.log(`   ✅ الحجم ${mid}px يناسب، البحث في النطاق [${low}, ${high}]`);
          } else {
              high = mid - 1;
              console.log(`   ❌ الحجم ${mid}px لا يناسب، البحث في النطاق [${low}, ${high}]`);
          }

          if (iterations > 20) {
              console.log('⚠️ توقف البحث بعد الحد الأقصى للتكرارات');
              break;
          }
      }

      if (bestFit.fitsPerfectly) {
          optimalFontSize = bestFit.fontSize;
      } else {
          console.log('⚠️ لم يتم العثور على حجم يناسب تماماً، استخدام أفضل محاولة');
          const minMeasurements = measureTextSize(minFontSize);
          optimalFontSize = minFontSize;
          bestFit = {
              fontSize: minFontSize,
              width: minMeasurements.actualWidth,
              height: minMeasurements.actualHeight,
              fitsPerfectly: minMeasurements.fitsPerfectly
          };
      }

      const finalMeasurements = measureTextSize(optimalFontSize);

      const result = {
          optimalFontSize,
          actualWidth: finalMeasurements.actualWidth,
          actualHeight: finalMeasurements.actualHeight,
          fitsPerfectly: finalMeasurements.fitsPerfectly,
          iterations
      };

      console.log('🎊 نتيجة البحث الثنائي:', {
          الحجم_الأمثل: result.optimalFontSize,
          العرض_الفعلي: Math.round(result.actualWidth),
          الارتفاع_الفعلي: Math.round(result.actualHeight),
          يناسب_تماماً: result.fitsPerfectly,
          عدد_التكرارات: result.iterations,
          الكفاءة: `${Math.round((iterations / (maxFontSize - minFontSize)) * 100)}%`
      });

      return result;
  }, []);

  const updateTextSize = useCallback((textContainer: TextContainer, newWidth: number, newHeight: number, fontSizeForce?: boolean) => {
    const { text, textContent, fontFamily, originalWidth, originalHeight, fontSize, minFontSize, maxFontSize } = textContainer;

    fontSizeForce = fontSizeForce || false;

    const { width, height } = measureText({
      text: textContainer.textContent,
      fontSize: fontSize > (maxFontSize || 120) ? maxFontSize || 120 : fontSize,
      fontFamily
    });

    const result = findOptimalFontSizeBinary({
      text: textContainer.textContent,
      fontFamily,
      containerWidth: newWidth,
      containerHeight: newHeight,
      minFontSize: minFontSize || 8,
      maxFontSize: maxFontSize || 120,
      align: text.style.align as any,
      breakWords: text.style.breakWords
    });

    console.log('=== بدء تحديث حجم النص ===', {
      originalWidth,
      originalHeight,
      newWidth,
      newHeight,
      fontSize,
      suggestWidth: width,
      suggestHeight: height,
      optimalFontSize: result.optimalFontSize,
      actualWidth: result.actualWidth,
      actualHeight: result.actualHeight,
      fitsPerfectly: result.fitsPerfectly,
      iterations: result.iterations,
    });

    const targetScaleX = newWidth / originalWidth;
    const targetScaleY = newHeight / originalHeight;
    const targetScale = Math.min(targetScaleX, targetScaleY);
    const targetFontSize = Math.round(fontSize * targetScale);
    
    console.log('الحجم المستهدف:', {
      targetScaleX,
      targetScaleY,
      targetScale,
      targetFontSize
    });

    const optimalFontSize = fontSizeForce ? (fontSize > (maxFontSize || 120) ? maxFontSize || 120 : fontSize < (minFontSize || 8) ? minFontSize || 8 : fontSize) : result.optimalFontSize;
    
    text.style = new TextStyle({
      fontFamily: text.style.fontFamily,
      fontSize: optimalFontSize,
      fill: text.style.fill,
      align: text.style.align as any,
      breakWords: text.style.breakWords,
      wordWrap: true,
      wordWrapWidth: newWidth - 20
    });
    
    textContainer.fontSize = optimalFontSize;
    textContainer.currentWidth = newWidth;
    textContainer.currentHeight = newHeight;
    
    const finalMetrics = text.getLocalBounds();
    
    console.log('🎯 التحديث النهائي:', {
      الحجم_النهائي: optimalFontSize,
      العرض_الفعلي: Math.round(finalMetrics.width),
      الارتفاع_الفعلي: Math.round(finalMetrics.height),
      حدود_الحاوية: { 
        width: Math.round(newWidth), 
        height: Math.round(newHeight) 
      },
      متجاوز_العرض: finalMetrics.width > newWidth,
      متجاوز_الارتفاع: finalMetrics.height > newHeight
    });
    
    return optimalFontSize;
  }, [findOptimalFontSizeBinary, measureText]);

  const createTextContainer = useCallback((config: TextConfig, id: string): TextContainer => {
    const {
      x,
      y,
      text,
      fontSize = 24,
      fontFamily = 'Arial',
      color = 0xffffff,
      maxWidth = 550,
      align = 'center',
      breakWords = true,
      fontStyle = 'normal',
      showBorder = false,
      borderColor = 0xffffff,
      borderWidth = 1,
      containerWidth,
      containerHeight
    } = config;

    const container = new Graphics();
    
    const validatedText = text && text.length > MAX_TEXT_LENGTH 
      ? text.substring(0, MAX_TEXT_LENGTH) 
      : text || 'النص الجديد';
    
    const textStyle: any = {
      fontFamily,
      fontSize,
      fill: color,
      align,
      breakWords,
      wordWrap: true,
      wordWrapWidth: maxWidth
    };

    if (fontStyle === 'bold') {
      textStyle.fontWeight = 'bold';
    } else if (fontStyle === 'italic') {
      textStyle.fontStyle = 'italic';
    }

    const textElement = new Text({
      text: validatedText,
      style: new TextStyle(textStyle)
    });

    const textMetrics = textElement.getLocalBounds();
    
    let adjustedFontSize = fontSize;
    const adjustedMetrics = textElement.getLocalBounds();
    
    let textWidth = containerWidth || Math.max(adjustedMetrics.width + 40, 100);
    let textHeight = containerHeight || Math.max(adjustedMetrics.height + 40, 60);

    console.log('أبعاد حاوية النص:', {
      عرض_مخصص: containerWidth,
      ارتفاع_مخصص: containerHeight,
      عرض_فعلي: Math.round(textWidth),
      ارتفاع_فعلي: Math.round(textHeight),
      عرض_النص: Math.round(adjustedMetrics.width),
      ارتفاع_النص: Math.round(adjustedMetrics.height),
      طول_النص: validatedText.length
    });

    container.rect(-textWidth / 2, -textHeight / 2, textWidth, textHeight);
    container.fill({
      color: 0x000000,
      alpha: 0,
    });
    
    if (showBorder) {
      container.stroke({ 
        width: borderWidth, 
        color: borderColor, 
        alpha: 0.8 
      });
    }

    container.x = x;
    container.y = y;
    container.eventMode = 'static';
    container.cursor = 'pointer';

    textElement.anchor.set(0.5);
    textElement.x = 0;
    textElement.y = 0;

    container.addChild(textElement);

    const textContainer: TextContainer = {
      container,
      text: textElement,
      elementId: id,
      originalWidth: textWidth,
      originalHeight: textHeight,
      currentWidth: textWidth,
      currentHeight: textHeight,
      fontSize: adjustedFontSize,
      fontFamily,
      textContent: validatedText,
      maxFontSize: 120,
      minFontSize: 8,
      showBorder,
      borderColor,
      borderWidth
    };

    console.log('تم إنشاء حاوية نص جديدة:', {
      النص: validatedText,
      العرض: Math.round(textWidth),
      الارتفاع: Math.round(textHeight),
      استخدام_أبعاد_مخصصة: !!(containerWidth || containerHeight),
      طول_النص: validatedText.length
    });

    return textContainer;
  }, []);

  const redrawTextContainer = useCallback((textContainer: TextContainer, newWidth: number, newHeight: number, fontSizeForce?: boolean) => {
    const { container, text, showBorder = false, borderColor = 0xffffff, borderWidth = 1 } = textContainer;

    fontSizeForce = fontSizeForce || false;
    
    if (textContainer.textContent.length > MAX_TEXT_LENGTH) {
      textContainer.textContent = textContainer.textContent.substring(0, MAX_TEXT_LENGTH);
      textContainer.text.text = textContainer.textContent;
    }
    
    console.log('🔄 إعادة رسم حاوية النص:', { 
      newWidth: Math.round(newWidth), 
      newHeight: Math.round(newHeight),
      fontSize: textContainer.fontSize,
      showBorder,
      borderColor,
      borderWidth,
      طول_النص: textContainer.textContent.length
    });

    const { width, height } = measureText({
      text: textContainer.textContent,
      fontSize: textContainer.fontSize > (textContainer.maxFontSize || 120) ? textContainer.maxFontSize || 120 : textContainer.fontSize,
      fontFamily: textContainer.fontFamily
    });

    console.log('measureText t t t : ', width, height);
    
    container.clear();
    container.rect(-newWidth / 2, -newHeight / 2, newWidth, newHeight);
    container.fill({
      color: 0x000000,
      alpha: 0,
    });
    
    if (showBorder) {
      container.stroke({ 
        width: borderWidth, 
        color: borderColor, 
        alpha: 0.8 
      });
    }
    
    textContainer.currentWidth = newWidth;
    textContainer.currentHeight = newHeight;
    
    text.style.wordWrapWidth = newWidth - 10;
    
    updateTextSize(textContainer, newWidth, newHeight, fontSizeForce);
    
    console.log('✅ تم إعادة رسم حاوية النص مع البوردر الجديد');
  }, [updateTextSize, measureText]);

  const getResizeCursor = (handleIndex: number): string => {
    switch (handleIndex) {
      case 0: case 7: return 'nw-resize';
      case 1: case 6: return 'n-resize';
      case 2: case 5: return 'ne-resize';
      case 3: case 4: return 'e-resize';
      default: return 'pointer';
    }
  };

  const setupResizeHandles = useCallback(() => {
    if (!resizeBorderRef.current.border || !resizeBorderRef.current.target) return;

    const resizeData = {
      originalWidth: 0,
      originalHeight: 0,
      originalX: 0,
      originalY: 0,
      originalMouseX: 0,
      originalMouseY: 0,
      handleIndex: -1
    };

    resizeBorderRef.current.handles.forEach((handle, index) => {
      handle.eventMode = 'static';
      handle.cursor = getResizeCursor(index);
      
      handle.on('pointerdown', (event: any) => {
        event.stopPropagation();
        
        if (!resizeBorderRef.current.target) return;
        
        const target = resizeBorderRef.current.target;
        const globalPos = event.global;
        
        if (target instanceof Graphics) {
          resizeData.originalWidth = (target as any).currentWidth;
          resizeData.originalHeight = (target as any).currentHeight;
        } else {
          resizeData.originalWidth = (target as TextContainer).currentWidth;
          resizeData.originalHeight = (target as TextContainer).currentHeight;
        }
        
        resizeData.originalX = target instanceof Graphics ? target.x : target.container.x;
        resizeData.originalY = target instanceof Graphics ? target.y : target.container.y;
        resizeData.originalMouseX = globalPos.x;
        resizeData.originalMouseY = globalPos.y;
        resizeData.handleIndex = index;
        
        appRef.current?.stage.on('pointermove', onResizeMove);
        appRef.current?.stage.on('pointerup', onResizeUp);
        appRef.current?.stage.on('pointerupoutside', onResizeUp);
      });
    });

    const onResizeMove = (event: any) => {
      if (!resizeBorderRef.current.target || resizeData.handleIndex === -1) return;

      const target = resizeBorderRef.current.target;
      const currentMouseX = event.global.x;
      const currentMouseY = event.global.y;
      
      const deltaX = currentMouseX - resizeData.originalMouseX;
      const deltaY = currentMouseY - resizeData.originalMouseY;

      let newWidth = resizeData.originalWidth;
      let newHeight = resizeData.originalHeight;
      let newX = resizeData.originalX;
      let newY = resizeData.originalY;

      const minSize = 50;

      switch (resizeData.handleIndex) {
        case 0: // top-left
          newWidth = Math.max(minSize, resizeData.originalWidth - deltaX);
          newHeight = Math.max(minSize, resizeData.originalHeight - deltaY);
          newX = resizeData.originalX + (resizeData.originalWidth - newWidth) / 2;
          newY = resizeData.originalY + (resizeData.originalHeight - newHeight) / 2;
          break;
        case 1: // top-center
          newHeight = Math.max(minSize, resizeData.originalHeight - deltaY);
          newY = resizeData.originalY + (resizeData.originalHeight - newHeight) / 2;
          break;
        case 2: // top-right
          newWidth = Math.max(minSize, resizeData.originalWidth + deltaX);
          newHeight = Math.max(minSize, resizeData.originalHeight - deltaY);
          newX = resizeData.originalX + (newWidth - resizeData.originalWidth) / 2;
          newY = resizeData.originalY + (resizeData.originalHeight - newHeight) / 2;
          break;
        case 3: // middle-left
          newWidth = Math.max(minSize, resizeData.originalWidth - deltaX);
          newX = resizeData.originalX + (resizeData.originalWidth - newWidth) / 2;
          break;
        case 4: // middle-right
          newWidth = Math.max(minSize, resizeData.originalWidth + deltaX);
          newX = resizeData.originalX + (newWidth - resizeData.originalWidth) / 2;
          break;
        case 5: // bottom-left
          newWidth = Math.max(minSize, resizeData.originalWidth - deltaX);
          newHeight = Math.max(minSize, resizeData.originalHeight + deltaY);
          newX = resizeData.originalX + (resizeData.originalWidth - newWidth) / 2;
          newY = resizeData.originalY + (newHeight - resizeData.originalHeight) / 2;
          break;
        case 6: // bottom-center
          newHeight = Math.max(minSize, resizeData.originalHeight + deltaY);
          newY = resizeData.originalY + (newHeight - resizeData.originalHeight) / 2;
          break;
        case 7: // bottom-right
          newWidth = Math.max(minSize, resizeData.originalWidth + deltaX);
          newHeight = Math.max(minSize, resizeData.originalHeight + deltaY);
          newX = resizeData.originalX + (newWidth - resizeData.originalWidth) / 2;
          newY = resizeData.originalY + (newHeight - resizeData.originalHeight) / 2;
          break;
      }

      if (target instanceof Graphics) {
        redrawRectangle(target, newWidth, newHeight);
        target.x = newX;
        target.y = newY;
      } else {
        console.log(" - !!!!!! new width : ", newWidth);
        console.log(" - !!!!!! new height : ", newHeight);
        redrawTextContainer(target, newWidth, newHeight, false);
        target.container.x = newX;
        target.container.y = newY;
        
        const textMetrics = target.text.getLocalBounds();
        console.log('أبعاد النص بعد التحديث:', {
          width: Math.round(textMetrics.width),
          height: Math.round(textMetrics.height),
          fontSize: target.fontSize,
          container: { width: Math.round(newWidth), height: Math.round(newHeight) }
        });
      }
      
      const elementId = target instanceof Graphics ? 
        (target as any).rectangleId : 
        (target as TextContainer).elementId;
      const elementType = target instanceof Graphics ? 'rectangle' : 'text';
      
      triggerElementResize({
        type: elementType,
        id: elementId,
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
        target: target
      });
      
      updateResizeBorder(target);
    };

    const onResizeUp = () => {
      resizeData.handleIndex = -1;
      appRef.current?.stage.off('pointermove', onResizeMove);
      appRef.current?.stage.off('pointerup', onResizeUp);
      appRef.current?.stage.off('pointerupoutside', onResizeUp);
    };

    const updateResizeBorder = (target: Graphics | TextContainer) => {
      if (!resizeBorderRef.current.border) return;
      createResizeBorder(target);
    };
  }, [redrawRectangle, redrawTextContainer, triggerElementResize]);

  const createResizeBorder = useCallback((target: Graphics | TextContainer) => {
    if (!appRef.current) return;

    if (resizeBorderRef.current.border) {
      appRef.current.stage.removeChild(resizeBorderRef.current.border);
    }
    resizeBorderRef.current.handles.forEach(handle => {
      appRef.current?.stage.removeChild(handle);
    });

    const border = new Graphics();
    const handles: Graphics[] = [];
    
    const handleSize = 8;
    const handleColor = 0xffffff;
    const borderColor = 0xffffff;
    
    let currentWidth: number, currentHeight: number, targetX: number, targetY: number;
    
    if (target instanceof Graphics) {
      currentWidth = (target as any).currentWidth;
      currentHeight = (target as any).currentHeight;
      targetX = target.x;
      targetY = target.y;
    } else {
      currentWidth = target.currentWidth;
      currentHeight = target.currentHeight;
      targetX = target.container.x;
      targetY = target.container.y;
    }
    
    const borderPadding = resizeBorderPadding;

    border.stroke({ width: 2, color: borderColor });
    border.rect(
      -currentWidth / 2 - borderPadding, 
      -currentHeight / 2 - borderPadding, 
      currentWidth + (borderPadding * 2), 
      currentHeight + (borderPadding * 2)
    );
    
    const halfWidth = currentWidth / 2;
    const halfHeight = currentHeight / 2;
    
    const positions = [
      { x: -halfWidth - borderPadding, y: -halfHeight - borderPadding },
      { x: 0, y: -halfHeight - borderPadding },
      { x: halfWidth + borderPadding, y: -halfHeight - borderPadding },
      { x: -halfWidth - borderPadding, y: 0 },
      { x: halfWidth + borderPadding, y: 0 },
      { x: -halfWidth - borderPadding, y: halfHeight + borderPadding },
      { x: 0, y: halfHeight + borderPadding },
      { x: halfWidth + borderPadding, y: halfHeight + borderPadding }
    ];

    positions.forEach((pos, index) => {
      const handle = new Graphics();
      
      handle.rect(pos.x - handleSize/2, pos.y - handleSize/2, handleSize, handleSize);
      handle.fill(handleColor);
      handle.stroke({ width: 1, color: 0x000000 });
      
      handle.eventMode = 'static';
      handle.cursor = getResizeCursor(index);
      
      handles.push(handle);
      border.addChild(handle);
    });

    border.x = targetX;
    border.y = targetY;

    appRef.current.stage.addChild(border);

    resizeBorderRef.current = {
      visible: true,
      target: target,
      border: border,
      handles: handles
    };

    setupResizeHandles();

  }, [setupResizeHandles]);

  const hideResizeBorder = useCallback(() => {
    if (!appRef.current) return;

    if (resizeBorderRef.current.border) {
      appRef.current.stage.removeChild(resizeBorderRef.current.border);
      resizeBorderRef.current.border = null;
    }
    
    resizeBorderRef.current.handles = [];
    resizeBorderRef.current.visible = false;
    resizeBorderRef.current.target = null;
    activeElementRef.current = null;
  }, []);

  const reorderElements = useCallback(() => {
    if (!appRef.current) return;

    const stage = appRef.current.stage;
    
    const allElements: { element: Graphics | TextContainer; zIndex: number }[] = [];
    
    rectanglesRef.current.forEach(rect => {
      const layer = layersRef.current.find(l => l.id === (rect as any).rectangleId);
      if (layer) {
        allElements.push({ element: rect, zIndex: layer.zIndex });
      }
    });
    
    textContainersRef.current.forEach(textContainer => {
      const layer = layersRef.current.find(l => l.id === textContainer.elementId);
      if (layer) {
        allElements.push({ element: textContainer, zIndex: layer.zIndex });
      }
    });
    
    allElements.sort((a, b) => a.zIndex - b.zIndex);
    
    allElements.forEach(({ element }) => {
      if (element instanceof Graphics) {
        stage.removeChild(element);
      } else {
        stage.removeChild(element.container);
      }
    });
    
    allElements.forEach(({ element }) => {
      if (element instanceof Graphics) {
        stage.addChild(element);
      } else {
        stage.addChild(element.container);
      }
    });
  }, []);

  const addLayer = useCallback((element: Omit<LayerElement, 'zIndex'>) => {
    const newLayer: LayerElement = {
      ...element,
      zIndex: layersRef.current.length
    };

    console.log('addLayer from pixi :: ', newLayer);
    
    layersRef.current.push(newLayer);
    reorderElements();
    
    return newLayer;
  }, [reorderElements]);

  const removeLayer = useCallback((id: string) => {
    layersRef.current = layersRef.current.filter(layer => layer.id !== id);
    reorderElements();
  }, [reorderElements]);

  const updateLayerVisibility = useCallback((id: string, visible: boolean) => {
    const layer = layersRef.current.find(l => l.id === id);
    if (layer) {
      layer.visible = visible;
      
      const rectangle = rectanglesRef.current.find(rect => (rect as any).rectangleId === id);
      const textContainer = textContainersRef.current.find(tc => tc.elementId === id);
      
      if (rectangle) {
        rectangle.visible = visible;
      } else if (textContainer) {
        textContainer.container.visible = visible;
      }
      
      reorderElements();
    }
  }, [reorderElements]);

  const moveLayerUp = useCallback((id: string) => {
    const index = layersRef.current.findIndex(layer => layer.id === id);
    if (index < layersRef.current.length - 1) {
      const currentLayer = layersRef.current[index];
      const nextLayer = layersRef.current[index + 1];
      
      const tempZIndex = currentLayer.zIndex;
      currentLayer.zIndex = nextLayer.zIndex;
      nextLayer.zIndex = tempZIndex;
      
      layersRef.current.sort((a, b) => a.zIndex - b.zIndex);
      reorderElements();
    }
  }, [reorderElements]);

  const moveLayerDown = useCallback((id: string) => {
    const index = layersRef.current.findIndex(layer => layer.id === id);
    if (index > 0) {
      const currentLayer = layersRef.current[index];
      const previousLayer = layersRef.current[index - 1];
      
      const tempZIndex = currentLayer.zIndex;
      currentLayer.zIndex = previousLayer.zIndex;
      previousLayer.zIndex = tempZIndex;
      
      layersRef.current.sort((a, b) => a.zIndex - b.zIndex);
      reorderElements();
    }
  }, [reorderElements]);

  const updateLayerName = useCallback((id: string, name: string) => {
    const layer = layersRef.current.find(l => l.id === id);
    if (layer) {
      layer.name = name;
    }
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    const layer = layersRef.current.find(l => l.id === id);
    if (layer) {
      updateLayerVisibility(id, !layer.visible);
    }
  }, [updateLayerVisibility]);

  const createRectangleWithLayer = useCallback(async (config: RectangleConfig, id: string): Promise<Graphics> => {
    const rectangle = await createRectangle(config, id);
    
    addLayer({
      id,
      type: 'rectangle',
      specialist: config.specialist || '',
      name: `${config.specialist || 'rectangle'} ${layersRef.current.length + 1}`,
      visible: true
    });
    
    return rectangle;
  }, [createRectangle, addLayer]);

  const createTextContainerWithLayer = useCallback((config: TextConfig, id: string): TextContainer => {
    const textContainer = createTextContainer(config, id);
    
    addLayer({
      id,
      type: 'text',
      specialist: config.specialist || '',
      name: `${config.specialist || 'text'} ${layersRef.current.length + 1}`,
      visible: true
    });
    
    return textContainer;
  }, [createTextContainer, addLayer]);

  const removeRectangleWithLayer = useCallback((id: string) => {
    removeLayer(id);
  }, [removeLayer]);

  const removeTextWithLayer = useCallback((id: string) => {
    removeLayer(id);
  }, [removeLayer]);

  const setupDragEvents = useCallback(() => {
    if (!appRef.current) return;

    const app = appRef.current;
    const rectangles = rectanglesRef.current;
    const textContainers = textContainersRef.current;

    const onPointerDown = (event: any) => {
      const target = event.target as Graphics;
      
      const isRectangle = rectangles.includes(target);
      const isTextContainer = textContainers.some(tc => tc.container === target);
      
      if (target && (isRectangle || isTextContainer)) {
        let actualTarget: Graphics | TextContainer;
        let elementId: string;
        let elementType: string;
        
        if (isRectangle) {
          actualTarget = target;
          elementId = (target as any).rectangleId;
          elementType = 'rectangle';
        } else {
          actualTarget = textContainers.find(tc => tc.container === target)!;
          elementId = actualTarget.elementId;
          elementType = 'text';
        }
        
        triggerMouseDown({
          type: elementType,
          id: elementId,
          x: target.x,
          y: target.y,
          target: actualTarget
        });
        
        dragTargetRef.current = actualTarget;
        activeElementRef.current = actualTarget;
        
        const elementPos = target.getGlobalPosition();
        dragOffsetRef.current.x = event.global.x - elementPos.x;
        dragOffsetRef.current.y = event.global.y - elementPos.y;
        
        target.alpha = 0.7;
        
        createResizeBorder(actualTarget);
      } else {
        hideResizeBorder(); 
      }
    };

    const onPointerMove = (event: any) => {
      if (dragTargetRef.current) {
        let target: Graphics;
        let elementId: string;
        let elementType: string;
        
        if (dragTargetRef.current instanceof Graphics) {
          target = dragTargetRef.current;
          elementId = (target as any).rectangleId;
          elementType = 'rectangle';
        } else {
          target = dragTargetRef.current.container;
          elementId = dragTargetRef.current.elementId;
          elementType = 'text';
        }
        
        const newX = event.global.x - dragOffsetRef.current.x;
        const newY = event.global.y - dragOffsetRef.current.y;
        
        target.position.set(newX, newY);

        triggerMouseMove({
          type: elementType,
          id: elementId,
          x: newX,
          y: newY,
          target: dragTargetRef.current
        });

        if (resizeBorderRef.current.visible && resizeBorderRef.current.border) {
          resizeBorderRef.current.border.position.copyFrom(target.position);
        }
      }
    };

    const releaseDragTarget = () => {
      if (dragTargetRef.current) {
        let target: Graphics;
        let elementId: string;
        let elementType: string;
        
        if (dragTargetRef.current instanceof Graphics) {
          target = dragTargetRef.current;
          elementId = (target as any).rectangleId;
          elementType = 'rectangle';
        } else {
          target = dragTargetRef.current.container;
          elementId = dragTargetRef.current.elementId;
          elementType = 'text';
        }
        
        triggerMouseUp({
          type: elementType,
          id: elementId,
          x: target.x,
          y: target.y,
          target: dragTargetRef.current
        });
        
        target.alpha = 1;
        dragTargetRef.current = null;
      }
    };

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    
    app.stage.on('pointerdown', onPointerDown);
    app.stage.on('pointermove', onPointerMove);
    app.stage.on('pointerup', releaseDragTarget);
    app.stage.on('pointerupoutside', releaseDragTarget);

    return () => {
      app.stage.off('pointerdown', onPointerDown);
      app.stage.off('pointermove', onPointerMove);
      app.stage.off('pointerup', releaseDragTarget);
      app.stage.off('pointerupoutside', releaseDragTarget);
    };
  }, [createResizeBorder, hideResizeBorder, triggerMouseDown, triggerMouseMove, triggerMouseUp]);

  const cleanupMemory = useCallback(() => {
    if (appRef.current) {
      rectanglesRef.current.forEach(rect => {
        const sprite = (rect as any).imageSprite;
        const mask = (rect as any).imageMask;
        if (sprite) {
          sprite.texture?.destroy();
          sprite.destroy();
        }
        if (mask) {
          mask.destroy();
        }
        rect.destroy();
      });
      
      textContainersRef.current.forEach(tc => {
        tc.text.destroy();
        tc.container.destroy();
      });
      
      rectanglesRef.current = [];
      textContainersRef.current = [];
      layersRef.current = [];
      
      hideResizeBorder();
    }
  }, [hideResizeBorder]);

  const initializeApp = useCallback(async () => {
    console.log("initializeApp : ", canvasWidth, canvasHeight, backgroundColor);
    if (!canvasRef.current) return;
    console.log("canvasRef.current : ", canvasRef.current);

    try {
      const app = new Application();
      await app.init({
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });
      app.canvas.style.border = '2px dashed #898989c4';
      app.canvas.style.boxSizing = 'content-box';
      app.canvas.style.alignSelf = 'center';

      canvasRef.current.appendChild(app.canvas);
      appRef.current = app;
      console.log("appRef.current : ", appRef.current);
      if (onLoad) {
      onLoad();
    }

      const cleanupEvents = setupDragEvents();
      
      return () => {
        cleanupEvents?.();
        hideResizeBorder();
        if (appRef.current) {
          appRef.current.destroy(true);
        }
      };
    } catch (error) {
      console.error('❌ فشل في تهيئة التطبيق:', error);
    }
  }, [canvasWidth, canvasHeight, backgroundColor, setupDragEvents, hideResizeBorder]);

  useEffect(() => {
    // فقط initialize مرة واحدة عند mount
    let cleanup: (() => void) | undefined;
    let mounted = true;

    const init = async () => {
      // تحقق من عدم وجود app بالفعل
      if (appRef.current) {
        console.log('App already initialized, skipping...');
        return;
      }
      
      try {
        const cleanupFn = await initializeApp();
        if (mounted && cleanupFn) {
          cleanup = cleanupFn;
        }
      } catch (error) {
        console.error('فشل في التهيئة:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []); // dependencies فارغة - initialize مرة واحدة فقط!

  useEffect(() => {
    if (appRef.current && appRef.current.renderer) {
      console.log('Resizing canvas:', canvasWidth, canvasHeight);
      
      // تغيير حجم الـ renderer فقط دون إعادة التهيئة
      appRef.current.renderer.resize(canvasWidth, canvasHeight);
      
      // تحديث حدود الـ stage
      appRef.current.stage.hitArea = appRef.current.screen;
      
      console.log('Canvas resized successfully');
    }
  }, [canvasWidth, canvasHeight]);

  const calculateOptimalTextDimensions = useCallback((textElement: Text, margin: number = 40): { width: number; height: number } => {
    const metrics = textElement.getLocalBounds();

    console.log('metrics : ', metrics.width, metrics.height);
    
    const optimalWidth = Math.max(metrics.width + margin, 100);
    const optimalHeight = Math.max(metrics.height + margin, 60);
    
    return {
      width: optimalWidth,
      height: optimalHeight
    };
  }, []);

  const getSelectedElement = useCallback((id?: string) => {
    if (!id) return null;
    
    const layers = layersRef.current;
      let layer = null;
      if(id) {
        layer = layers.find(l => l.id === id);
      } else {
        if (activeElementRef.current instanceof Graphics) {
          const rect = activeElementRef.current as Graphics;
          const id = (rect as any).rectangleId;
          layer = layers.find(l => l.id === id);
        } else {
          const text = activeElementRef.current as TextContainer;
          const id = text.elementId;
          layer = layers.find(l => l.id === id);
        }
      }

      if (!layer) return null;
      
      if (layer.type === 'rectangle') {
        const id = (layer as LayerElement).id;
        const settings = rectanglesRef.current.find(r => (r as any).rectangleId === id) ? 
          (() => {
            const rect = rectanglesRef.current.find(r => (r as any).rectangleId === id)!;
            return {
              x: rect.x,
              y: rect.y,
              width: (rect as any).currentWidth,
              height: (rect as any).currentHeight,
              cornerRadius: (rect as any).cornerRadius,
              color: (rect as any).fillColor,
              imageUrl: (rect as any).imageUrl,
              imageFit: (rect as any).imageFit || 'fill',
              showBorder: (rect as any).showBorder !== false,
              borderColor: (rect as any).borderColor || 0xffffff,
              borderWidth: (rect as any).borderWidth || 2,
              opacity: (rect as any).opacity ?? 1,
              filters: (rect as any).filters || {},
              isTextContainer: (rect as any).isTextContainer || false
            };
          })() : null;
        
        return {
          type: 'rectangle',
          id,
          settings
        };
      } else {
        const id = (layer as LayerElement).id;
        const settings = textContainersRef.current.find(t => t.elementId === id) ? 
          (() => {
            const textContainer = textContainersRef.current.find(t => t.elementId === id)!;
            
            const fontWeight = textContainer.text.style.fontWeight;
            const fontStyle = textContainer.text.style.fontStyle;
            
            let textFontStyle: 'normal' | 'bold' | 'italic' = 'normal';
            if (fontWeight === 'bold') {
              textFontStyle = 'bold';
            } else if (fontStyle === 'italic') {
              textFontStyle = 'italic';
            }
            
            return {
              x: textContainer.container.x,
              y: textContainer.container.y,
              fontSize: textContainer.fontSize,
              color: textContainer.text.style.fill as number,
              fontFamily: textContainer.fontFamily,
              fontStyle: textFontStyle,
              align: textContainer.text.style.align as 'left' | 'center' | 'right',
              text: textContainer.textContent,
              showBorder: textContainer.showBorder,
              borderColor: textContainer.borderColor || 0xffffff,
              borderWidth: textContainer.borderWidth || 1
            };
          })() : null;
        
        return {
          type: 'text',
          id: id,
          settings
        };
      }
    
  }, []);

  useImperativeHandle(ref, () => ({
    createRectangle: async (config: Omit<RectangleConfig, 'x' | 'y'> & { x?: number; y?: number }) => {
      console.log("config 0 : ", config);
      if (!appRef.current) return '';
      console.log("config 1 : ", config);

      const colors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c];
      const id = `rect-${rectangleIdCounter.current++}`;
      
      const isTextContainer = config.isTextContainer;
      
      const validatedWidth = isTextContainer 
        ? (config.width || 120)
        : Math.min(config.width || 120, MAX_RECTANGLE_WIDTH);
      
      const validatedHeight = isTextContainer
        ? (config.height || 80)
        : Math.min(config.height || 80, MAX_RECTANGLE_HEIGHT);
      
      const fullConfig: RectangleConfig = {
        x: typeof config.x === 'number' ? config.x : canvasWidth / 2,
        y: typeof config.y === 'number' ? config.y : canvasHeight / 2,
        color: config.color || colors[rectangleIdCounter.current % colors.length],
        width: validatedWidth,
        height: validatedHeight,
        cornerRadius: config.cornerRadius || 16,
        text: config.text || id,
        imageUrl: config.imageUrl,
        imageFile: config.imageFile,
        imageFit: config.imageFit || 'fill',
        showBorder: config.showBorder,
        borderColor: config.borderColor || 0xffffff,
        borderWidth: typeof config.borderWidth === 'number' ? config.borderWidth : 2,
        specialist: config.specialist || 'rectangle',
        opacity: typeof config.opacity === 'number' ? config.opacity : 1,
        filters: config.filters || {},
        isTextContainer: config.isTextContainer || false
      };

      const rectangle = await createRectangleWithLayer(fullConfig, id);
      appRef.current?.stage.addChild(rectangle);
      rectanglesRef.current.push(rectangle);

      return id;
    },

    createText: (config: Omit<TextConfig, 'x' | 'y'> & { x?: number; y?: number }) => {
      if (!appRef.current) return '';

      const id = `text-${textIdCounter.current++}`;
      
      const validatedText = config.text && config.text.length > MAX_TEXT_LENGTH 
        ? config.text.substring(0, MAX_TEXT_LENGTH) 
        : config.text || 'النص الجديد';
      
      const fullConfig: TextConfig = {
        x: typeof config.x === 'number' ? config.x : canvasWidth / 2,
        y: typeof config.y === 'number' ? config.y : canvasHeight / 2,
        text: validatedText,
        fontSize: config.fontSize || 70,
        fontFamily: config.fontFamily || 'Arial',
        color: config.color || 0xffffff,
        maxWidth: config.maxWidth || 550,
        align: config.align || 'center',
        breakWords: config.breakWords !== undefined ? config.breakWords : true,
        fontStyle: config.fontStyle || 'normal',
        showBorder: config.showBorder,
        borderColor: config.borderColor || 0xffffff,
        borderWidth: typeof config.borderWidth === 'number' ? config.borderWidth : 1,
        specialist: config.specialist || 'text',
      };

      const textContainer = createTextContainerWithLayer(fullConfig, id);
      appRef.current.stage.addChild(textContainer.container);
      textContainersRef.current.push(textContainer);

      return id;
    },

    removeRectangle: (id: string) => {
      if (!appRef.current) return;

      const index = rectanglesRef.current.findIndex(rect => 
        (rect as any).rectangleId === id
      );

      if (index !== -1) {
        const rectangle = rectanglesRef.current[index];
        
        const mask = (rectangle as any).imageMask as Graphics;
        if (mask) {
          rectangle.removeChild(mask);
          mask.destroy();
        }
        
        appRef.current.stage.removeChild(rectangle);
        rectanglesRef.current.splice(index, 1);

        removeRectangleWithLayer(id);

        if (resizeBorderRef.current.target === rectangle) {
          hideResizeBorder();
        }
      }
    },

    removeText: (id: string) => {
      if (!appRef.current) return;

      const index = textContainersRef.current.findIndex(text => 
        text.elementId === id
      );

      if (index !== -1) {
        const textContainer = textContainersRef.current[index];
        appRef.current.stage.removeChild(textContainer.container);
        textContainersRef.current.splice(index, 1);

        removeTextWithLayer(id);

        if (resizeBorderRef.current.target === textContainer) {
          hideResizeBorder();
        }
      }
    },

    clearAll: () => {
      if (!appRef.current) return;
      cleanupMemory();
    },

    getRectangles: () => {
      return rectanglesRef.current;
    },

    getTexts: () => {
      return textContainersRef.current;
    },

    setRectangleImage: async (id: string, imageUrl: string) => {
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      if (rectangle && appRef.current) {
        try {
          const texture = await loadAndValidateImage(imageUrl);
          (rectangle as any).imageUrl = imageUrl;
          await addImageToRectangle(rectangle, texture, (rectangle as any).imageFit || 'fill');
        } catch (error) {
          console.error('❌ فشل في تعيين الصورة من الرابط:', error);
        }
      }
    },

    setRectangleImageFromFile: async (id: string, file: File) => {
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      if (rectangle && appRef.current) {
        try {
          if (!file.type.startsWith('image/')) {
            throw new Error('الملف المحدد ليس صورة');
          }

          if (file.size > 10 * 1024 * 1024) {
            throw new Error('حجم الصورة كبير جداً (الحد الأقصى 10MB)');
          }

          const texture = await loadImageFromFile(file);
          
          if (!texture || texture === Texture.EMPTY) {
            throw new Error('فشل في تحميل الملف - صورة غير صالحة');
          }

          await addImageToRectangle(rectangle, texture, (rectangle as any).imageFit || 'fill');
          console.log('✅ تم تحميل صورة من الملف بنجاح مع mask');
          
        } catch (error) {
          console.error('❌ فشل في تعيين الصورة من الملف:', error);
          const errorTexture = createErrorTexture();
          await addImageToRectangle(rectangle, errorTexture, (rectangle as any).imageFit || 'fill');
        }
      }
    },

    updateText: (id: string, updates: Partial<TextConfig>) => {
      const textContainer = textContainersRef.current.find(text => 
        text.elementId === id
      );
      
      if (textContainer) {
        const { text, container } = textContainer;
        
        if (updates.text !== undefined) {
          const validatedText = updates.text.length > MAX_TEXT_LENGTH 
            ? updates.text.substring(0, MAX_TEXT_LENGTH) 
            : updates.text;
          
          text.text = validatedText;
          textContainer.textContent = validatedText;
        }
        
        if (updates.fontSize !== undefined) {
          text.style = new TextStyle({
            ...text.style,
            fontSize: updates.fontSize
          });
          textContainer.fontSize = updates.fontSize;
        }
        
        if (updates.color !== undefined) {
          text.style = new TextStyle({
            ...text.style,
            fill: updates.color
          });
        }
        
        if (updates.fontFamily !== undefined) {
          text.style = new TextStyle({
            ...text.style,
            fontFamily: updates.fontFamily
          });
          textContainer.fontFamily = updates.fontFamily;
        }
        
        if (updates.showBorder !== undefined) {
          textContainer.showBorder = updates.showBorder;
        }

        if (updates.borderColor !== undefined) {
          textContainer.borderColor = updates.borderColor;
        }

        if (updates.borderWidth !== undefined) {
          textContainer.borderWidth = updates.borderWidth;
        }
        
        const newMetrics = text.getLocalBounds();
        const newWidth = Math.max(newMetrics.width + 40, 100);
        const newHeight = Math.max(newMetrics.height + 40, 60);
        
        textContainer.originalWidth = newWidth;
        textContainer.originalHeight = newHeight;
        
        redrawTextContainer(textContainer, newWidth, newHeight);
        
        if (resizeBorderRef.current.target === textContainer) {
          createResizeBorder(textContainer);
        }
      }
    },

    getAppRef: () => {
      return appRef.current;
    },

    getRectangleSettings: (id: string): RectangleSettings | null => {
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      if (!rectangle) return null;
      
      return {
        x: rectangle.x,
        y: rectangle.y,
        width: (rectangle as any).currentWidth,
        height: (rectangle as any).currentHeight,
        cornerRadius: (rectangle as any).cornerRadius,
        color: (rectangle as any).fillColor,
        imageUrl: (rectangle as any).imageUrl,
        imageFit: (rectangle as any).imageFit || 'fill',
        showBorder: (rectangle as any).showBorder !== false,
        borderColor: (rectangle as any).borderColor || 0xffffff,
        borderWidth: (rectangle as any).borderWidth || 2,
        opacity: (rectangle as any).opacity ?? 1,
        filters: (rectangle as any).filters || {},
        isTextContainer: (rectangle as any).isTextContainer || false
      };
    },

    getTextSettings: (id: string): TextSettings | null => {
      const textContainer = textContainersRef.current.find(text => 
        text.elementId === id
      );
      
      if (!textContainer) return null;
      
      const fontWeight = textContainer.text.style.fontWeight;
      const fontStyle = textContainer.text.style.fontStyle;
      
      let textFontStyle: 'normal' | 'bold' | 'italic' = 'normal';
      if (fontWeight === 'bold') {
        textFontStyle = 'bold';
      } else if (fontStyle === 'italic') {
        textFontStyle = 'italic';
      }
      
      return {
        x: textContainer.container.x,
        y: textContainer.container.y,
        fontSize: textContainer.fontSize,
        color: textContainer.text.style.fill as number,
        fontFamily: textContainer.fontFamily,
        fontStyle: textFontStyle,
        align: textContainer.text.style.align as 'left' | 'center' | 'right',
        text: textContainer.textContent,
        showBorder: textContainer.showBorder,
        borderColor: textContainer.borderColor || 0xffffff,
        borderWidth: textContainer.borderWidth || 1,
        containerWidth: textContainer.currentWidth,
        containerHeight: textContainer.currentHeight
      };
    },

    updateRectangleSettings: (id: string, settings: Partial<RectangleSettings>) => {
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      if (rectangle) {
        const isTextContainer = (rectangle as any).isTextContainer;
        
        if (settings.x !== undefined) rectangle.x = settings.x;
        if (settings.y !== undefined) rectangle.y = settings.y;
        
        if (settings.cornerRadius !== undefined) {
          (rectangle as any).cornerRadius = settings.cornerRadius;
        }
        
        if (settings.showBorder !== undefined) {
          (rectangle as any).showBorder = settings.showBorder;
        }

        if (settings.borderColor !== undefined) {
          (rectangle as any).borderColor = settings.borderColor;
        }

        if (settings.borderWidth !== undefined) {
          (rectangle as any).borderWidth = Math.max(1, settings.borderWidth);
        }
        
        if (settings.opacity !== undefined) {
          (rectangle as any).opacity = settings.opacity;
          applyRectangleOpacity(rectangle, settings.opacity);
        }
        
        if (settings.filters !== undefined) {
          (rectangle as any).filters = settings.filters;
          const sprite = (rectangle as any).imageSprite as Sprite;
          if (sprite) {
            if(layersRef.current.filter(layer => layer.id === id)[0]?.specialist !== "avatar"){
              applyImageFilters(sprite, settings.filters);
            }
          }
        }
        
        if (settings.imageFit !== undefined && settings.imageFit !== (rectangle as any).imageFit) {
          (rectangle as any).imageFit = settings.imageFit;
          const sprite = (rectangle as any).imageSprite;
          const texture = sprite?.texture;
          if (texture) {
            addImageToRectangle(rectangle, texture, settings.imageFit);
          }
        }
        
        if (settings.width !== undefined || settings.height !== undefined) {
          const newWidth = settings.width !== undefined 
            ? (isTextContainer ? settings.width : Math.min(settings.width, MAX_RECTANGLE_WIDTH))
            : (rectangle as any).currentWidth;
          
          const newHeight = settings.height !== undefined 
            ? (isTextContainer ? settings.height : Math.min(settings.height, MAX_RECTANGLE_HEIGHT))
            : (rectangle as any).currentHeight;
          
          redrawRectangle(rectangle, newWidth, newHeight);
        } else if (settings.cornerRadius !== undefined || settings.showBorder !== undefined || settings.borderColor !== undefined || settings.borderWidth !== undefined) {
          redrawRectangle(rectangle, 
            (rectangle as any).currentWidth, 
            (rectangle as any).currentHeight
          );
        }
        
        if (settings.color !== undefined) {
          (rectangle as any).fillColor = settings.color;
          redrawRectangle(rectangle, 
            (rectangle as any).currentWidth, 
            (rectangle as any).currentHeight
          );
        }
        
        if (settings.imageUrl !== undefined && settings.imageUrl !== (rectangle as any).imageUrl) {
          (rectangle as any).imageUrl = settings.imageUrl;
          if (settings.imageUrl) {
            loadAndValidateImage(settings.imageUrl).then(texture => {
              addImageToRectangle(rectangle, texture, (rectangle as any).imageFit || 'fill');
            });
          } else {
            const sprite = (rectangle as any).imageSprite;
            const mask = (rectangle as any).imageMask;
            if (sprite) rectangle.removeChild(sprite);
            if (mask) rectangle.removeChild(mask);
          }
        }
        
        if (settings.isTextContainer !== undefined) {
          (rectangle as any).isTextContainer = settings.isTextContainer;
        }
        
        if (resizeBorderRef.current.target === rectangle) {
          createResizeBorder(rectangle);
        }
      }
    },

    updateTextSettings: (id: string, settings: Partial<TextSettings>) => {
      const textContainer = textContainersRef.current.find(text => 
        text.elementId === id
      );
      
      if (textContainer) {
        const { container, text } = textContainer;

        if (settings.containerWidth !== undefined || settings.containerHeight !== undefined) {
          const newWidth = settings.containerWidth ?? textContainer.currentWidth;
          const newHeight = settings.containerHeight ?? textContainer.currentHeight;
          
          console.log('🔄 تحديث أبعاد حاوية النص:', {
            id,
            العرض_الجديد: newWidth,
            الارتفاع_الجديد: newHeight,
            العرض_السابق: textContainer.currentWidth,
            الارتفاع_السابق: textContainer.currentHeight
          });

          textContainer.originalWidth = newWidth;
          textContainer.originalHeight = newHeight;
          textContainer.currentWidth = newWidth;
          textContainer.currentHeight = newHeight;

          redrawTextContainer(textContainer, newWidth, newHeight, true);
        }

        if (settings.x !== undefined) container.x = settings.x;
        if (settings.y !== undefined) container.y = settings.y;
        
        if (settings.showBorder !== undefined) {
          textContainer.showBorder = settings.showBorder;
        }

        if (settings.borderColor !== undefined) {
          textContainer.borderColor = settings.borderColor;
        }

        if (settings.borderWidth !== undefined) {
          textContainer.borderWidth = settings.borderWidth;
        }
        
        if (settings.text !== undefined) {
          const validatedText = settings.text.length > MAX_TEXT_LENGTH 
            ? settings.text.substring(0, MAX_TEXT_LENGTH) 
            : settings.text;
          
          text.text = validatedText;
          textContainer.textContent = validatedText;
        }
        
        const newStyle: any = {
          fontFamily: settings.fontFamily ?? textContainer.fontFamily,
          fontSize: settings.fontSize ?? textContainer.fontSize,
          fill: settings.color !== undefined ? settings.color : text.style.fill,
          align: settings.align ?? text.style.align,
          breakWords: text.style.breakWords,
          wordWrap: true,
          wordWrapWidth: textContainer.currentWidth - 20
        };
        
        if (settings.fontStyle) {
          if (settings.fontStyle === 'bold') {
            newStyle.fontWeight = 'bold';
            newStyle.fontStyle = 'normal';
          } else if (settings.fontStyle === 'italic') {
            newStyle.fontStyle = 'italic';
            newStyle.fontWeight = 'normal';
          } else {
            newStyle.fontWeight = 'normal';
            newStyle.fontStyle = 'normal';
          }
        }
        
        text.style = new TextStyle(newStyle);
        
        if (settings.fontSize !== undefined) textContainer.fontSize = settings.fontSize;
        if (settings.fontFamily !== undefined) textContainer.fontFamily = settings.fontFamily;
        
        if (settings.containerWidth === undefined && settings.containerHeight === undefined) {
          const metrics = text.getLocalBounds();
          const newWidth = Math.max(metrics.width + 40, 100);
          const newHeight = Math.max(metrics.height + 40, 60);
          
          textContainer.originalWidth = newWidth;
          textContainer.originalHeight = newHeight;
          
          redrawTextContainer(textContainer, newWidth, newHeight, true);
        }
        
        if (resizeBorderRef.current.target === textContainer) {
          createResizeBorder(textContainer);
        }
      }
    },

    getSelectedElement: (id?: string) => {
      return getSelectedElement(id);
    },

    selectElement: (id: string) => {
      if (!appRef.current) return false;

      // البحث في المستطيلات
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      // البحث في النصوص
      const textContainer = textContainersRef.current.find(text => 
        text.elementId === id
      );

      let target: Graphics | TextContainer | null = null;

      if (rectangle) {
        target = rectangle;
        activeElementRef.current = rectangle;
      } else if (textContainer) {
        target = textContainer;
        activeElementRef.current = textContainer;
      }

      if (target) {
        // إظهار حدود التكبير/التصغير للعنصر المحدد
        createResizeBorder(target);
        
        // إشعال حدث mouse down لمحاكاة التحديد
        let elementData: any;
        
        if (target instanceof Graphics) {
          elementData = {
            type: 'rectangle',
            id: (target as any).rectangleId,
            x: target.x,
            y: target.y,
            target: target
          };
        } else {
          elementData = {
            type: 'text',
            id: target.elementId,
            x: target.container.x,
            y: target.container.y,
            target: target
          };
        }
        
        // triggerMouseDown(elementData);
        
        console.log('✅ تم تحديد العنصر:', { id, type: elementData.type });
        return true;
      } else {
        console.warn('⚠️ لم يتم العثور على العنصر:', id);
        hideResizeBorder();
        return false;
      }
    },

    setRectangleBorder: (id: string, borderConfig: { showBorder?: boolean; borderColor?: number; borderWidth?: number }) => {
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      if (rectangle) {
        const { showBorder, borderColor, borderWidth } = borderConfig;
        
        if (showBorder !== undefined) {
          (rectangle as any).showBorder = showBorder;
        }
        
        if (borderColor !== undefined) {
          (rectangle as any).borderColor = borderColor;
        }
        
        if (borderWidth !== undefined) {
          (rectangle as any).borderWidth = Math.max(1, borderWidth);
        }
        
        redrawRectangle(rectangle, 
          (rectangle as any).currentWidth, 
          (rectangle as any).currentHeight
        );
        
        if (resizeBorderRef.current.target === rectangle) {
          createResizeBorder(rectangle);
        }

        console.log('🎨 تم تحديث بوردر المستطيل:', {
          id,
          showBorder: (rectangle as any).showBorder,
          borderColor: (rectangle as any).borderColor,
          borderWidth: (rectangle as any).borderWidth
        });
      }
    },
    
    setTextBorder: (id: string, borderConfig: { showBorder?: boolean; borderColor?: number; borderWidth?: number }) => {
      const textContainer = textContainersRef.current.find(text => 
        text.elementId === id
      );
      
      if (textContainer) {
        const { showBorder, borderColor, borderWidth } = borderConfig;
        
        if (showBorder !== undefined) {
          textContainer.showBorder = showBorder;
        }
        
        if (borderColor !== undefined) {
          textContainer.borderColor = borderColor;
        }
        
        if (borderWidth !== undefined) {
          textContainer.borderWidth = Math.max(1, borderWidth);
        }
        
        redrawTextContainer(textContainer, 
          textContainer.currentWidth, 
          textContainer.currentHeight
        );
        
        if (resizeBorderRef.current.target === textContainer) {
          createResizeBorder(textContainer);
        }

        console.log('🎨 تم تحديث بوردر النص:', {
          id,
          showBorder: textContainer.showBorder,
          borderColor: textContainer.borderColor,
          borderWidth: textContainer.borderWidth
        });
      }
    },
    
    getBorderSettings: (id: string) => {
      const rectangle = rectanglesRef.current.find(rect => 
        (rect as any).rectangleId === id
      );
      
      if (rectangle) {
        return {
          showBorder: (rectangle as any).showBorder !== false,
          borderColor: (rectangle as any).borderColor || 0xffffff,
          borderWidth: (rectangle as any).borderWidth || 2
        };
      }
      
      const textContainer = textContainersRef.current.find(text => 
        text.elementId === id
      );
      
      if (textContainer) {
        return {
          showBorder: textContainer.showBorder || false,
          borderColor: textContainer.borderColor || 0xffffff,
          borderWidth: textContainer.borderWidth || 1
        };
      }
      
      return null;
    },

    getLayers: () => [...layersRef.current],
    
    moveLayerUp: (id: string) => {
      moveLayerUp(id);
    },
    
    moveLayerDown: (id: string) => {
      moveLayerDown(id);
    },
    
    toggleLayerVisibility: (id: string) => {
      toggleLayerVisibility(id);
    },
    
    updateLayerName: (id: string, name: string) => {
      updateLayerName(id, name);
    },

    getLayersRef: () => layersRef.current,
    
    getLayerManager: () => ({
      layers: layersRef.current,
      addLayer,
      removeLayer,
      updateLayerVisibility,
      updateLayerOrder: (id: string, newIndex: number) => {
        const layer = layersRef.current.find(l => l.id === id);
        if (layer && newIndex >= 0 && newIndex < layersRef.current.length) {
          layersRef.current.forEach(l => {
            if (l.zIndex === newIndex) {
              l.zIndex = layer.zIndex;
            }
          });
          layer.zIndex = newIndex;
          layersRef.current.sort((a, b) => a.zIndex - b.zIndex);
          reorderElements();
        }
      },
      moveLayerUp,
      moveLayerDown,
      getLayers: () => [...layersRef.current],
      getLayer: (id: string) => layersRef.current.find(l => l.id === id)
    }),

    onMouseDown: (callback: (element: any) => void) => {
      mouseDownCallbacksRef.current.push(callback);
    },
    
    onMouseMove: (callback: (element: any) => void) => {
      mouseMoveCallbacksRef.current.push(callback);
    },
    
    onMouseUp: (callback: (element: any) => void) => {
      mouseUpCallbacksRef.current.push(callback);
    },
    
    onElementResize: (callback: (element: any) => void) => {
      elementResizeCallbacksRef.current.push(callback);
    },

    setCanvasDimensions: (width: number, height: number) => {
      console.log('Setting canvas dimensions:', width, height);
      setCanvasWidth(width);
      setCanvasHeight(height);
      
      // تحديث الـ renderer مباشرة
      if (appRef.current?.renderer) {
        appRef.current.renderer.resize(width, height);
        appRef.current.stage.hitArea = appRef.current.screen;
      }
    },

    getCanvasDimensions: () => ({
      width: canvasWidth || 0,
      height: canvasHeight || 0
    }),
    
    removeAllListeners: () => {
      mouseDownCallbacksRef.current = [];
      mouseMoveCallbacksRef.current = [];
      mouseUpCallbacksRef.current = [];
      elementResizeCallbacksRef.current = [];
    }
  }));

  return (
    <div className="draggable-rectangles">
      <div style={{
        border: '1px solid rgb(137 137 137)',
        padding: '10px',
        paddingTop: '8px',
        transform: 'scale(1)',
        borderRadius: '0.75rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'column',
        gap: '5px',
        minWidth: '320px',
      }} ref={canvasRef} onLoad={onLoad} >
        <div className="flex justify-between items-center w-full">
          {(canvasRef.current?.clientWidth || 500) > 400 && (
            <h2 className="text-lg font-semibold text-white/90 tracking-wide">محرر الصور الترحيبية</h2>
          )}
          <DimensionButton 
            width={canvasWidth || 0} 
            height={canvasHeight || 0} 
            onClick={onDimensionButtonClick}
          />
        </div>
      </div>
    </div>
  );
});

export const numberToHex = (color: number | undefined): string => {
  if (color === undefined || color === null || isNaN(color)) {
    return '#3498db';
  }
  return `#${color.toString(16).padStart(6, '0')}`;
};

export const hexToNumber = (hex: string): number => {
  if (!hex || !hex.startsWith('#')) {
    return 0x3498db;
  }
  
  const hexValue = hex.replace('#', '');
  const numberValue = parseInt(hexValue, 16);
  
  return isNaN(numberValue) ? 0x3498db : numberValue;
};

// تصدير الدوال الجديدة
export { 
  parseColorWithAlpha,
  combineColorWithAlpha,
  numberToHexWithAlpha,
  hexWithAlphaToNumber
};

DraggableRectangles.displayName = 'DraggableRectangles';

export type { DraggableRectanglesRef, RectangleConfig, TextConfig, RectangleSettings, TextSettings, LayerElement };
export default React.memo(DraggableRectangles);