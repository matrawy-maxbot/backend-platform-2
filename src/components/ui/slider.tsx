"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, step = 0.1, onValueChange, value, min = 0, max = 100, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const currentValue = value?.[0] || 0
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    updateValueFromMouse(e)
  }
  
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updateValueFromMouse(e as any)
  }, [isDragging])
  
  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])
  
  const updateValueFromMouse = (e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newValue = min + percentage * (max - min)
    const steppedValue = Math.round(newValue / step) * step
    
    // استدعاء فوري للتحديث
    if (onValueChange) {
      onValueChange([steppedValue])
    }
  }
  
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mouseleave', handleMouseUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
      document.body.style.pointerEvents = 'none'
      if (sliderRef.current) {
        sliderRef.current.style.pointerEvents = 'auto'
      }
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      document.body.style.pointerEvents = ''
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      document.body.style.pointerEvents = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])
  

  
  return (
    <SliderPrimitive.Root
      ref={ref}
      step={step}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track 
         ref={sliderRef}
         onMouseDown={handleMouseDown}
         className={cn(
           "relative w-full grow overflow-hidden rounded-full bg-gray-700/50 group-hover:bg-gray-600/60 transition-all duration-150 ease-out cursor-pointer",
           className?.includes('h-1.5') ? 'h-1.5' : className?.includes('h-2') ? 'h-2' : 'h-4'
         )}
       >
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150 ease-out" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        onMouseDown={handleMouseDown}
        className={cn(
           "block rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg ring-offset-background transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu will-change-transform",
           className?.includes('h-1.5') ? 'h-3 w-3' : className?.includes('h-2') ? 'h-4 w-4' : 'h-7 w-7',
           isDragging ? "scale-125 shadow-2xl cursor-grabbing" : "hover:scale-110 hover:shadow-xl active:scale-105 cursor-grab"
         )} 
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }