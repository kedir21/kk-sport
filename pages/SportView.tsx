import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { APIMatch } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Loader2, Trophy, Layers } from 'lucide-react';

export const SportView: React.FC = () => {
  const { sportId } = useParams<{ sportId: string }>();
  const [matches, setMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!sportId) return;
      setLoading(true);
      try {
        const data = await api.getMatchesBySport(sportId);
        setMatches(data);
      } catch (error) {
        console.error("Failed to load sport matches", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sportId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
           <Trophy className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-3xl font-bold text-white capitalize tracking-tight">{sportId?.replace('-', ' ')}</h2>
      </div>
      
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-surfaceHighlight/30 rounded-2xl p-16 text-center border border-white/5 flex flex-col items-center">
          <Layers className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
          <p className="text-gray-400">There are no upcoming matches for this category right now.</p>
        </div>
      )}
    </div>
  );
};