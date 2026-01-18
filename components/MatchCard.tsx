import React from 'react';
import { PlayCircle, Clock, Calendar, Star } from 'lucide-react';
import { APIMatch } from '../types';
import { formatMatchTime, getImageUrl } from '../utils/formatters';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: APIMatch;
  isLive?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, isLive = false }) => {
  const { id, title, date, teams, popular, category } = match;
  const hasTeamData = teams && teams.home && teams.away;
  
  return (
    <Link 
      to={`/match/${id}`}
      className="group relative block bg-surfaceHighlight/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1"
    >
      {/* Top Banner */}
      <div className="px-5 pt-5 pb-2 flex justify-between items-start">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
          {category}
        </span>
        
        <div className="flex items-center gap-2">
          {popular && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 drop-shadow-sm" />}
          {isLive ? (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Live</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formatMatchTime(date)}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 pt-2">
        {hasTeamData ? (
          <div className="flex items-center justify-between py-2">
            {/* Home */}
            <div className="flex flex-col items-center gap-3 w-[40%]">
              <div className="relative w-14 h-14 p-2 bg-black/20 rounded-full ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all">
                <img 
                    src={getImageUrl(teams?.home?.badge)} 
                    alt={teams?.home?.name}
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                />
              </div>
              <span className="text-xs font-semibold text-gray-300 text-center leading-tight line-clamp-2">{teams?.home?.name}</span>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl font-black text-white/10 group-hover:text-white/80 transition-colors italic">VS</span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-3 w-[40%]">
              <div className="relative w-14 h-14 p-2 bg-black/20 rounded-full ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all">
                <img 
                    src={getImageUrl(teams?.away?.badge)} 
                    alt={teams?.away?.name}
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                />
              </div>
              <span className="text-xs font-semibold text-gray-300 text-center leading-tight line-clamp-2">{teams?.away?.name}</span>
            </div>
          </div>
        ) : (
          <div className="h-28 flex items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-200 group-hover:text-primary-400 transition-colors px-2">{title}</h3>
          </div>
        )}
      </div>

      {/* Hover Overlay Action */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-full font-semibold text-sm shadow-lg shadow-primary-600/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <PlayCircle className="w-4 h-4" />
          Watch Stream
        </button>
      </div>
    </Link>
  );
};