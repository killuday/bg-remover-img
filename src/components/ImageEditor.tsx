import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  image, 
  onSave, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState<'solidColor' | 'image'>('solidColor');
  const [selectedColor, setSelectedColor] = useState('#ff0000'); // Default red
  const [customColor, setCustomColor] = useState('#ff0000');
  const [effect, setEffect] = useState<'none' | 'blur' | 'bright' | 'contrast'>('none');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  
  const colors = [
    '#ffffff', // white
    '#000000', // black
    '#ff0000', // red
    '#00ff00', // green
    '#0000ff', // blue
    '#ffff00', // yellow
    '#00ffff', // cyan
    '#ff00ff', // magenta
    '#808080', // gray
    '#c0c0c0', // light gray
  ];

  useEffect(() => {
    // Create a canvas to manipulate the image
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Apply background color if in solid color mode
        if (activeTab === 'solidColor') {
          // Get image data to manipulate pixels
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Convert hex color to RGB
          const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : { r: 255, g: 0, b: 0 };
          };
          
          const bgColor = hexToRgb(selectedColor);
          
          // Replace transparent/semi-transparent pixels with background color
          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 255) {
              const alphaFactor = alpha / 255;
              data[i] = Math.round(data[i] * alphaFactor + bgColor.r * (1 - alphaFactor));
              data[i + 1] = Math.round(data[i + 1] * alphaFactor + bgColor.g * (1 - alphaFactor));
              data[i + 2] = Math.round(data[i + 2] * alphaFactor + bgColor.b * (1 - alphaFactor));
              data[i + 3] = 255; // Make fully opaque
            }
          }
          
          // Apply the modified image data
          ctx.putImageData(imageData, 0, 0);
        }
        
        // Apply effects
        if (effect !== 'none') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          if (effect === 'blur') {
            // Simple blur effect (this is a basic implementation)
            // For a real app, you'd want a more sophisticated blur algorithm
            for (let i = 0; i < data.length; i += 4) {
              if (i % (canvas.width * 4) < canvas.width * 4 - 8) {
                data[i] = (data[i] + data[i + 4]) / 2;
                data[i + 1] = (data[i + 1] + data[i + 5]) / 2;
                data[i + 2] = (data[i + 2] + data[i + 6]) / 2;
              }
            }
          } else if (effect === 'bright') {
            // Increase brightness
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(data[i] + 30, 255);
              data[i + 1] = Math.min(data[i + 1] + 30, 255);
              data[i + 2] = Math.min(data[i + 2] + 30, 255);
            }
          } else if (effect === 'contrast') {
            // Increase contrast
            const factor = 1.2; // Contrast factor
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(Math.max(((data[i] / 255 - 0.5) * factor + 0.5) * 255, 0), 255);
              data[i + 1] = Math.min(Math.max(((data[i + 1] / 255 - 0.5) * factor + 0.5) * 255, 0), 255);
              data[i + 2] = Math.min(Math.max(((data[i + 2] / 255 - 0.5) * factor + 0.5) * 255, 0), 255);
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        // Get the final image as data URL
        const dataUrl = canvas.toDataURL('image/png');
        setEditedImage(dataUrl);
      }
    };
    
    img.src = image;
  }, [image, selectedColor, activeTab, effect]);
  
  const handleSave = () => {
    if (editedImage) {
      onSave(editedImage);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Image</h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left column - Controls */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Background</h3>
            <div className="flex mb-4">
              <button 
                className={`px-4 py-2 rounded-l-lg ${activeTab === 'solidColor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveTab('solidColor')}
              >
                Solid Color
              </button>
              <button 
                className={`px-4 py-2 rounded-r-lg ${activeTab === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveTab('image')}
              >
                Image
              </button>
            </div>
            
            {/* Color selector */}
            {activeTab === 'solidColor' && (
              <div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-7 h-10 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
                <div className="flex items-center mb-6">
                  <label className="mr-4 text-gray-700">Custom Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setSelectedColor(e.target.value);
                      }}
                      className="w-8 h-8 overflow-hidden cursor-pointer"
                    />
                    <div 
                      className="w-10 h-10 ml-2 border border-gray-300 rounded-lg"
                      style={{ backgroundColor: customColor }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Effects section */}
            <h3 className="text-lg font-medium text-gray-700 mt-6 mb-2">Effects</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-lg ${effect === 'none' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setEffect('none')}
              >
                None
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${effect === 'blur' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setEffect('blur')}
              >
                Blur
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${effect === 'bright' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setEffect('bright')}
              >
                Bright
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${effect === 'contrast' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setEffect('contrast')}
              >
                Contrast
              </button>
            </div>
          </div>
          
          {/* Right column - Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Preview</h3>
            <div className="bg-white border border-gray-300 rounded-lg w-full  flex items-center justify-center">
              {editedImage ? (
                <img 
                  src={editedImage} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-gray-500">Loading preview...</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button 
            onClick={onCancel}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor; 