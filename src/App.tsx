
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "@/components/auth/AuthPage";
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import DeviceManager from "@/components/devices/DeviceManager";
import RemoteConnection from "@/components/connection/RemoteConnection";
import FileTransfer from "@/components/files/FileTransfer";
import MessagingHub from "@/components/chat/MessagingHub";
import ConnectionHistory from "@/components/history/ConnectionHistory";
import SettingsPanel from "@/components/settings/SettingsPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/devices" element={<DeviceManager />} />
                        <Route path="/connect" element={<RemoteConnection />} />
                        <Route path="/files" element={<FileTransfer />} />
                        <Route path="/chat" element={<MessagingHub />} />
                        <Route path="/history" element={<ConnectionHistory />} />
                        <Route path="/settings" element={<SettingsPanel />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
