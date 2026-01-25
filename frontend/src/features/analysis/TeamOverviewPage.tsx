import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { teamsApi } from '@/api/teams';
import { analysisApi } from '@/api/analysis';
import { formatAssessmentType, getColorBgClass } from '@/lib/utils';
import { AssessmentType } from '@/types/assessment';
import { ArrowLeft, Trophy, Users, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ASSESSMENT_TYPES: AssessmentType[] = [
  'onbaseu',
  'pitcher_onbaseu',
  'tpi_power',
  'sprint',
  'kams',
];

export function TeamOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);
  const [selectedType, setSelectedType] = useState<AssessmentType>('onbaseu');

  const { data: team, isLoading: loadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsApi.get(teamId),
    enabled: !!teamId,
  });

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ['team-overview', teamId],
    queryFn: () => analysisApi.getTeamOverview(teamId),
    enabled: !!teamId,
  });

  const { data: rankings, isLoading: loadingRankings } = useQuery({
    queryKey: ['team-rankings', teamId, selectedType],
    queryFn: () => analysisApi.getTeamRankings(teamId, selectedType),
    enabled: !!teamId,
  });

  if (loadingTeam || loadingOverview) {
    return (
      <PageContainer title="Team Analysis">
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

  const averagesData = overview
    ? Object.entries(overview.team_averages)
        .filter(([_, data]) => data?.average !== undefined)
        .map(([type, data]) => ({
          name: formatAssessmentType(type as AssessmentType).split(' ')[0],
          average: data.average,
          playerCount: data.player_count,
        }))
    : [];

  return (
    <PageContainer
      title={`${team.name} - Analysis`}
      description="Team performance overview and rankings"
      actions={
        <Button variant="outline" asChild>
          <Link to={`/teams/${teamId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Team Stats */}
        {overview && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="mx-auto h-8 w-8 text-blue-600" />
                <p className="mt-2 text-2xl font-bold">{overview.player_count}</p>
                <p className="text-sm text-gray-500">Total Players</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-green-600" />
                <p className="mt-2 text-2xl font-bold">{overview.pitchers}</p>
                <p className="text-sm text-gray-500">Pitchers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="mx-auto h-8 w-8 text-purple-600" />
                <p className="mt-2 text-2xl font-bold">{overview.position_players}</p>
                <p className="text-sm text-gray-500">Position Players</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-orange-600" />
                <p className="mt-2 text-2xl font-bold">
                  {Object.values(overview.assessment_counts).reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Assessments</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Averages Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Team Averages by Assessment Type</CardTitle>
          </CardHeader>
          <CardContent>
            {averagesData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={averagesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Average']}
                    />
                    <Bar dataKey="average" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No assessment data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Player Rankings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Player Rankings</CardTitle>
              <div className="flex gap-2">
                {ASSESSMENT_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    onClick={() => setSelectedType(type)}
                    size="sm"
                  >
                    {formatAssessmentType(type).split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRankings ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : rankings && rankings.rankings.length > 0 ? (
              <div className="space-y-2">
                {rankings.rankings.map((player) => (
                  <Link
                    key={player.player_id}
                    to={`/players/${player.player_id}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          player.rank === 1
                            ? 'bg-yellow-100 text-yellow-700'
                            : player.rank === 2
                            ? 'bg-gray-200 text-gray-700'
                            : player.rank === 3
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {player.rank}
                      </span>
                      <div>
                        <p className="font-medium">{player.player_name}</p>
                        <p className="text-xs text-gray-500">
                          Last assessed: {player.assessment_date}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold">
                      {player.overall_score.toFixed(1)}%
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No rankings available for {formatAssessmentType(selectedType)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
