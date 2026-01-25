import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { sportsApi } from '@/api/sports';
import { Sport, SportListItem } from '@/types/sport';
import { AssessmentType } from '@/types/assessment';
import { formatAssessmentType } from '@/lib/utils';
import { Trophy, Pencil, X, Check, Plus } from 'lucide-react';

const ALL_ASSESSMENT_TYPES: AssessmentType[] = [
  'onbaseu',
  'pitcher_onbaseu',
  'tpi_power',
  'sprint',
  'kams',
];

interface EditingSport {
  id: number;
  name: string;
  code: string;
  description: string;
  available_assessments: AssessmentType[];
}

export function SportsSettingsPage() {
  const queryClient = useQueryClient();
  const [editingSport, setEditingSport] = useState<EditingSport | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSport, setNewSport] = useState<Omit<EditingSport, 'id'>>({
    name: '',
    code: '',
    description: '',
    available_assessments: [],
  });

  const { data: sports, isLoading } = useQuery({
    queryKey: ['sports', { include_inactive: true }],
    queryFn: () => sportsApi.list(true),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sport> }) =>
      sportsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
      setEditingSport(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<EditingSport, 'id'>) =>
      sportsApi.create({
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        available_assessments: data.available_assessments,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
      setIsAddingNew(false);
      setNewSport({
        name: '',
        code: '',
        description: '',
        available_assessments: [],
      });
    },
  });

  const handleEdit = (sport: SportListItem) => {
    setEditingSport({
      id: sport.id,
      name: sport.name,
      code: sport.code,
      description: '',
      available_assessments: sport.available_assessments as AssessmentType[],
    });
  };

  const handleSave = () => {
    if (!editingSport) return;
    updateMutation.mutate({
      id: editingSport.id,
      data: {
        name: editingSport.name,
        available_assessments: editingSport.available_assessments,
      },
    });
  };

  const handleCreateSport = () => {
    if (!newSport.name || !newSport.code) return;
    createMutation.mutate(newSport);
  };

  const toggleAssessment = (type: AssessmentType, isEditing: boolean) => {
    if (isEditing && editingSport) {
      const current = editingSport.available_assessments;
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      setEditingSport({ ...editingSport, available_assessments: updated });
    } else if (!isEditing) {
      const current = newSport.available_assessments;
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      setNewSport({ ...newSport, available_assessments: updated });
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Settings">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Sports Settings"
      description="Manage sports and their available assessments"
      actions={
        !isAddingNew && (
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sport
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {/* Add New Sport Form */}
        {isAddingNew && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Sport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sport Name
                  </label>
                  <Input
                    value={newSport.name}
                    onChange={(e) =>
                      setNewSport({ ...newSport, name: e.target.value })
                    }
                    placeholder="e.g., Men's Golf"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code
                  </label>
                  <Input
                    value={newSport.code}
                    onChange={(e) =>
                      setNewSport({
                        ...newSport,
                        code: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                      })
                    }
                    placeholder="e.g., mens_golf"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={newSport.description}
                    onChange={(e) =>
                      setNewSport({ ...newSport, description: e.target.value })
                    }
                    placeholder="e.g., RIT Men's Golf - Division III"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Assessments
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ASSESSMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleAssessment(type, false)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        newSport.available_assessments.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {formatAssessmentType(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCreateSport}
                  disabled={
                    !newSport.name ||
                    !newSport.code ||
                    createMutation.isPending
                  }
                >
                  {createMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Create Sport
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewSport({
                      name: '',
                      code: '',
                      description: '',
                      available_assessments: [],
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sports List */}
        <div className="grid gap-4">
          {sports?.map((sport) => (
            <Card
              key={sport.id}
              className={editingSport?.id === sport.id ? 'ring-2 ring-blue-500' : ''}
            >
              <CardContent className="py-4">
                {editingSport?.id === sport.id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Trophy className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <Input
                        value={editingSport.name}
                        onChange={(e) =>
                          setEditingSport({
                            ...editingSport,
                            name: e.target.value,
                          })
                        }
                        className="max-w-xs"
                      />
                      <span className="text-sm text-gray-500">
                        Code: {sport.code}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Assessments
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ALL_ASSESSMENT_TYPES.map((type) => (
                          <button
                            key={type}
                            onClick={() => toggleAssessment(type, true)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              editingSport.available_assessments.includes(type)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {formatAssessmentType(type)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSport(null)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Trophy className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {sport.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Code: {sport.code}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {sport.available_assessments.length > 0 ? (
                            sport.available_assessments.map((type) => (
                              <span
                                key={type}
                                className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {formatAssessmentType(type)}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              No assessments configured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(sport)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {sports?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No Sports Configured
              </h3>
              <p className="mt-2 text-gray-500">
                Add sports to configure which assessments are available for each.
              </p>
              <Button className="mt-4" onClick={() => setIsAddingNew(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Sport
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
