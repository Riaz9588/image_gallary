import React, { useState } from 'react';
import { RiImageAddLine } from 'react-icons/ri';
import { BiSolidSelectMultiple } from 'react-icons/bi';
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
    <>
      {/* navbar starts */}

      <div className="shadow-sm bg-white">
        {selectedImages.size > 0 ?
          <div className="container mx-auto font-semibold p-4 flex justify-between items-center">
            <div className="shadow p-2 rounded-md bg-white text-blue-500 font-bold flex items-center uppercase"><BiSolidSelectMultiple className='mt-1 mr-1' />Selected Images:<span className="font-black ml-1">{selectedImages.size}</span></div>
            <button onClick={handleDeleteSelected} className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"><BsTrash className="h-6 w-6" /></button>
          </div>
          :
          <div className="container mx-auto text-blue-500 font-semibold p-4">
            <span className="font-black ml-1 text-3xl">Image Gallery</span>
          </div>
        }
      </div>

      {/* navbar ends */}

      <div className="grid sm:grid-cols-4 md:grid-cols-6 gap-4 container mx-auto p-4 mt-4" onDragOver={(e) => handleDragOver(e)}>
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`group relative cursor-pointer shadow-lg rounded-md transition hover:scale-105 ${index === 0 && 'col-span-2 row-span-2'}`}
          >
            <input type="checkbox" checked={selectedImages.has(index)} onChange={() => handleCheckboxChange(index)} className="absolute top-2 left-2 z-10" />
            <img src={image} alt={`Image ${index}`} className={`w-full object-contain rounded-md ${index === 0 ? 'aspect-w-2 aspect-h-2' : 'aspect-w-1 aspect-h-1'}`} />
            <div className="absolute inset-0 bg-black rounded-md bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        ))}
        <div className="flex items-center justify-center bg-white shadow-lg rounded-md cursor-pointer transition hover:scale-105" style={{ aspectRatio: '1/1' }}>
          <label htmlFor="fileInput" className="cursor-pointer font-semibold text-gray-400"><RiImageAddLine className="h-20 w-20" />Add Images</label>
          <input id="fileInput" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
        </div>
      </div>
    </>
  );
};

export default ImageGallery;