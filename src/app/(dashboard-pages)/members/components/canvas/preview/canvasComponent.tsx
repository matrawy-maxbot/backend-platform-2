'use client';

import React, { useRef, useEffect, useState } from 'react';
import DraggableRectangles from './canvasPixi';
import type { DraggableRectanglesRef, LayerElement } from './canvasPixi';
import ImageUploader from './imageUploader';

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
  opacity?: number;
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
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
}

// أنواع الأبعاد المحددة مسبقاً
type CanvasSize = '550x350' | '350x350' | '250x350' | 'custom';

interface CanvasDimension {
  width: number;
  height: number;
  label: string;
}

// الأبعاد المحددة مسبقاً
const CANVAS_SIZES: Record<CanvasSize, CanvasDimension> = {
  '550x350': { width: 550, height: 350, label: '550 × 350' },
  '350x350': { width: 350, height: 350, label: '350 × 350' },
  '250x350': { width: 250, height: 350, label: '250 × 350' },
  'custom': { width: 0, height: 0, label: 'مخصص' }
};

// دالة مساعدة لتحويل رقم اللون إلى نص hex
const numberToHex = (color: number | undefined): string => {
  if (color === undefined || color === null || isNaN(color)) {
    return '#3498db';
  }
  return `#${color.toString(16).padStart(6, '0')}`;
};

// دالة مساعدة لتحويل نص hex إلى رقم
const hexToNumber = (hex: string): number => {
  if (!hex || !hex.startsWith('#')) {
    return 0x3498db;
  }
  
  const hexValue = hex.replace('#', '');
  const numberValue = parseInt(hexValue, 16);
  
  return isNaN(numberValue) ? 0x3498db : numberValue;
};

// مكون مساعد لحقل الإدخال
const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{label}</label>
      {children}
    </div>
  );
};

// نمط الإدخال
const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  color: '#000',
};

