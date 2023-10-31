import React, { useState } from 'react';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const updatedImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          updatedImages.push(event.target.result);
          setImages(updatedImages);
        };
        reader.readAsDataURL(file);
      }
    }
  };

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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  return (
    <div className="container mx-auto p-4">
      {selectedImages.size > 0 && (
        <div className="sticky top-0 bg-gray-200 text-white p-4 flex justify-between items-center">
          <div className='text-black font-semibold'>Selected Images: {selectedImages.size}</div>
          {selectedImages.size > 0 && (
            <button onClick={handleDeleteSelected} className="p-2 rounded-full bg-red-500 text-white">
              <BsTrash className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-5 gap-4 mt-4 relative"
            >
              {images.map((image, index) => (
                <Draggable key={index} draggableId={`image-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative ${index === 0 ? 'row-span-2 col-span-2' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImages.has(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="absolute top-2 left-2"
                      />
                      <img src={image} alt={`Image ${index}`} className="w-full h-auto" />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="flex items-center justify-center bg-gray-200 rounded-md h-72">
                <label htmlFor="fileInput" className="cursor-pointer">
                  <BsPlusCircle className="h-20 w-20 text-gray-400" />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Gallery;