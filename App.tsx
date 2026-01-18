import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { SportView } from './pages/SportView';
import { MatchDetail } from './pages/MatchDetail';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-background text-gray-100 font-sans flex flex-col selection:bg-primary-500 selection:text-white">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="flex pt-16 h-screen overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <main className="flex-1 overflow-y-auto w-full relative">
            <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-[calc(100vh-10rem)]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/sport/:sportId" element={<SportView />} />
                <Route path="/match/:matchId" element={<MatchDetail />} />
              </Routes>
            </div>
            
            <footer className="py-8 text-center text-gray-600 text-xs border-t border-white/5 mt-auto">
              <div className="max-w-4xl mx-auto px-4">
                <p className="mb-2">Disclaimer: StreamZone does not host any content. All streams are embedded from external sources.</p>
                <p>&copy; 2024 StreamZone. All rights reserved.</p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;