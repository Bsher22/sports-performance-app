import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { sportsApi } from '@/api/sports';
import { sessionsApi } from '@/api/assessments';
import { useAssessmentStore } from '@/store/assessmentStore';
import { AssessmentType } from '@/types/assessment';
import { formatAssessmentType } from '@/lib/utils';
import { ClipboardList, User, Calendar, Trophy } from 'lucide-react';

// Import assessment input components
import {
  OnBaseUInput,
  TPIPowerInput,
  SprintInput,
  KAMSInput,
  AssessmentReview,
} from './components';

export function AssessmentFlowPage() {
  const [searchParams] = useSearchParams();
  const preselectedPlayerId = searchParams.get('player');

  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(preselectedPlayerId);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { startAssessment, currentStep, currentSession } = useAssessmentStore();

  // Fetch all sports
  const { data: sports, isLoading: loadingSports } = useQuery({
    queryKey: ['sports'],
    queryFn: () => sportsApi.list(),
  });

  // Fetch players filtered by selected sport
  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ['players', { sport_id: selectedSportId, is_active: true }],
    queryFn: () => playersApi.list({ sport_id: selectedSportId ?? undefined, is_active: true }),
    enabled: selectedSportId !== null,
  });

  // Get available assessment types for the selected sport
  const availableAssessmentTypes = useMemo(() => {
    if (!selectedSportId || !sports) return [];
    const selectedSport = sports.find((s) => s.id === selectedSportId);
    return selectedSport?.available_assessments ?? [];
  }, [selectedSportId, sports]);

  // Get the selected sport name for display
  const selectedSportName = useMemo(() => {
    if (!selectedSportId || !sports) return null;
    return sports.find((s) => s.id === selectedSportId)?.name ?? null;
  }, [selectedSportId, sports]);

  // Reset dependent selections when sport changes
  const handleSportChange = (sportId: number | null) => {
    setSelectedSportId(sportId);
    setSelectedPlayerId(null);
    setSelectedType(null);
  };

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

  // Render the appropriate input component based on assessment type
  const renderAssessmentInput = () => {
    if (!currentSession) return null;

    switch (currentSession.assessment_type) {
      case 'onbaseu':
        return <OnBaseUInput isPitcher={false} />;
      case 'pitcher_onbaseu':
        return <OnBaseUInput isPitcher={true} />;
      case 'tpi_power':
        return <TPIPowerInput />;
      case 'sprint':
        return <SprintInput />;
      case 'kams':
        return <KAMSInput />;
      default:
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Unknown assessment type: {currentSession.assessment_type}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loadingSports) {
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
      description={
        currentStep === 'select'
          ? 'Select a sport, athlete, and assessment type to begin'
          : currentStep === 'input'
          ? `Recording ${formatAssessmentType(currentSession?.assessment_type || 'onbaseu')} assessment`
          : 'Assessment completed'
      }
    >
      {currentStep === 'select' && (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {/* Sport Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Select Sport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedSportId ?? ''}
                onChange={(e) => handleSportChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Choose a sport...</option>
                {sports?.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
              {selectedSportId && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {availableAssessmentTypes.length} assessment type{availableAssessmentTypes.length !== 1 ? 's' : ''} available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Player Selection */}
          <Card className={!selectedSportId ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Athlete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPlayerId ?? ''}
                onChange={(e) => setSelectedPlayerId(e.target.value || null)}
                disabled={!selectedSportId}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {!selectedSportId
                    ? 'Select a sport first...'
                    : loadingPlayers
                    ? 'Loading athletes...'
                    : 'Choose an athlete...'}
                </option>
                {players?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.full_name} ({player.team_name || 'No team'})
                  </option>
                ))}
              </select>
              {selectedSportId && !loadingPlayers && players && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {players.length} athlete{players.length !== 1 ? 's' : ''} in {selectedSportName}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Assessment Type Selection */}
          <Card className={!selectedSportId ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Assessment Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!selectedSportId ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Select a sport to see available assessments
                </p>
              ) : availableAssessmentTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No assessments configured for this sport
                </p>
              ) : (
                availableAssessmentTypes.map((type) => (
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
                ))
              )}
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
                    Sport:{' '}
                    {selectedSportName || 'Not selected'}
                  </p>
                  <p>
                    Athlete:{' '}
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

      {currentStep === 'input' && renderAssessmentInput()}

      {currentStep === 'review' && <AssessmentReview />}
    </PageContainer>
  );
}
