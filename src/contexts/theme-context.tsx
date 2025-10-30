'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// تعريف أنواع البيانات للثيم
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  gradient: {
    primary: string
    secondary: string
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  }
}

export interface CustomTheme {
  id: string
  name: string
  colors: ThemeColors
  isDark: boolean
  intensity: number // 0-100
}

// الثيمات المحددة مسبقاً
const predefinedThemes: CustomTheme[] = [
  {
    id: 'blue-gold',
    name: 'Blue & Gold',
    isDark: true,
    intensity: 75,
    colors: {
      primary: '#3B82F6',
      secondary: '#F59E0B',
      accent: '#8B5CF6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      gradient: {
        primary: 'from-blue-500 to-blue-600',
        secondary: 'from-yellow-500 to-yellow-600',
        direction: 'to-br'
      }
    }
  },
  {
    id: 'purple-pink',
    name: 'Purple & Pink',
    isDark: true,
    intensity: 80,
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#06B6D4',
      background: '#0F0F23',
      surface: '#1A1A2E',
      text: '#F8FAFC',
      textSecondary: '#A78BFA',
      border: '#4C1D95',
      gradient: {
        primary: 'from-purple-500 to-purple-600',
        secondary: 'from-pink-500 to-pink-600',
        direction: 'to-br'
      }
    }
  },
  {
    id: 'green-emerald',
    name: 'Green & Emerald',
    isDark: true,
    intensity: 70,
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#06B6D4',
      background: '#0F1419',
      surface: '#1F2937',
      text: '#F8FAFC',
      textSecondary: '#6EE7B7',
      border: '#065F46',
      gradient: {
        primary: 'from-green-500 to-green-600',
        secondary: 'from-emerald-500 to-emerald-600',
        direction: 'to-br'
      }
    }
  },
  {
    id: 'red-orange',
    name: 'Red & Orange',
    isDark: true,
    intensity: 85,
    colors: {
      primary: '#EF4444',
      secondary: '#F97316',
      accent: '#8B5CF6',
      background: '#1A0B0B',
      surface: '#2D1B1B',
      text: '#F8FAFC',
      textSecondary: '#FCA5A5',
      border: '#7F1D1D',
      gradient: {
        primary: 'from-red-500 to-red-600',
        secondary: 'from-orange-500 to-orange-600',
        direction: 'to-br'
      }
    }
  }
]

// واجهة السياق
interface ThemeContextType {
  currentTheme: CustomTheme
  previewTheme: CustomTheme | null
  predefinedThemes: CustomTheme[]
  customThemes: CustomTheme[]
  setTheme: (theme: CustomTheme) => void
  setPreviewTheme: (theme: CustomTheme | null) => void
  applyPreviewTheme: () => void
  createCustomTheme: (theme: Omit<CustomTheme, 'id'>) => void
  updateTheme: (themeId: string, updates: Partial<CustomTheme>) => void
  deleteCustomTheme: (themeId: string) => void
  resetToDefault: () => void
  exportThemes: () => string
  importThemes: (themesJson: string) => boolean
}

