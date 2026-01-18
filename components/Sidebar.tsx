import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Home, 
  CalendarDays, 
  Flame, 
  Dumbbell, 
  Target,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the allowed sports manually as per requirements
const SPORTS_NAV = [
  { id: 'football', name: 'Football', icon: Trophy },
  { id: 'basketball', name: 'Basketball', icon: Target },
  { id: 'american-football', name: 'Am. Football', icon: Flame }, // Assuming 'american-football' matches API or mapped later
  { id: 'mma', name: 'Fighting (MMA)', icon: Dumbbell },
  { id: 'boxing', name: 'Fighting (Boxing)', icon: Dumbbell },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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
            {SPORTS_NAV.map((sport) => (
              <Link
                key={sport.id}
                to={`/sport/${sport.id}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive(`/sport/${sport.id}`) ? 'bg-primary-600/10 text-primary-500 border border-primary-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}`}
              >
                <sport.icon className={`w-4 h-4 ${isActive(`/sport/${sport.id}`) ? 'text-primary-500' : 'text-gray-500'}`} />
                {sport.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-border mt-auto">
           <div className="bg-surfaceHighlight rounded-xl p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-xs text-gray-300 font-medium relative z-10 mb-2">Join Premium</p>
              <p className="text-[10px] text-gray-500 relative z-10">Ad-free experience & 4K streams.</p>
           </div>
        </div>
      </aside>
    </>
  );
};