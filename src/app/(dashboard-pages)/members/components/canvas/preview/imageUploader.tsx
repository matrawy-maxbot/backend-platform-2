import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Compressor from 'compressorjs';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onUrlUpload: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onUrlUpload }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ضغط الصورة قبل الرفع - الإصدار المصحح
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        success(result) {
          // تحويل Blob إلى File
          const compressedFile = new File([result], file.name, {
            type: result.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        error(err) {
          console.error('خطأ في ضغط الصورة:', err);
          resolve(file); // ارجع للصورة الأصلية في حالة الخطأ
        },
      });
    });
  };

  // معالجة رفع الملفات
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsLoading(true);
      try {
        const file = acceptedFiles[0];
        console.log('📁 الملف الأصلي:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        const compressedFile = await compressImage(file);
        console.log('✅ الملف بعد الضغط:', {
          name: compressedFile.name,
          type: compressedFile.type,
          size: compressedFile.size
        });

        onImageUpload(compressedFile);
      } catch (error) {
        console.error('❌ خطأ في رفع الملف:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // معالجة رفع الرابط
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      setIsLoading(true);
      console.log('🔗 رفع رابط الصورة:', imageUrl);
      onUrlUpload(imageUrl.trim());
      setImageUrl('');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* أزرار التبويب */}
      <div style={{ display: 'flex', marginBottom: '15px', borderBottom: '1px solid #ddd' }}>
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'file' ? '#007bff' : 'transparent',
            color: activeTab === 'file' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          📁 رفع ملف
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'url' ? '#007bff' : 'transparent',
            color: activeTab === 'url' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          🔗 رابط صورة
        </button>
      </div>

      {/* محتوى التبويب النشط */}
      {activeTab === 'file' ? (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? '#007bff' : '#ddd'}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f8ff' : 'white',
            transition: 'all 0.3s ease'
          }}
        >
          <input {...getInputProps()} />
          
          {isLoading ? (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
              <p>جاري رفع الصورة...</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
              {isDragActive ? (
                <p>أفلت الصورة هنا...</p>
              ) : (
                <div>
                  <p>اسحب الصورة هنا أو انقر للاختيار</p>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    يدعم: JPG, PNG, GIF, WebP (الحد الأقصى: 10MB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!imageUrl.trim() || isLoading}
            style={{
              padding: '12px',
              backgroundColor: imageUrl.trim() && !isLoading ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: imageUrl.trim() && !isLoading ? 'pointer' : 'not-allowed'
            }}
          >
            {isLoading ? 'جاري التحميل...' : 'رفع الرابط'}
          </button>
          <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
            يدعم: JPG, PNG, GIF, WebP
          </p>
        </form>
      )}
    </div>
  );
};

export default ImageUploader;