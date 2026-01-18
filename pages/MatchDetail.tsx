import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchDetail as MatchDetailType, Stream } from '../types';
import { 
  Loader2, 
  AlertTriangle, 
  ChevronLeft, 
  ShieldCheck, 
  ShieldAlert,
  Settings,
  Tv,
  Info,
  Maximize2,
  Minimize2,
  RotateCw,
  Zap
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
  const [adBlockEnabled, setAdBlockEnabled] = useState(true);
  const [iframeKey, setIframeKey] = useState(0); // Used to force reload iframe

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

  const refreshStream = () => {
    setIframeKey(prev => prev + 1);
  };

  const toggleAdBlock = () => {
    setAdBlockEnabled(!adBlockEnabled);
    // We need to reload the iframe for sandbox attributes to take effect/reset
    setTimeout(() => refreshStream(), 100);
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
        <h2 className="text-xl font-bold text-white mb-2">{error ? "Error" : "Match Not Found"}</h2>
        <Link to="/" className="mt-4 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const { title, teams, category } = match;
  const hasTeamData = teams && teams.home && teams.away;

  // Sandbox rules: 
  // - allow-scripts: needed for player JS
  // - allow-same-origin: needed for some players to function
  // - allow-presentation: needed for fullscreen
  // - OMITTING 'allow-popups' effectively blocks new windows
  const sandboxRules = adBlockEnabled 
    ? "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-presentation" 
    : undefined; // undefined removes the attribute, allowing everything

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

      {/* Header Info (Hidden in Wide Mode to focus on video) */}
      {!isWideMode && (
        <div className="bg-surfaceHighlight/50 backdrop-blur-md rounded-t-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden mb-1">
           {/* Background glow */}
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
        flex items-center justify-between p-3 bg-surface border-x border-t border-white/5 
        ${isWideMode ? 'rounded-t-2xl' : !hasTeamData ? 'rounded-t-2xl' : ''}
      `}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white px-3 border-l-2 border-primary-500">
               <Tv className="w-4 h-4 text-primary-500" />
               <span>Server {activeStream?.streamNo || 1}</span>
            </div>
            
            {/* Ad Block Toggle */}
            <button 
              onClick={toggleAdBlock}
              className={`
                hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                ${adBlockEnabled 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'}
              `}
              title={adBlockEnabled ? "Ads are blocked. Click to disable if video doesn't load." : "Ads allowed. Click to block popups."}
            >
              {adBlockEnabled ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              {adBlockEnabled ? 'Ad-Shield: Active' : 'Ad-Shield: Disabled'}
            </button>
          </div>

          <div className="flex items-center gap-2">
             <button 
               onClick={refreshStream}
               className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
               title="Refresh Stream"
             >
               <RotateCw className="w-4 h-4" />
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

      {/* Video Player */}
      <div className={`bg-black relative aspect-video w-full shadow-2xl z-20 overflow-hidden group border-x border-white/5 ${isWideMode ? '' : ''}`}>
        {activeStream ? (
           <div className="w-full h-full relative">
             <iframe 
               key={iframeKey} // Force reload when key changes
               src={activeStream.embedUrl} 
               title={title}
               className="w-full h-full border-0"
               allowFullScreen
               allow="encrypted-media; fullscreen; picture-in-picture"
               sandbox={sandboxRules} // Ad-blocking magic
               loading="lazy"
               referrerPolicy="no-referrer"
             />
           </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surfaceHighlight/20 backdrop-blur-sm text-center p-6">
             <Tv className="w-16 h-16 text-gray-700 mb-4" />
             <p className="text-xl font-medium text-gray-300">Stream Offline</p>
             <p className="text-gray-500 mt-2 text-sm">Please select a different server or check back later.</p>
          </div>
        )}
      </div>

      {/* Stream Info & Server Selector */}
      <div className="bg-surfaceHighlight/50 backdrop-blur-md rounded-b-2xl p-6 border border-white/5">
         
         {/* Mobile Ad Block Toggle */}
         <div className="md:hidden mb-6">
            <button 
              onClick={toggleAdBlock}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all
                ${adBlockEnabled 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}
              `}
            >
              {adBlockEnabled ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {adBlockEnabled ? 'Ad-Shield Active (Safe)' : 'Ad-Shield Disabled (Use if stuck)'}
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-2">
              If the video doesn't play, try disabling Ad-Shield.
            </p>
         </div>

         <div className="flex items-center gap-3 mb-4">
           <Settings className="w-5 h-5 text-gray-400" />
           <h3 className="text-white font-bold">Switch Server</h3>
         </div>
         
         {match.sources && match.sources.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
             {match.sources.map((stream) => (
               <button
                 key={stream.id}
                 onClick={() => {
                   setActiveStream(stream);
                   setIframeKey(prev => prev + 1); // Reset iframe on change
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

         {/* Help / Info Box */}
         <div className="mt-6 flex items-start gap-3 p-4 bg-primary-900/10 border border-primary-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
            <div className="text-xs text-primary-200/80 leading-relaxed">
              <p className="font-bold text-primary-400 mb-1">Streaming Tips</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>If the video is stuck, try the <strong>Refresh</strong> button above the player.</li>
                <li>Some streams require <strong>Ad-Shield</strong> to be disabled to start. Toggle it if you see a black screen.</li>
                <li>For best quality, look for servers marked with <strong>HD</strong>.</li>
              </ul>
            </div>
         </div>
      </div>
    </div>
  );
};