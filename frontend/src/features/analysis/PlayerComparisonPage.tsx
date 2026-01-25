import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { analysisApi } from '@/api/analysis';
import { formatAssessmentType, getColorBgClass } from '@/lib/utils';
import { AssessmentType } from '@/types/assessment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const ASSESSMENT_TYPES: AssessmentType[] = [
  'onbaseu',
  'pitcher_onbaseu',
  'tpi_power',
  'sprint',
  'kams',
];

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

export function PlayerComparisonPage() {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<AssessmentType>('onbaseu');

  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: () => playersApi.list({ is_active: true }),
  });

  const { data: comparison, isLoading: loadingComparison } = useQuery({
    queryKey: ['player-comparison', selectedPlayerIds, selectedType],
    queryFn: () => analysisApi.comparePlayers(selectedPlayerIds, selectedType),
    enabled: selectedPlayerIds.length >= 2,
  });

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : prev.length < 5
        ? [...prev, playerId]
        : prev
    );
  };

  const chartData = comparison
    ? Object.entries(comparison.comparison_data).map(([_playerId, data]) => ({
        name: data.player_name.split(' ')[0],
        score: data.overall_score,
        color: data.color,
      }))
    : [];

  return (
    <PageContainer
      title="Player Comparison"
      description="Compare performance across multiple players"
    >
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Player Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Players (2-5)</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPlayers ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {players?.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className={`w-full rounded-lg border p-2 text-left text-sm transition-colors ${
                      selectedPlayerIds.includes(player.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{player.full_name}</p>
                    <p className="text-xs text-gray-500">{player.team_name}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Results */}
        <div className="space-y-6 lg:col-span-3">
          {/* Assessment Type Selector */}
          <div className="flex gap-2 flex-wrap">
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

          {selectedPlayerIds.length < 2 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  Select at least 2 players to compare
                </p>
              </CardContent>
            </Card>
          ) : loadingComparison ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ) : comparison ? (
            <>
              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="score">
                          {chartData.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Rankings Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {comparison.rankings.map((ranking, index) => {
                      const playerData =
                        comparison.comparison_data[ranking.player_id];
                      return (
                        <div
                          key={ranking.player_id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                index === 0
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : index === 1
                                  ? 'bg-gray-200 text-gray-700'
                                  : index === 2
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {ranking.rank}
                            </span>
                            <div>
                              <p className="font-medium">
                                {playerData.player_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {playerData.team_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {playerData.overall_score.toFixed(1)}%
                            </span>
                            <span
                              className={`h-3 w-3 rounded-full ${getColorBgClass(
                                playerData.color
                              )}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
