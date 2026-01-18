import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Home, 
  CalendarDays, 
  Flame, 
  Dumbbell, 
  Target,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the allowed sports manually as per requirements
const SPORTS_NAV = [
  { 
    id: 'football', 
    name: 'Football', 
    icon: Trophy,
    subItems: [
      { name: 'Premier League', id: 'premier-league' },
      { name: 'Champions League', id: 'champions-league' },
      { name: 'La Liga', id: 'la-liga' },
      { name: 'Serie A', id: 'serie-a' },
      { name: 'Bundesliga', id: 'bundesliga' },
    ]
  },
  { id: 'basketball', name: 'Basketball', icon: Target },
  { id: 'american-football', name: 'Am. Football', icon: Flame },
  { id: 'mma', name: 'Fighting (MMA)', icon: Dumbbell },
  { id: 'boxing', name: 'Fighting (Boxing)', icon: Dumbbell },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedSports, setExpandedSports] = useState<string[]>(['football']); // Default expanded

  const isActive = (path: string) => location.pathname === path;

  const toggleSport = (sportId: string) => {
    setExpandedSports(prev => 
      prev.includes(sportId) 
        ? prev.filter(id => id !== sportId) 
        : [...prev, sportId]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border 
          transform transition-transform duration-300 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:shrink-0
        `}
      >
        <div className="p-4 md:hidden flex justify-end">
           <button onClick={onClose} className="text-gray-400 hover:text-white">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1 mb-8">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">Discover</h3>
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive('/') ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}`}
            >
              <Home className="w-4 h-4" />
              Overview
            </Link>
            <Link
              to="/schedule"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive('/schedule') ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}`}
            >
              <CalendarDays className="w-4 h-4" />
              Schedule
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">Sports</h3>
            {SPORTS_NAV.map((sport) => {
              const isExpanded = expandedSports.includes(sport.id);
              const hasSubItems = sport.subItems && sport.subItems.length > 0;
              const isSportActive = isActive(`/sport/${sport.id}`);

              return (
                <div key={sport.id} className="mb-1">
                  {/* Main Sport Link/Toggle */}
                  <div className={`
                    flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer group
                    ${isSportActive ? 'bg-primary-600/10 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}
                  `}>
                     <Link
                        to={`/sport/${sport.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 flex-1"
                      >
                        <sport.icon className={`w-4 h-4 ${isSportActive ? 'text-primary-500' : 'text-gray-500 group-hover:text-white'}`} />
                        {sport.name}
                      </Link>
                      
                      {hasSubItems && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSport(sport.id);
                          }}
                          className="p-1 rounded-md hover:bg-white/10"
                        >
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      )}
                  </div>

                  {/* Sub Categories */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-white/10 pl-2">
                      {sport.subItems.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/sport/${sport.id}`} // Linking to main sport page as API doesn't support league filtering directly yet
                          onClick={onClose}
                          className="block px-3 py-2 text-xs text-gray-500 hover:text-primary-400 hover:bg-white/5 rounded-md transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t border-border mt-auto">
           <div className="bg-surfaceHighlight rounded-xl p-4 relative overflow-hidden group border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <ShieldCheck className="w-4 h-4 text-primary-500" />
                <p className="text-xs text-white font-bold">kk-sport VIP</p>
              </div>
              <p className="text-[10px] text-gray-500 relative z-10 leading-relaxed">
                Unlock 4K streams, Multi-view, and Ad-free experience.
              </p>
           </div>
        </div>
      </aside>
    </>
  );
};