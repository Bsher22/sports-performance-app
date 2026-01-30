import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/store/assessmentStore';
import { formatAssessmentType } from '@/lib/utils';
import { CheckCircle, Users, BarChart3, RefreshCw, User, ArrowRight } from 'lucide-react';

export function GroupAssessmentReview() {
  const { groupSessions, clearAssessment, selectedPlayers } = useAssessmentStore();

  const completedCount = groupSessions.filter(s => s.isComplete).length;
  const assessmentType = groupSessions[0]?.session.assessment_type;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-800">
                Group Assessment Complete!
              </h2>
              <p className="text-green-600">
                {completedCount} athlete{completedCount !== 1 ? 's' : ''} assessed with{' '}
                {formatAssessmentType(assessmentType || 'onbaseu')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groupSessions.length}</p>
                <p className="text-sm text-muted-foreground">Total Athletes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assessmentType ? formatAssessmentType(assessmentType) : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Assessment Type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Athletes Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Assessed Athletes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {groupSessions.map((session) => (
              <div
                key={session.playerId}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    session.isComplete ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {session.isComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{session.playerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.session.assessment_date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.isComplete
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {session.isComplete ? 'Complete' : 'Incomplete'}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/players/${session.playerId}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={clearAssessment}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Start New Assessment
        </Button>
        {selectedPlayers.length > 0 && selectedPlayers[0]?.sport_id && (
          <Button asChild>
            <Link to={`/analysis/team/${selectedPlayers[0].sport_id}`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Team Analysis
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
