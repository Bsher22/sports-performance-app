import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAssessmentStore } from '@/store/assessmentStore';
import { onbaseUApi, pitcherOnbaseUApi } from '@/api/assessments/onbaseu';
import { tpiPowerApi } from '@/api/assessments/tpi-power';
import { sprintApi } from '@/api/assessments/sprint';
import { kamsApi } from '@/api/assessments/kams';
import { formatAssessmentType } from '@/lib/utils';
import { CheckCircle, BarChart3, User, ClipboardList, ArrowRight, RefreshCw } from 'lucide-react';

export function AssessmentReview() {
  const { currentSession, clearAssessment } = useAssessmentStore();

  // Fetch results based on assessment type
  const { data: onbaseUResults, isLoading: loadingOnbaseU } = useQuery({
    queryKey: ['onbaseu-results', currentSession?.id],
    queryFn: () => onbaseUApi.getResults(currentSession!.id),
    enabled: !!currentSession && currentSession.assessment_type === 'onbaseu',
  });

  const { data: pitcherOnbaseUResults, isLoading: loadingPitcherOnbaseU } = useQuery({
    queryKey: ['pitcher-onbaseu-results', currentSession?.id],
    queryFn: () => pitcherOnbaseUApi.getResults(currentSession!.id),
    enabled: !!currentSession && currentSession.assessment_type === 'pitcher_onbaseu',
  });

  const { data: tpiPowerResults, isLoading: loadingTpiPower } = useQuery({
    queryKey: ['tpi-power-results', currentSession?.id],
    queryFn: () => tpiPowerApi.getResults(currentSession!.id),
    enabled: !!currentSession && currentSession.assessment_type === 'tpi_power',
  });

  const { data: sprintResults, isLoading: loadingSprint } = useQuery({
    queryKey: ['sprint-results', currentSession?.id],
    queryFn: () => sprintApi.getResults(currentSession!.id),
    enabled: !!currentSession && currentSession.assessment_type === 'sprint',
  });

  const { data: kamsResults, isLoading: loadingKams } = useQuery({
    queryKey: ['kams-results', currentSession?.id],
    queryFn: () => kamsApi.getResults(currentSession!.id),
    enabled: !!currentSession && currentSession.assessment_type === 'kams',
  });

  const isLoading = loadingOnbaseU || loadingPitcherOnbaseU || loadingTpiPower || loadingSprint || loadingKams;

  const getColorClass = (color: string | null | undefined): string => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getScoreSummary = () => {
    if (currentSession?.assessment_type === 'onbaseu' && onbaseUResults) {
      const total = onbaseUResults.length;
      const green = onbaseUResults.filter(r => r.color === 'green').length;
      const yellow = onbaseUResults.filter(r => r.color === 'yellow').length;
      const red = onbaseUResults.filter(r => r.color === 'red').length;
      return { total, green, yellow, red };
    }
    if (currentSession?.assessment_type === 'pitcher_onbaseu' && pitcherOnbaseUResults) {
      const total = pitcherOnbaseUResults.length;
      const green = pitcherOnbaseUResults.filter(r => r.color === 'green').length;
      const yellow = pitcherOnbaseUResults.filter(r => r.color === 'yellow').length;
      const red = pitcherOnbaseUResults.filter(r => r.color === 'red').length;
      return { total, green, yellow, red };
    }
    return null;
  };

  const scoreSummary = getScoreSummary();

  if (!currentSession) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No assessment session found.</p>
          <Button onClick={clearAssessment} className="mt-4">
            Start New Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

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
              <h2 className="text-xl font-semibold text-green-800">Assessment Complete!</h2>
              <p className="text-green-600">
                {formatAssessmentType(currentSession.assessment_type)} assessment for{' '}
                {currentSession.player_name} has been saved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Athlete</p>
                <p className="font-medium">{currentSession.player_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <ClipboardList className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Assessment Type</p>
                <p className="font-medium">{formatAssessmentType(currentSession.assessment_type)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <BarChart3 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{currentSession.assessment_date}</p>
              </div>
            </div>
          </div>

          {/* Score Summary for OnBaseU */}
          {scoreSummary && (
            <div className="mt-6">
              <h4 className="font-medium mb-4">Results Overview</h4>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-gray-100">
                  <p className="text-3xl font-bold">{scoreSummary.total}</p>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-100">
                  <p className="text-3xl font-bold text-green-700">{scoreSummary.green}</p>
                  <p className="text-sm text-green-600">Pass</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-100">
                  <p className="text-3xl font-bold text-yellow-700">{scoreSummary.yellow}</p>
                  <p className="text-sm text-yellow-600">Neutral</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-100">
                  <p className="text-3xl font-bold text-red-700">{scoreSummary.red}</p>
                  <p className="text-sm text-red-600">Fail</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Results - OnBaseU */}
      {(currentSession.assessment_type === 'onbaseu' && onbaseUResults) && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onbaseUResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorClass(result.color)}`} />
                    <div>
                      <p className="font-medium">{result.test_name}</p>
                      {result.side && (
                        <p className="text-xs text-muted-foreground capitalize">{result.side} side</p>
                      )}
                    </div>
                  </div>
                  <span className="font-medium">{result.result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results - Pitcher OnBaseU */}
      {(currentSession.assessment_type === 'pitcher_onbaseu' && pitcherOnbaseUResults) && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pitcherOnbaseUResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorClass(result.color)}`} />
                    <div>
                      <p className="font-medium">{result.test_name}</p>
                      {result.side && (
                        <p className="text-xs text-muted-foreground capitalize">{result.side} side</p>
                      )}
                    </div>
                  </div>
                  <span className="font-medium">{result.result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results - TPI Power */}
      {(currentSession.assessment_type === 'tpi_power' && tpiPowerResults) && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tpiPowerResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorClass(result.color)}`} />
                    <div>
                      <p className="font-medium">{result.test_name}</p>
                      {result.side && (
                        <p className="text-xs text-muted-foreground capitalize">{result.side} side</p>
                      )}
                    </div>
                  </div>
                  <span className="font-medium">{result.result_value} inches</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results - Sprint */}
      {(currentSession.assessment_type === 'sprint' && sprintResults) && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sprintResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorClass(result.color)}`} />
                    <div>
                      <p className="font-medium">{result.test_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{result.test_category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{result.best_time?.toFixed(2)} sec</p>
                    <p className="text-xs text-muted-foreground">
                      Runs: {result.run_1_time?.toFixed(2) || '-'} / {result.run_2_time?.toFixed(2) || '-'} / {result.run_3_time?.toFixed(2) || '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results - KAMS */}
      {(currentSession.assessment_type === 'kams' && kamsResults) && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kamsResults.map((result, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <h4 className="font-medium capitalize mb-2">{result.test_type}</h4>
                  <div className="grid gap-2 text-sm">
                    {Object.entries(result.measurements).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={clearAssessment}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Start New Assessment
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/players/${currentSession.player_id}`}>
              View Player Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/analysis/player/${currentSession.player_id}`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analysis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
