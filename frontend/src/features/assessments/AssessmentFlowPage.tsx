import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { sportsApi } from '@/api/sports';
import { sessionsApi } from '@/api/assessments';
import { useAssessmentStore } from '@/store/assessmentStore';
import { AssessmentType } from '@/types/assessment';
import { PlayerListItem } from '@/types/player';
import { formatAssessmentType } from '@/lib/utils';
import { ClipboardList, User, Calendar, Trophy, Users, UserPlus, X, AlertCircle } from 'lucide-react';

// Import assessment input components
import {
  OnBaseUInput,
  TPIPowerInput,
  SprintInput,
  KAMSInput,
  AssessmentReview,
  GroupAssessmentWrapper,
  GroupAssessmentReview,
} from './components';

export function AssessmentFlowPage() {
  const [searchParams] = useSearchParams();
  const preselectedPlayerId = searchParams.get('player');

  // Mode selection
  const [assessmentMode, setAssessmentMode] = useState<'single' | 'group'>('single');

  // Single mode state
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(preselectedPlayerId);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Group mode state
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerListItem[]>([]);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [isStartingGroup, setIsStartingGroup] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    startAssessment,
    startGroupAssessment,
    currentStep,
    currentSession,
    mode,
  } = useAssessmentStore();

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

  // Filter players for group selection (exclude already selected)
  const availablePlayersForGroup = useMemo(() => {
    if (!players) return [];
    const selectedIds = new Set(selectedPlayers.map(p => p.id));
    return players.filter(p =>
      !selectedIds.has(p.id) &&
      (playerSearchQuery === '' ||
        p.full_name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
        p.player_code.toLowerCase().includes(playerSearchQuery.toLowerCase()))
    );
  }, [players, selectedPlayers, playerSearchQuery]);

  // Reset dependent selections when sport changes
  const handleSportChange = (sportId: number | null) => {
    setSelectedSportId(sportId);
    setSelectedPlayerId(null);
    setSelectedType(null);
    setSelectedPlayers([]);
    setPlayerSearchQuery('');
    setError(null);
  };

  // Extract error message from Axios error
  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as { response?: { data?: { detail?: string; message?: string } } }).response;
      if (response?.data?.detail) {
        return response.data.detail;
      }
      if (response?.data?.message) {
        return response.data.message;
      }
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'An unexpected error occurred';
  };

  // Single athlete assessment start
  const handleStartAssessment = async () => {
    if (!selectedPlayerId || !selectedType) return;

    setIsStarting(true);
    setError(null);

    try {
      const session = await sessionsApi.create({
        player_id: selectedPlayerId,
        assessment_type: selectedType,
        assessment_date: assessmentDate,
      });

      startAssessment(session);
    } catch (err) {
      console.error('Failed to create session:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsStarting(false);
    }
  };

  // Group assessment start
  const handleStartGroupAssessment = async () => {
    if (selectedPlayers.length === 0 || !selectedType) return;

    setIsStartingGroup(true);
    setError(null);

    try {
      // Create sessions for all selected players
      const sessions = await Promise.all(
        selectedPlayers.map(player =>
          sessionsApi.create({
            player_id: player.id,
            assessment_type: selectedType,
            assessment_date: assessmentDate,
          })
        )
      );

      startGroupAssessment(sessions, selectedPlayers);
    } catch (err) {
      console.error('Failed to create group sessions:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsStartingGroup(false);
    }
  };

  // Add player to group selection
  const handleAddPlayerToGroup = (player: PlayerListItem) => {
    setSelectedPlayers(prev => [...prev, player]);
    setPlayerSearchQuery('');
  };

  // Remove player from group selection
  const handleRemovePlayerFromGroup = (playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  // Render the appropriate input component based on assessment type
  const renderAssessmentInput = () => {
    if (!currentSession) return null;

    const inputComponent = (() => {
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
    })();

    // Wrap in group wrapper if in group mode
    if (mode === 'group') {
      return <GroupAssessmentWrapper>{inputComponent}</GroupAssessmentWrapper>;
    }

    return inputComponent;
  };

  // Render review screen based on mode
  const renderReview = () => {
    if (mode === 'group') {
      return <GroupAssessmentReview />;
    }
    return <AssessmentReview />;
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
          ? 'Select a sport, athlete(s), and assessment type to begin'
          : currentStep === 'input'
          ? `Recording ${formatAssessmentType(currentSession?.assessment_type || 'onbaseu')} assessment`
          : 'Assessment completed'
      }
    >
      {currentStep === 'select' && (
        <div className="space-y-6">
          {/* Mode Selection */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setAssessmentMode('single')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
                    assessmentMode === 'single'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Single Athlete</span>
                </button>
                <button
                  onClick={() => setAssessmentMode('group')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
                    assessmentMode === 'group'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Group Assessment</span>
                </button>
              </div>
            </CardContent>
          </Card>

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

            {/* Player Selection - Single Mode */}
            {assessmentMode === 'single' && (
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
            )}

            {/* Player Selection - Group Mode */}
            {assessmentMode === 'group' && (
              <Card className={`lg:col-span-1 ${!selectedSportId ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Select Athletes ({selectedPlayers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Input
                      placeholder="Search athletes..."
                      value={playerSearchQuery}
                      onChange={(e) => setPlayerSearchQuery(e.target.value)}
                      disabled={!selectedSportId}
                      className="pr-8"
                    />
                    {playerSearchQuery && (
                      <button
                        onClick={() => setPlayerSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Selected Players */}
                  {selectedPlayers.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {selectedPlayers.map((player) => (
                        <span
                          key={player.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {player.full_name}
                          <button
                            onClick={() => handleRemovePlayerFromGroup(player.id)}
                            className="hover:text-blue-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Available Players Dropdown */}
                  {selectedSportId && playerSearchQuery && availablePlayersForGroup.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border rounded-md divide-y">
                      {availablePlayersForGroup.slice(0, 10).map((player) => (
                        <button
                          key={player.id}
                          onClick={() => handleAddPlayerToGroup(player)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-sm">{player.full_name}</span>
                          <UserPlus className="h-4 w-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Add All Button */}
                  {selectedSportId && players && players.length > 0 && selectedPlayers.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedPlayers(players)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add All {players.length} Athletes
                    </Button>
                  )}

                  {/* Clear All Button */}
                  {selectedPlayers.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setSelectedPlayers([])}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

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
                      {assessmentMode === 'single' ? 'Athlete: ' : 'Athletes: '}
                      {assessmentMode === 'single'
                        ? selectedPlayerId
                          ? players?.find((p) => p.id === selectedPlayerId)?.full_name
                          : 'Not selected'
                        : selectedPlayers.length > 0
                        ? `${selectedPlayers.length} selected`
                        : 'None selected'}
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

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                {assessmentMode === 'single' ? (
                  <Button
                    onClick={handleStartAssessment}
                    disabled={!selectedPlayerId || !selectedType || isStarting}
                    className="w-full"
                  >
                    {isStarting ? 'Starting...' : 'Start Assessment'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartGroupAssessment}
                    disabled={selectedPlayers.length === 0 || !selectedType || isStartingGroup}
                    className="w-full"
                  >
                    {isStartingGroup ? (
                      'Starting...'
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Start Group Assessment ({selectedPlayers.length})
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentStep === 'input' && renderAssessmentInput()}

      {currentStep === 'review' && renderReview()}
    </PageContainer>
  );
}
