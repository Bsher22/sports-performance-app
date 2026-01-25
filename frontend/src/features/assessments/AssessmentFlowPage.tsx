import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { sessionsApi } from '@/api/assessments';
import { useAssessmentStore } from '@/store/assessmentStore';
import { AssessmentType } from '@/types/assessment';
import { formatAssessmentType } from '@/lib/utils';
import { ClipboardList, User, Calendar } from 'lucide-react';

const ASSESSMENT_TYPES: AssessmentType[] = [
  'onbaseu',
  'pitcher_onbaseu',
  'tpi_power',
  'sprint',
  'kams',
];

export function AssessmentFlowPage() {
  const [searchParams] = useSearchParams();
  const preselectedPlayerId = searchParams.get('player');

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(preselectedPlayerId);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { startAssessment, currentStep } = useAssessmentStore();

  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: () => playersApi.list({ is_active: true }),
  });

  const handleStartAssessment = async () => {
    if (!selectedPlayerId || !selectedType) return;

    try {
      const session = await sessionsApi.create({
        player_id: selectedPlayerId,
        assessment_type: selectedType,
        assessment_date: assessmentDate,
      });

      startAssessment(session);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  if (loadingPlayers) {
    return (
      <PageContainer title="Assessments">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Assessments"
      description="Select a player and assessment type to begin"
    >
      {currentStep === 'select' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Player Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPlayerId || ''}
                onChange={(e) => setSelectedPlayerId(e.target.value || null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Choose a player...</option>
                {players?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.full_name} ({player.team_name || 'No team'})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Assessment Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Assessment Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ASSESSMENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{formatAssessmentType(type)}</p>
                  <p className="text-sm text-gray-500">
                    {type === 'onbaseu' && 'Position player mobility assessment'}
                    {type === 'pitcher_onbaseu' && 'Pitcher-specific mobility assessment'}
                    {type === 'tpi_power' && 'Power and strength metrics'}
                    {type === 'sprint' && 'Speed and agility testing'}
                    {type === 'kams' && 'Kinetic movement analysis'}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Date & Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Assessment Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium">Summary</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    Player:{' '}
                    {selectedPlayerId
                      ? players?.find((p) => p.id === selectedPlayerId)?.full_name
                      : 'Not selected'}
                  </p>
                  <p>
                    Type:{' '}
                    {selectedType
                      ? formatAssessmentType(selectedType)
                      : 'Not selected'}
                  </p>
                  <p>Date: {assessmentDate}</p>
                </div>
              </div>

              <Button
                onClick={handleStartAssessment}
                disabled={!selectedPlayerId || !selectedType}
                className="w-full"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 'input' && (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">Assessment Input</h3>
            <p className="mt-2 text-gray-500">
              Assessment input interface would be displayed here based on the selected type.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Full implementation includes test-by-test input forms.
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
