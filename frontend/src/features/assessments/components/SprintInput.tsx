import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { sprintApi } from '@/api/assessments/sprint';
import { sessionsApi } from '@/api/assessments/sessions';
import { useAssessmentStore } from '@/store/assessmentStore';
import { TestDefinition, SprintResultCreate } from '@/types/assessment';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, Timer } from 'lucide-react';
import { TestInstructionsButton } from './TestInstructionsModal';
import { getSprintInstruction } from '../data/sprintInstructions';

// Sprint test definitions based on backend schema
const SPRINT_TESTS: TestDefinition[] = [
  { code: "SPR-01", name: "81 ft Sprint", category: "linear", is_bilateral: false, result_type: "time", unit: "seconds", description: "Straight-line sprint over 81 feet (baseline to baseline)" },
  { code: "SPR-02", name: "5-yard Directional - Left", category: "directional", is_bilateral: false, result_type: "time", unit: "seconds", description: "5-yard directional sprint to the left" },
  { code: "SPR-03", name: "5-yard Directional - Center", category: "directional", is_bilateral: false, result_type: "time", unit: "seconds", description: "5-yard directional sprint straight ahead" },
  { code: "SPR-04", name: "5-yard Directional - Right", category: "directional", is_bilateral: false, result_type: "time", unit: "seconds", description: "5-yard directional sprint to the right" },
  { code: "SPR-05", name: "Curvilinear Sprint", category: "curvilinear", is_bilateral: false, result_type: "time", unit: "seconds", description: "Curved sprint path simulating base running" },
];

// Scoring thresholds
const SPRINT_THRESHOLDS: Record<string, { optimal: number; adequate: number }> = {
  "81 ft Sprint": { optimal: 2.80, adequate: 3.00 },
  "5-yard Directional - Left": { optimal: 1.10, adequate: 1.25 },
  "5-yard Directional - Center": { optimal: 1.05, adequate: 1.20 },
  "5-yard Directional - Right": { optimal: 1.10, adequate: 1.25 },
  "Curvilinear Sprint": { optimal: 2.00, adequate: 2.20 },
};

interface TestResult {
  run1?: number;
  run2?: number;
  run3?: number;
  notes?: string;
}

interface SprintSettings {
  shoeType: string;
  surfaceType: string;
}

