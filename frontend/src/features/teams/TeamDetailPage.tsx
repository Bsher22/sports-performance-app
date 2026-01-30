import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { teamsApi } from '@/api/teams';
import { ArrowLeft, BarChart3, Users, Pencil } from 'lucide-react';

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);

  const { data: team, isLoading: loadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsApi.get(teamId),
    enabled: !!teamId,
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['team-stats', teamId],
    queryFn: () => teamsApi.getStats(teamId),
    enabled: !!teamId,
  });

  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ['team-players', teamId],
    queryFn: () => teamsApi.getPlayers(teamId),
    enabled: !!teamId,
  });

  if (loadingTeam || loadingStats || loadingPlayers) {
    return (
      <PageContainer title="Team Details">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (!team) {
    return (
      <PageContainer title="Team Not Found">
        <p>The requested team could not be found.</p>
        <Button asChild className="mt-4">
          <Link to="/teams">Back to Teams</Link>
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={team.name}
      description={team.organization || undefined}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/teams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/teams/${teamId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/analysis/team/${teamId}`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Team Analysis
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Team Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {stats?.active_players || 0}
                </p>
                <p className="text-sm text-blue-600">Active Players</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">
                  {stats?.assessment_count || 0}
                </p>
                <p className="text-sm text-green-600">Assessments</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">
                  {stats?.pitchers || 0}
                </p>
                <p className="text-sm text-purple-600">Pitchers</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4 text-center">
                <p className="text-2xl font-bold text-orange-700">
                  {stats?.position_players || 0}
                </p>
                <p className="text-sm text-orange-600">Position Players</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Players */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Roster</CardTitle>
          </CardHeader>
          <CardContent>
            {players && players.length > 0 ? (
              <div className="space-y-2">
                {players.map((player) => (
                  <Link
                    key={player.id}
                    to={`/players/${player.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{player.full_name}</p>
                      <p className="text-sm text-gray-500">{player.player_code}</p>
                    </div>
                    <div className="flex gap-2">
                      {player.is_pitcher && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          Pitcher
                        </span>
                      )}
                      {player.is_position_player && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Position
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No players on this team</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
