import React, { useCallback, useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';

export interface UploadedImage {
  file: File;
  preview: string;
}

interface ProductUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  disabled?: boolean;
}

const ProductUploader: React.FC<ProductUploaderProps> = ({
  images,
  onImagesChange,
  disabled
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList | File[]) => {
    if (disabled) return;
    
    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) return;

    const newImages: UploadedImage[] = [];
    let processedCount = 0;
    
    const filesArray = Array.isArray(files) ? files : Array.from(files);
    const filesToProcess = filesArray.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    filesToProcess.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string
          });
          processedCount++;
          
          if (processedCount === filesToProcess.length) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [images, onImagesChange, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  }, [processFiles]);

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (disabled) return;
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center text-neutral-500 p-6 text-center">
      <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-4">
        <Upload size={32} />
      </div>
      <p className="font-bold text-lg text-black uppercase tracking-tight">Upload Photos</p>
      <p className="text-sm mt-2 font-medium">
        Drag & drop up to 3 files
      </p>
    </div>
  );

  return (
    <div className="w-full">
      {/* If no images, show the large dropzone */}
      {images.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-full aspect-[4/3] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer bg-gray-50
            ${isDragging ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-black'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {renderEmptyState()}
        </div>
      ) : (
        /* If images exist, show grid */
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div 
              key={index} 
              className="relative aspect-square border border-gray-200 bg-white group"
            >
              <img 
                src={img.preview} 
                alt={`Product ${index + 1}`} 
                className="w-full h-full object-contain p-2"
              />
              <button
                onClick={(e) => handleRemove(e, index)}
                disabled={disabled}
                className="absolute top-1 right-1 p-1 bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
                  Main
                </div>
              )}
            </div>
          ))}

          {/* Add Button if < 3 images */}
          {images.length < 3 && (
            <div
              className={`
                relative aspect-square border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors
                ${disabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-black hover:bg-gray-50 bg-white'}
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center text-gray-400 hover:text-black">
                <Plus size={24} />
                <span className="text-xs font-bold mt-1 uppercase">Add</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-2 flex justify-between items-center px-1">
        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
          {images.length}/3 uploaded
        </p>
        {images.length > 0 && (
          <button 
            onClick={() => onImagesChange([])}
            className="text-xs text-black border-b border-black font-bold uppercase hover:opacity-70"
            disabled={disabled}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductUploader;