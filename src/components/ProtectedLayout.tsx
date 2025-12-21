import { Outlet, NavLink } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { auth } from "../lib/mockBackend";
import { useState, useEffect } from "react";
import { useIsMobile } from "./ui/use-mobile";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/cv-fix", label: "CV Fix" },
  { to: "/cover-letter", label: "Cover Letter" },
  { to: "/interview-prep", label: "Interview Prep" },
  { to: "/job-application", label: "Applications" },
  { to: "/referral", label: "Referrals" },
];

export function ProtectedLayout() {
  const user = auth.getCurrentUser();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="text-lg font-semibold tracking-tight">
              FlowJobAi
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center gap-8">
                {navItems.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      [
                        "text-sm font-medium transition-colors",
                        "border-b-2 pb-1",
                        isActive
                          ? "text-gray-900 border-gray-900"
                          : "text-gray-500 border-transparent hover:text-gray-900",
                      ].join(" ")
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            )}

            {/* Right / Meta */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{user?.points ?? 0} pts</span>
              </div>

              {!isMobile && (
                <NavLink
                  to="/settings"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Settings
                </NavLink>
              )}

              {/* Mobile menu button */}
              {isMobile && (
                <button
                  onClick={() => setOpen(!open)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  {open ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && open && (
          <div className="border-t bg-white">
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {label}
                </NavLink>
              ))}

              <NavLink
                to="/settings"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Settings
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
