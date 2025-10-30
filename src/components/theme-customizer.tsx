'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme, CustomTheme, ThemeColors } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Palette, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Copy,
  Check,
  X,
  Shuffle,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const { 
    currentTheme, 
    previewTheme,
    predefinedThemes, 
    customThemes, 
    setTheme, 
    setPreviewTheme,
    applyPreviewTheme,
    createCustomTheme, 
    updateTheme, 
    deleteCustomTheme, 
    resetToDefault,
    exportThemes,
    importThemes
  } = useTheme()

  const [activeTab, setActiveTab] = useState<'appearance' | 'colors' | 'advanced'>('appearance')
  const [editingTheme, setEditingTheme] = useState<CustomTheme>(currentTheme)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [isCreatingCustom, setIsCreatingCustom] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    appearance: true,
    colors: true,
    controls: true
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // تحديث الثيم المحرر عند تغيير الثيم الحالي
  useEffect(() => {
    setEditingTheme(currentTheme)
  }, [currentTheme])

  // إغلاق منتقي الألوان عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const updatedTheme = {
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [colorKey]: value
      }
    }
    setEditingTheme(updatedTheme)
    
    // تطبيق المعاينة المؤقتة
    setPreviewTheme(updatedTheme)
  }

  const handleGradientDirectionChange = (direction: string) => {
    const updatedTheme = {
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        gradient: {
          ...editingTheme.colors.gradient,
          direction: direction as any
        }
      }
    }
    setEditingTheme(updatedTheme)
    
    // تطبيق المعاينة المؤقتة
    setPreviewTheme(updatedTheme)
  }

  const handleIntensityChange = (value: number[]) => {
    const updatedTheme = {
      ...editingTheme,
      intensity: value[0]
    }
    setEditingTheme(updatedTheme)
    
    // تطبيق المعاينة المؤقتة
    setPreviewTheme(updatedTheme)
  }

  const handleThemeToggle = () => {
    const updatedTheme = {
      ...editingTheme,
      isDark: !editingTheme.isDark
    }
    setEditingTheme(updatedTheme)
    
    // تطبيق المعاينة المؤقتة
    setPreviewTheme(updatedTheme)
  }

  const handleSaveCustomTheme = () => {
    if (isCreatingCustom) {
      const newTheme = createCustomTheme({
        name: editingTheme.name || 'Custom Theme',
        colors: editingTheme.colors,
        isDark: editingTheme.isDark,
        intensity: editingTheme.intensity
      })
      setTheme(newTheme)
      setIsCreatingCustom(false)
    } else {
      updateTheme(editingTheme.id, editingTheme)
    }
  }

  const handleCreateNewTheme = () => {
    setIsCreatingCustom(true)
    setEditingTheme({
      id: 'new',
      name: 'New Custom Theme',
      colors: { ...currentTheme.colors },
      isDark: currentTheme.isDark,
      intensity: currentTheme.intensity
    })
  }

  const generateRandomTheme = () => {
    const randomColors: ThemeColors = {
      primary: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      secondary: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      accent: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      background: editingTheme.isDark ? '#0F172A' : '#FFFFFF',
      surface: editingTheme.isDark ? '#1E293B' : '#F8FAFC',
      text: editingTheme.isDark ? '#F8FAFC' : '#0F172A',
      textSecondary: editingTheme.isDark ? '#94A3B8' : '#64748B',
      border: editingTheme.isDark ? '#334155' : '#E2E8F0',
      gradient: {
        primary: 'from-blue-500 to-blue-600',
        secondary: 'from-purple-500 to-purple-600',
        direction: 'to-br'
      }
    }

    const updatedTheme = {
      ...editingTheme,
      colors: randomColors
    }
    setEditingTheme(updatedTheme)
    
    // تطبيق المعاينة المؤقتة
    setPreviewTheme(updatedTheme)
  }

  const handleExportThemes = () => {
    const dataStr = exportThemes()
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dashboard-themes.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportThemes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (importThemes(content)) {
          // نجح الاستيراد
        } else {
          // فشل الاستيراد
          alert('فشل في استيراد الثيمات. تأكد من صحة الملف.')
        }
      }
      reader.readAsText(file)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const ColorPicker = ({ colorKey, label }: { colorKey: keyof ThemeColors, label: string }) => {
    if (colorKey === 'gradient') return null
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-300">{label}</Label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowColorPicker(showColorPicker === colorKey ? null : colorKey)}
            className="w-10 h-10 rounded-lg border-2 border-gray-600 overflow-hidden hover:border-gray-500 transition-colors"
            style={{ backgroundColor: editingTheme.colors[colorKey] }}
          />
          <Input
            value={editingTheme.colors[colorKey]}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            className="flex-1 bg-gray-800/50 border-gray-600 text-gray-200"
            placeholder="#000000"
          />
        </div>
        
        {showColorPicker === colorKey && (
          <div ref={colorPickerRef} className="absolute z-50 mt-2">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
              <div className="grid grid-cols-6 gap-2 mb-4">
                {[
                  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
                  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
                  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B'
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      handleColorChange(colorKey, color)
                      setShowColorPicker(null)
                    }}
                    className="w-8 h-8 rounded border-2 border-gray-600 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={editingTheme.colors[colorKey]}
                onChange={(e) => handleColorChange(colorKey, e.target.value)}
                className="w-full h-10 rounded border border-gray-600 bg-transparent"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Custom Themes</h2>
              <p className="text-sm text-gray-400">Match your mood with endless color combinations. Try it now!</p>
            </div>
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              BETA
            </div>
            {previewTheme && (
              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                معاينة نشطة
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreviewTheme(null)
              onClose()
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Appearance Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('appearance')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
              {expandedSections.appearance ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </button>
            
            {expandedSections.appearance && (
              <div className="space-y-4">
                {/* Dark/Light Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {editingTheme.isDark ? 
                      <Moon className="h-5 w-5 text-blue-400" /> : 
                      <Sun className="h-5 w-5 text-yellow-400" />
                    }
                    <span className="text-white font-medium">
                      {editingTheme.isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <Switch
                    checked={editingTheme.isDark}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>

                {/* Predefined Themes */}
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">Predefined Themes</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {predefinedThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setTheme(theme)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all duration-200 text-left",
                          currentTheme.id === theme.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-6 h-6 rounded-md"
                            style={{ 
                              background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.secondary})` 
                            }}
                          />
                          <span className="text-white font-medium text-sm">{theme.name}</span>
                          {currentTheme.id === theme.id && (
                            <Check className="h-4 w-4 text-blue-400 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Colors Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('colors')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-lg font-semibold text-white">Colors</h3>
              {expandedSections.colors ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </button>
            
            {expandedSections.colors && (
              <div className="space-y-4">
                {/* Color Palette */}
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker colorKey="primary" label="Primary Color" />
                  <ColorPicker colorKey="secondary" label="Secondary Color" />
                  <ColorPicker colorKey="accent" label="Accent Color" />
                  <ColorPicker colorKey="background" label="Background" />
                </div>

                {/* Color Intensity Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-300">Color Intensity</Label>
                    <span className="text-sm text-gray-400">{editingTheme.intensity}%</span>
                  </div>
                  <Slider
                    value={[editingTheme.intensity]}
                    onValueChange={handleIntensityChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full h-1.5"
                  />
                </div>

                {/* Gradient Direction */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-300">Gradient Direction</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'to-r', label: '→' },
                      { value: 'to-l', label: '←' },
                      { value: 'to-t', label: '↑' },
                      { value: 'to-b', label: '↓' },
                      { value: 'to-br', label: '↘' },
                      { value: 'to-bl', label: '↙' },
                      { value: 'to-tr', label: '↗' },
                      { value: 'to-tl', label: '↖' }
                    ].map((direction) => (
                      <button
                        key={direction.value}
                        onClick={() => handleGradientDirectionChange(direction.value)}
                        className={cn(
                          "p-3 rounded-lg border text-center font-mono text-lg transition-colors",
                          editingTheme.colors.gradient.direction === direction.value
                            ? "border-blue-500 bg-blue-500/20 text-blue-400"
                            : "border-gray-600 text-gray-400 hover:border-gray-500"
                        )}
                      >
                        {direction.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('controls')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-lg font-semibold text-white">Controls</h3>
              {expandedSections.controls ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </button>
            
            {expandedSections.controls && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <h4 className="text-sm font-medium text-gray-300">إجراءات سريعة</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={generateRandomTheme}
                      variant="outline"
                      className="justify-start h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Shuffle className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">مفاجأة!</div>
                          <div className="text-xs text-gray-400">إنشاء ثيم عشوائي جديد</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={resetToDefault}
                      variant="outline"
                      className="justify-start h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-red-500 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <RotateCcw className="h-4 w-4 text-red-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">إعادة تعيين</div>
                          <div className="text-xs text-gray-400">العودة للإعدادات الافتراضية</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/50" />

                {/* Theme Management */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <h4 className="text-sm font-medium text-gray-300">إدارة الثيمات</h4>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCreateNewTheme}
                      variant="outline"
                      className="w-full justify-start h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-green-500 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Plus className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">إنشاء ثيم جديد</div>
                          <div className="text-xs text-gray-400">إضافة مجموعة ألوان مخصصة</div>
                        </div>
                      </div>
                    </Button>
                    
                    {(isCreatingCustom || customThemes.some(t => t.id === editingTheme.id)) && (
                      <Button
                        onClick={handleSaveCustomTheme}
                        className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700 text-white transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">حفظ الثيم</div>
                            <div className="text-xs text-blue-200">حفظ التغييرات الحالية</div>
                          </div>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/50" />

                {/* Import/Export */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <h4 className="text-sm font-medium text-gray-300">استيراد وتصدير</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleExportThemes}
                      variant="outline"
                      className="h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-orange-500 transition-all"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="p-1 bg-orange-500/20 rounded">
                          <Download className="h-3 w-3 text-orange-400" />
                        </div>
                        <div className="text-xs font-medium">تصدير</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-orange-500 transition-all"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="p-1 bg-orange-500/20 rounded">
                          <Upload className="h-3 w-3 text-orange-400" />
                        </div>
                        <div className="text-xs font-medium">استيراد</div>
                      </div>
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportThemes}
                    className="hidden"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/50" />

                {/* Current Theme Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <h4 className="text-sm font-medium text-gray-300">معلومات الثيم الحالي</h4>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div 
                            className="w-8 h-8 rounded-lg shadow-lg"
                            style={{ 
                              background: `linear-gradient(135deg, ${editingTheme.colors.primary}, ${editingTheme.colors.secondary})` 
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{editingTheme.name}</div>
                          <div className="text-xs text-gray-400">الثيم النشط</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-cyan-400 font-medium">{editingTheme.intensity}%</div>
                        <div className="text-xs text-gray-400">الكثافة</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">الألوان</div>
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-1">
                            <div 
                              className="h-6 rounded-md border border-gray-600"
                              style={{ backgroundColor: editingTheme.colors.primary }}
                            />
                            <div className="text-xs text-gray-400 text-center">أساسي</div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div 
                              className="h-6 rounded-md border border-gray-600"
                              style={{ backgroundColor: editingTheme.colors.secondary }}
                            />
                            <div className="text-xs text-gray-400 text-center">ثانوي</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">الوضع</div>
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${editingTheme.isDark ? 'bg-gray-700' : 'bg-yellow-500/20'}`}>
                            {editingTheme.isDark ? 
                              <Moon className="h-4 w-4 text-gray-300" /> : 
                              <Sun className="h-4 w-4 text-yellow-500" />
                            }
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">
                              {editingTheme.isDark ? 'داكن' : 'فاتح'}
                            </div>
                            <div className="text-xs text-gray-400">الوضع الحالي</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Actions */}
          {previewTheme && (
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-300 font-medium">معاينة مؤقتة نشطة</span>
                </div>
                <span className="text-xs text-blue-400">جاري المعاينة...</span>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={applyPreviewTheme}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  تطبيق الألوان
                </Button>
                <Button
                  onClick={() => {
                    setPreviewTheme(null)
                    setEditingTheme(currentTheme)
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}