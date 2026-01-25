import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { teamsApi } from '@/api/teams';
import { Plus, Building2, Users } from 'lucide-react';

export function TeamsListPage() {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.list(),
  });

  return (
    <PageContainer
      title="Teams"
      description="Manage your teams"
      actions={
        <Button asChild>
          <Link to="/teams/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : teams && teams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} to={`/teams/${team.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        {team.organization || 'No organization'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {team.player_count || 0} players
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      team.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {team.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No teams found</p>
            <Button asChild className="mt-4">
              <Link to="/teams/new">Add First Team</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
