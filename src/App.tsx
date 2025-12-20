import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { CVFixFlow } from './components/CVFixFlow';
import { CVOutput } from './components/CVOutput';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { InterviewPrep } from './components/InterviewPrep';
import { BuyPoints } from './components/BuyPoints';
import { ReferralPage } from './components/ReferralPage';
import { Settings } from './components/Settings';
import { JobApplication } from './components/JobApplication';
import { auth, initializeSampleData } from './lib/mockBackend';

type Page = 
  | 'landing' 
  | 'auth' 
  | 'dashboard' 
  | 'cv-fix' 
  | 'cv-output' 
  | 'cover-letter' 
  | 'interview-prep'
  | 'job-application'
  | 'buy-points' 
  | 'referral' 
  | 'settings'
  | 'history'
  | 'notifications';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [cvOutputId, setCvOutputId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();

    // Check if user is already logged in
    const user = auth.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleCVComplete = (cvId: string) => {
    setCvOutputId(cvId);
    setCurrentPage('cv-output');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={() => setCurrentPage('auth')}
            onShowSample={() => {
              // In real app, show sample CV output
              alert('Sample output would be displayed here');
            }}
          />
        );

      case 'auth':
        return <AuthPage onSuccess={handleAuthSuccess} />;

      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );

      case 'cv-fix':
        return (
          <CVFixFlow
            onBack={() => setCurrentPage('dashboard')}
            onComplete={handleCVComplete}
            onNavigate={handleNavigate}
          />
        );

      case 'cv-output':
        return (
          <CVOutput
            cvId={cvOutputId}
            onBack={() => setCurrentPage('dashboard')}
            onNavigate={handleNavigate}
          />
        );

      case 'cover-letter':
        return (
          <CoverLetterGenerator
            onBack={() => setCurrentPage('dashboard')}
            onNavigate={handleNavigate}
          />
        );

      case 'interview-prep':
        return (
          <InterviewPrep
            onBack={() => setCurrentPage('dashboard')}
            onNavigate={handleNavigate}
          />
        );

      case 'job-application':
        return (
          <JobApplication
            onBack={() => setCurrentPage('dashboard')}
          />
        );

      case 'buy-points':
        return (
          <BuyPoints
            onBack={() => setCurrentPage('dashboard')}
          />
        );

      case 'referral':
        return (
          <ReferralPage
            onBack={() => setCurrentPage('dashboard')}
          />
        );

      case 'settings':
        return (
          <Settings
            onBack={() => setCurrentPage('dashboard')}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster position="top-right" />
    </>
  );
}