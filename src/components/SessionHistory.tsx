'use client';

import { useState } from 'react';
import { TaskSession, Task, Dog } from '../types/types';
import { DogSummary } from './DogSummary'

interface SessionHistoryProps {
  sessions: TaskSession[];
  tasks: Task[];
  dogs: Dog[];
  onDeleteSession: (date: Date, dogId: string) => void;
}

interface SessionSummary {
  total: number;
  bien: number;
  regular: number;
  mal: number;
}

export function SessionHistory({ sessions, tasks, dogs, onDeleteSession }: SessionHistoryProps) {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  // Función para calcular el resumen de una sesión
  const calculateSessionSummary = (tasks: TaskSession[]): SessionSummary => {
    return tasks.reduce((acc, task) => ({
      total: acc.total + 1,
      bien: acc.bien + (task.result === 'bien' ? 1 : 0),
      regular: acc.regular + (task.result === 'regular' ? 1 : 0),
      mal: acc.mal + (task.result === 'mal' ? 1 : 0),
    }), { total: 0, bien: 0, regular: 0, mal: 0 });
  };

  // Función para calcular el porcentaje de éxito
  const calculateSuccessRate = (summary: SessionSummary): number => {
    return ((summary.bien + (summary.regular * 0.5)) / summary.total) * 100;
  };

  // Función para obtener el color y texto según el porcentaje
  const getSuccessRateDisplay = (rate: number): { color: string; text: string } => {
    if (rate >= 90) return { color: 'text-green-600', text: 'Excelente' };
    if (rate >= 75) return { color: 'text-blue-600', text: 'Muy Bien' };
    if (rate >= 60) return { color: 'text-yellow-600', text: 'Regular' };
    return { color: 'text-red-600', text: 'Necesita Mejorar' };
  };

  // Primero agrupamos por perro
  const sessionsByDog = sessions.reduce((acc, session) => {
    if (!acc[session.dogId]) {
      acc[session.dogId] = [];
    }
    acc[session.dogId].push(session);
    return acc;
  }, {} as Record<string, TaskSession[]>);

  // Luego agrupamos por día del protocolo y fecha
  const groupSessions = (dogSessions: TaskSession[]) => {
    return dogSessions.reduce((acc, session) => {
      // Extraer el día del protocolo del taskId (ejemplo: "day1-1" -> "day1")
      const protocolDay = session.taskId.split('-')[0];
      const dateKey = new Date(session.timestamp).toDateString();
      const sessionKey = `${protocolDay}-${dateKey}-${session.dogId}`;
      
      if (!acc[sessionKey]) {
        acc[sessionKey] = {
          protocolDay,
          date: new Date(session.timestamp),
          tasks: []
        };
      }
      acc[sessionKey].tasks.push(session);
      return acc;
    }, {} as Record<string, { protocolDay: string; date: Date; tasks: TaskSession[] }>);
  };

  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : 'Tarea desconocida';
  };

  const getDogName = (dogId: string) => {
    const dog = dogs.find(d => d.id === dogId);
    return dog ? dog.name : 'Perro desconocido';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSession = (sessionKey: string) => {
    setExpandedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionKey)) {
        next.delete(sessionKey);
      } else {
        next.add(sessionKey);
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {Object.entries(sessionsByDog).map(([dogId, dogSessions]) => {
        const groupedSessions = groupSessions(dogSessions);
        const dog = dogs.find(d => d.id === dogId);
        if (!dog) return null;

        return (
          <div key={dogId} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-lg font-medium text-gray-900">
                {dog.name}
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {Object.entries(groupedSessions)
                .sort(([, a], [, b]) => b.date.getTime() - a.date.getTime())
                .map(([sessionKey, { protocolDay, date, tasks: sessionTasks }]) => {
                  const summary = calculateSessionSummary(sessionTasks);
                  const successRate = calculateSuccessRate(summary);
                  const { color, text } = getSuccessRateDisplay(successRate);
                  const isExpanded = expandedSessions.has(sessionKey);

                  return (
                    <div key={sessionKey} className="p-4">
                      <button
                        onClick={() => toggleSession(sessionKey)}
                        className="w-full"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 text-left">
                              Día {protocolDay.replace('day', '')}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(date)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${color}`}>
                              {text} ({successRate.toFixed(1)}%)
                            </span>
                            <svg
                              className={`w-5 h-5 transform transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <div className="font-medium">{summary.total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded text-center">
                            <div className="font-medium text-green-700">{summary.bien}</div>
                            <div className="text-xs text-green-600">Bien</div>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded text-center">
                            <div className="font-medium text-yellow-700">{summary.regular}</div>
                            <div className="text-xs text-yellow-600">Regular</div>
                          </div>
                          <div className="bg-red-50 p-2 rounded text-center">
                            <div className="font-medium text-red-700">{summary.mal}</div>
                            <div className="text-xs text-red-600">Mal</div>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          {sessionTasks
                            .sort((a, b) => {
                              // Ordenar por el número de tarea dentro del día
                              const taskNumA = parseInt(a.taskId.split('-')[1]);
                              const taskNumB = parseInt(b.taskId.split('-')[1]);
                              return taskNumA - taskNumB;
                            })
                            .map((session) => (
                              <div 
                                key={session.id} 
                                className="flex justify-between items-center bg-gray-50 p-2 rounded"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full
                                    ${session.result === 'bien' ? 'bg-green-500' : 
                                      session.result === 'regular' ? 'bg-yellow-500' : 
                                      'bg-red-500'}`}
                                  />
                                  <span className="text-sm text-gray-700">
                                    {getTaskName(session.taskId)}
                                  </span>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full
                                  ${session.result === 'bien' ? 'bg-green-100 text-green-800' : 
                                    session.result === 'regular' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}`}
                                >
                                  {session.result}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
} 