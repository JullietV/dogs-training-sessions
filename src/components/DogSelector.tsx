'use client';

import { useState } from 'react';
import { Dog } from '../types/types';
import { DogForm } from './DogForm';

interface DogSelectorProps {
  dogs: Dog[];
  onSelectDog: (dogId: string) => void;
  onAddDog: (dog: Omit<Dog, 'id'>) => void;
  onClose: () => void;
}

export function DogSelector({ dogs, onSelectDog, onAddDog, onClose }: DogSelectorProps) {
  const [isAddingDog, setIsAddingDog] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {dogs.length > 0 ? 'Selecciona tu perro' : 'Añade tu primer perro'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isAddingDog ? (
        <DogForm
          onSubmit={(dogData) => {
            onAddDog(dogData);
            setIsAddingDog(false);
          }}
          onCancel={() => setIsAddingDog(false)}
        />
      ) : (
        <>
          {dogs.length > 0 && (
            <div className="grid gap-3 mb-6">
              {dogs.map(dog => (
                <button
                  key={dog.id}
                  onClick={() => onSelectDog(dog.id)}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {dog.imageUrl ? (
                    <img
                      src={dog.imageUrl}
                      alt={dog.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{dog.name}</div>
                    <div className="text-sm text-gray-500">{dog.breed}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsAddingDog(true)}
            className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-gray-600">Agregar nuevo perro</span>
          </button>
        </>
      )}
    </div>
  );
} 