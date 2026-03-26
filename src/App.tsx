import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import PageLoader from './components/PageLoader';

const Landing        = lazy(() => import('./pages/Landing'));
const Login          = lazy(() => import('./pages/Login'));
const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const StudioDashboard = lazy(() => import('./pages/studio/Dashboard'));
const Clienti        = lazy(() => import('./pages/studio/Clienti'));
const Fatturazione   = lazy(() => import('./pages/Fatturazione'));
const Simulatore     = lazy(() => import('./pages/Simulatore'));
const Documenti      = lazy(() => import('./pages/Documenti'));
const Accertamenti   = lazy(() => import('./pages/Accertamenti'));
const Scadenze       = lazy(() => import('./pages/Scadenze'));
const Tickets        = lazy(() => import('./pages/Tickets'));
const Chat           = lazy(() => import('./pages/Chat'));
const Colf           = lazy(() => import('./pages/Colf'));
const DVR            = lazy(() => import('./pages/DVR'));
const Impostazioni   = lazy(() => import('./pages/Impostazioni'));

const TOAST_STYLE = {
  borderRadius: '12px',
  background: '#0f172a',
  color: '#f8fafc',
  fontSize: '14px',
  fontWeight: 500,
  padding: '12px 16px',
} as const;

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: TOAST_STYLE,
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* App — single Layout wrapper for all protected pages */}
          <Route element={<Layout />}>
            <Route path="/dashboard"    element={<ClientDashboard />} />
            <Route path="/studio"       element={<StudioDashboard />} />
            <Route path="/clienti"      element={<Clienti />} />
            <Route path="/fatturazione" element={<Fatturazione />} />
            <Route path="/simulatore"   element={<Simulatore />} />
            <Route path="/documenti"    element={<Documenti />} />
            <Route path="/accertamenti" element={<Accertamenti />} />
            <Route path="/scadenze"     element={<Scadenze />} />
            <Route path="/tickets"      element={<Tickets />} />
            <Route path="/chat"         element={<Chat />} />
            <Route path="/colf"         element={<Colf />} />
            <Route path="/dvr"          element={<DVR />} />
            <Route path="/impostazioni" element={<Impostazioni />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppProvider>
  );
}
