'use client';

import { relaxationProtocol, RelaxationDay } from '../data/relaxationProtocol';
import DayCard from './DayCard';
interface RelaxationProtocolSelectorProps {
  onSelectDay: (day: RelaxationDay) => void;
}

export default function RelaxationProtocolSelector({ onSelectDay }: RelaxationProtocolSelectorProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Protocolo de Relajación - Dr. Karen Overall</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(relaxationProtocol) as RelaxationDay[]).map((dayKey) => {
          const day = relaxationProtocol[dayKey];
          return (
              <DayCard key={day.id}  day={day}/>  
          );
        })}
      </div>
    </div>
  );
} 