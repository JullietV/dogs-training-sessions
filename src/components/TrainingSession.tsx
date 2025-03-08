'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CircularProgress from '../components/CircularProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Dog, TaskSession } from '../types/types';
import { sessionStorage } from '../services/sessionStorage';

interface TrainingSessionProps {
  day: string;
  dogId: string;
  dayData: any; // Ajusta este tipo según la estructura de tus datos
}

type SessionState = 'preparation' | 'task' | 'evaluation' | 'completed';

const PREPARATION_TIME = 5;
const EVALUATION_TIME = 30;

export function TrainingSession({ day, dogId, dayData }: TrainingSessionProps) {
  const router = useRouter();
  const [dogs] = useLocalStorage<Dog[]>('dogs', []);
  const [dog, setDog] = useState<Dog | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionState, setSessionState] = useState<SessionState>('preparation');
  const [timeRemaining, setTimeRemaining] = useState(PREPARATION_TIME);
  const [totalTime, setTotalTime] = useState(PREPARATION_TIME);
  const [result, setResult] = useState<'bien' | 'regular' | 'mal' | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const tasks = dayData.tasks;
  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    const foundDog = dogs.find(d => d.id === dogId);
    if (!foundDog) {
      router.push('/');
    } else {
      setDog(foundDog);
    }
  }, [dogId, dogs, router]);

  useEffect(() => {
    let newTotalTime: number;
    
    switch (sessionState) {
      case 'preparation':
        newTotalTime = PREPARATION_TIME;
        break;
      case 'task':
        newTotalTime = currentTask.duration;
        break;
      case 'evaluation':
        newTotalTime = EVALUATION_TIME;
        break;
      default:
        return;
    }

    setTotalTime(newTotalTime);
    setTimeRemaining(newTotalTime);
    setResult(null);
  }, [sessionState, currentTask?.duration]);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, sessionState, timeRemaining]);

  const handleTimerComplete = () => {
    switch (sessionState) {
      case 'preparation':
        setSessionState('task');
        break;
      case 'task':
        const taskId = `day${day}-${currentTaskIndex + 1}`;
        const session: TaskSession = {
          id: Date.now().toString(),
          dogId: dogId,
          taskId: taskId,
          taskName: currentTask.name,
          taskDescription: currentTask.description || '',
          result: null,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };
        
        try {
          sessionStorage.saveSession(session);
          console.log('Sesión guardada automáticamente:', session);
        } catch (error) {
          console.error('Error al guardar la sesión:', error);
        }
        
        setSessionState('evaluation');
        break;
      case 'evaluation':
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
          setSessionState('preparation');
        } else {
          setSessionState('completed');
        }
        break;
    }
  };

  const handleResult = (selectedResult: 'bien' | 'regular' | 'mal') => {
    if (result !== null) return;
    
    setResult(selectedResult);
    const taskId = `day${day}-${currentTaskIndex + 1}`;
    const session: TaskSession = {
      id: Date.now().toString(),
      dogId: dogId,
      taskId: taskId,
      taskName: currentTask.name,
      taskDescription: currentTask.description || '',
      result: selectedResult,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    console.log('Sesión a guardar:', session);
    try {
      sessionStorage.saveSession(session);
      console.log('Sesión guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar la sesión:', error);
    }
  };

  const handleCancelSession = () => {
    const confirmCancel = window.confirm('¿Estás seguro que deseas cancelar la sesión? Las tareas completadas se guardarán en el historial.');
    
    if (confirmCancel) {
      if (sessionState === 'task' || sessionState === 'evaluation') {
        const session: TaskSession = {
          id: Date.now().toString(),
          dogId: dogId,
          taskId: currentTask.id,
          taskName: currentTask.name,
          taskDescription: currentTask.description,
          result: result || 'mal',
          timestamp: new Date().toISOString(),
          status: 'cancelled'
        };
        
        sessionStorage.saveSession(session);
      }
      
      router.push('/');
    }
  };

  const getProgressValue = () => {
    return 1 - (timeRemaining / totalTime);
  };

  const getStateLabel = () => {
    switch (sessionState) {
      case 'preparation':
        return 'Preparación para la siguiente tarea';
      case 'task':
        return 'Tarea en curso';
      case 'evaluation':
        return 'Evaluación';
      case 'completed':
        return 'Sesión completada';
      default:
        return '';
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(prev => !prev);
  };

  const progressColor = () => {
    switch (sessionState) {
      case 'preparation':
        return 'text-gray-500';
      case 'task':
        return 'text-blue-500';
      case 'evaluation':
        return 'text-green-500';
    }
  };

  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : 'Tarea desconocida';
  };

  if (!dog) return null;

  if (sessionState === 'completed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¡Sesión completada!
          </h2>
          <p className="text-gray-600 mb-6">
            Has completado todas las tareas del día {day} con {dog.name}.
          </p>
          <a
            href="/"
            className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
          {dayData.name}
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Tarea {currentTaskIndex + 1} de {tasks.length}
            </div>
            <div className="flex items-center gap-4">
              
              <button
                onClick={handlePauseToggle}
                className={`text-blue-600 hover:text-blue-800 transition-colors ${
                  isPaused ? 'text-green-600 hover:text-green-800' : ''
                }`}
                title={isPaused ? 'Reanudar sesión' : 'Pausar sesión'}
              >
                {isPaused ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 9v6m4-6v6"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={handleCancelSession}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Cancelar sesión"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col items-center justify-center mb-6">
              <CircularProgress
                progress={getProgressValue()}
                size={100}
                strokeWidth={8}
                color={progressColor()}
              >
                <div className="text-xl font-semibold">
                  {timeRemaining}s
                </div>
              </CircularProgress>
              <div className="mt-2 text-sm text-gray-500">
                {getStateLabel()}
                {isPaused && ' (Pausado)'}
              </div>
            </div>

            {sessionState === 'preparation' && (
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Preparación para la siguiente tarea
                </h3>
                <p className="text-gray-600">
                  {currentTask.name}
                </p>
              </div>
            )}

            {sessionState === 'task' && (
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentTask.name}
                </h3>
                <p className="text-gray-600 text-xs">
                  {currentTask.description}
                </p>
              </div>
            )}

            {sessionState === 'evaluation' && (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                    ¿Cómo lo hizo {dog?.name}?
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleResult('mal')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    disabled={result !== null}
                  >
                    Mal
                  </button>
                  <button
                    onClick={() => handleResult('regular')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                    disabled={result !== null}
                  >
                    Puede mejorar
                  </button>
                  
                  <button
                    onClick={() => handleResult('bien')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    disabled={result !== null}
                  >
                    Excelente
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-4">
            <button
              onClick={handlePauseToggle}
              className={`flex-1 px-4 py-2 border rounded transition-colors ${
                isPaused 
                  ? 'border-green-600 text-green-600 hover:bg-green-50'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isPaused ? 'Reanudar sesión' : 'Pausar sesión'}
            </button>
            <button
              onClick={handleCancelSession}
              className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
            >
              Abandonar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 