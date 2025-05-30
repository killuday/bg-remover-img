import React from 'react';

interface SampleImagesProps {
  onSampleSelect: (imageUrl: string) => void;
}

const SampleImages: React.FC<SampleImagesProps> = ({ onSampleSelect }) => {
  const sampleImages = [
    {
      url: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=300',
      alt: 'Person smiling'
    },
    {
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300',
      alt: 'Dog portrait'
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV7Lj-7ZODxbJDkraJXaGPPYnzqSms3n30gg&s',
      alt: 'KTM Super Duke R EVO'
    },
    {
      url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300',
      alt: 'Cat looking up'
    }
  ];

  return (
    <div className="mt-12">
      <h3 className="text-xl font-medium text-center text-gray-700 mb-6">No image? Try one of these:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sampleImages.map((image, index) => (
          <div 
            key={index}
            onClick={() => onSampleSelect(image.url)}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img 
              src={image.url} 
              alt={image.alt}
              className="w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-4 text-sm text-gray-500">
        All images are processed locally on your device and are not uploaded to any server.
      </div>
    </div>
  );
};

export default SampleImages;