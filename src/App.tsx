import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { JournalProvider } from '@/context/JournalContext';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Journal } from '@/pages/Journal';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { ROUTES } from '@/constants/routes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <JournalProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.JOURNAL} element={<Journal />} />
              <Route path={ROUTES.JOURNAL_EDIT} element={<Journal />} />
              <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
              <Route path={ROUTES.CALENDAR} element={<Navigate to={ROUTES.ANALYTICS} replace />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Route>
          </Routes>
        </Router>
      </JournalProvider>
    </ThemeProvider>
  );
};

export default App;
