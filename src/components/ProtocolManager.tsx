'use client';

import { useState } from 'react';
import { Protocol, Task } from '../types/types';

interface ProtocolManagerProps {
  tasks: Task[];
  protocols: Protocol[];
  onAddProtocol: (protocol: Protocol) => void;
  onSelectProtocol: (protocol: Protocol) => void;
}

export default function ProtocolManager({ 
  tasks, 
  protocols, 
  onAddProtocol, 
  onSelectProtocol 
}: ProtocolManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState(1);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProtocol: Protocol = {
      id: Date.now().toString(),
      name,
      description,
      taskIds: selectedTaskIds,
      day
    };
    onAddProtocol(newProtocol);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setDay(1);
    setSelectedTaskIds([]);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Protocolos de Entrenamiento</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {isCreating ? 'Cancelar' : 'Crear Protocolo'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Día del Protocolo</label>
            <input
              type="number"
              min="1"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Protocolo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Seleccionar Tareas</label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded">
              {tasks.map(task => (
                <label key={task.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTaskIds([...selectedTaskIds, task.id]);
                      } else {
                        setSelectedTaskIds(selectedTaskIds.filter(id => id !== task.id));
                      }
                    }}
                  />
                  <span>{task.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Guardar Protocolo
          </button>
        </form>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {protocols.map(protocol => (
            <div key={protocol.id} className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-lg mb-2">Día {protocol.day}</div>
              <h3 className="font-medium">{protocol.name}</h3>
              {protocol.description && (
                <p className="text-gray-600 text-sm mt-1">{protocol.description}</p>
              )}
              <div className="mt-2">
                <div className="text-sm text-gray-500">Tareas:</div>
                <ul className="list-disc list-inside text-sm">
                  {protocol.taskIds.map(taskId => {
                    const task = tasks.find(t => t.id === taskId);
                    return task ? (
                      <li key={taskId}>{task.name}</li>
                    ) : null;
                  })}
                </ul>
              </div>
              <button
                onClick={() => onSelectProtocol(protocol)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Usar este protocolo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 