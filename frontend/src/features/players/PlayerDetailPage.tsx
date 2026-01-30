import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { sessionsApi } from '@/api/assessments';
import { formatDate, formatAssessmentType } from '@/lib/utils';
import { ArrowLeft, ClipboardList, BarChart3, Pencil } from 'lucide-react';

export function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: player, isLoading: loadingPlayer } = useQuery({
    queryKey: ['player', id],
    queryFn: () => playersApi.getWithAssessments(id!),
    enabled: !!id,
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['sessions', id],
    queryFn: () => sessionsApi.list({ player_id: id }),
    enabled: !!id,
  });

  if (loadingPlayer || loadingSessions) {
    return (
      <PageContainer title="Player Details">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (!player) {
    return (
      <PageContainer title="Player Not Found">
        <p>The requested player could not be found.</p>
        <Button asChild className="mt-4">
          <Link to="/players">Back to Players</Link>
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={player.full_name}
      description={player.display_name}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/players">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/players/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/analysis/player/${id}`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analysis
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Player Info */}
        <Card>
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Player Code</p>
              <p className="font-medium">{player.player_code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Team</p>
              <p className="font-medium">{player.team_name || 'No team'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <div className="flex gap-2">
                {player.is_pitcher && (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    Pitcher
                  </span>
                )}
                {player.is_position_player && (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Position Player
                  </span>
                )}
              </div>
            </div>
            {player.graduation_year && (
              <div>
                <p className="text-sm text-gray-500">Graduation Year</p>
                <p className="font-medium">{player.graduation_year}</p>
              </div>
            )}
            {player.bats && (
              <div>
                <p className="text-sm text-gray-500">Bats</p>
                <p className="font-medium">
                  {player.bats === 'R' ? 'Right' : player.bats === 'L' ? 'Left' : 'Switch'}
                </p>
              </div>
            )}
            {player.throws && (
              <div>
                <p className="text-sm text-gray-500">Throws</p>
                <p className="font-medium">
                  {player.throws === 'R' ? 'Right' : 'Left'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assessment History</CardTitle>
            <Button asChild size="sm">
              <Link to={`/assessments?player=${id}`}>
                <ClipboardList className="mr-2 h-4 w-4" />
                New Assessment
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {formatAssessmentType(session.assessment_type)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(session.assessment_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          session.is_complete
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {session.is_complete ? 'Complete' : 'In Progress'}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/assessments/${session.assessment_type}?session=${session.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No assessments yet</p>
                <Button asChild className="mt-4">
                  <Link to={`/assessments?player=${id}`}>Start First Assessment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
