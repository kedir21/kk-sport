import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchDetail as MatchDetailType, Stream } from '../types';
import { 
  Loader2, 
  AlertTriangle, 
  ChevronLeft, 
  Shield, 
  AlertCircle,
  Settings,
  Tv,
  Info,
  Lock,
  Unlock,
  Play
} from 'lucide-react';
import { getImageUrl } from '../utils/formatters';

export const MatchDetail: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<MatchDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  
  // New Ad Blocking Method: Click Shield
  // When true, a transparent overlay blocks interaction with the iframe
  const [isPlayerLocked, setIsPlayerLocked] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!matchId) return;
      setLoading(true);
      setError(null);
      
      try {
        const data = await api.getMatchDetail(matchId);
        
        if (!data || !data.id) {
            throw new Error("Match not found");
        }

        setMatch(data);
        if (data.sources && data.sources.length > 0) {
          setActiveStream(data.sources[0]);
        }
      } catch (err: any) {
        setError(err.message || "Could not load match details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-surfaceHighlight/30 rounded-2xl mx-4 border border-white/5">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{error ? "Error" : "Match Not Found"}</h2>
        <Link to="/" className="mt-4 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const { title, teams, category } = match;
  const hasTeamData = teams && teams.home && teams.away;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
          <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 mr-2">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Matches</span>
        </Link>
        
        {/* Ad Block / Click Shield Toggle */}
        <button 
          onClick={() => setIsPlayerLocked(!isPlayerLocked)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
            ${isPlayerLocked 
              ? 'bg-primary-500/10 border-primary-500/30 text-primary-400 hover:bg-primary-500/20' 
              : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'}
          `}
        >
          {isPlayerLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {isPlayerLocked ? 'Player Locked (Safe)' : 'Player Unlocked'}
        </button>
      </div>

      {/* Header Info */}
      <div className="bg-surfaceHighlight/50 backdrop-blur-md rounded-t-2xl p-8 border border-white/5 relative overflow-hidden">
         {/* Background glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>

         {hasTeamData ? (
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center gap-4">
                 <img 
                    src={getImageUrl(teams.home?.badge)} 
                    alt={teams.home?.name} 
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                 />
                 <h2 className="text-xl md:text-2xl font-bold text-white text-center">{teams.home?.name}</h2>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                 <span className="text-3xl md:text-5xl font-black text-white/20 italic">VS</span>
                 <span className="px-3 py-1 bg-white/5 rounded text-xs font-bold uppercase tracking-wider text-primary-400 border border-white/5">
                    {category}
                 </span>
              </div>

              <div className="flex flex-col items-center gap-4">
                 <img 
                    src={getImageUrl(teams.away?.badge)} 
                    alt={teams.away?.name} 
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                 />
                 <h2 className="text-xl md:text-2xl font-bold text-white text-center">{teams.away?.name}</h2>
              </div>
           </div>
         ) : (
           <div className="text-center relative z-10">
             <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{title}</h1>
             <span className="text-primary-400 font-medium uppercase tracking-widest text-sm">{category} Event</span>
           </div>
         )}
      </div>

      {/* Video Player */}
      <div className="bg-black relative aspect-video w-full shadow-2xl z-20 overflow-hidden group">
        {activeStream ? (
           <div className="w-full h-full relative">
             <iframe 
               src={activeStream.embedUrl} 
               title={title}
               className="w-full h-full border-0"
               allowFullScreen
               allow="encrypted-media; fullscreen; picture-in-picture"
               // Sandbox removed as per request.
             />
             
             {/* Click Shield Overlay */}
             {isPlayerLocked && (
                <div 
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px] cursor-pointer transition-opacity hover:bg-black/50"
                  onClick={() => setIsPlayerLocked(false)}
                >
                   <div className="bg-primary-600 rounded-full p-4 mb-4 shadow-lg shadow-primary-500/30 animate-pulse">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                   </div>
                   <h3 className="text-xl font-bold text-white">Click to Play</h3>
                   <p className="text-gray-300 text-sm mt-2">Safe Mode Active: Ads Blocked</p>
                </div>
             )}
           </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surfaceHighlight/20 backdrop-blur-sm text-center p-6">
             <Tv className="w-16 h-16 text-gray-700 mb-4" />
             <p className="text-xl font-medium text-gray-300">Stream Offline</p>
             <p className="text-gray-500 mt-2 text-sm">Please select a different server or check back later.</p>
          </div>
        )}
      </div>

      {/* Server Selection */}
      <div className="bg-surfaceHighlight/50 backdrop-blur-md rounded-b-2xl p-6 border-x border-b border-white/5">
         <div className="flex items-center gap-3 mb-4">
           <Settings className="w-5 h-5 text-gray-400" />
           <h3 className="text-white font-bold">Stream Sources</h3>
         </div>
         
         {match.sources && match.sources.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
             {match.sources.map((stream) => (
               <button
                 key={stream.id}
                 onClick={() => {
                   setActiveStream(stream);
                   setIsPlayerLocked(true); // Reset lock when changing stream for safety
                 }}
                 className={`
                   group relative px-4 py-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1 transition-all
                   ${activeStream?.id === stream.id 
                     ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                     : 'bg-black/40 text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'}
                 `}
               >
                 <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wider text-[10px]">Server {stream.streamNo}</span>
                 </div>
                 <div className="flex items-center gap-1 text-xs opacity-80">
                   {stream.hd && <span className="bg-white/20 px-1 rounded text-[9px] font-bold">HD</span>}
                   <span className="capitalize">{stream.language}</span>
                 </div>
                 
                 {activeStream?.id === stream.id && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                 )}
               </button>
             ))}
           </div>
         ) : (
            <p className="text-gray-500 text-sm">No servers available.</p>
         )}

         <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
            <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-200/80 leading-relaxed">
              <p className="font-bold text-yellow-400 mb-1">Popup Protection</p>
              The player is locked by default to prevent unwanted popups. Click the "Play" overlay to unlock and start the stream. If you experience issues, try a different server.
            </div>
         </div>
      </div>
    </div>
  );
};