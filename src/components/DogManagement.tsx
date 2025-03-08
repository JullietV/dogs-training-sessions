'use client';

import { useState, useEffect } from 'react';
import { Dog, TaskSession } from '../types/types';
import { DogSummary } from './DogSummary';
import { DogForm } from './DogForm';
import { sessionStorage } from '../services/sessionStorage';
import Image from 'next/image';

interface DogManagementProps {
  dogs: Dog[];
  setDogs: (dogs: Dog[]) => void;
}

export default function DogManagement({ dogs, setDogs }: DogManagementProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [newDogName, setNewDogName] = useState('');
  const [displayedDogs, setDisplayedDogs] = useState<Dog[]>([]);
  const sessions = sessionStorage.getSessions();

  useEffect(() => {
    setDisplayedDogs(dogs);
    setIsLoading(false);
  }, [dogs]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const handleAddDog = (dogData: Omit<Dog, 'id'>) => {
    const newDog: Dog = {
      id: Date.now().toString(),
      ...dogData
    };
    setDogs([...dogs, newDog]);
    setIsAddingDog(false);
  };

  const handleEditDog = (dogId: string) => {
    setEditingDogId(dogId);
    const dog = dogs.find(d => d.id === dogId);
    if (dog) {
      setNewDogName(dog.name);
    }
  };

  const handleSaveDog = (dogId: string) => {
    const updatedDogs = dogs.map(dog =>
      dog.id === dogId ? { ...dog, name: newDogName } : dog
    );
    setDogs(updatedDogs);
    setEditingDogId(null);
    setNewDogName('');
  };

  const handleDeleteDog = (dogId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este perro? Se eliminarán todas sus sesiones de entrenamiento.')) {
      setDogs(dogs.filter(dog => dog.id !== dogId));
      const updatedSessions = sessions.filter(session => session.dogId !== dogId);
      sessionStorage.saveSessions(updatedSessions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Mis Perros</h2>
        {!isAddingDog && (
          <button
            onClick={() => setIsAddingDog(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agregar Perro
          </button>
        )}
      </div>

      {isAddingDog && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar nuevo perro</h3>
          <DogForm
            onSubmit={handleAddDog}
            onCancel={() => setIsAddingDog(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedDogs.map(dog => {
          const dogSessions = sessions.filter(session => session.dogId === dog.id);
          const isEditing = editingDogId === dog.id;
          
          if (isEditing) {
            return (
              <div key={dog.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Editar perro</h3>
                <DogForm
                  dog={dog}
                  onSubmit={(dogData) => handleSaveDog(dog.id)}
                  onCancel={() => setEditingDogId(null)}
                />
              </div>
            );
          }

          return (
            <div key={dog.id} className="relative">
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button
                  onClick={() => handleEditDog(dog.id)}
                  className="text-gray-400 hover:text-blue-500"
                  title="Editar perro"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteDog(dog.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Eliminar perro"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {dog.imageUrl && (
                      <Image
                        src={dog.imageUrl}
                        alt={dog.name}
                        className="w-16 h-16 rounded-full object-cover"
                        width={64}
                        height={64}
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{dog.name}</h3>
                      <p className="text-sm text-gray-500">{dog.breed} • {dog.age} años</p>
                    </div>
                  </div>
                  {dog.description && (
                    <p className="text-sm text-gray-600 mb-4">{dog.description}</p>
                  )}
                  <DogSummary dog={dog} sessions={dogSessions} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 