import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { teamsApi } from '@/api/teams';
import { Users, Building2, ClipboardList, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: () => playersApi.list({ limit: 5 }),
  });

  const { data: teams, isLoading: loadingTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.list(),
  });

  const totalPlayers = players?.length || 0;
  const totalTeams = teams?.length || 0;

  if (loadingPlayers || loadingTeams) {
    return (
      <PageContainer title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" description="Welcome to the Sports Performance App">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Players
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <Link to="/players" className="text-sm text-blue-600 hover:underline">
              View all players
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Teams
            </CardTitle>
            <Building2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <Link to="/teams" className="text-sm text-blue-600 hover:underline">
              View all teams
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Assessments
            </CardTitle>
            <ClipboardList className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Types</div>
            <Link to="/assessments" className="text-sm text-blue-600 hover:underline">
              Start assessment
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Analysis
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Reports</div>
            <Link to="/analysis/compare" className="text-sm text-blue-600 hover:underline">
              Compare players
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Players */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Players</CardTitle>
        </CardHeader>
        <CardContent>
          {players && players.length > 0 ? (
            <div className="space-y-4">
              {players.map((player) => (
                <Link
                  key={player.id}
                  to={`/players/${player.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{player.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {player.team_name || 'No team'} | {player.player_code}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {player.is_pitcher && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        Pitcher
                      </span>
                    )}
                    {player.is_position_player && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Position
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No players found. Add your first player to get started.</p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
