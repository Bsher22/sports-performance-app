import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { tpiPowerApi } from '@/api/assessments/tpi-power';
import { sessionsApi } from '@/api/assessments/sessions';
import { useAssessmentStore } from '@/store/assessmentStore';
import { TestDefinition, TPIPowerResultCreate } from '@/types/assessment';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, Ruler } from 'lucide-react';

// TPI Power test definitions based on backend schema
const TPI_POWER_TESTS: TestDefinition[] = [
  { code: "TPI-01", name: "Vertical Jump", category: "lower_body_power", is_bilateral: false, result_type: "numeric", unit: "inches", description: "Standing vertical jump height measurement" },
  { code: "TPI-02", name: "Broad Jump", category: "lower_body_power", is_bilateral: false, result_type: "numeric", unit: "inches", description: "Standing broad jump distance measurement" },
  { code: "TPI-03", name: "Seated Chest Pass", category: "upper_body_power", is_bilateral: false, result_type: "numeric", unit: "inches", description: "Seated medicine ball chest pass distance" },
  { code: "TPI-04", name: "Sit Up Throw", category: "core_power", is_bilateral: false, result_type: "numeric", unit: "inches", description: "Medicine ball throw from sit-up position" },
  { code: "TPI-05", name: "Baseline Shot Put", category: "rotational_power", is_bilateral: true, result_type: "numeric", unit: "inches", description: "Rotational shot put throw from baseline stance" },
];

interface TestResult {
  value?: number;
  leftValue?: number;
  rightValue?: number;
  notes?: string;
}

export function TPIPowerInput() {
  const { currentSession, setStep, clearAssessment } = useAssessmentStore();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch test definitions from API
  const { data: apiTests, isLoading: loadingTests } = useQuery({
    queryKey: ['tpi-power-tests'],
    queryFn: () => tpiPowerApi.getTests(),
  });

  // Use API tests or fallback to local definitions
  const tests = apiTests || TPI_POWER_TESTS;

  const currentTest = tests[currentTestIndex];

  const submitMutation = useMutation({
    mutationFn: async (resultData: TPIPowerResultCreate[]) => {
      if (!currentSession) throw new Error('No active session');
      return tpiPowerApi.createBulkResults(currentSession.id, resultData);
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

  const handleValueChange = (testCode: string, field: keyof TestResult, value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    setResults(prev => ({
      ...prev,
      [testCode]: {
        ...prev[testCode],
        [field]: numericValue,
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

  const isTestComplete = (test: TestDefinition): boolean => {
    const testResult = results[test.code];
    if (!testResult) return false;
    if (test.is_bilateral) {
      return testResult.leftValue !== undefined && testResult.rightValue !== undefined;
    }
    return testResult.value !== undefined;
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
    const resultData: TPIPowerResultCreate[] = [];

    tests.forEach(test => {
      const testResult = results[test.code];
      if (!testResult) return;

      if (test.is_bilateral) {
        // Add left side result
        if (testResult.leftValue !== undefined) {
          resultData.push({
            test_code: test.code,
            test_name: test.name,
            result_value: testResult.leftValue,
            side: 'left',
            notes: testResult.notes,
          });
        }
        // Add right side result
        if (testResult.rightValue !== undefined) {
          resultData.push({
            test_code: test.code,
            test_name: test.name,
            result_value: testResult.rightValue,
            side: 'right',
            notes: testResult.notes,
          });
        }
      } else {
        // Add single result
        if (testResult.value !== undefined) {
          resultData.push({
            test_code: test.code,
            test_name: test.name,
            result_value: testResult.value,
            notes: testResult.notes,
          });
        }
      }
    });

    submitMutation.mutate(resultData);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this assessment? All progress will be lost.')) {
      clearAssessment();
    }
  };

  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
              <h2 className="text-lg font-semibold">TPI Power Assessment</h2>
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

      {/* Current Test Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {formatCategoryName(currentTest.category)}
              </p>
              <CardTitle className="mt-1">{currentTest.name}</CardTitle>
              {currentTest.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentTest.description}</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Test {currentTestIndex + 1} of {tests.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentTest.is_bilateral ? (
            // Bilateral test - show left and right
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Side */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Left Side (Off Side)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={results[currentTest.code]?.leftValue ?? ''}
                    onChange={(e) => handleValueChange(currentTest.code, 'leftValue', e.target.value)}
                    placeholder="Enter value"
                    className="text-lg font-medium"
                  />
                  <span className="text-sm text-muted-foreground">{currentTest.unit}</span>
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Right Side (Dom Side)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={results[currentTest.code]?.rightValue ?? ''}
                    onChange={(e) => handleValueChange(currentTest.code, 'rightValue', e.target.value)}
                    placeholder="Enter value"
                    className="text-lg font-medium"
                  />
                  <span className="text-sm text-muted-foreground">{currentTest.unit}</span>
                </div>
              </div>
            </div>
          ) : (
            // Single result test
            <div className="space-y-3">
              <label className="block text-sm font-medium">Measurement</label>
              <div className="flex items-center gap-3 max-w-md">
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.1"
                    value={results[currentTest.code]?.value ?? ''}
                    onChange={(e) => handleValueChange(currentTest.code, 'value', e.target.value)}
                    placeholder="Enter value"
                    className="text-xl font-medium h-14"
                  />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ruler className="h-5 w-5" />
                  <span className="text-lg">{currentTest.unit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Reference */}
          {currentTest.code === 'TPI-01' && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-medium text-blue-800">Scoring Reference</h4>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 rounded bg-blue-100">
                  <p className="font-bold text-blue-800">&gt;30&quot;</p>
                  <p className="text-blue-600">Elite</p>
                </div>
                <div className="text-center p-2 rounded bg-green-100">
                  <p className="font-bold text-green-800">26-30&quot;</p>
                  <p className="text-green-600">Good</p>
                </div>
                <div className="text-center p-2 rounded bg-yellow-100">
                  <p className="font-bold text-yellow-800">22-25&quot;</p>
                  <p className="text-yellow-600">Average</p>
                </div>
              </div>
            </div>
          )}

          {currentTest.code === 'TPI-02' && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-medium text-blue-800">Scoring Reference</h4>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 rounded bg-blue-100">
                  <p className="font-bold text-blue-800">&gt;114&quot;</p>
                  <p className="text-blue-600">Elite</p>
                </div>
                <div className="text-center p-2 rounded bg-green-100">
                  <p className="font-bold text-green-800">108-114&quot;</p>
                  <p className="text-green-600">Good</p>
                </div>
                <div className="text-center p-2 rounded bg-yellow-100">
                  <p className="font-bold text-yellow-800">96-107&quot;</p>
                  <p className="text-yellow-600">Average</p>
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

      {/* Test Overview Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Test Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {tests.map((test, index) => {
              const isComplete = isTestComplete(test);
              const isCurrent = index === currentTestIndex;

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
                  {isComplete && results[test.code] && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {test.is_bilateral
                        ? `L: ${results[test.code].leftValue}" / R: ${results[test.code].rightValue}"`
                        : `${results[test.code].value}"`}
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
