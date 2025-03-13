
import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import AllTeams from '@/pages/AllTeams';
import TeamView from '@/pages/TeamView';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import AuthCallback from '@/pages/AuthCallback';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from "@/components/ThemeProvider"
import UploadImages from '@/pages/UploadImages';

export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teams" element={<AllTeams />} />
          <Route path="/team/:teamId" element={<TeamView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/upload-images" element={<UploadImages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
