'use client';

import { useState, useEffect } from 'react';
import { Tabs } from '../components/Tabs';
import { DayCard } from '../components/DayCard';
import { SessionHistory } from '../components/SessionHistory';
import { relaxationProtocol } from '../data/relaxationProtocol';
import { sessionStorage } from '../services/sessionStorage';
import { TaskSession, Dog } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DogManagement from '../components/DogManagement';
import { Modal } from '../components/Modal';
import { DogSelector } from '../components/DogSelector';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'training' | 'history' | 'dogs'>('training');
  const [sessions, setSessions] = useState<TaskSession[]>([]);
  const [isSelectingDog, setIsSelectingDog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [dogs, setDogs] = useLocalStorage<Dog[]>('dogs', []);

  useEffect(() => {
    // Migrar datos antiguos si es necesario
    sessionStorage.migrateOldSessions();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      const savedSessions = sessionStorage.getSessions();
      setSessions(savedSessions);
    }
  }, [activeTab]);

  // Obtener todas las tareas del protocolo para el historial
  const allTasks = Object.values(relaxationProtocol).flatMap(day => day.tasks);

  const handleDeleteSession = (sessionDate: Date, dogId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta sesión?');
    if (confirmed) {
      const updatedSessions = sessions.filter(session => {
        const sessionDateTime = new Date(session.timestamp);
        return !(sessionDateTime.toDateString() === sessionDate.toDateString() && 
                session.dogId === dogId);
      });
      setSessions(updatedSessions);
      sessionStorage.saveSessions(updatedSessions);
    }
  };

  const handleStartTraining = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsSelectingDog(true);
  };

  const handleSelectDog = (dogId: string) => {
    if (selectedTaskId) {
      // Aquí deberíamos manejar el inicio de la sesión
      console.log('Iniciar sesión con:', { taskId: selectedTaskId, dogId });
    }
    setIsSelectingDog(false);
    setSelectedTaskId(null);
  };

  const handleAddDog = (dogData: Omit<Dog, 'id'>) => {
    const newDog: Dog = {
      id: Date.now().toString(),
      ...dogData
    };
    setDogs([...dogs, newDog]);
    if (selectedTaskId) {
      // Iniciar sesión con el nuevo perro
      console.log('Iniciar sesión con nuevo perro:', { taskId: selectedTaskId, dogId: newDog.id });
    }
    setIsSelectingDog(false);
    setSelectedTaskId(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Protocolo de Relajación
      </h1>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        <div className={`${activeTab === 'training' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(relaxationProtocol).map((day) => (
              <DayCard key={day.id} day={day.id} tasks={day.tasks} />
            ))}
          </div>
        </div>

        <div className={`${activeTab === 'history' ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sesiones completadas
            </h3>
            {sessions.length > 0 ? (
              <SessionHistory 
                sessions={sessions} 
                tasks={allTasks} 
                dogs={dogs} 
                onDeleteSession={handleDeleteSession} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay sesiones completadas aún.
                <p className="mt-2 text-sm text-gray-400">
                  Las sesiones completadas aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`${activeTab === 'dogs' ? 'block' : 'hidden'}`}>
          <DogManagement dogs={dogs} setDogs={setDogs} />
        </div>
      </div>

      <Modal
        isOpen={isSelectingDog}
        onClose={() => {
          setIsSelectingDog(false);
          setSelectedTaskId(null);
        }}
      >
        <DogSelector
          dogs={dogs}
          onSelectDog={handleSelectDog}
          onAddDog={handleAddDog}
          onClose={() => {
            setIsSelectingDog(false);
            setSelectedTaskId(null);
          }}
        />
      </Modal>
    </main>
  );
} 