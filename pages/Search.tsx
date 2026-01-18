import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { APIMatch } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Loader2, Search as SearchIcon, AlertCircle } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [matches, setMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        // Fetch all matches and filter client-side
        // Note: Ideally the API would support server-side search
        const allMatches = await api.getAllMatches();
        
        const lowerQuery = query.toLowerCase();
        const filtered = allMatches.filter(match => {
          const titleMatch = match.title.toLowerCase().includes(lowerQuery);
          const homeTeamMatch = match.teams?.home?.name.toLowerCase().includes(lowerQuery);
          const awayTeamMatch = match.teams?.away?.name.toLowerCase().includes(lowerQuery);
          const categoryMatch = match.category.toLowerCase().includes(lowerQuery);
          
          return titleMatch || homeTeamMatch || awayTeamMatch || categoryMatch;
        });

        setMatches(filtered);
      } catch (error) {
        console.error("Search failed", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      performSearch();
    } else {
      setMatches([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="animate-fade-in">
      <div className="bg-surfaceHighlight/30 p-8 rounded-3xl border border-white/5 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-500/10 rounded-xl">
             <SearchIcon className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Search Results</h2>
            <p className="text-gray-400 text-sm mt-1">
              Results for "<span className="text-white font-medium">{query}</span>"
            </p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-surfaceHighlight/30 rounded-2xl p-16 text-center border border-dashed border-white/10 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
          <p className="text-gray-400">We couldn't find any matches matching your search.</p>
        </div>
      )}
    </div>
  );
};