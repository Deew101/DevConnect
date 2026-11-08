import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastProvider } from '@/components/ui/Toast';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

import { AuthPage } from '@/pages/AuthPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DiscoveryPage } from '@/pages/DiscoveryPage';
import { GitHubDevelopersPage } from '@/pages/GitHubDevelopersPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { ProjectWorkspacePage } from '@/pages/ProjectWorkspacePage';
import { MessagesPage } from '@/pages/MessagesPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { CommunityRepositoriesPage } from '@/pages/CommunityRepositoriesPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/**
 * Intercepts OAuth code or error if redirected to root or any path other than /auth/callback
 */
function OAuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // If already on /auth/callback, let AuthCallbackPage handle it
    if (location.pathname.endsWith('/auth/callback')) return;

    const searchParams = new URLSearchParams(location.search);
    const hasCode = searchParams.has('code');
    const hasError = searchParams.has('error') || searchParams.has('error_description');
    const hasHashToken = location.hash.includes('access_token');

    if (hasCode || hasError || hasHashToken) {
      console.log('🔄 OAuth authorization parameter detected outside callback route, routing to /auth/callback');
      navigate(`/auth/callback${location.search}${location.hash}`, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <OAuthRedirectHandler />
                <Routes>
                  {/* Public Authentication Route */}
                  <Route
                    path="/auth"
                    element={
                      <PublicOnlyRoute>
                        <AuthPage />
                      </PublicOnlyRoute>
                    }
                  />
                  {/* OAuth PKCE Callback Route */}
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />

                  {/* Onboarding Wizard Route */}
                  <Route
                    path="/onboarding"
                    element={
                      <ProtectedRoute>
                        <OnboardingPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Application Routes inside AppLayout */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/developers" element={<DiscoveryPage />} />
                    <Route path="/github-developers" element={<GitHubDevelopersPage />} />
                    <Route path="/profile/me" element={<ProfilePage />} />
                    <Route path="/profile/edit" element={<EditProfilePage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/my-projects" element={<ProjectsPage defaultFilter="my-projects" />} />
                    <Route path="/saved-projects" element={<ProjectsPage defaultFilter="saved" />} />
                    <Route path="/projects/new" element={<CreateProjectPage />} />
                    <Route path="/projects/:id" element={<ProjectWorkspacePage />} />
                    <Route path="/repositories" element={<CommunityRepositoriesPage />} />
                    <Route path="/teams" element={<TeamsPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                  </Route>

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
