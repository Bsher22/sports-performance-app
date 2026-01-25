import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { analysisApi } from '@/api/analysis';
import { formatAssessmentType, getColorBgClass } from '@/lib/utils';
import { AssessmentType } from '@/types/assessment';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart,
  Line,
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

export function PlayerProgressPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedType, setSelectedType] = useState<AssessmentType>('onbaseu');

  const { data: player, isLoading: loadingPlayer } = useQuery({
    queryKey: ['player', id],
    queryFn: () => playersApi.get(id!),
    enabled: !!id,
  });

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['player-summary', id],
    queryFn: () => analysisApi.getPlayerSummary(id!),
    enabled: !!id,
  });

  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ['player-progress', id, selectedType],
    queryFn: () => analysisApi.getPlayerProgress(id!, selectedType),
    enabled: !!id,
  });

  if (loadingPlayer || loadingSummary) {
    return (
      <PageContainer title="Player Analysis">
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

  const TrendIcon = progress?.trend.direction === 'improving'
    ? TrendingUp
    : progress?.trend.direction === 'declining'
    ? TrendingDown
    : Minus;

  const trendColor = progress?.trend.direction === 'improving'
    ? 'text-green-600'
    : progress?.trend.direction === 'declining'
    ? 'text-red-600'
    : 'text-gray-500';

  return (
    <PageContainer
      title={`${player.full_name} - Analysis`}
      description="Track progress and performance over time"
      actions={
        <Button variant="outline" asChild>
          <Link to={`/players/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Player
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Assessment Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ASSESSMENT_TYPES.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              onClick={() => setSelectedType(type)}
              size="sm"
            >
              {formatAssessmentType(type)}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {ASSESSMENT_TYPES.map((type) => {
              const assessmentData = summary.assessments[type];
              return (
                <Card key={type} className={selectedType === type ? 'ring-2 ring-blue-500' : ''}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-600">
                      {formatAssessmentType(type)}
                    </p>
                    {assessmentData ? (
                      <>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {assessmentData.overall_score.toFixed(1)}%
                          </span>
                          <span
                            className={`h-3 w-3 rounded-full ${getColorBgClass(
                              assessmentData.color
                            )}`}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Last: {assessmentData.latest_date}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400">No data</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{formatAssessmentType(selectedType)} Progress</span>
              {progress && progress.trend && (
                <div className={`flex items-center gap-2 ${trendColor}`}>
                  <TrendIcon className="h-5 w-5" />
                  <span className="text-sm font-normal">
                    {progress.trend.direction === 'improving'
                      ? `+${progress.trend.change.toFixed(1)}%`
                      : progress.trend.direction === 'declining'
                      ? `${progress.trend.change.toFixed(1)}%`
                      : 'Stable'}
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProgress ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : progress && progress.progress_data.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress.progress_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="overall_score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-gray-500">
                No progress data available for this assessment type
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
