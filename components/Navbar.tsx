import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Tv2 } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border h-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <Tv2 className="w-6 h-6 text-primary-500 relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Stream<span className="text-primary-500">Zone</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-8">
           <div className="relative w-full group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-gray-600 group-focus-within:text-primary-500 transition-colors" />
             </div>
             <input
               type="text"
               placeholder="Find matches, teams, or events..."
               className="block w-full pl-10 pr-3 py-2 bg-surfaceHighlight/50 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
             />
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Login
          </button>
          <button className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-5 rounded-full text-sm transition-all transform hover:scale-105 shadow-lg shadow-white/10">
            Get Premium
          </button>
        </div>
      </div>
    </header>
  );
};