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
      <div className="min-h-screen bg-brand-900 text-gray-100 font-sans flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/sport/:sportId" element={<SportView />} />
                <Route path="/match/:matchId" element={<MatchDetail />} />
              </Routes>
            </div>
            
            {/* Simple Footer inside scrollable area */}
            <footer className="mt-12 py-8 border-t border-brand-800 text-center text-gray-500 text-sm">
              <p className="mb-2">Disclaimer: This site does not host any content. All streams are embedded from external sources.</p>
              <p>&copy; 2024 720pStreams Clone. All rights reserved.</p>
            </footer>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;