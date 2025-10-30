// components/ColorPickerWithProvider.tsx
"use client"

import ColorPickerComponent from './ColorPickerComponent';

interface ColorPickerWithProviderProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showManualInput?: boolean;
  className?: string;
}

export default function ColorPickerWithProvider({
  value,
  onChange,
  label,
  showManualInput,
  className
}: ColorPickerWithProviderProps) {
  return (
    <ColorPickerComponent
      value={value}
      onChange={onChange}
      label={label}
      showManualInput={showManualInput}
      className={className}
    />
  );
}