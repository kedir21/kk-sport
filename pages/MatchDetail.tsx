import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchDetail as MatchDetailType, Stream } from '../types';
import { 
  Loader2, 
  AlertTriangle, 
  ChevronLeft, 
  Settings,
  Tv,
  Maximize2,
  Minimize2,
  RotateCw,
  Globe,
  Server,
  Signal
} from 'lucide-react';
import { getImageUrl } from '../utils/formatters';

export const MatchDetail: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<MatchDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  
  // UI States
  const [isWideMode, setIsWideMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!matchId) return;
      setLoading(true);
      setError(null);
      
      try {
        const data = await api.getMatchDetail(matchId);
        
        if (!data || !data.id) {
            throw new Error("Match data is incomplete or missing.");
        }

        setMatch(data);
        if (data.sources && data.sources.length > 0) {
          setActiveStream(data.sources[0]);
        }
      } catch (err: any) {
        // Handle 404 specifically
        if (err.message && (err.message.includes('404') || err.message.includes('Match not found'))) {
          setError("This match is no longer available or the stream has ended.");
        } else {
          setError(err.message || "Could not load match details.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [matchId]);

  const refreshStream = () => {
    setIframeKey(prev => prev + 1);
  };

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
        <h2 className="text-xl font-bold text-white mb-2">Stream Unavailable</h2>
        <p className="text-gray-400 mb-6 max-w-md">{error}</p>
        <Link to="/" className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
          Browse Live Matches
        </Link>
      </div>
    );
  }

  const { title, teams, category } = match;
  const hasTeamData = teams && teams.home && teams.away;

  return (
    <div className={`mx-auto pb-12 animate-fade-in transition-all duration-500 ${isWideMode ? 'max-w-[1800px]' : 'max-w-6xl'}`}>
      
      {/* Navigation & Toolbar */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
          <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 mr-2">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Matches</span>
        </Link>
      </div>

      {/* Header Info */}
      {!isWideMode && (
        <div className="bg-surfaceHighlight/50 backdrop-blur-md rounded-t-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden mb-1">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>

           {hasTeamData ? (
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="flex flex-col items-center gap-4">
                   <img 
                      src={getImageUrl(teams.home?.badge)} 
                      alt={teams.home?.name} 
                      className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                      onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                   />
                   <h2 className="text-xl md:text-2xl font-bold text-white text-center">{teams.home?.name}</h2>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live</span>
                   </div>
                   <span className="text-3xl md:text-5xl font-black text-white/20 italic">VS</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                   <img 
                      src={getImageUrl(teams.away?.badge)} 
                      alt={teams.away?.name} 
                      className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl"
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
      )}

      {/* Player Controls Bar */}
      <div className={`
        flex flex-wrap items-center justify-between p-3 bg-surface border-x border-t border-white/5 gap-y-2
        ${isWideMode ? 'rounded-t-2xl' : !hasTeamData ? 'rounded-t-2xl' : ''}
      `}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white px-3 border-l-2 border-primary-500">
               <Tv className="w-4 h-4 text-primary-500" />
               <span className="hidden sm:inline">Server {activeStream?.streamNo || 1}</span>
               <span className="sm:hidden">S{activeStream?.streamNo || 1}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
             <button 
               onClick={refreshStream}
               className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-gray-300"
             >
               <RotateCw className="w-3.5 h-3.5" />
               <span className="hidden sm:inline">Reload</span>
             </button>
             
             <button 
               onClick={() => setIsWideMode(!isWideMode)}
               className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden md:block"
               title={isWideMode ? "Exit Cinema Mode" : "Cinema Mode"}
             >
               {isWideMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
             </button>
          </div>
      </div>

      {/* Video Player Container */}
      <div className="bg-black relative aspect-video w-full shadow-2xl z-20 overflow-hidden group border-x border-white/5">
        {activeStream ? (
           <div className="w-full h-full relative group">
             <iframe 
               key={`${activeStream.id}-${iframeKey}`} 
               src={activeStream.embedUrl} 
               title={title}
               className="w-full h-full border-0"
               allowFullScreen
               // Standard permissions for max compatibility
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               loading="lazy"
               referrerPolicy="no-referrer"
             />
           </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surfaceHighlight/20 backdrop-blur-sm text-center p-6">
             <Tv className="w-16 h-16 text-gray-700 mb-4" />
             <p className="text-xl font-medium text-gray-300">Stream Offline</p>
             <p className="text-gray-500 mt-2 text-sm">Please select a different server below.</p>
          </div>
        )}
      </div>

      {/* Stream Info & Server Selector */}
      <div className="bg-surfaceHighlight/50 backdrop-blur-md rounded-b-2xl p-6 border border-white/5">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <h3 className="text-white font-bold">Select Source</h3>
            </div>
         </div>
         
         {match.sources && match.sources.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {match.sources.map((stream) => (
               <button
                 key={stream.id}
                 onClick={() => {
                   setActiveStream(stream);
                   setIframeKey(prev => prev + 1);
                 }}
                 className={`
                   group relative p-4 rounded-xl text-left transition-all overflow-hidden border
                   ${activeStream?.id === stream.id 
                     ? 'bg-primary-600/10 border-primary-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                     : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/5'}
                 `}
               >
                  {/* Header: Server ID + Status */}
                  <div className="flex items-center justify-between mb-3">
                     <span className={`text-xs font-bold uppercase tracking-wider ${activeStream?.id === stream.id ? 'text-primary-400' : 'text-gray-400'}`}>
                        Server {stream.streamNo}
                     </span>
                     {stream.hd ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                           HD 720p+
                        </span>
                     ) : (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded border border-gray-500/10">
                           SD
                        </span>
                     )}
                  </div>

                  {/* Metadata Rows */}
                  <div className="space-y-1.5">
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Globe className="w-3.5 h-3.5 text-gray-500" />
                        <span className="capitalize">{stream.language}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Server className="w-3.5 h-3.5 text-gray-500" />
                        <span className="capitalize truncate" title={stream.source}>Provider: {stream.source}</span>
                     </div>
                  </div>
                 
                 {/* Active Indicator Pulse */}
                 {activeStream?.id === stream.id && (
                    <div className="absolute top-3 right-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </div>
                 )}
                 
                 {/* Selection Highlight Bottom Bar */}
                 {activeStream?.id === stream.id && (
                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
                 )}
               </button>
             ))}
           </div>
         ) : (
            <div className="p-8 text-center bg-black/20 rounded-xl border border-dashed border-white/10">
               <Signal className="w-8 h-8 text-gray-600 mx-auto mb-2" />
               <p className="text-gray-500 text-sm">No streaming servers available for this match yet.</p>
            </div>
         )}
      </div>
    </div>
  );
};