export function SprintInput() {
  const { currentSession, setStep, clearAssessment } = useAssessmentStore();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [settings, setSettings] = useState<SprintSettings>({
    shoeType: 'Cleats',
    surfaceType: 'Turf',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch test definitions from API
  const { data: apiTests, isLoading: loadingTests } = useQuery({
    queryKey: ['sprint-tests'],
    queryFn: () => sprintApi.getTests(),
  });

  // Use API tests or fallback to local definitions
  const tests = apiTests || SPRINT_TESTS;

  const currentTest = tests[currentTestIndex];

  const submitMutation = useMutation({
    mutationFn: async (resultData: SprintResultCreate[]) => {
      if (!currentSession) throw new Error('No active session');
      return sprintApi.createBulkResults(currentSession.id, resultData);
    },
    onSuccess: async () => {
      // Mark session as complete
      if (currentSession) {
        await sessionsApi.markComplete(currentSession.id);
      }
      setStep('review');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to submit results');
      setSubmitting(false);
    },
  });

  const handleTimeChange = (testCode: string, run: 'run1' | 'run2' | 'run3', value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    setResults(prev => ({
      ...prev,
      [testCode]: {
        ...prev[testCode],
        [run]: numericValue,
      },
    }));
  };

  const handleNotesChange = (testCode: string, value: string) => {
    setResults(prev => ({
      ...prev,
      [testCode]: {
        ...prev[testCode],
        notes: value,
      },
    }));
  };

  const getBestTime = (testCode: string): number | undefined => {
    const testResult = results[testCode];
    if (!testResult) return undefined;

    const times = [testResult.run1, testResult.run2, testResult.run3].filter(
      (t): t is number => t !== undefined
    );

    if (times.length === 0) return undefined;
    return Math.min(...times);
  };

  const getTimeColor = (testName: string, time: number | undefined): string => {
    if (time === undefined) return '';
    const thresholds = SPRINT_THRESHOLDS[testName];
    if (!thresholds) return '';

    if (time <= thresholds.optimal) return 'text-green-600';
    if (time <= thresholds.adequate) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isTestComplete = (test: TestDefinition): boolean => {
    const testResult = results[test.code];
    if (!testResult) return false;
    // At least one run time is required
    return testResult.run1 !== undefined || testResult.run2 !== undefined || testResult.run3 !== undefined;
  };

  const getCompletedCount = (): number => {
    return tests.filter(test => isTestComplete(test)).length;
  };

  const canSubmit = (): boolean => {
    return tests.every(test => isTestComplete(test));
  };

  const handleSubmit = async () => {
    if (!canSubmit() || !currentSession) return;

    setSubmitting(true);
    setError(null);

    // Build results array
    const resultData: SprintResultCreate[] = [];

    tests.forEach(test => {
      const testResult = results[test.code];
      if (!testResult) return;

      const category = test.category as 'linear' | 'directional' | 'curvilinear';

      resultData.push({
        test_code: test.code,
        test_name: test.name,
        test_category: category,
        shoe_type: settings.shoeType,
        surface_type: settings.surfaceType,
        run_1_time: testResult.run1,
        run_2_time: testResult.run2,
        run_3_time: testResult.run3,
        notes: testResult.notes,
      });
    });

    submitMutation.mutate(resultData);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this assessment? All progress will be lost.')) {
      clearAssessment();
    }
  };

  const formatCategoryName = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loadingTests) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sprint Assessment</h2>
              <p className="text-sm text-muted-foreground">
                {currentSession?.player_name} - {currentSession?.assessment_date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {getCompletedCount()} / {tests.length}
              </p>
              <p className="text-sm text-muted-foreground">Tests Complete</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(getCompletedCount() / tests.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Equipment Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Test Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Shoe Type</label>
              <select
                value={settings.shoeType}
                onChange={(e) => setSettings(prev => ({ ...prev, shoeType: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="Cleats">Cleats</option>
                <option value="Turf Shoes">Turf Shoes</option>
                <option value="Running Shoes">Running Shoes</option>
                <option value="Barefoot">Barefoot</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Surface Type</label>
              <select
                value={settings.surfaceType}
                onChange={(e) => setSettings(prev => ({ ...prev, surfaceType: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="Turf">Turf</option>
                <option value="Grass">Grass</option>
                <option value="Dirt">Dirt</option>
                <option value="Track">Track</option>
                <option value="Indoor">Indoor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Test Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {formatCategoryName(currentTest.category)} Sprint
              </p>
              <CardTitle className="mt-1">{currentTest.name}</CardTitle>
              {currentTest.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentTest.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <TestInstructionsButton instruction={getSprintInstruction(currentTest.code)} />
              <div className="text-sm text-muted-foreground">
                Test {currentTestIndex + 1} of {tests.length}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Run Times */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Run 1</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={results[currentTest.code]?.run1 ?? ''}
                  onChange={(e) => handleTimeChange(currentTest.code, 'run1', e.target.value)}
                  placeholder="0.00"
                  className="text-lg font-medium"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Run 2</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={results[currentTest.code]?.run2 ?? ''}
                  onChange={(e) => handleTimeChange(currentTest.code, 'run2', e.target.value)}
                  placeholder="0.00"
                  className="text-lg font-medium"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Run 3</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={results[currentTest.code]?.run3 ?? ''}
                  onChange={(e) => handleTimeChange(currentTest.code, 'run3', e.target.value)}
                  placeholder="0.00"
                  className="text-lg font-medium"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
            </div>
          </div>

          {/* Best Time Display */}
          {getBestTime(currentTest.code) !== undefined && (
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Timer className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Best Time:</span>
                <span className={`text-2xl font-bold ${getTimeColor(currentTest.name, getBestTime(currentTest.code))}`}>
                  {getBestTime(currentTest.code)?.toFixed(2)} sec
                </span>
              </div>
            </div>
          )}

          {/* Scoring Reference */}
          {SPRINT_THRESHOLDS[currentTest.name] && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-medium text-blue-800">Scoring Reference</h4>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 rounded bg-green-100">
                  <p className="font-bold text-green-800">
                    &le;{SPRINT_THRESHOLDS[currentTest.name].optimal}s
                  </p>
                  <p className="text-green-600">Optimal</p>
                </div>
                <div className="text-center p-2 rounded bg-yellow-100">
                  <p className="font-bold text-yellow-800">
                    {SPRINT_THRESHOLDS[currentTest.name].optimal}-{SPRINT_THRESHOLDS[currentTest.name].adequate}s
                  </p>
                  <p className="text-yellow-600">Adequate</p>
                </div>
                <div className="text-center p-2 rounded bg-red-100">
                  <p className="font-bold text-red-800">
                    &gt;{SPRINT_THRESHOLDS[currentTest.name].adequate}s
                  </p>
                  <p className="text-red-600">Needs Work</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={results[currentTest.code]?.notes || ''}
              onChange={(e) => handleNotesChange(currentTest.code, e.target.value)}
              placeholder="Add any observations..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[80px]"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentTestIndex(Math.max(0, currentTestIndex - 1))}
              disabled={currentTestIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {isTestComplete(currentTest) && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Complete
                </span>
              )}
            </div>

            {currentTestIndex < tests.length - 1 ? (
              <Button
                onClick={() => setCurrentTestIndex(currentTestIndex + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit() || submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
                <Check className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Test Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {tests.map((test, index) => {
              const isComplete = isTestComplete(test);
              const isCurrent = index === currentTestIndex;
              const bestTime = getBestTime(test.code);

              return (
                <button
                  key={test.code}
                  onClick={() => setCurrentTestIndex(index)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : isComplete
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-700' : isComplete ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {test.name}
                  </p>
                  {bestTime !== undefined && (
                    <p className={`text-xs mt-1 ${getTimeColor(test.name, bestTime)}`}>
                      Best: {bestTime.toFixed(2)}s
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel Assessment
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || submitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {submitting ? 'Submitting...' : `Submit Assessment (${getCompletedCount()}/${tests.length})`}
        </Button>
      </div>
    </div>
  );
}
