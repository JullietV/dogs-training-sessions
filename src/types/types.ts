export interface Task {
  id: string;
  name: string;
  duration: number; // en segundos
  description?: string;
}

export type TaskResult = 'bien' | 'regular' | 'mal';

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl?: string;
}

export interface TaskSession {
  id: string;
  dogId: string;
  taskId: string;
  taskName: string;
  taskDescription: string;
  result: 'bien' | 'regular' | 'mal' | null;
  timestamp: string;
  status: 'completed' | 'cancelled';
}

export interface Protocol {
  id: string;
  name: string;
  description?: string;
  taskIds: string[]; // Referencias a las tareas que componen este protocolo
  day: number; // Día del protocolo (1, 2, 3, etc.)
} 

export interface Day {
  id: string;
  name: string;
  description?: string;
  day: number;
  tasks: Task[];
  requirements: {
    space: string;
    items: string[];
    sound: boolean;
    movement: boolean;
    door: boolean;
    time: number;
  };
}