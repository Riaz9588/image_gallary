import React, { useState } from 'react';
import { RiImageAddLine } from 'react-icons/ri';
import { BsTrash } from 'react-icons/bs';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());

  // drag and drop functionality - starts
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e, index) => {
    const droppedIndex = e.dataTransfer.getData("index");
    const newImages = [...images];
    const draggedImage = newImages[droppedIndex];
    newImages.splice(droppedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    setImages(newImages);
  };
  // drag and drop functionality - ends

  // checkbox functionality - starts
  const handleCheckboxChange = (index) => {
    const updatedSelectedImages = new Set(selectedImages);
    if (updatedSelectedImages.has(index)) {
      updatedSelectedImages.delete(index);
    } else {
      updatedSelectedImages.add(index);
    }
    setSelectedImages(updatedSelectedImages);
  };
  const handleDeleteSelected = () => {
    const updatedImages = images.filter((_, index) => !selectedImages.has(index));
    setImages(updatedImages);
    setSelectedImages(new Set());
  };
  // checkbox functionality - ends

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setImages([...images, event.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
      {/* navbar starts */}
      {selectedImages.size > 0 && (
        <div className="shadow-sm bg-white">
          <div className="sticky top-0 z-10 container mx-auto text-black font-semibold p-4 flex justify-between items-center">
            <div>Selected Images: {selectedImages.size}</div>
            {selectedImages.size > 0 && (
              <button onClick={handleDeleteSelected} className="p-2 rounded-full bg-red-500 text-white">
                <BsTrash className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
      {/* navbar ends */}

      <div className="grid sm:grid-cols-4 md:grid-cols-6 gap-4 container mx-auto p-4 mt-4" onDragOver={(e) => handleDragOver(e)}>
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative cursor-pointer shadow-lg ${index === 0 && 'col-span-2 row-span-2'}`}
          >
            <input type="checkbox" checked={selectedImages.has(index)} onChange={() => handleCheckboxChange(index)} className="absolute top-2 left-2" />
            <img src={image} alt={`Image ${index}`} className={`w-full object-cover ${index === 0 ? 'h-[336px]' : 'h-40'}`} />
          </div>
        ))}
        <div className="flex items-center justify-center bg-white shadow-lg rounded-md h-40">
          <label htmlFor="fileInput" className="cursor-pointer font-semibold text-gray-400"><RiImageAddLine className="h-20 w-20" />Add Image</label>
          <input id="fileInput" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
        </div>
      </div>

    </div>
  );
};

export default ImageGallery;