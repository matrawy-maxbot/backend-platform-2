'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import * as PIXI from 'pixi.js';

interface Circle {
  graphics: PIXI.Graphics;
  isDragging: boolean;
  isResizing: boolean;
  radius: number;
  color: number;
  resizeHandle?: PIXI.Graphics;
  // إضافة خصائص للتحسين
  lastUpdateTime: number;
  needsRedraw: boolean;
  eventHandlers: Map<string, Function>;
}

// تجميع الثوابت لتحسين الأداء
const CONSTANTS = {
  CANVAS_WIDTH: 500,
  CANVAS_HEIGHT: 350,
  BACKGROUND_COLOR: 0x2c2c2c,
  MIN_RADIUS: 20,
  MAX_RADIUS: 80,
  DEFAULT_RADIUS: 40,
  HANDLE_SIZE: 8,
  HANDLE_COLOR: 0xffffff,
  UPDATE_THRESHOLD: 16, // 60 FPS
  COLORS: [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24],
  POSITIONS: [
    { x: 100, y: 100 },
    { x: 400, y: 100 },
    { x: 100, y: 250 },
    { x: 400, y: 250 }
  ]
} as const;

// Object Pool للدوائر لتحسين إدارة الذاكرة
class CirclePool {
  private static instance: CirclePool;
  private pool: Circle[] = [];
  private maxPoolSize = 10;

  static getInstance(): CirclePool {
    if (!CirclePool.instance) {
      CirclePool.instance = new CirclePool();
    }
    return CirclePool.instance;
  }

  getCircle(): Circle | null {
    return this.pool.pop() || null;
  }

  returnCircle(circle: Circle): void {
    if (this.pool.length < this.maxPoolSize) {
      // إعادة تعيين خصائص الدائرة
      circle.isDragging = false;
      circle.isResizing = false;
      circle.needsRedraw = false;
      circle.lastUpdateTime = 0;
      circle.eventHandlers.clear();
      
      this.pool.push(circle);
    }
  }

  clear(): void {
    this.pool.length = 0;
  }
}

// Performance Monitor لمراقبة الأداء
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private renderTime = 0;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startFrame(): number {
    return performance.now();
  }

  endFrame(startTime: number): void {
    const now = performance.now();
    this.renderTime = now - startTime;
    this.frameCount++;

    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
      
      // تسجيل الإحصائيات في وضع التطوير
      if (process.env.NODE_ENV === 'development') {
        console.log(`FPS: ${this.fps}, Render Time: ${this.renderTime.toFixed(2)}ms`);
      }
    }
  }

  getStats() {
    return {
      fps: this.fps,
      renderTime: this.renderTime
    };
  }
}

