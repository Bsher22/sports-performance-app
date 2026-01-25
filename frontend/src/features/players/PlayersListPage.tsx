import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { playersApi } from '@/api/players';
import { teamsApi } from '@/api/teams';
import { Plus, Search, Users } from 'lucide-react';

export function PlayersListPage() {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<number | undefined>();

  const { data: players, isLoading } = useQuery({
    queryKey: ['players', search, teamFilter],
    queryFn: () => playersApi.list({ search, team_id: teamFilter }),
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.list(),
  });

  return (
    <PageContainer
      title="Players"
      description="Manage your players and their assessments"
      actions={
        <Button asChild>
          <Link to="/players/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Player
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <Card>
        <CardContent className="flex gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={teamFilter || ''}
            onChange={(e) => setTeamFilter(e.target.value ? Number(e.target.value) : undefined)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Teams</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Players List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : players && players.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{player.full_name}</h3>
                      <p className="text-sm text-gray-500">
                        {player.team_name || 'No team'}
                      </p>
                      <p className="text-xs text-gray-400">{player.player_code}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
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
                    </div>
                  </div>
                  {player.graduation_year && (
                    <p className="mt-2 text-xs text-gray-500">
                      Class of {player.graduation_year}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No players found</p>
            <Button asChild className="mt-4">
              <Link to="/players/new">Add First Player</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
