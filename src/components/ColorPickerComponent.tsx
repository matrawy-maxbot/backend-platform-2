import React, { useRef, useEffect, useState } from 'react';
import { Check, Pipette } from 'lucide-react';

export interface ColorPickerComponentProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showAlpha?: boolean;
  showManualInput?: boolean;
  className?: string;
}

const defaultSwatches = [
  "#000000", "#4A5568", "#F56565", "#ED64A6", "#9F7AEA", 
  "#6B46C1", "#4299E1", "#0BC5EA", "#00B5D8", "#38B2AC", 
  "#48BB78", "#68D391", "#ECC94B", "#DD6B20",
  "#FFFFFF", "#A0AEC0", "#E53E3E", "#D53F8C", "#805AD5",
  "#553C9A", "#3182CE", "#319795", "#38A169"
];

export default function ColorPickerComponent({
  value = '#000000',
  onChange,
  label = "Color",
  showAlpha = true,
  showManualInput = true,
  className = ""
}: ColorPickerComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '#000000');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(1);
  
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const alphaCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<false | 'main' | 'hue' | 'alpha'>(false);
  const gradientImageDataRef = useRef<ImageData | null>(null);

  const hexToHsl = (hex: string) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
      return { h: 0, s: 0, l: 50 };
    }
    
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const hslToHex = (h: number, s: number, l: number, a: number = 1) => {
    const rgb = hslToRgb(h, s, l);
    const toHex = (x: number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    if (a < 1) {
      const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
      return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${alphaHex}`.toUpperCase();
    }
    
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (value && typeof value === 'string' && value.startsWith('#')) {
      setInputValue(value);
      const hsl = hexToHsl(value);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      
      if (value.length === 9) {
        const alphaHex = value.slice(7, 9);
        setAlpha(parseInt(alphaHex, 16) / 255);
      } else {
        setAlpha(1);
      }
    }
  }, [value]);

  const createGradient = (currentHue: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 180;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const imageData = ctx.createImageData(280, 180);
    const data = imageData.data;

    for (let y = 0; y < 180; y++) {
      for (let x = 0; x < 280; x++) {
        const sat = (x / 280) * 100;
        const light = 100 - (y / 180) * 100;
        const rgb = hslToRgb(currentHue, sat, light);
        
        const index = (y * 280 + x) * 4;
        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 255;
      }
    }

    return imageData;
  };

  const drawCursor = (ctx: CanvasRenderingContext2D, sat: number, light: number) => {
    const x = (sat / 100) * 280;
    const y = ((100 - light) / 100) * 180;

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  useEffect(() => {
    if (!mainCanvasRef.current || !isOpen) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    gradientImageDataRef.current = createGradient(hue);
    
    if (gradientImageDataRef.current) {
      ctx.putImageData(gradientImageDataRef.current, 0, 0);
      drawCursor(ctx, saturation, lightness);
    }
  }, [hue, isOpen]);

  useEffect(() => {
    if (!mainCanvasRef.current || !isOpen || !gradientImageDataRef.current) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.putImageData(gradientImageDataRef.current, 0, 0);
    drawCursor(ctx, saturation, lightness);
  }, [saturation, lightness, isOpen]);

  useEffect(() => {
    if (!hueCanvasRef.current || !isOpen) return;

    const canvas = hueCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let x = 0; x < 260; x++) {
      const hueValue = (x / 260) * 360;
      const rgb = hslToRgb(hueValue, 100, 50);
      ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.fillRect(x, 0, 1, 16);
    }

    const indicatorX = (hue / 360) * 260;
    ctx.beginPath();
    ctx.arc(indicatorX, 8, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [hue, isOpen]);

  useEffect(() => {
    if (!alphaCanvasRef.current || !isOpen) return;

    const canvas = alphaCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const checkerSize = 8;
    for (let y = 0; y < 16; y += checkerSize) {
      for (let x = 0; x < 260; x += checkerSize) {
        ctx.fillStyle = ((x / checkerSize) + (y / checkerSize)) % 2 === 0 ? '#e0e0e0' : '#ffffff';
        ctx.fillRect(x, y, checkerSize, checkerSize);
      }
    }

    const rgb = hslToRgb(hue, saturation, lightness);
    const gradient = ctx.createLinearGradient(0, 0, 260, 0);
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 260, 16);

    const indicatorX = alpha * 260;
    ctx.beginPath();
    ctx.arc(indicatorX, 8, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [alpha, hue, saturation, lightness, isOpen]);

  const updateMainCanvasColor = (clientX: number, clientY: number) => {
    if (!mainCanvasRef.current) return;

    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const sat = (x / rect.width) * 100;
    const light = 100 - (y / rect.height) * 100;

    setSaturation(sat);
    setLightness(light);

    const hex = hslToHex(hue, sat, light, alpha);
    setInputValue(hex);
    onChange(hex);
  };

  const handleMainCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDraggingRef.current = 'main';
    updateMainCanvasColor(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      if (mainCanvasRef.current && isDraggingRef.current === 'main') {
        updateMainCanvasColor(e.clientX, e.clientY);
      } else if (hueCanvasRef.current && isDraggingRef.current === 'hue') {
        updateHueColor(e.clientX);
      } else if (alphaCanvasRef.current && isDraggingRef.current === 'alpha') {
        updateAlphaColor(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };

    if (isDraggingRef.current) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingRef.current, hue, saturation, lightness, alpha]);

  const updateHueColor = (clientX: number) => {
    if (!hueCanvasRef.current) return;

    const rect = hueCanvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newHue = (x / rect.width) * 360;

    setHue(newHue);
    const hex = hslToHex(newHue, saturation, lightness, alpha);
    setInputValue(hex);
    onChange(hex);
  };

  const handleHueCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDraggingRef.current = 'hue';
    updateHueColor(e.clientX);
  };

  const updateAlphaColor = (clientX: number) => {
    if (!alphaCanvasRef.current) return;

    const rect = alphaCanvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newAlpha = x / rect.width;

    setAlpha(newAlpha);
    const hex = hslToHex(hue, saturation, lightness, newAlpha);
    setInputValue(hex);
    onChange(hex);
  };

  const handleAlphaCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDraggingRef.current = 'alpha';
    updateAlphaColor(e.clientX);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    setInputValue(hex);
    
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3})$/.test(hex)) {
      const hsl = hexToHsl(hex);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      
      if (hex.length === 9) {
        const alphaHex = hex.slice(7, 9);
        setAlpha(parseInt(alphaHex, 16) / 255);
      } else {
        setAlpha(1);
      }
      
      onChange(hex);
    }
  };

  const handleSwatchClick = (swatch: string) => {
    setInputValue(swatch);
    const hsl = hexToHsl(swatch);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    onChange(swatch);
  };

  const handleEyeDropper = async () => {
    try {
      if ('EyeDropper' in window) {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        const hex = result.sRGBHex;
        setInputValue(hex);
        const hsl = hexToHsl(hex);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        onChange(hex);
      }
    } catch (err) {
      console.log('Eye dropper not available');
    }
  };

  return (
    <div ref={containerRef} className={`space-y-2 relative ${className}`}>
      {label && (
        <label className="text-white text-sm font-semibold block mb-3">
          {label}
        </label>
      )}
      
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-10 rounded border-2 border-gray-600 cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0"
          style={{ backgroundColor: value }}
          title={value}
        />
        {showManualInput && (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="#000000"
            maxLength={9}
            className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 w-[300px]">
          <canvas
            ref={mainCanvasRef}
            width={280}
            height={180}
            onMouseDown={handleMainCanvasMouseDown}
            className="mb-4 w-full rounded border border-gray-600 cursor-crosshair"
          />

          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 space-y-2">
              <canvas
                ref={hueCanvasRef}
                width={260}
                height={16}
                onMouseDown={handleHueCanvasMouseDown}
                className="w-full rounded border border-gray-600 cursor-pointer"
              />
              {showAlpha && (
                <canvas
                ref={alphaCanvasRef}
                width={260}
                height={16}
                onMouseDown={handleAlphaCanvasMouseDown}
                className="w-full rounded border border-gray-600 cursor-pointer"
              />
              )}
            </div>
            {('EyeDropper' in window) && (
              <button
                onClick={handleEyeDropper}
                className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex items-center justify-center transition-colors w-10"
                style={{ height: '-webkit-fill-available' }}
                title="Pick Color"
              >
                <Pipette className="h-5 w-5" />
              </button>
            )}
          </div>

          <div>
            <div className="grid grid-cols-8 gap-2">
              {defaultSwatches.map((swatch) => (
                <button
                  key={swatch}
                  onClick={() => handleSwatchClick(swatch)}
                  className="w-full aspect-square rounded border-2 border-gray-600 hover:border-gray-400 transition-all relative group"
                  style={{ backgroundColor: swatch }}
                  title={swatch}
                >
                  {swatch === value && (
                    <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Demo Component
export function Demo() {
  const [selectedColor, setSelectedColor] = useState('#89AD40');

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Swatch and</h1>
          <p className="text-gray-500 text-sm">Here's how to use the color picker component.</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-6">
          <ColorPickerComponent
            value={selectedColor}
            onChange={setSelectedColor}
            showAlpha={true}
            label="Color"
            showManualInput={true}
          />

          <div className="pt-4 border-t border-gray-800">
            <h2 className="text-sm font-semibold text-white mb-3">Preview</h2>
            <div 
              className="w-16 h-16 rounded border-2 border-gray-700"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}