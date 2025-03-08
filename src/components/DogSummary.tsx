'use client';

import { TaskSession, Dog } from '../types/types';

interface DogSummaryProps {
  dog: Dog;
  sessions: TaskSession[];
}

interface SessionAnalysis {
  protocolDay: string;
  date: Date;
  successRate: number;
}

export function DogSummary({ dog, sessions }: DogSummaryProps) {
  // Agrupar sesiones por día del protocolo y fecha
  const groupedSessions = sessions.reduce((acc, session) => {
    const protocolDay = session.taskId.split('-')[0];
    const dateKey = new Date(session.timestamp).toDateString();
    const sessionKey = `${protocolDay}-${dateKey}`;
    
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

  // Analizar cada sesión
  const sessionAnalyses: SessionAnalysis[] = Object.values(groupedSessions).map(({ protocolDay, date, tasks }) => {
    const total = tasks.length;
    const bien = tasks.filter(t => t.result === 'bien').length;
    const regular = tasks.filter(t => t.result === 'regular').length;
    const successRate = ((bien + (regular * 0.5)) / total) * 100;

    return {
      protocolDay,
      date,
      successRate
    };
  });

  // Calcular estadísticas
  const totalSessions = sessionAnalyses.length;
  const highestDay = sessionAnalyses.reduce((max, session) => {
    const dayNum = parseInt(session.protocolDay.replace('day', ''));
    return Math.max(max, dayNum);
  }, 0);
  
  const bestSession = sessionAnalyses.reduce((best, current) => 
    current.successRate > (best?.successRate || 0) ? current : best
  , sessionAnalyses[0]);

  const worstSession = sessionAnalyses.reduce((worst, current) => 
    current.successRate < (worst?.successRate || 100) ? current : worst
  , sessionAnalyses[0]);

  const averageScore = sessionAnalyses.reduce((sum, session) => 
    sum + session.successRate, 0) / totalSessions;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{dog.name}</h3>          
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {averageScore.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">promedio general</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{totalSessions}</div>
          <div className="text-sm text-gray-600">sesiones completadas</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">Día {highestDay}</div>
          <div className="text-sm text-gray-600">nivel más alto alcanzado</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Mejor sesión</h4>
          {bestSession && (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-green-700">
                {bestSession.successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">
                Día {bestSession.protocolDay.replace('day', '')} - {formatDate(bestSession.date)}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Sesión con más dificultad</h4>
          {worstSession && (
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-red-700">
                {worstSession.successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-red-600">
                Día {worstSession.protocolDay.replace('day', '')} - {formatDate(worstSession.date)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 