const CanvasPreview: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const performanceMonitorRef = useRef<PerformanceMonitor>(PerformanceMonitor.getInstance());
  const circlePoolRef = useRef<CirclePool>(CirclePool.getInstance());

  // تحسين إنشاء الدوائر باستخدام useMemo
  const circleConfigs = useMemo(() => 
    CONSTANTS.POSITIONS.map((pos, index) => ({
      x: pos.x,
      y: pos.y,
      radius: CONSTANTS.DEFAULT_RADIUS,
      color: CONSTANTS.COLORS[index]
    })), []
  );

  // دالة محسنة لتحديث حجم الدائرة مع تقليل إعادة الرسم
  const updateCircleSize = useCallback((circle: Circle, newRadius: number) => {
    const now = performance.now();
    
    // تجنب التحديثات المتكررة
    if (now - circle.lastUpdateTime < CONSTANTS.UPDATE_THRESHOLD) {
      return;
    }
    
    circle.radius = newRadius;
    circle.lastUpdateTime = now;
    circle.needsRedraw = true;
    
    // استخدام requestAnimationFrame لتحسين الأداء مع مراقبة الأداء
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const startTime = performanceMonitorRef.current.startFrame();
        
        if (circle.needsRedraw) {
          circle.graphics.clear();
          circle.graphics.beginFill(circle.color);
          circle.graphics.drawCircle(0, 0, newRadius);
          circle.graphics.endFill();
          
          // تحديث موقع مقبض تغيير الحجم
          if (circle.resizeHandle) {
            circle.resizeHandle.x = newRadius;
            circle.resizeHandle.y = 0;
          }
          
          circle.needsRedraw = false;
        }
        
        performanceMonitorRef.current.endFrame(startTime);
        animationFrameRef.current = null;
      });
    }
  }, []);

  // دالة محسنة لإزالة مستمعي الأحداث مع استخدام Object Pool
  const cleanupEventHandlers = useCallback((circle: Circle) => {
    circle.eventHandlers.forEach((handler, event) => {
      const [target, eventName] = event.split('.');
      if (target === 'graphics') {
        circle.graphics.off(eventName as any, handler as any);
      } else if (target === 'resizeHandle' && circle.resizeHandle) {
        circle.resizeHandle.off(eventName as any, handler as any);
      } else if (target === 'stage' && appRef.current) {
        appRef.current.stage.off(eventName as any, handler as any);
      }
    });
    
    // إرجاع الدائرة إلى Object Pool
    circlePoolRef.current.returnCircle(circle);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // إنشاء تطبيق PixiJS بشكل غير متزامن مع تحسينات الأداء
    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: CONSTANTS.CANVAS_WIDTH,
        height: CONSTANTS.CANVAS_HEIGHT,
        backgroundColor: CONSTANTS.BACKGROUND_COLOR,
        antialias: true,
        // تحسينات إضافية للأداء
        powerPreference: 'high-performance',
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      appRef.current = app;
      canvasRef.current!.appendChild(app.canvas);

      // إنشاء الدوائر باستخدام التكوين المحسن
      const circles: Circle[] = [];
      
      circleConfigs.forEach((config) => {
        const circle = createInteractiveCircle(app, config.x, config.y, config.radius, config.color);
        circles.push(circle);
      });

      circlesRef.current = circles;
    };

    initPixi();

    // تنظيف الموارد عند إلغاء التحميل
    return () => {
      // إلغاء إطار الرسوم المتحرك
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // تنظيف مستمعي الأحداث
      circlesRef.current.forEach(cleanupEventHandlers);
      
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [circleConfigs, cleanupEventHandlers]);

  const createInteractiveCircle = useCallback((
    app: PIXI.Application,
    x: number,
    y: number,
    radius: number,
    color: number
  ): Circle => {
    // إنشاء الحاوي الرئيسي للدائرة
    const container = new PIXI.Container();
    container.x = x;
    container.y = y;

    // إنشاء الدائرة
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';

    // إنشاء مقبض تغيير الحجم
    const resizeHandle = new PIXI.Graphics();
    resizeHandle.beginFill(CONSTANTS.HANDLE_COLOR);
    resizeHandle.drawCircle(0, 0, CONSTANTS.HANDLE_SIZE);
    resizeHandle.endFill();
    resizeHandle.x = radius;
    resizeHandle.y = 0;
    resizeHandle.eventMode = 'static';
    resizeHandle.cursor = 'nw-resize';

    container.addChild(graphics);
    container.addChild(resizeHandle);
    app.stage.addChild(container);

    // إنشاء كائن الدائرة مع تحسينات الأداء
    const circle: Circle = {
      graphics,
      isDragging: false,
      isResizing: false,
      radius,
      color,
      resizeHandle,
      lastUpdateTime: 0,
      needsRedraw: false,
      eventHandlers: new Map()
    };

    // متغيرات محلية للسحب
    let dragData: { x: number; y: number } | null = null;
    let resizeData: { initialDistance: number; initialRadius: number } | null = null;

    // دوال معالجة الأحداث المحسنة
    const onDragStart = (event: PIXI.FederatedPointerEvent) => {
      circle.isDragging = true;
      const position = event.global;
      dragData = {
        x: position.x - container.x,
        y: position.y - container.y
      };
      graphics.alpha = 0.8;
    };

    const onDragMove = (event: PIXI.FederatedPointerEvent) => {
      if (circle.isDragging && dragData) {
        const position = event.global;
        const newX = position.x - dragData.x;
        const newY = position.y - dragData.y;
        
        // تطبيق القيود مع تحسين الأداء
        container.x = Math.max(radius, Math.min(CONSTANTS.CANVAS_WIDTH - radius, newX));
        container.y = Math.max(radius, Math.min(CONSTANTS.CANVAS_HEIGHT - radius, newY));
      }
    };

    const onDragEnd = () => {
      circle.isDragging = false;
      dragData = null;
      graphics.alpha = 1;
    };

    const onResizeStart = (event: PIXI.FederatedPointerEvent) => {
      event.stopPropagation();
      circle.isResizing = true;
      
      const globalPos = event.global;
      const localPos = app.stage.toLocal(globalPos);
      const distance = Math.sqrt(
        Math.pow(localPos.x - container.x, 2) + 
        Math.pow(localPos.y - container.y, 2)
      );
      
      resizeData = {
        initialDistance: Math.max(distance, 1),
        initialRadius: circle.radius
      };
      
      resizeHandle.alpha = 0.8;
    };

    const onResizeMove = (event: PIXI.FederatedPointerEvent) => {
      if (circle.isResizing && resizeData) {
        const globalPos = event.global;
        const localPos = app.stage.toLocal(globalPos);
        const currentDistance = Math.sqrt(
          Math.pow(localPos.x - container.x, 2) + 
          Math.pow(localPos.y - container.y, 2)
        );
        
        const scale = currentDistance / resizeData.initialDistance;
        const newRadius = Math.max(
          CONSTANTS.MIN_RADIUS,
          Math.min(CONSTANTS.MAX_RADIUS, resizeData.initialRadius * scale)
        );
        
        // استخدام الدالة المحسنة لتحديث الحجم
        updateCircleSize(circle, newRadius);
      }
    };

    const onResizeEnd = () => {
      circle.isResizing = false;
      resizeData = null;
      resizeHandle.alpha = 1;
    };

    // ربط الأحداث مع تتبع المراجع للتنظيف
    const addEventHandler = (target: string, eventName: string, handler: Function) => {
      const key = `${target}.${eventName}`;
      circle.eventHandlers.set(key, handler);
      
      if (target === 'graphics') {
        graphics.on(eventName as any, handler as any);
      } else if (target === 'resizeHandle') {
        resizeHandle.on(eventName as any, handler as any);
      } else if (target === 'stage') {
        app.stage.on(eventName as any, handler as any);
      }
    };

    // إضافة مستمعي الأحداث
    addEventHandler('graphics', 'pointerdown', onDragStart);
    addEventHandler('stage', 'pointermove', onDragMove);
    addEventHandler('stage', 'pointerup', onDragEnd);
    addEventHandler('stage', 'pointerupoutside', onDragEnd);
    
    addEventHandler('resizeHandle', 'pointerdown', onResizeStart);
    addEventHandler('stage', 'pointermove', onResizeMove);
    addEventHandler('stage', 'pointerup', onResizeEnd);
    addEventHandler('stage', 'pointerupoutside', onResizeEnd);

    return circle;
  }, [updateCircleSize]);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        PixiJS Canvas - دوائر تفاعلية
      </h2>
      <div 
        ref={canvasRef} 
        className="border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
        style={{ width: '500px', height: '350px' }}
      />
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        <p>• اسحب الدوائر لتحريكها</p>
        <p>• اسحب النقطة البيضاء لتغيير حجم الدائرة</p>
      </div>
    </div>
  );
};

export default CanvasPreview;