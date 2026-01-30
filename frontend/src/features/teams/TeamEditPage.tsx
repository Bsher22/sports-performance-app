import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { teamsApi } from '@/api/teams';
import { sportsApi } from '@/api/sports';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { TeamCreate, TeamUpdate } from '@/types/team';

export function TeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<TeamCreate>({
    name: '',
    organization: 'RIT Athletics',
    sport: '',
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null);

  const { data: team, isLoading: loadingTeam } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.get(Number(id)),
    enabled: !isNew && !!id,
  });

  const { data: sports } = useQuery({
    queryKey: ['sports'],
    queryFn: () => sportsApi.list(),
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        organization: team.organization,
        sport: team.sport,
        is_active: team.is_active,
      });
    }
  }, [team]);

  const createMutation = useMutation({
    mutationFn: (data: TeamCreate) => teamsApi.create(data),
    onSuccess: (newTeam) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigate(`/teams/${newTeam.id}`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create team');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TeamUpdate) => teamsApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', id] });
      navigate(`/teams/${id}`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update team');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => teamsApi.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigate('/teams');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to delete team');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      setError('Team name is required');
      return;
    }

    if (!formData.sport) {
      setError('Sport is required');
      return;
    }

    if (isNew) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isNew && loadingTeam) {
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
      title={isNew ? 'Create New Team' : `Edit ${team?.name || 'Team'}`}
      actions={
        <Button variant="outline" asChild>
          <Link to={isNew ? '/teams' : `/teams/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Varsity Baseball 2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport *
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.sport || ''}
                onChange={(e) => handleChange('sport', e.target.value)}
                required
              >
                <option value="">Select a Sport</option>
                {sports?.map((sport) => (
                  <option key={sport.id} value={sport.code}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <Input
                value={formData.organization || ''}
                onChange={(e) => handleChange('organization', e.target.value || null)}
                placeholder="e.g. RIT Athletics"
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
                Active Team
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 max-w-2xl">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-between max-w-2xl">
          <div>
            {!isNew && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Team'}
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : isNew ? 'Create Team' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
