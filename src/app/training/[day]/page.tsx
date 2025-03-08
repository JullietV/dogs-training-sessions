import { Suspense } from 'react';
import { TrainingSession } from '../../../components/TrainingSession';
import { relaxationProtocol } from '../../../data/relaxationProtocol';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    day: string;
  }>;
  searchParams: Promise<{
    dogId: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { day } = await params;
  const { dogId } = await searchParams;

  const dayNumber = day.split('-')[1];
  const dayKey = `day${dayNumber}`;
  const dayData = relaxationProtocol[dayKey];

  if (!dayData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Error
          </h2>
          <p className="text-gray-600 mb-6">
            No se encontraron tareas para el día {day}.
          </p>
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <TrainingSession
        day={day}
        dogId={dogId}
        dayData={dayData}
      />
    </Suspense>
  );
} 