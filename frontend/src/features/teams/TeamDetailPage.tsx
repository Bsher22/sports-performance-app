import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { teamsApi } from '@/api/teams';
import { playersApi } from '@/api/players';
import { ArrowLeft, BarChart3, Users, Pencil, Plus, X, UserMinus } from 'lucide-react';

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

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

  // Get all players for the add modal (excluding those already on the team)
  const { data: allPlayers } = useQuery({
    queryKey: ['players', 'all'],
    queryFn: () => playersApi.list({}),
    enabled: showAddModal,
  });

  const availablePlayers = allPlayers?.filter(
    (p) => !players?.some((tp) => tp.id === p.id)
  ) || [];

  const filteredPlayers = availablePlayers.filter((p) =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.player_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPlayersMutation = useMutation({
    mutationFn: async (playerIds: string[]) => {
      // Update each player to be on this team
      await Promise.all(
        playerIds.map((playerId) =>
          playersApi.update(playerId, { team_id: teamId })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-players', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-stats', teamId] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      setShowAddModal(false);
      setSelectedPlayerIds([]);
      setSearchQuery('');
    },
  });

  const removePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      await playersApi.update(playerId, { team_id: null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-players', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-stats', teamId] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleAddPlayers = () => {
    if (selectedPlayerIds.length > 0) {
      addPlayersMutation.mutate(selectedPlayerIds);
    }
  };

  const handleRemovePlayer = (playerId: string, playerName: string) => {
    if (confirm(`Remove ${playerName} from this team?`)) {
      removePlayerMutation.mutate(playerId);
    }
  };

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team Roster</CardTitle>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Players
            </Button>
          </CardHeader>
          <CardContent>
            {players && players.length > 0 ? (
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                  >
                    <Link
                      to={`/players/${player.id}`}
                      className="flex-1"
                    >
                      <p className="font-medium">{player.full_name}</p>
                      <p className="text-sm text-gray-500">{player.player_code}</p>
                    </Link>
                    <div className="flex items-center gap-2">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePlayer(player.id, player.full_name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No players on this team</p>
                <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Players
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Players Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add Players to {team.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPlayerIds([]);
                  setSearchQuery('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b">
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {filteredPlayers.length > 0 ? (
                <div className="space-y-2">
                  {filteredPlayers.map((player) => (
                    <label
                      key={player.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPlayerIds.includes(player.id)
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlayerIds.includes(player.id)}
                        onChange={() => togglePlayerSelection(player.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{player.full_name}</p>
                        <p className="text-sm text-gray-500">
                          {player.player_code}
                          {player.sport_name && ` • ${player.sport_name}`}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {player.is_pitcher && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                            P
                          </span>
                        )}
                        {player.is_position_player && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                            Pos
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No players match your search' : 'No available players to add'}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-500">
                {selectedPlayerIds.length} player{selectedPlayerIds.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedPlayerIds([]);
                    setSearchQuery('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPlayers}
                  disabled={selectedPlayerIds.length === 0 || addPlayersMutation.isPending}
                >
                  {addPlayersMutation.isPending ? 'Adding...' : 'Add to Team'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
