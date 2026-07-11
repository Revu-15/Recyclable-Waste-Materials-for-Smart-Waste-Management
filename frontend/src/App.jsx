import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Classify from './pages/Classify';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Admin from './pages/Admin';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to body on state change
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'classify':
        return <Classify />;
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <History />;
      case 'admin':
        return <Admin />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Decorative Radial Background */}
      <div className="radial-bg"></div>

      {/* Header */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Sticky Navigation Footer */}
      <footer className="md:hidden sticky bottom-0 z-30 w-full glass-panel border-t border-glass-dark dark:border-glass-light flex items-center justify-around py-3 px-4 text-[10px] font-bold text-slate-600 dark:text-slate-400">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : ''}`}
        >
          <span>Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('classify')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'classify' ? 'text-emerald-600' : ''}`}
        >
          <span>Classify</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-600' : ''}`}
        >
          <span>Analytics</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-emerald-600' : ''}`}
        >
          <span>History</span>
        </button>
        <button 
          onClick={() => setActiveTab('admin')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-emerald-600' : ''}`}
        >
          <span>Admin</span>
        </button>
      </footer>
    </div>
  );
}

export default App;
