import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Plus } from 'lucide-react';
import { SitePhoto } from '../types';

interface InputGroupPhotosProps {
  photos: SitePhoto[];
  onAddPhotos: (newPhotos: SitePhoto[]) => void;
  onRemovePhoto: (id: string) => void;
}

export const InputGroupPhotos: React.FC<InputGroupPhotosProps> = ({
  photos,
  onAddPhotos,
  onRemovePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const newPhotos: SitePhoto[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newPhotos.push({
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          size: file.size,
          dataUrl: result,
          previewUrl: result,
        });

        if (newPhotos.length === fileArray.length) {
          onAddPhotos(newPhotos);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset value so same file can be picked again if needed
      e.target.value = '';
    }
  };

  // Sample architectural photos helper for convenience
  const handleAddSamplePhotos = () => {
    const samples: SitePhoto[] = [
      {
        id: `sample_1_${Date.now()}`,
        name: '거실_오크원목마루_자연광_시공.jpg',
        size: 245000,
        dataUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: `sample_2_${Date.now()}`,
        name: '주방_아일랜드_세라믹_마감현장.jpg',
        size: 310000,
        dataUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: `sample_3_${Date.now()}`,
        name: '마스터베드룸_간접조명_프레임.jpg',
        size: 198000,
        dataUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      }
    ];
    onAddPhotos(samples);
  };

  return (
    <section id="section-site-photos" className="group">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold tracking-wide text-[#191512] flex items-center gap-2">
          <span className="font-editorial text-base text-[#8C8277]">03</span>
          <span>현장 사진</span>
          <span className="text-xs text-[#8A8075] font-normal">
            ({photos.length}장 등록됨)
          </span>
        </label>
        
        {photos.length === 0 && (
          <button
            type="button"
            onClick={handleAddSamplePhotos}
            className="text-xs text-[#8A8075] hover:text-[#191512] underline underline-offset-2 cursor-pointer transition-colors"
          >
            샘플 현장 사진 추가
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      <div
        id="dropzone-site-photos"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border border-dashed rounded-sm p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#191512] bg-[#F2ECE4]'
            : 'border-[#D8D2C8] hover:border-[#191512] bg-[#FFFFFF] hover:bg-[#FAF8F5]'
        }`}
      >
        <input
          ref={fileInputRef}
          id="input-file-photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EAE5DF] flex items-center justify-center text-[#5A5046]">
            <UploadCloud className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-sm text-[#2C241E] font-medium">
              현장 사진을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-[#8A8075] mt-0.5">
              JPG, PNG, WEBP 지원 (다중 선택 가능)
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnails Preview Grid */}
      {photos.length > 0 && (
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group/thumb aspect-4/3 rounded-xs overflow-hidden border border-[#E2DDD6] bg-[#EAE5DF]"
            >
              <img
                src={photo.previewUrl}
                alt={photo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-end p-1.5">
                <span className="text-[10px] text-white truncate max-w-[80%]">
                  {photo.name}
                </span>
              </div>
              <button
                type="button"
                id={`btn-remove-photo-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePhoto(photo.id);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-[#191512]/80 hover:bg-[#B85443] text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="사진 삭제"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Quick add more tile */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-4/3 rounded-xs border border-dashed border-[#D8D2C8] hover:border-[#191512] bg-[#FAF8F5] flex flex-col items-center justify-center gap-1 text-[#7A7067] hover:text-[#191512] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[11px]">사진 추가</span>
          </button>
        </div>
      )}
    </section>
  );
};
