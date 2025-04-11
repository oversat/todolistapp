import React, { useState } from 'react';
import Image from 'next/image';
import { Skull } from 'lucide-react';
import { DeleteChibiDialog } from './DeleteChibiDialog';

interface ChibiProps {
  id?: string;
  name: string;
  image: string;
  happiness: number;
  energy: number;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function Chibi({ id, name, image, happiness, energy, onSelect, onDelete }: ChibiProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  console.log('Chibi component rendered with props:', { id, name, onDelete });

  const handleDeleteClick = (e: React.MouseEvent) => {
    console.log('Delete button clicked');
    e.stopPropagation();
    if (onDelete) {
      console.log('onDelete handler exists, showing dialog');
      setShowDeleteDialog(true);
    } else {
      console.log('No onDelete handler provided');
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageError(true);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-center w-full bg-[#d4d0c8] bg-opacity-90 rounded-lg p-6 shadow-md relative">
        <Skull 
          className="absolute top-2 right-2 h-6 w-6 text-red-500 cursor-pointer hover:text-red-700 z-10" 
          onClick={handleDeleteClick}
        />
        <div 
          className="relative w-48 h-48 mx-auto cursor-pointer transform transition-transform hover:scale-105 mb-4"
          onClick={onSelect}
        >
          {!imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
        </div>
        <h3 className="font-vt323 text-4xl text-black mb-4">{name}</h3>
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-vt323 text-2xl text-black min-w-[140px] text-left">
              <span>Love:</span>
            </div>
            <div className="flex-1 h-6 bg-[#1a1a1a] rounded-sm overflow-hidden border border-black">
              <div
                className="h-full bg-[#33ff33] transition-all duration-300"
                style={{ width: `${happiness}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-vt323 text-2xl text-black min-w-[140px] text-left">Energy:</span>
            <div className="flex-1 h-6 bg-[#1a1a1a] rounded-sm overflow-hidden border border-black">
              <div
                className="h-full bg-[#33ff33] transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <DeleteChibiDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          console.log('Delete dialog closed');
          setShowDeleteDialog(false);
        }}
        onConfirm={() => {
          console.log('Delete confirmed in Chibi component');
          if (onDelete) {
            console.log('Calling onDelete handler');
            onDelete();
          }
          setShowDeleteDialog(false);
        }}
        chibiName={name}
      />
    </div>
  );
} 