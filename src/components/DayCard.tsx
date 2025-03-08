'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Task, Dog } from '../types/types';
import { Modal } from './Modal';
import { DogSelector } from './DogSelector';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DayCardProps {
  day: string;
  tasks: Task[];
}

export function DayCard({ day, tasks }: DayCardProps) {
  const router = useRouter();
  const [isSelectingDog, setIsSelectingDog] = useState(false);
  const [dogs, setDogs] = useLocalStorage<Dog[]>('dogs', []);

  const handleStartSession = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación del Link
    setIsSelectingDog(true);
  };

  const handleSelectDog = (dogId: string) => {
    setIsSelectingDog(false);
    // Navegar a la página de la sesión con el perro seleccionado
    router.push(`/training/${day}?dogId=${dogId}`);
  };

  const handleAddDog = (dogData: Omit<Dog, 'id'>) => {
    const newDog: Dog = {
      id: Date.now().toString(),
      ...dogData
    };
    setDogs([...dogs, newDog]);
    // Navegar a la página de la sesión con el nuevo perro
    router.push(`/training/${day}?dogId=${newDog.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Día {day}</h3>
          <p className="text-gray-600 mb-4">
            {tasks.length} ejercicios
          </p>
          <Link
            href={`/training/${day}`}
            onClick={handleStartSession}
            className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>

      <Modal
        isOpen={isSelectingDog}
        onClose={() => setIsSelectingDog(false)}
      >
        <DogSelector
          dogs={dogs}
          onSelectDog={handleSelectDog}
          onAddDog={handleAddDog}
          onClose={() => setIsSelectingDog(false)}
        />
      </Modal>
    </>
  );
} 