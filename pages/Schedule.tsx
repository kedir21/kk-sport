import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { APIMatch } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Loader2, CalendarClock } from 'lucide-react';

export const Schedule: React.FC = () => {
  const [matches, setMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getTodayMatches();
        setMatches(data);
      } catch (error) {
        console.error("Failed to load schedule", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <CalendarClock className="w-6 h-6 text-brand-500" />
        <h2 className="text-2xl font-bold text-white">Today's Schedule</h2>
      </div>
      
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-brand-800 rounded-lg p-12 text-center border border-brand-700">
          <p className="text-gray-400 text-lg">No matches scheduled for the rest of today.</p>
        </div>
      )}
    </section>
  );
};