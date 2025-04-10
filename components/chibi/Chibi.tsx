import React from 'react';
import Image from 'next/image';

interface ChibiProps {
  name: string;
  image: string;
  happiness: number;
  energy: number;
  onSelect?: () => void;
}

export function Chibi({ name, image, happiness, energy, onSelect }: ChibiProps) {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-center w-full bg-[#d4d0c8] bg-opacity-90 rounded-lg p-6 shadow-md">
        <div 
          className="relative w-48 h-48 mx-auto cursor-pointer transform transition-transform hover:scale-105 mb-4"
          onClick={onSelect}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-vt323 text-4xl text-black mb-4">{name}</h3>
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-4">
            <span className="font-vt323 text-2xl text-black min-w-[140px] text-left">Happiness:</span>
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
    </div>
  );
} 