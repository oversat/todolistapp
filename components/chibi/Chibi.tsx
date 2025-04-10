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
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <div 
          className="relative w-32 h-32 mx-auto cursor-pointer transform transition-transform hover:scale-105"
          onClick={onSelect}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-vt323 text-2xl">{name}</h3>
        <div className="space-y-3 w-full max-w-sm mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-vt323 min-w-[100px] text-left">Happiness:</span>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-pink rounded-full transition-all duration-300"
                style={{ width: `${happiness}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-vt323 min-w-[100px] text-left">Energy:</span>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-blue rounded-full transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 