// مكون نافذة الأبعاد المخصصة
const CustomSizeModal: React.FC<{
  isOpen: boolean;
  dimensions: { width: number; height: number };
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  onApply: () => void;
  onCancel: () => void;
}> = ({ isOpen, dimensions, onDimensionsChange, onApply, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        width: '320px',
        maxWidth: '90vw'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          textAlign: 'center',
          color: '#333',
          fontSize: '18px'
        }}>
          📏 الأبعاد المخصصة
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <FormField label="العرض (px)">
            <input
              type="number"
              value={dimensions.width}
              onChange={(e) => onDimensionsChange({
                ...dimensions,
                width: Math.max(100, parseInt(e.target.value) || 100)
              })}
              style={inputStyle}
              min="100"
              max="2000"
            />
          </FormField>

          <FormField label="الارتفاع (px)">
            <input
              type="number"
              value={dimensions.height}
              onChange={(e) => onDimensionsChange({
                ...dimensions,
                height: Math.max(100, parseInt(e.target.value) || 100)
              })}
              style={inputStyle}
              min="100"
              max="2000"
            />
          </FormField>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
          }}>
            <button
              onClick={onApply}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                flex: 1
              }}
            >
              ✅ تطبيق
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                flex: 1
              }}
            >
              ❌ إلغاء
            </button>
          </div>

          <div style={{
            padding: '10px',
            backgroundColor: '#e8f4fd',
            borderRadius: '6px',
            border: '1px solid #bee5eb',
            fontSize: '12px',
            color: '#0c5460',
            textAlign: 'center'
          }}>
            💡 الحد الأدنى: 100px × 100px
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون إعدادات الفلاتر
const FiltersSettingsForm: React.FC<{
  filters: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
  onChange: (filters: any) => void;
}> = ({ filters, onChange }) => {
  const safeFilters = {
    blur: filters?.blur || 0,
    brightness: filters?.brightness || 1,
    contrast: filters?.contrast || 1,
    saturation: filters?.saturation || 1,
    hue: filters?.hue || 0
  };

  const handleFilterChange = (filterName: string, value: number) => {
    onChange({
      ...safeFilters,
      [filterName]: value
    });
  };

  const resetFilters = () => {
    onChange({
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      hue: 0
    });
  };

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h4 style={{ margin: 0, color: '#333' }}>🎨 الفلاتر</h4>
        <button
          onClick={resetFilters}
          style={{
            padding: '5px 10px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#6c757d',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 إعادة تعيين
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <FormField label={`ضبابية: ${safeFilters.blur.toFixed(1)}`}>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={safeFilters.blur}
            onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
            style={inputStyle}
          />
        </FormField>

        <FormField label={`سطوع: ${safeFilters.brightness.toFixed(1)}`}>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={safeFilters.brightness}
            onChange={(e) => handleFilterChange('brightness', parseFloat(e.target.value))}
            style={inputStyle}
          />
        </FormField>

        <FormField label={`تباين: ${safeFilters.contrast.toFixed(1)}`}>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={safeFilters.contrast}
            onChange={(e) => handleFilterChange('contrast', parseFloat(e.target.value))}
            style={inputStyle}
          />
        </FormField>

        <FormField label={`تشبع: ${safeFilters.saturation.toFixed(1)}`}>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={safeFilters.saturation}
            onChange={(e) => handleFilterChange('saturation', parseFloat(e.target.value))}
            style={inputStyle}
          />
        </FormField>

        <FormField label={`درجة اللون: ${safeFilters.hue}°`}>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={safeFilters.hue}
            onChange={(e) => handleFilterChange('hue', parseInt(e.target.value))}
            style={inputStyle}
          />
        </FormField>
      </div>

      {/* معاينة الفلاتر */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e8f4fd',
        borderRadius: '6px',
        border: '1px solid #bee5eb',
        fontSize: '12px',
        color: '#0c5460'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>💡 تلميحات:</div>
        <div>• الضبابية: 0-20</div>
        <div>• السطوع: 0-3 (1 = عادي)</div>
        <div>• التباين: 0-3 (1 = عادي)</div>
        <div>• التشبع: 0-3 (1 = عادي)</div>
        <div>• درجة اللون: 0-360 درجة</div>
      </div>
    </div>
  );
};

// مكون إعدادات المستطيل
const RectangleSettingsForm: React.FC<{
  settings: RectangleSettings;
  onChange: (field: string, value: any) => void;
  onFileUpload: (file: File) => void;
  onUrlUpload: (url: string) => void;
}> = ({ settings, onChange, onFileUpload, onUrlUpload }) => {
  const safeSettings = {
    x: settings.x || 0,
    y: settings.y || 0,
    width: settings.width || 100,
    height: settings.height || 100,
    cornerRadius: settings.cornerRadius || 0,
    color: settings.color || '#3498db',
    opacity: settings.opacity ?? 1,
    imageUrl: settings.imageUrl || '',
    imageFit: settings.imageFit || 'fill',
    showBorder: settings.showBorder !== false,
    filters: settings.filters || {}
  };

  const handleOpacityChange = (value: number) => {
    onChange('opacity', Math.max(0, Math.min(1, value)));
  };

  const handleFiltersChange = (filters: any) => {
    onChange('filters', filters);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <FormField label="الموقع X">
        <input
          type="number"
          value={Math.round(safeSettings.x)}
          onChange={(e) => onChange('x', e.target.value)}
          style={inputStyle}
        />
      </FormField>

      <FormField label="الموقع Y">
        <input
          type="number"
          value={Math.round(safeSettings.y)}
          onChange={(e) => onChange('y', e.target.value)}
          style={inputStyle}
        />
      </FormField>

      <FormField label="العرض">
        <input
          type="number"
          value={Math.round(safeSettings.width)}
          onChange={(e) => onChange('width', e.target.value)}
          style={inputStyle}
          min="50"
        />
      </FormField>

      <FormField label="الارتفاع">
        <input
          type="number"
          value={Math.round(safeSettings.height)}
          onChange={(e) => onChange('height', e.target.value)}
          style={inputStyle}
          min="50"
        />
      </FormField>

      <FormField label="زوايا دائرية (%)">
        <input
          type="number"
          value={safeSettings.cornerRadius}
          onChange={(e) => onChange('cornerRadius', e.target.value)}
          style={inputStyle}
          min="0"
          max="100"
        />
      </FormField>

      <FormField label="اللون">
        <input
          type="color"
          value={numberToHex(safeSettings.color)}
          onChange={(e) => onChange('color', hexToNumber(e.target.value))}
          style={inputStyle}
        />
      </FormField>

      <FormField label={`الشفافية: ${Math.round(safeSettings.opacity * 100)}%`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={safeSettings.opacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          style={inputStyle}
        />
      </FormField>

      <FormField label="حجم الصورة">
        <select
          value={safeSettings.imageFit}
          onChange={(e) => onChange('imageFit', e.target.value)}
          style={inputStyle}
        >
          <option value="fill">Fill - ملء (قد يشوه الصورة)</option>
          <option value="contain">Contain - احتواء (مع الحفاظ على النسبة)</option>
          <option value="cover">Cover - تغطية (اقتصاص مع الحفاظ على النسبة)</option>
        </select>
      </FormField>

      <FormField label="إظهار الإطار">
        <select
          value={safeSettings.showBorder ? 'true' : 'false'}
          onChange={(e) => onChange('showBorder', e.target.value === 'true')}
          style={inputStyle}
        >
          <option value="true">نعم</option>
          <option value="false">لا</option>
        </select>
      </FormField>

      {/* إضافة الفلاتر فقط إذا كان هناك صورة */}
      {safeSettings.imageUrl && (
        <FiltersSettingsForm
          filters={safeSettings.filters}
          onChange={handleFiltersChange}
        />
      )}

      <FormField label="إضافة صورة">
        <ImageUploader
          onImageUpload={onFileUpload}
          onUrlUpload={onUrlUpload}
        />
      </FormField>
    </div>
  );
};

// مكون إعدادات النص
const TextSettingsForm: React.FC<{
  settings: TextSettings;
  onChange: (field: string, value: any) => void;
}> = ({ settings, onChange }) => {
  const safeSettings = {
    x: settings.x || 0,
    y: settings.y || 0,
    fontSize: settings.fontSize || 16,
    color: settings.color || '#ffffff',
    fontFamily: settings.fontFamily || 'Arial',
    fontStyle: settings.fontStyle || 'normal',
    align: settings.align || 'center',
    text: settings.text || '',
    showBorder: settings.showBorder || false
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <FormField label="الموقع X">
        <input
          type="number"
          value={Math.round(safeSettings.x)}
          onChange={(e) => onChange('x', e.target.value)}
          style={inputStyle}
        />
      </FormField>

      <FormField label="الموقع Y">
        <input
          type="number"
          value={Math.round(safeSettings.y)}
          onChange={(e) => onChange('y', e.target.value)}
          style={inputStyle}
        />
      </FormField>

      <FormField label="النص">
        <textarea
          value={safeSettings.text}
          onChange={(e) => onChange('text', e.target.value)}
          style={{ ...inputStyle, minHeight: '80px' }}
          placeholder="أدخل النص هنا..."
        />
      </FormField>

      <FormField label="حجم الخط">
        <input
          type="number"
          value={safeSettings.fontSize}
          onChange={(e) => onChange('fontSize', e.target.value)}
          style={inputStyle}
          min="8"
          max="72"
        />
      </FormField>

      <FormField label="لون النص">
        <input
          type="color"
          value={numberToHex(safeSettings.color)}
          onChange={(e) => onChange('color', hexToNumber(e.target.value))}
          style={inputStyle}
        />
      </FormField>

      <FormField label="نوع الخط">
        <select
          value={safeSettings.fontFamily}
          onChange={(e) => onChange('fontFamily', e.target.value)}
          style={inputStyle}
        >
          <option value="Arial">Arial</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial Arabic">Arial Arabic</option>
        </select>
      </FormField>

      <FormField label="نمط الخط">
        <select
          value={safeSettings.fontStyle}
          onChange={(e) => onChange('fontStyle', e.target.value)}
          style={inputStyle}
        >
          <option value="normal">عادي</option>
          <option value="bold">عريض</option>
          <option value="italic">مائل</option>
        </select>
      </FormField>

      <FormField label="المحاذاة">
        <select
          value={safeSettings.align}
          onChange={(e) => onChange('align', e.target.value)}
          style={inputStyle}
        >
          <option value="right">يمين</option>
          <option value="center">وسط</option>
          <option value="left">يسار</option>
        </select>
      </FormField>

      <FormField label="إظهار الإطار">
        <select
          value={safeSettings.showBorder ? 'true' : 'false'}
          onChange={(e) => onChange('showBorder', e.target.value === 'true')}
          style={inputStyle}
        >
          <option value="true">نعم</option>
          <option value="false">لا</option>
        </select>
      </FormField>
    </div>
  );
};

// مكون لوحة الإعدادات
const SettingsPanel: React.FC<{
  selectedElement: {
    type: 'rectangle' | 'text';
    id: string;
    settings: any;
  } | null;
  onUpdateSettings: (type: 'rectangle' | 'text', id: string, settings: any) => void;
  onFileUpload: (file: File) => void;
}> = ({ selectedElement, onUpdateSettings, onFileUpload }) => {
  const [localSettings, setLocalSettings] = useState<any>({});

  useEffect(() => {
    if (selectedElement) {
      const convertedSettings = { ...selectedElement.settings };
      
      if (selectedElement.type === 'rectangle') {
        convertedSettings.color = numberToHex(convertedSettings.color || 0x3498db);
      } else if (selectedElement.type === 'text') {
        convertedSettings.color = numberToHex(convertedSettings.color || 0xffffff);
      }
      
      const defaultValues = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        cornerRadius: 0,
        opacity: 1,
        filters: {},
        fontSize: 16,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'center',
        text: '',
        imageUrl: '',
        imageFit: 'fill',
        showBorder: selectedElement.type === 'rectangle' ? true : false
      };
      
      setLocalSettings({
        ...defaultValues,
        ...convertedSettings
      });
    } else {
      setLocalSettings({});
    }
  }, [selectedElement]);

  const handleInputChange = (field: string, value: any) => {
    if (!localSettings || !selectedElement) return;
    
    let processedValue = value;
    
    if (field === 'color') {
      processedValue = hexToNumber(value);
    } else if (field === 'x' || field === 'y' || field === 'width' || field === 'height' || field === 'fontSize' || field === 'cornerRadius') {
      processedValue = Number(value) || 0;
    } else if (field === 'showBorder') {
      processedValue = value === 'true' || value === true;
    } else if (field === 'opacity') {
      processedValue = Math.max(0, Math.min(1, Number(value) || 1));
    }
    
    const updatedSettings = {
      ...localSettings,
      [field]: field === 'color' ? processedValue : value
    };
    
    setLocalSettings(updatedSettings);
    onUpdateSettings(selectedElement.type, selectedElement.id, { [field]: processedValue });
  };

  const handleUrlUpload = (url: string) => {
    if (selectedElement && selectedElement.type === 'rectangle') {
      onUpdateSettings('rectangle', selectedElement.id, { imageUrl: url });
    }
  };

  if (!selectedElement || Object.keys(localSettings).length === 0) {
    return (
      <div style={{ 
        width: '300px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px',
        height: 'fit-content'
      }}>
        <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>الإعدادات</h3>
        <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>اختر عنصراً لتعديل إعداداته</p>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '300px', 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
        إعدادات {selectedElement.type === 'rectangle' ? 'المستطيل' : 'النص'}
      </h3>

      {selectedElement.type === 'rectangle' ? (
        <RectangleSettingsForm
          settings={localSettings as RectangleSettings}
          onChange={handleInputChange}
          onFileUpload={onFileUpload}
          onUrlUpload={handleUrlUpload}
        />
      ) : (
        <TextSettingsForm
          settings={localSettings as TextSettings}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
};

// مكون لوحة الطبقات
const LayersPanel: React.FC<{
  layers: LayerElement[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onSelect: (id: string) => void;
}> = ({ layers, onMoveUp, onMoveDown, onToggleVisibility, onRename, onSelect }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
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

  return (
    <div style={{ 
      width: '300px', 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>الطبقات</h3>
      
      {sortedLayers.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>لا توجد عناصر</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedLayers.map((layer, index) => (
            <div
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: layer.visible ? 1 : 0.6
              }}
              onClick={() => onSelect(layer.id)}
              onDoubleClick={() => handleStartEdit(layer.id, layer.name)}
            >
              {/* أيقونة النوع */}
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                backgroundColor: layer.type === 'rectangle' ? '#3498db' : '#e74c3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                flexShrink: 0
              }}>
                {layer.type === 'rectangle' ? '🟦' : '📝'}
              </div>

              {/* اسم الطبقة */}
              <div style={{ flex: 1, minWidth: 0 }}>
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
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: '1px solid #3498db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    autoFocus
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span 
                      style={{ 
                        fontSize: '14px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {layer.name}
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {layer.type === 'rectangle' ? 'مستطيل' : 'نص'} • {layer.visible ? 'مرئي' : 'مخفي'}
                    </span>
                  </div>
                )}
              </div>

              {/* أزرار التحكم */}
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexShrink: 0 }}>
                {/* زر الإظهار/الإخفاء */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: layer.visible ? '#2ecc71' : '#95a5a6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={layer.visible ? 'إخفاء' : 'إظهار'}
                >
                  {layer.visible ? '👁️' : '👁️‍🗨️'}
                </button>

                {/* زر التحريك لأعلى */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp(layer.id);
                  }}
                  disabled={index === 0}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: index === 0 ? '#bdc3c7' : '#3498db',
                    color: 'white',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="تحريك لأعلى"
                >
                  ⬆️
                </button>

                {/* زر التحريك لأسفل */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown(layer.id);
                  }}
                  disabled={index === sortedLayers.length - 1}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: index === sortedLayers.length - 1 ? '#bdc3c7' : '#3498db',
                    color: 'white',
                    cursor: index === sortedLayers.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="تحريك لأسفل"
                >
                  ⬇️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* إحصائيات الطبقات */}
      {sortedLayers.length > 0 && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px',
          backgroundColor: '#e8f4fd',
          borderRadius: '6px',
          border: '1px solid #bee5eb'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#0c5460'
          }}>
            <span>المستطيلات: {sortedLayers.filter(l => l.type === 'rectangle').length}</span>
            <span>النصوص: {sortedLayers.filter(l => l.type === 'text').length}</span>
            <span>المخفي: {sortedLayers.filter(l => !l.visible).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// نمط الأزرار
const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.2s'
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#6c757d'
};

const dangerButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#dc3545'
};

const successButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#28a745'
};

// المكون الرئيسي
function CanvasTest() {
  const rectanglesRef = useRef<DraggableRectanglesRef>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{
    type: 'rectangle' | 'text';
    id: string;
    settings: any;
  } | null>(null);
  const [layers, setLayers] = useState<LayerElement[]>([]);
  
  // State جديدة لإدارة أبعاد الكانفاس
  const [canvasSize, setCanvasSize] = useState<CanvasSize>('550x350');
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  const [customDimensions, setCustomDimensions] = useState({
    width: 400,
    height: 300
  });

  // تحديث الأبعاد الحالية بناءً على الاختيار
  const currentDimensions = canvasSize === 'custom' 
    ? customDimensions 
    : CANVAS_SIZES[canvasSize];

  // تحديث الطبقات
  const updateLayers = () => {
    if (rectanglesRef.current) {
      const currentLayers = rectanglesRef.current.getLayers();
      setLayers(currentLayers);
    }
  };

  useEffect(() => {
    if (rectanglesRef.current) {
      setIsReady(true);
      updateLayers();
      return;
    }

    const timer = setTimeout(() => {
      if (rectanglesRef.current) {
        setIsReady(true);
        updateLayers();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // تحديث الطبقات بانتظام
  useEffect(() => {
    const interval = setInterval(updateLayers, 500);
    return () => clearInterval(interval);
  }, []);

  // دالة تغيير حجم الكانفاس
  const handleCanvasSizeChange = (newSize: CanvasSize) => {
    setCanvasSize(newSize);
    
    if (newSize !== 'custom') {
      // تطبيق الأبعاد المحددة مسبقاً مباشرة
      const dimensions = CANVAS_SIZES[newSize];
      if (rectanglesRef.current) {
        const app = rectanglesRef.current.getAppRef();
        if (app) {
          app.renderer.resize(dimensions.width, dimensions.height);
        }
      }
    } else {
      // فتح نافذة الأبعاد المخصصة
      setShowCustomSizeModal(true);
    }
  };

  // دالة تطبيق الأبعاد المخصصة
  const handleApplyCustomSize = () => {
    if (customDimensions.width > 0 && customDimensions.height > 0) {
      if (rectanglesRef.current) {
        const app = rectanglesRef.current.getAppRef();
        if (app) {
          app.renderer.resize(customDimensions.width, customDimensions.height);
        }
      }
      setShowCustomSizeModal(false);
    } else {
      alert('الرجاء إدخال أبعاد صحيحة');
    }
  };

  // دالة إلغاء الأبعاد المخصصة
  const handleCancelCustomSize = () => {
    setShowCustomSizeModal(false);
    // العودة إلى الحجم السابق إذا كان موجوداً
    if (canvasSize === 'custom') {
      setCanvasSize('550x350');
    }
  };

  // دوال التحكم في الطبقات
  const handleMoveLayerUp = (id: string) => {
    if (rectanglesRef.current) {
      rectanglesRef.current.moveLayerUp(id);
      updateLayers();
    }
  };

  const handleMoveLayerDown = (id: string) => {
    if (rectanglesRef.current) {
      rectanglesRef.current.moveLayerDown(id);
      updateLayers();
    }
  };

  const handleToggleVisibility = (id: string) => {
    if (rectanglesRef.current) {
      rectanglesRef.current.toggleLayerVisibility(id);
      updateLayers();
    }
  };

  const handleRenameLayer = (id: string, name: string) => {
    if (rectanglesRef.current) {
      rectanglesRef.current.updateLayerName(id, name);
      updateLayers();
    }
  };

  const handleSelectLayer = (id: string) => {
    if (rectanglesRef.current) {
      const selected = rectanglesRef.current.getSelectedElement();
      if (selected && selected.id === id) {
        // إذا كان العنصر محدداً بالفعل، قم بإلغاء التحديد
        setSelectedElement(null);
      } else {
        // حدد العنصر
        const layers = rectanglesRef.current.getLayers();
        const layer = layers.find(l => l.id === id);
        if (layer) {
          if (layer.type === 'rectangle') {
            const settings = rectanglesRef.current.getRectangleSettings(id);
            if (settings) {
              setSelectedElement({ type: 'rectangle', id, settings });
            }
          } else {
            const settings = rectanglesRef.current.getTextSettings(id);
            if (settings) {
              setSelectedElement({ type: 'text', id, settings });
            }
          }
        }
      }
    }
  };

  const handleUpdateSettings = (type: 'rectangle' | 'text', id: string, settings: any) => {
    if (rectanglesRef.current) {
      if (type === 'rectangle') {
        rectanglesRef.current.updateRectangleSettings(id, settings);
      } else {
        rectanglesRef.current.updateTextSettings(id, settings);
      }
    }
  };

  const handleFileUpload = (file: File) => {
    if (selectedElement && selectedElement.type === 'rectangle' && rectanglesRef.current) {
      rectanglesRef.current.setRectangleImageFromFile(selectedElement.id, file);
    }
  };

  // دوال جديدة لإضافة مستطيلات مع خصائص متقدمة
  const handleAddRectangleWithOpacity = () => {
    if (rectanglesRef.current) {
      const rectId = rectanglesRef.current.createRectangle({
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        color: 0x3498db,
        cornerRadius: 20,
        opacity: 0.7,
        showBorder: false
      });
      
      setTimeout(() => {
        const settings = rectanglesRef.current?.getRectangleSettings(rectId);
        if (settings) {
          setSelectedElement({
            type: 'rectangle',
            id: rectId,
            settings
          });
        }
        updateLayers();
      }, 200);
    }
  };

  const handleAddRectangleWithFilters = () => {
    if (rectanglesRef.current) {
      const rectId = rectanglesRef.current.createRectangle({
        x: 300,
        y: 100,
        width: 200,
        height: 150,
        color: 0xe74c3c,
        cornerRadius: 10,
        opacity: 0.9,
        filters: {
          blur: 3,
          brightness: 1.2,
          contrast: 1.1,
          saturation: 0.8,
          hue: 45
        },
        imageUrl: 'https://fastly.picsum.photos/id/954/200/150.jpg?hmac=xOgHk-LcxFn0jOsX94eTFtL8pfKmxHa6IBdYQw3F834',
        imageFit: 'cover',
        showBorder: false
      });
      
      setTimeout(() => {
        const settings = rectanglesRef.current?.getRectangleSettings(rectId);
        if (settings) {
          setSelectedElement({
            type: 'rectangle',
            id: rectId,
            settings
          });
        }
        updateLayers();
      }, 200);
    }
  };

  const handleAddSimpleRectangle = () => {
    if (rectanglesRef.current) {
      const rectId = rectanglesRef.current.createRectangle({
        width: 120,
        height: 80,
        color: 0x2ecc71,
        cornerRadius: 15,
        showBorder: false
      });
      
      setTimeout(() => {
        const settings = rectanglesRef.current?.getRectangleSettings(rectId);
        if (settings) {
          setSelectedElement({
            type: 'rectangle',
            id: rectId,
            settings
          });
        }
        updateLayers();
      }, 200);
    }
  };

  const handleAddText = () => {
    if (rectanglesRef.current) {
      const textId = rectanglesRef.current.createText({
        x: 300,
        y: 200,
        text: 'مرحباً بك في التطبيق!\nهذا نص متعدد الأسطر',
        fontSize: 27,
        color: 0xffffff,
        fontFamily: 'Arial',
        maxWidth: 250,
        align: 'center',
        showBorder: false
      });
      
      setTimeout(() => {
        const settings = rectanglesRef.current?.getTextSettings(textId);
        if (settings) {
          setSelectedElement({
            type: 'text',
            id: textId,
            settings
          });
        }
        updateLayers();
      }, 200);
    }
  };

  const handleAddLongText = () => {
    if (rectanglesRef.current) {
      const textId = rectanglesRef.current.createText({
        x: 500,
        y: 300,
        text: 'هذا نص طويل جداً لتجربة خاصية التحجيم التلقائي للنص. عندما تقوم بتغيير حجم الإطار، سيتغير حجم الخط تلقائياً ليناسب المساحة المتاحة مع الحفاظ على الحدود القصوى والدنيا لحجم الخط.',
        fontSize: 18,
        color: 0xf39c12,
        fontFamily: 'Arial',
        maxWidth: 300,
        align: 'right',
        showBorder: false
      });
      
      setTimeout(() => {
        const settings = rectanglesRef.current?.getTextSettings(textId);
        if (settings) {
          setSelectedElement({
            type: 'text',
            id: textId,
            settings
          });
        }
        updateLayers();
      }, 200);
    }
  };

  const handleClearAll = () => {
    if (rectanglesRef.current) {
      rectanglesRef.current.clearAll();
      setSelectedElement(null);
      updateLayers();
    }
  };

  const handleUpdateFirstText = () => {
    if (rectanglesRef.current) {
      const texts = rectanglesRef.current.getTexts();
      if (texts.length > 0) {
        const firstTextId = texts[0].elementId;
        rectanglesRef.current.updateText(firstTextId, {
          text: 'تم تحديث النص! ✅',
          color: 0x2ecc71,
          fontSize: 28,
          showBorder: false
        });
        updateLayers();
      }
    }
  };

  const handleDeselect = () => {
    setSelectedElement(null);
  };

  const handleShowAllLayers = () => {
    if (rectanglesRef.current) {
      layers.forEach(layer => {
        if (!layer.visible) {
          rectanglesRef.current?.toggleLayerVisibility(layer.id);
        }
      });
      updateLayers();
    }
  };

  const handleHideAllLayers = () => {
    if (rectanglesRef.current) {
      layers.forEach(layer => {
        if (layer.visible) {
          rectanglesRef.current?.toggleLayerVisibility(layer.id);
        }
      });
      updateLayers();
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* الجزء الرئيسي */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={handleAddSimpleRectangle}
            style={buttonStyle}
          >
            ➕ مستطيل بسيط
          </button>
          
          <button 
            onClick={handleAddRectangleWithOpacity}
            style={buttonStyle}
          >
            🔮 مستطيل شفاف
          </button>
          
          <button 
            onClick={handleAddRectangleWithFilters}
            style={buttonStyle}
          >
            🎨 مستطيل مع فلاتر
          </button>
          
          <button 
            onClick={handleAddText}
            style={buttonStyle}
          >
            📝 نص قصير
          </button>
          
          <button 
            onClick={handleAddLongText}
            style={buttonStyle}
          >
            📄 نص طويل
          </button>
          
          <button 
            onClick={handleUpdateFirstText}
            style={successButtonStyle}
          >
            ✏️ تحديث أول نص
          </button>
          
          <button 
            onClick={handleClearAll}
            style={dangerButtonStyle}
          >
            🗑️ مسح الكل
          </button>

          <button 
            onClick={handleDeselect}
            style={secondaryButtonStyle}
          >
            ❌ إلغاء التحديد
          </button>

          {/* زر اختيار حجم الكانفاس */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#333',
              whiteSpace: 'nowrap'
            }}>
              📐 حجم الكانفاس:
            </label>
            <select
              value={canvasSize}
              onChange={(e) => handleCanvasSizeChange(e.target.value as CanvasSize)}
              style={{
                ...inputStyle,
                width: '150px',
                backgroundColor: 'white'
              }}
            >
              <option value="550x350">550 × 350</option>
              <option value="350x350">350 × 350</option>
              <option value="250x350">250 × 350</option>
              <option value="custom">مخصص...</option>
            </select>
            
            {/* عرض الأبعاد الحالية */}
            <span style={{
              padding: '6px 12px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#495057',
              border: '1px solid #ced4da'
            }}>
              {currentDimensions.width} × {currentDimensions.height}
            </span>
          </div>

          {/* باقي الأزرار */}
          <div style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleShowAllLayers}
              style={{ ...secondaryButtonStyle, backgroundColor: '#28a745', padding: '8px 12px' }}
            >
              👁️ إظهار الكل
            </button>
            <button 
              onClick={handleHideAllLayers}
              style={{ ...secondaryButtonStyle, backgroundColor: '#6c757d', padding: '8px 12px' }}
            >
              👁️‍🗨️ إخفاء الكل
            </button>
            <span style={{ 
              padding: '5px 10px', 
              backgroundColor: isReady ? '#d4edda' : '#fff3cd', 
              color: isReady ? '#155724' : '#856404',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {isReady ? '✅ جاهز' : '⏳ جاري التحميل...'}
            </span>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          border: '2px dashed #ddd', 
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <DraggableRectangles
            ref={rectanglesRef}
            width={currentDimensions.width}
            height={currentDimensions.height}
            backgroundColor={0x2c3e50}
          />
        </div>

        {/* معلومات الطبقات */}
        {layers.length > 0 && (
          <div style={{ 
            marginTop: '15px', 
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>معلومات الطبقات</h4>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#3498db', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '14px', color: '#333' }}>مستطيلات: {layers.filter(l => l.type === 'rectangle').length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#e74c3c', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '14px', color: '#333' }}>نصوص: {layers.filter(l => l.type === 'text').length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '14px', color: '#333' }}>المرئية: {layers.filter(l => l.visible).length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '14px', color: '#333' }}>المخفية: {layers.filter(l => !l.visible).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* لوحة التحكم الجانبية */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '320px' }}>
        {/* لوحة الطبقات */}
        <LayersPanel
          layers={layers}
          onMoveUp={handleMoveLayerUp}
          onMoveDown={handleMoveLayerDown}
          onToggleVisibility={handleToggleVisibility}
          onRename={handleRenameLayer}
          onSelect={handleSelectLayer}
        />

        {/* لوحة الإعدادات الحالية */}
        <SettingsPanel
          selectedElement={selectedElement}
          onUpdateSettings={handleUpdateSettings}
          onFileUpload={handleFileUpload}
        />
      </div>

      {/* نافذة الأبعاد المخصصة */}
      <CustomSizeModal
        isOpen={showCustomSizeModal}
        dimensions={customDimensions}
        onDimensionsChange={setCustomDimensions}
        onApply={handleApplyCustomSize}
        onCancel={handleCancelCustomSize}
      />
    </div>
  );
}

export default CanvasTest;