import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Tv, Search } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-brand-900/90 backdrop-blur-md border-b border-brand-700 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden text-gray-300 hover:text-white p-1 rounded-md hover:bg-brand-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-brand-900 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Tv className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              720p<span className="text-brand-500">Streams</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
           <div className="relative w-full">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-gray-500" />
             </div>
             <input
               type="text"
               placeholder="Search matches (Coming soon...)"
               disabled
               className="block w-full pl-10 pr-3 py-2 border border-brand-700 rounded-md leading-5 bg-brand-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm cursor-not-allowed opacity-60"
             />
           </div>
        </div>

        <div className="flex items-center">
          <button className="bg-brand-500 hover:bg-brand-400 text-brand-900 font-bold py-2 px-4 rounded text-sm transition-colors">
            Get Premium
          </button>
        </div>
      </div>
    </header>
  );
};