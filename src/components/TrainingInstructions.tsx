'use client';

interface TrainingInstructionsProps {
  onClose: () => void;
}

export default function TrainingInstructions({ onClose }: TrainingInstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Cómo funciona el entrenamiento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Fases del entrenamiento</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-medium">1. Preparación (5 segundos)</p>
                <p className="text-sm text-gray-600">Tiempo para que tú y tu perro se preparen para la siguiente tarea. Usa este momento para leer la siguiente instrucción.</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <p className="font-medium">2. Ejecución (tiempo variable)</p>
                <p className="text-sm text-gray-600">Período durante el cual tu perro debe mantener la posición o realizar la tarea indicada. El tiempo varía según la tarea.</p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded">
                <p className="font-medium">3. Evaluación (30 segundos)</p>
                <p className="text-sm text-gray-600">Momento para evaluar el desempeño de tu perro en la tarea anterior. Califica como Bien, Regular o Mal.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Controles disponibles</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <p className="font-medium">⏸️ Pausa global</p>
                <p className="text-sm text-gray-600">Puedes pausar el entrenamiento en cualquier momento. El tiempo se detendrá y podrás reanudarlo cuando estés listo.</p>
              </div>
              
              <div className="p-3 border rounded">
                <p className="font-medium">❌ Cancelar sesión</p>
                <p className="text-sm text-gray-600">Si necesitas terminar el entrenamiento antes de tiempo, puedes cancelar la sesión. El progreso hasta ese momento quedará guardado.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Consejos importantes</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Asegúrate de estar en un ambiente tranquilo y sin distracciones</li>
              <li>Ten premios listos para recompensar a tu perro</li>
              <li>Mantén sesiones cortas y positivas</li>
              <li>El progreso se guarda automáticamente después de cada tarea</li>
              <li>Puedes revisar el historial de sesiones en cualquier momento</li>
            </ul>
          </section>

          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ¡Entendido, comenzar entrenamiento!
          </button>
        </div>
      </div>
    </div>
  );
} 