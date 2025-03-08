'use client';

interface TabProps {
  activeTab: 'training' | 'history' | 'dogs';
  setActiveTab: (tab: 'training' | 'history' | 'dogs') => void;
}

export function Tabs({ activeTab, setActiveTab }: TabProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab('training')}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'training'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Entrenamiento
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'history'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Historial
        </button>
        <button
          onClick={() => setActiveTab('dogs')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'dogs'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Perros
        </button>
      </nav>
    </div>
  );
} 