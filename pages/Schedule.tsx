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
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-surfaceHighlight/30 p-8 rounded-3xl border border-white/5 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-500/10 rounded-xl">
             <CalendarClock className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Today's Schedule</h2>
            <p className="text-gray-400 text-sm mt-1">Don't miss a single game happening today.</p>
          </div>
        </div>
      </div>
      
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-surfaceHighlight/30 rounded-2xl p-16 text-center border border-dashed border-white/10">
          <p className="text-gray-400 text-lg">No matches scheduled for the rest of today.</p>
        </div>
      )}
    </div>
  );
};