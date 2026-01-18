import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchDetail as MatchDetailType, Stream } from '../types';
import { Loader2, AlertTriangle, MonitorPlay, ChevronLeft, ShieldCheck, Monitor, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../utils/formatters';

export const MatchDetail: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<MatchDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!matchId) return;
      setLoading(true);
      setError(null);
      console.log(`[MatchDetail] Fetching details for match ${matchId}...`);
      
      try {
        const data = await api.getMatchDetail(matchId);
        console.log(`[MatchDetail] Received data:`, data);
        
        if (!data || !data.id) {
            console.error("[MatchDetail] Invalid data received:", data);
            throw new Error("Invalid match data received from server");
        }

        setMatch(data);
        
        if (data.sources && data.sources.length > 0) {
          console.log(`[MatchDetail] Found ${data.sources.length} streams. Setting active stream to first source.`);
          setActiveStream(data.sources[0]);
        } else {
            console.warn(`[MatchDetail] No streams found in 'sources' array.`);
        }
      } catch (err: any) {
        console.error("[MatchDetail] Failed to load match detail:", err);
        setError(err.message || "Could not load match details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4 bg-brand-800 rounded-lg m-4 border border-brand-700">
        {error ? <AlertCircle className="w-12 h-12 text-red-500 mb-4" /> : <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />}
        <h2 className="text-2xl font-bold text-white mb-2">{error ? "Connection Error" : "Match Not Found"}</h2>
        <p className="text-gray-400 mb-6">{error || "The match you are looking for isn't available right now."}</p>
        <Link to="/" className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-full transition-colors font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  const { title, teams, category } = match;
  const hasTeamData = teams && teams.home && teams.away;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Matches
      </Link>

      {/* Title Header */}
      <div className="bg-brand-800 rounded-t-xl p-6 border-b border-brand-700">
         {hasTeamData ? (
           <div className="flex items-center justify-between md:justify-center md:gap-12">
              <div className="flex flex-col items-center gap-2 w-1/3">
                 <img 
                    src={getImageUrl(teams.home?.badge)} 
                    alt={teams.home?.name} 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                 />
                 <h2 className="text-lg md:text-2xl font-bold text-white text-center">{teams.home?.name}</h2>
              </div>
              <div className="text-2xl md:text-4xl font-black text-brand-500 italic">VS</div>
              <div className="flex flex-col items-center gap-2 w-1/3">
                 <img 
                    src={getImageUrl(teams.away?.badge)} 
                    alt={teams.away?.name} 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50/50')}
                 />
                 <h2 className="text-lg md:text-2xl font-bold text-white text-center">{teams.away?.name}</h2>
              </div>
           </div>
         ) : (
           <h1 className="text-2xl md:text-3xl font-bold text-white text-center">{title}</h1>
         )}
         <div className="text-center mt-2 text-brand-400 uppercase tracking-widest text-sm font-semibold">
           {category} Stream
         </div>
      </div>

      {/* Video Player Container */}
      <div className="bg-black aspect-video w-full relative group">
        {activeStream ? (
           <iframe 
             src={activeStream.embedUrl} 
             title={title}
             className="w-full h-full border-0"
             allowFullScreen
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
             <MonitorPlay className="w-16 h-16 text-gray-600 mb-4" />
             <p className="text-xl font-medium">No streams available currently.</p>
             <p className="text-gray-500 mt-2">Check back closer to the match start time.</p>
          </div>
        )}
      </div>

      {/* Stream Selector */}
      {match.sources && match.sources.length > 0 && (
        <div className="bg-brand-800 rounded-b-xl p-4 border-t border-brand-700">
           <div className="flex items-center gap-2 mb-3">
             <ShieldCheck className="w-5 h-5 text-brand-500" />
             <h3 className="text-white font-semibold">Available Sources</h3>
           </div>
           <div className="flex flex-wrap gap-2">
             {match.sources.map((stream) => (
               <button
                 key={stream.id}
                 onClick={() => setActiveStream(stream)}
                 className={`
                   px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all
                   ${activeStream?.id === stream.id 
                     ? 'bg-brand-500 text-brand-900 shadow-lg shadow-brand-500/20' 
                     : 'bg-brand-900 text-gray-300 hover:bg-brand-700 hover:text-white border border-brand-700'}
                 `}
               >
                 <span>Server {stream.streamNo}</span>
                 <span className="text-xs opacity-70 uppercase">({stream.language})</span>
                 {stream.hd && <Monitor className="w-4 h-4" />}
               </button>
             ))}
           </div>
           <p className="mt-4 text-xs text-gray-500">
             * If the stream buffers, try switching to a different server. Ad-blockers may interfere with some players.
           </p>
        </div>
      )}
    </div>
  );
};