import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sport } from '../types';
import { api } from '../services/api';
import { Trophy, Activity, Menu, X, Home, CalendarClock, Tv } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const data = await api.getSports();
        setSports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-brand-900 border-r border-brand-700 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:shrink-0
        `}
      >
        <div className="p-4 md:hidden flex justify-between items-center border-b border-brand-700">
           <span className="text-xl font-bold text-brand-500">720pStreams</span>
           <button onClick={onClose} className="text-gray-400 hover:text-white">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Menu</h3>
            <nav className="space-y-1">
              <Link
                to="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/') ? 'bg-brand-500 text-white' : 'text-gray-300 hover:bg-brand-800 hover:text-white'}`}
              >
                <Home className="w-4 h-4" />
                Live & Popular
              </Link>
              <Link
                to="/schedule"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/schedule') ? 'bg-brand-500 text-white' : 'text-gray-300 hover:bg-brand-800 hover:text-white'}`}
              >
                <CalendarClock className="w-4 h-4" />
                Schedule (Today)
              </Link>
            </nav>
          </div>

          {/* Sports Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Sports</h3>
            <nav className="space-y-1">
              {loading ? (
                 <div className="space-y-2 px-2">
                   {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="h-8 bg-brand-800 rounded animate-pulse"></div>
                   ))}
                 </div>
              ) : (
                Array.isArray(sports) && sports.map((sport) => (
                  <Link
                    key={sport.id}
                    to={`/sport/${sport.id}`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(`/sport/${sport.id}`) ? 'bg-brand-800 text-brand-400 border-l-2 border-brand-500' : 'text-gray-300 hover:bg-brand-800 hover:text-white'}`}
                  >
                    {sport.id === 'football' ? <Trophy className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    {sport.name}
                  </Link>
                ))
              )}
            </nav>
          </div>
        </div>
        
        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-brand-700 text-center md:text-left">
           <p className="text-xs text-gray-500">© 2024 720pStreams Clone</p>
        </div>
      </aside>
    </>
  );
};