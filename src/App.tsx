// src/App.tsx
import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { CVFixFlow } from "./components/CVFixFlow";
import { CVOutput } from "./components/CVOutput";
import { CoverLetterGenerator } from "./components/CoverLetterGenerator";
import { InterviewPrep } from "./components/InterviewPrep";
import { BuyPoints } from "./components/BuyPoints";
import { ReferralPage } from "./components/ReferralPage";
import { Settings } from "./components/Settings";
import { JobApplication } from "./components/JobApplication";

import { auth, initializeSampleData } from "./lib/mockBackend";
import { ProtectedLayout } from "./components/ProtectedLayout";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize data and handle initial redirects
  useEffect(() => {
    initializeSampleData();

    const user = auth.getCurrentUser();
    const isOnPublicPage =
      location.pathname === "/" || location.pathname === "/auth";

    if (user && isOnPublicPage) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleAuthSuccess = () => {
    // Redirect to intended page after login, fallback to dashboard
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    navigate(from);
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={<AuthPage onSuccess={handleAuthSuccess} />}
        />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cv-fix" element={<CVFixFlow />} />
          <Route path="/cv-output/:cvId" element={<CVOutput />} />
          <Route path="/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/job-application" element={<JobApplication />} />
          <Route path="/buy-points" element={<BuyPoints />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="p-8 text-center text-2xl">Page Not Found</div>
          }
        />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}
