import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  originalImage, 
  processedImage, 
  isProcessing 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {originalImage && (
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Original Image</h3>
          <div className="bg-white p-2 rounded-lg shadow-md w-full">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-auto max-h-80 object-contain mx-auto"
            />
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Processed Image</h3>
        <div className="bg-white p-2 rounded-lg shadow-md w-full min-h-[200px] flex items-center justify-center">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <RefreshCw className="h-8 w-8 animate-spin mb-2" />
              <p>Removing background...</p>
            </div>
          ) : processedImage ? (
            <img 
              src={processedImage} 
              alt="Processed" 
              className="w-full h-auto max-h-80 object-contain mx-auto"
            />
          ) : (
            <p className="text-gray-400">Processing image...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;