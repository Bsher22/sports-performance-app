import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PlayersListPage } from '@/features/players/PlayersListPage';
import { PlayerDetailPage } from '@/features/players/PlayerDetailPage';
import { PlayerEditPage } from '@/features/players/PlayerEditPage';
import { TeamsListPage } from '@/features/teams/TeamsListPage';
import { TeamDetailPage } from '@/features/teams/TeamDetailPage';
import { TeamEditPage } from '@/features/teams/TeamEditPage';
import { AssessmentFlowPage } from '@/features/assessments/AssessmentFlowPage';
import { PlayerProgressPage } from '@/features/analysis/PlayerProgressPage';
import { PlayerComparisonPage } from '@/features/analysis/PlayerComparisonPage';
import { TeamOverviewPage } from '@/features/analysis/TeamOverviewPage';
import { SportsSettingsPage } from '@/features/settings/SportsSettingsPage';
import { useEffect } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, fetchUser, user } = useAuthStore();

  useEffect(() => {
    if (accessToken && !user) {
      fetchUser();
    }
  }, [accessToken, user, fetchUser]);

  if (!isAuthenticated && !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Players */}
          <Route path="players" element={<PlayersListPage />} />
          <Route path="players/new" element={<PlayerEditPage />} />
          <Route path="players/:id" element={<PlayerDetailPage />} />
          <Route path="players/:id/edit" element={<PlayerEditPage />} />

          {/* Teams */}
          <Route path="teams" element={<TeamsListPage />} />
          <Route path="teams/new" element={<TeamEditPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="teams/:id/edit" element={<TeamEditPage />} />

          {/* Assessments */}
          <Route path="assessments" element={<AssessmentFlowPage />} />
          <Route path="assessments/:type" element={<AssessmentFlowPage />} />

          {/* Analysis */}
          <Route path="analysis/player/:id" element={<PlayerProgressPage />} />
          <Route path="analysis/compare" element={<PlayerComparisonPage />} />
          <Route path="analysis/team/:id" element={<TeamOverviewPage />} />

          {/* Settings (Admin) */}
          <Route path="settings/sports" element={<SportsSettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// Force rebuild Fri, Jan 30, 2026 10:48:10 AM
