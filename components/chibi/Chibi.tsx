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
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-4 w-full max-w-[400px] mx-auto">
        <div 
          className="relative w-48 h-48 mx-auto cursor-pointer transform transition-transform hover:scale-105"
          onClick={onSelect}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-vt323 text-3xl text-[#33ff33]">{name}</h3>
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-4">
            <span className="font-vt323 text-xl text-[#33ff33] min-w-[120px] text-left">Happiness:</span>
            <div className="flex-1 h-6 bg-[#1a1a1a] rounded-sm overflow-hidden border border-[#33ff33]/30">
              <div
                className="h-full bg-[#33ff33] transition-all duration-300"
                style={{ width: `${happiness}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-vt323 text-xl text-[#33ff33] min-w-[120px] text-left">Energy:</span>
            <div className="flex-1 h-6 bg-[#1a1a1a] rounded-sm overflow-hidden border border-[#33ff33]/30">
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