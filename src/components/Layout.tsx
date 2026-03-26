import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';
import CommandPalette from './CommandPalette';
import Breadcrumb from './Breadcrumb';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { sidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileSidebarOpen(false)} 
        />
      )}

      <Sidebar />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'} ml-0`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AIAssistant />
      <CommandPalette />
    </div>
  );
}
