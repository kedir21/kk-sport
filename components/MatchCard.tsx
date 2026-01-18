import React from 'react';
import { PlayCircle, Calendar, Star } from 'lucide-react';
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
      className="group relative flex flex-col bg-surfaceHighlight/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1 h-full"
    >
      {/* Top Banner */}
      <div className="px-4 py-3 flex justify-between items-start border-b border-white/5 bg-white/[0.02]">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
          {category}
        </span>
        
        <div className="flex items-center gap-2">
          {popular && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-sm" />}
          {isLive ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
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

      <div className="p-4 md:p-6 flex-1 flex flex-col justify-center relative">
        {/* Background ambient glow for team colors (simulated) */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {hasTeamData ? (
          <div className="flex items-center justify-between gap-2 md:gap-4 relative z-10">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 md:gap-5 flex-1 min-w-0">
              <div className="relative w-20 h-20 md:w-28 md:h-28 transition-transform duration-300 group-hover:scale-110">
                 {/* Logo Container with Glow */}
                 <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                 <img 
                    src={getImageUrl(teams?.home?.badge)} 
                    alt={teams?.home?.name}
                    className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/80/80')}
                />
              </div>
              <span className="text-sm md:text-base font-bold text-gray-200 text-center leading-tight line-clamp-2 w-full">
                {teams?.home?.name}
              </span>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl md:text-4xl font-black text-white/10 group-hover:text-primary-500/50 transition-colors italic transform -skew-x-12">
                VS
              </span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 md:gap-5 flex-1 min-w-0">
              <div className="relative w-20 h-20 md:w-28 md:h-28 transition-transform duration-300 group-hover:scale-110">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <img 
                    src={getImageUrl(teams?.away?.badge)} 
                    alt={teams?.away?.name}
                    className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/80/80')}
                />
              </div>
              <span className="text-sm md:text-base font-bold text-gray-200 text-center leading-tight line-clamp-2 w-full">
                {teams?.away?.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="min-h-[120px] flex items-center justify-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-primary-400 transition-colors px-4">
              {title}
            </h3>
          </div>
        )}
      </div>

      {/* Hover Overlay Action */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-20">
        <button className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full font-bold text-sm md:text-base shadow-lg shadow-primary-600/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <PlayCircle className="w-5 h-5" />
          Watch Live
        </button>
      </div>
    </Link>
  );
};