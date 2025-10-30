// components/ColorPickerIframe.tsx
"use client"

import React, { useCallback, useState } from 'react';

interface ColorPickerIframeProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPickerIframe({
  value,
  onChange,
  label = "اختر اللون"
}: ColorPickerIframeProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'COLOR_CHANGE') {
      onChange(event.data.color);
    }
  }, [onChange]);

  React.useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [handleIframeMessage]);

  const iframeSrc = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://unpkg.com/@chakra-ui/react@latest/dist/index.js"></script>
      <style>
        body { margin: 0; padding: 10px; background: transparent; }
        .container { max-width: 300px; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="module">
        // كود Chakra UI سيذهب هنا
      </script>
    </body>
    </html>
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-gray-300 text-sm font-medium block">
          {label}
        </label>
      )}
      <div className="border border-gray-600 rounded-lg overflow-hidden">
        <iframe
          srcDoc={iframeSrc}
          className="w-full h-64"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 bg-gray-700 border border-gray-600 rounded"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm px-3 py-2 rounded mt-2"
        placeholder="#d0d4d8"
      />
    </div>
  );
}