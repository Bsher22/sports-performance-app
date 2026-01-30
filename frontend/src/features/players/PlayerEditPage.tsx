import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { teamsApi } from '@/api/teams';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { PlayerUpdate } from '@/types/player';

export function PlayerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<PlayerUpdate & { first_name: string; last_name: string }>({
    first_name: '',
    last_name: '',
    team_id: null,
    sport_id: null,
    graduation_year: null,
    date_of_birth: null,
    is_pitcher: false,
    is_position_player: true,
    bats: null,
    throws: null,
    height_inches: null,
    weight_lbs: null,
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null);

  const { data: player, isLoading: loadingPlayer } = useQuery({
    queryKey: ['player', id],
    queryFn: () => playersApi.get(id!),
    enabled: !isNew && !!id,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.list(),
  });

  useEffect(() => {
    if (player) {
      setFormData({
        first_name: player.first_name,
        last_name: player.last_name,
        team_id: player.team_id,
        sport_id: player.sport_id,
        graduation_year: player.graduation_year,
        date_of_birth: player.date_of_birth,
        is_pitcher: player.is_pitcher,
        is_position_player: player.is_position_player,
        bats: player.bats,
        throws: player.throws,
        height_inches: player.height_inches,
        weight_lbs: player.weight_lbs,
        is_active: player.is_active,
      });
    }
  }, [player]);

  const createMutation = useMutation({
    mutationFn: (data: PlayerUpdate & { first_name: string; last_name: string }) =>
      playersApi.create(data),
    onSuccess: (newPlayer) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      navigate(`/players/${newPlayer.id}`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create player');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PlayerUpdate) => playersApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['player', id] });
      navigate(`/players/${id}`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update player');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => playersApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      navigate('/players');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to delete player');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.first_name || !formData.last_name) {
      setError('First name and last name are required');
      return;
    }

    if (isNew) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isNew && loadingPlayer) {
    return (
      <PageContainer title="Loading...">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <PageContainer
      title={isNew ? 'Add New Player' : `Edit ${player?.full_name || 'Player'}`}
      actions={
        <Button variant="outline" asChild>
          <Link to={isNew ? '/players' : `/players/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.team_id || ''}
                  onChange={(e) => handleChange('team_id', e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">No Team</option>
                  {teams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <Input
                  type="number"
                  value={formData.graduation_year || ''}
                  onChange={(e) => handleChange('graduation_year', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 2025"
                  min={2000}
                  max={2050}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleChange('date_of_birth', e.target.value || null)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active Player
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Player Details */}
          <Card>
            <CardHeader>
              <CardTitle>Player Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_pitcher}
                      onChange={(e) => handleChange('is_pitcher', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Pitcher</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_position_player}
                      onChange={(e) => handleChange('is_position_player', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Position Player</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bats
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.bats || ''}
                    onChange={(e) => handleChange('bats', e.target.value || null)}
                  >
                    <option value="">Not specified</option>
                    <option value="R">Right</option>
                    <option value="L">Left</option>
                    <option value="S">Switch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Throws
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.throws || ''}
                    onChange={(e) => handleChange('throws', e.target.value || null)}
                  >
                    <option value="">Not specified</option>
                    <option value="R">Right</option>
                    <option value="L">Left</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <Input
                    type="number"
                    value={formData.height_inches || ''}
                    onChange={(e) => handleChange('height_inches', e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 72"
                    min={48}
                    max={96}
                  />
                  {formData.height_inches && (
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.floor(formData.height_inches / 12)}'{formData.height_inches % 12}"
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs)
                  </label>
                  <Input
                    type="number"
                    value={formData.weight_lbs || ''}
                    onChange={(e) => handleChange('weight_lbs', e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 180"
                    min={80}
                    max={400}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <div>
            {!isNew && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Player'}
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : isNew ? 'Create Player' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
