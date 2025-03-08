import { useState, useEffect } from 'react';
import { DayCard } from '../components/DayCard';
import { Tabs } from '../components/Tabs';
import { SessionHistory } from '../components/SessionHistory';
import { relaxationProtocol } from '../data/relaxationProtocol';
import { sessionStorage } from '../services/sessionStorage';
import { TaskSession, Task, Dog } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Home() {
  const [activeTab, setActiveTab] = useState<'training' | 'history'>('training');
  const [sessions, setSessions] = useState<TaskSession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dogs, setDogs] = useLocalStorage<Dog[]>('dogs', []);

  useEffect(() => {
    if (activeTab === 'history') {
      const savedSessions = sessionStorage.getSessions();
      setSessions(savedSessions);
    }
  }, [activeTab]);

  useEffect(() => {
    // Solo necesitamos obtener las tareas del protocolo
    setTasks(Object.values(relaxationProtocol).flatMap(day => day.tasks));
  }, []);

  const handleDeleteSession = (sessionDate: Date, dogId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta sesión?');
    if (confirmed) {
      const updatedSessions = sessions.filter(session => {
        const sessionDateTime = new Date(session.timestamp);
        return !(sessionDateTime.toDateString() === sessionDate.toDateString() && 
                session.dogId === dogId);
      });
      setSessions(updatedSessions);
      // Actualizar en localStorage
      localStorage.setItem('training-sessions', JSON.stringify(updatedSessions));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Protocolo de Relajación
      </h1>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        {/* Training Tab */}
        <div className={`${activeTab === 'training' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(relaxationProtocol).map((day) => (
              <DayCard key={day.id} day={day} />
            ))}
          </div>
        </div>

        {/* History Tab */}
        <div className={`${activeTab === 'history' ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sesiones completadas
            </h3>
            <SessionHistory 
              sessions={sessions} 
              tasks={tasks} 
              dogs={dogs} 
              onDeleteSession={handleDeleteSession} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 