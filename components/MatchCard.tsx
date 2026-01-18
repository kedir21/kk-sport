import React from 'react';
import { Play, Calendar, Star } from 'lucide-react';
import { APIMatch } from '../types';
import { formatMatchTime, getImageUrl } from '../utils/formatters';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: APIMatch;
  isLive?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, isLive = false }) => {
  const { id, title, date, teams, popular, category } = match;

  // Determine display logic based on if teams object exists or if we rely on title
  const hasTeamData = teams && teams.home && teams.away;
  
  return (
    <Link 
      to={`/match/${id}`}
      className="group block bg-brand-800 rounded-lg overflow-hidden border border-brand-700 hover:border-brand-500 transition-all duration-200 shadow-lg hover:shadow-brand-500/10"
    >
      <div className="p-4">
        {/* Header: League/Category & Status */}
        <div className="flex justify-between items-center mb-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
          <div className="flex items-center gap-2">
             <span className="bg-brand-900 px-2 py-1 rounded text-gray-300">{category}</span>
             {popular && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
          </div>
          
          <div className="flex items-center gap-1">
            {isLive ? (
              <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatMatchTime(date)}
              </span>
            )}
          </div>
        </div>

        {/* Teams Display */}
        {hasTeamData ? (
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-brand-900 p-2 flex items-center justify-center border border-brand-700 group-hover:border-brand-500 transition-colors">
                 <img 
                    src={getImageUrl(teams?.home?.badge)} 
                    alt={teams?.home?.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                 />
              </div>
              <span className="text-sm font-medium text-gray-200 line-clamp-2 min-h-[2.5em]">{teams?.home?.name}</span>
            </div>

            {/* VS Badge */}
            <div className="text-gray-500 font-bold text-lg italic">VS</div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-brand-900 p-2 flex items-center justify-center border border-brand-700 group-hover:border-brand-500 transition-colors">
                <img 
                    src={getImageUrl(teams?.away?.badge)} 
                    alt={teams?.away?.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                 />
              </div>
              <span className="text-sm font-medium text-gray-200 line-clamp-2 min-h-[2.5em]">{teams?.away?.name}</span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <h3 className="text-lg font-semibold text-white group-hover:text-brand-500 transition-colors">{title}</h3>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-3 border-t border-brand-700 flex justify-center">
            <span className="inline-flex items-center gap-2 text-sm text-brand-400 font-medium group-hover:text-white transition-colors">
                <Play className="w-4 h-4 fill-current" />
                Watch Stream
            </span>
        </div>
      </div>
    </Link>
  );
};