// إنشاء السياق
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// مزود السياق
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(predefinedThemes[0])
  const [previewTheme, setPreviewTheme] = useState<CustomTheme | null>(null)
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([])

  // تحميل الإعدادات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-current-theme')
    const savedCustomThemes = localStorage.getItem('dashboard-custom-themes')

    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(savedCustomThemes)
        setCustomThemes(parsed)
      } catch (error) {
        console.error('خطأ في تحميل الثيمات المخصصة:', error)
      }
    }

    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        // البحث في الثيمات المحددة مسبقاً والمخصصة
        const foundTheme = [...predefinedThemes, ...customThemes].find(t => t.id === parsed.id)
        if (foundTheme) {
          setCurrentTheme(foundTheme)
        } else {
          setCurrentTheme(parsed)
        }
      } catch (error) {
        console.error('خطأ في تحميل الثيم الحالي:', error)
      }
    }
  }, [])

  // حفظ الإعدادات في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('dashboard-current-theme', JSON.stringify(currentTheme))
  }, [currentTheme])

  useEffect(() => {
    localStorage.setItem('dashboard-custom-themes', JSON.stringify(customThemes))
  }, [customThemes])

  // تطبيق الثيم على CSS variables
  useEffect(() => {
    const root = document.documentElement
    const activeTheme = previewTheme || currentTheme
    const { colors } = activeTheme

    // تطبيق الألوان كمتغيرات CSS
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-background', colors.background)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-secondary', colors.textSecondary)
    root.style.setProperty('--theme-border', colors.border)
    root.style.setProperty('--theme-intensity', activeTheme.intensity.toString())

    // إضافة كلاس للثيم الداكن/الفاتح
    if (activeTheme.isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [currentTheme, previewTheme])

  const setTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme)
    setPreviewTheme(null) // إلغاء المعاينة عند تطبيق ثيم جديد
  }

  const applyPreviewTheme = () => {
    if (previewTheme) {
      setCurrentTheme(previewTheme)
      setPreviewTheme(null)
    }
  }

  const createCustomTheme = (theme: Omit<CustomTheme, 'id'>) => {
    const newTheme: CustomTheme = {
      ...theme,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setCustomThemes(prev => [...prev, newTheme])
    return newTheme
  }

  const updateTheme = (themeId: string, updates: Partial<CustomTheme>) => {
    // تحديث الثيم المخصص
    setCustomThemes(prev => 
      prev.map(theme => 
        theme.id === themeId ? { ...theme, ...updates } : theme
      )
    )

    // إذا كان الثيم المحدث هو الثيم الحالي، قم بتحديثه أيضاً
    if (currentTheme.id === themeId) {
      setCurrentTheme(prev => ({ ...prev, ...updates }))
    }
  }

  const deleteCustomTheme = (themeId: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== themeId))
    
    // إذا كان الثيم المحذوف هو الثيم الحالي، قم بالتبديل إلى الثيم الافتراضي
    if (currentTheme.id === themeId) {
      setCurrentTheme(predefinedThemes[0])
    }
  }

  const resetToDefault = () => {
    setCurrentTheme(predefinedThemes[0])
    setCustomThemes([])
    localStorage.removeItem('dashboard-current-theme')
    localStorage.removeItem('dashboard-custom-themes')
  }

  const exportThemes = (): string => {
    const exportData = {
      currentTheme,
      customThemes,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    return JSON.stringify(exportData, null, 2)
  }

  const importThemes = (themesJson: string): boolean => {
    try {
      const importData = JSON.parse(themesJson)
      
      if (importData.customThemes && Array.isArray(importData.customThemes)) {
        setCustomThemes(importData.customThemes)
      }
      
      if (importData.currentTheme) {
        setCurrentTheme(importData.currentTheme)
      }
      
      return true
    } catch (error) {
      console.error('خطأ في استيراد الثيمات:', error)
      return false
    }
  }

  const value: ThemeContextType = {
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
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// هوك لاستخدام السياق
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// دالة مساعدة لتطبيق الألوان
export function getThemeColor(colorKey: keyof ThemeColors, opacity?: number): string {
  const color = `var(--theme-${colorKey.replace(/([A-Z])/g, '-$1').toLowerCase()})`
  return opacity ? `${color}/${opacity}` : color
}

// دالة مساعدة لإنشاء كلاسات Tailwind مع الألوان المخصصة
export function createThemeClasses(theme: CustomTheme) {
  const { colors, intensity } = theme
  
  return {
    // خلفيات
    bgPrimary: `bg-[${colors.primary}]`,
    bgSecondary: `bg-[${colors.secondary}]`,
    bgSurface: `bg-[${colors.surface}]`,
    bgBackground: `bg-[${colors.background}]`,
    
    // نصوص
    textPrimary: `text-[${colors.text}]`,
    textSecondary: `text-[${colors.textSecondary}]`,
    textAccent: `text-[${colors.accent}]`,
    
    // حدود
    borderPrimary: `border-[${colors.border}]`,
    borderAccent: `border-[${colors.accent}]`,
    
    // تدرجات
    gradientPrimary: `bg-gradient-${colors.gradient.direction} ${colors.gradient.primary}`,
    gradientSecondary: `bg-gradient-${colors.gradient.direction} ${colors.gradient.secondary}`,
    
    // شفافية حسب الكثافة
    opacity: Math.round(intensity / 100 * 255).toString(16).padStart(2, '0')
  }
}
