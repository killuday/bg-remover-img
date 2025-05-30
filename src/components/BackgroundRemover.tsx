import React, { useState, useEffect } from 'react';
import { Upload, Download, Edit2 } from 'lucide-react';
import UploadArea from './UploadArea';
import ImagePreview from './ImagePreview';
import SampleImages from './SampleImages';
import ImageEditor from './ImageEditor';
import { initializeModel, processImage as processImageAPI } from "../lib/process";

const BackgroundRemover: React.FC = () => {
    const [image, setImage] = useState<{
        id: number;
        file: File;
        maskFile?: File;
        processedFile?: File;
      } | null>(null);
      
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    // Initialize the model when component mounts
    (async () => {
      try {
        const initialized = await initializeModel();
        if (initialized) {
          setIsModelLoaded(true);
        }
      } catch (err) {
        console.error("Failed to initialize model:", err);
      }
    })();
  }, []);

  const handleImageUpload = (imageDataUrl: string) => {
    // Convert data URL to File object
    const byteString = atob(imageDataUrl.split(',')[1]);
    const mimeType = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const file = new File([ab], "uploaded-image.png", { type: mimeType });
    
    const newImage = {
      id: Date.now(),
      file: file,
      processedFile: undefined,
    };
    setImage(newImage);
    handleProcessImage(newImage);
  };

  const handleSampleImageSelect = (imageUrl: string) => {
    // Convert sample image URL to data URL for consistency
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        // Convert dataUrl to File
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const file = new File([ab], "sample-image.png", { type: mimeType });
        
        const newImage = {
          id: Date.now(),
          file: file,
          processedFile: undefined,
        };
        
        setImage(newImage);
        handleProcessImage(newImage);
      }
    };
    img.src = imageUrl;
  };

  const handleProcessImage = async (img: {
    id: number;
    file: File;
    processedFile?: File;
  }) => {
    if (!isModelLoaded) {
      console.error("Model not initialized yet");
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await processImageAPI(img.file);
      if (result) {
        const { maskFile, processedFile } = result;
        setImage({ ...img, processedFile, maskFile });
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (image?.processedFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(image.processedFile);
      link.download = 'removed-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditImage = () => {
    if (image?.processedFile) {
      setShowEditor(true);
    }
  };

  const handleSaveEditedImage = (editedImageDataUrl: string) => {
    if (image) {
      // Convert data URL to File
      const byteString = atob(editedImageDataUrl.split(',')[1]);
      const mimeType = editedImageDataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const editedFile = new File([ab], "edited-image.png", { type: mimeType });
      
      // Update the image state with the edited file
      setImage({
        ...image,
        processedFile: editedFile
      });
      
      setShowEditor(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Remove Image Background</h2>
        <p className="text-xl text-gray-600 mb-6">100% Automatically and Free</p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your image and let our AI remove the background instantly. 
          Perfect for professional photos, product images, and more.
        </p>
      </div>

      {!image ? (
        <div className="space-y-8">
          <UploadArea onImageUpload={handleImageUpload} />
          <SampleImages onSampleSelect={handleSampleImageSelect} />
        </div>
      ) : (
        <div className="space-y-8">
          <ImagePreview 
            originalImage={URL.createObjectURL(image.file)}
            processedImage={image.processedFile ? URL.createObjectURL(image.processedFile) : null}
            isProcessing={isProcessing}
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                setImage(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={20} />
              Upload Another Image
            </button>
            
            {image.processedFile && (
              <>
                <button 
                  onClick={handleEditImage}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={20} />
                  Edit Background
                </button>
                
                <button 
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                >
                  <Download size={20} />
                  Download Result
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {showEditor && image?.processedFile && (
        <ImageEditor 
          image={URL.createObjectURL(image.processedFile)}
          onSave={handleSaveEditedImage}
          onCancel={() => setShowEditor(false)}
        />
      )}
      
      <div className="mt-12 p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-blue-800">
          All images are processed locally on your device and are not uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default BackgroundRemover;