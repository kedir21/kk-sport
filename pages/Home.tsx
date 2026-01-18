import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { APIMatch } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Loader2, Zap, Trophy, TrendingUp, AlertCircle, Target, Flame, Dumbbell, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper to map category names to icons
const getCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('football') || normalized.includes('soccer')) return <Trophy className="w-5 h-5 text-red-500" />;
  if (normalized.includes('basketball')) return <Target className="w-5 h-5 text-orange-500" />;
  if (normalized.includes('fighting') || normalized.includes('mma') || normalized.includes('boxing')) return <Dumbbell className="w-5 h-5 text-purple-500" />;
  if (normalized.includes('racing') || normalized.includes('f1')) return <Flame className="w-5 h-5 text-yellow-500" />;
  return <Activity className="w-5 h-5 text-primary-500" />;
};

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

  // Group all live matches by their category dynamically
  const groupedLiveMatches = useMemo((): Record<string, APIMatch[]> => {
    const groups: Record<string, APIMatch[]> = {};
    
    liveMatches.forEach(match => {
        // Capitalize the first letter for display
        const categoryName = match.category 
            ? match.category.charAt(0).toUpperCase() + match.category.slice(1) 
            : 'Other';

        if (!groups[categoryName]) {
            groups[categoryName] = [];
        }
        groups[categoryName].push(match);
    });

    return groups;
  }, [liveMatches]);

  const groupedLiveMatchesList = useMemo(() => Object.entries(groupedLiveMatches) as [string, APIMatch[]][], [groupedLiveMatches]);

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
    <div className="space-y-16 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900/40 via-purple-900/20 to-black border border-white/5 p-8 md:p-12 lg:p-16">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Trophy className="w-3 h-3" />
            Premium Sports
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
            The Ultimate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Streaming Experience</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
            Watch live football, basketball, and fighting events in HD. No interruptions, just pure action.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/schedule" className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors transform hover:-translate-y-0.5 shadow-lg shadow-white/10">
              View Schedule
            </Link>
            <button className="px-8 py-3.5 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
              Popular Now
            </button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Live Section - Categorized */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
           <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-red-500 blur opacity-25 animate-pulse"></div>
                <div className="relative p-2 rounded-lg bg-surface border border-white/10">
                  <Zap className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Live Now</h2>
           </div>
           <Link to="/schedule" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full hover:bg-white/10">
              Full Schedule
           </Link>
        </div>
        
        {groupedLiveMatchesList.length > 0 ? (
          <div className="space-y-12">
            {groupedLiveMatchesList.map(([category, matches]) => (
              <div key={category} className="animate-fade-in">
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-6 ml-1">
                  {getCategoryIcon(category)}
                  <h3 className="text-xl font-bold text-gray-200">{category}</h3>
                  <span className="text-xs font-semibold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {matches.length} Live
                  </span>
                </div>

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                  {matches.map(match => (
                    <MatchCard key={match.id} match={match} isLive={true} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surfaceHighlight/30 rounded-3xl p-16 text-center border border-dashed border-white/10">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
              <Zap className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No live matches</h3>
            <p className="text-gray-400">Everything is quiet for now. Check out the schedule or trending matches.</p>
          </div>
        )}
      </section>

      {/* Popular Section */}
      <section className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Trending & Upcoming</h2>
        </div>
        
        {popularMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
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