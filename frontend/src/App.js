import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { registerServiceWorker, scheduleDailyReminder } from './utils/offline';
import '@/App.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyHabits from './pages/DailyHabits';
import PeriodTracker from './pages/PeriodTracker';
import CravingEmergency from './pages/CravingEmergency';
import FoodSuggestions from './pages/FoodSuggestions';
import MonthlyReport from './pages/MonthlyReport';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

function App() {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();
    
    // Schedule daily reminders at 9 AM
    scheduleDailyReminder('09:00');
  }, []);
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/daily-habits" element={<DailyHabits />} />
          <Route path="/period-tracker" element={<PeriodTracker />} />
          <Route path="/craving-emergency" element={<CravingEmergency />} />
          <Route path="/food-suggestions" element={<FoodSuggestions />} />
          <Route path="/monthly-report" element={<MonthlyReport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#FDE2F3',
            color: '#5D4578',
            border: '2px solid #D8B4F8',
            borderRadius: '1rem',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#D8B4F8',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
}

export default App;