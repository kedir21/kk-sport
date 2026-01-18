import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { APIMatch } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Loader2, Zap, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<APIMatch[]>([]);
  const [popularMatches, setPopularMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [live, popular] = await Promise.all([
          api.getLiveMatches(),
          api.getPopularMatches()
        ]);
        setLiveMatches(live);
        setPopularMatches(popular);
      } catch (error: any) {
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
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-surfaceHighlight/50 rounded-2xl border border-red-500/20 mx-4">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Connection Issue</h2>
            <p className="text-gray-400 mb-6 max-w-md">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-surface hover:bg-white/10 rounded-full text-sm font-medium transition-colors">
              Retry Connection
            </button>
        </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900/40 via-purple-900/20 to-black border border-white/5 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Trophy className="w-3 h-3" />
            Premium Sports
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            The Ultimate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Streaming Experience</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Watch live football, basketball, and fighting events in HD. No interruptions, just pure action.
          </p>
          <div className="flex gap-4">
            <Link to="/schedule" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors transform hover:-translate-y-0.5">
              View Schedule
            </Link>
            <button className="px-8 py-3 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
              Popular Now
            </button>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      </section>

      {/* Live Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Zap className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Live Now</h2>
          </div>
          <Link to="/schedule" className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">
            View All
          </Link>
        </div>
        
        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} isLive={true} />
            ))}
          </div>
        ) : (
          <div className="bg-surfaceHighlight/30 rounded-2xl p-12 text-center border border-dashed border-white/10">
            <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
              <Zap className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No live matches</h3>
            <p className="text-gray-400 text-sm">Everything is quiet for now. Check out the schedule.</p>
          </div>
        )}
      </section>

      {/* Popular Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Trending Matches</h2>
        </div>
        
        {popularMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="bg-surfaceHighlight/30 rounded-2xl p-8 text-center border border-white/5">
            <p className="text-gray-400">No popular matches found.</p>
          </div>
        )}
      </section>
    </div>
  );
};