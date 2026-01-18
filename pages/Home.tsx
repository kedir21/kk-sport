import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { APIMatch } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Loader2, Zap, Flame, AlertCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<APIMatch[]>([]);
  const [popularMatches, setPopularMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Dashboard: Starting data fetch...");
        const [live, popular] = await Promise.all([
          api.getLiveMatches(),
          api.getPopularMatches()
        ]);
        console.log("Dashboard: Fetched live matches:", live);
        console.log("Dashboard: Fetched popular matches:", popular);
        setLiveMatches(live);
        setPopularMatches(popular);
      } catch (error: any) {
        console.error("Failed to load dashboard data", error);
        setError(error.message || "Failed to connect to the server");
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

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4 bg-brand-800 rounded-lg border border-red-900/50">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Check the console for more details.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-red-500 fill-red-500" />
          <h2 className="text-xl font-bold text-white">Live Now</h2>
        </div>
        
        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} isLive={true} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-800 rounded-lg p-8 text-center border border-brand-700 border-dashed">
            <p className="text-gray-400">No live matches currently. Check the schedule!</p>
          </div>
        )}
      </section>

      {/* Popular Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <h2 className="text-xl font-bold text-white">Popular Matches</h2>
        </div>
        
        {popularMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-800 rounded-lg p-8 text-center border border-brand-700">
            <p className="text-gray-400">No popular matches found.</p>
          </div>
        )}
      </section>
    </div>
  );
};