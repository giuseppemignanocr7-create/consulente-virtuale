import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (r: UserRole) => void;
  userName: string;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (v: boolean) => void;
  unreadAI: number;
  setUnreadAI: (v: number) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('client');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [unreadAI, setUnreadAI] = useState(3);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const userName = role === 'client' ? 'Marco Rossi' : role === 'studio' ? 'Studio Conti & Associati' : 'Admin';

  return (
    <AppContext.Provider value={{ role, setRole, userName, sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen, aiPanelOpen, setAiPanelOpen, unreadAI, setUnreadAI, darkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
