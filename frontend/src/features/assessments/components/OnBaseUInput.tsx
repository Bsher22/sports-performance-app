import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { onbaseUApi, pitcherOnbaseUApi } from '@/api/assessments/onbaseu';
import { sessionsApi } from '@/api/assessments/sessions';
import { useAssessmentStore } from '@/store/assessmentStore';
import { TestDefinition, OnBaseUResultCreate } from '@/types/assessment';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle } from 'lucide-react';
import { TestInstructionsButton } from './TestInstructionsModal';
import { getOnBaseUInstruction } from '../data/onbaseUInstructions';

// Test definitions based on backend schema (used as fallback)
const ONBASEU_TESTS: TestDefinition[] = [
  { code: "OBU-01", name: "Shoulder 46 Test", category: "upper_body", subcategory: "shoulder_mobility", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-02", name: "90/90 Test", category: "upper_body", subcategory: "shoulder_mobility", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-03", name: "Lat Test", category: "upper_body", subcategory: "shoulder_mobility", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-04", name: "Hitchhiker Test", category: "upper_body", subcategory: "upper_body_control", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-05", name: "Hip 45 Test", category: "lower_body", subcategory: "hip_mobility", is_bilateral: true, result_type: "select", options: ["> 45°", "= 45°", "< 45°"] },
  { code: "OBU-06", name: "Pelvic Tilt Test", category: "lower_body", subcategory: "hip_mobility", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-07", name: "Pelvic Rotation Test", category: "lower_body", subcategory: "hip_mobility", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-08", name: "Deep Squat Test", category: "lower_body", subcategory: "lower_body_control", is_bilateral: false, result_type: "select", options: ["Pass", "Improves with Holding", "Fail"] },
  { code: "OBU-09", name: "Hurdle Step Test", category: "lower_body", subcategory: "lower_body_control", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-10", name: "MSR", category: "lower_body", subcategory: "lower_body_control", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-11", name: "Toe Tap Test", category: "lower_body", subcategory: "foot_ankle", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-12", name: "Ankle Rocking Test", category: "lower_body", subcategory: "foot_ankle", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-13", name: "Push-Off Test", category: "core", subcategory: "power_stability", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-14", name: "Separation Test", category: "core", subcategory: "power_stability", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-15", name: "Holding Angle Test", category: "core", subcategory: "rotational_control", is_bilateral: false, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
  { code: "OBU-16", name: "Seated Trunk Rotation Test", category: "core", subcategory: "rotational_control", is_bilateral: true, result_type: "select", options: ["Pass", "Neutral", "Fail"] },
];

interface OnBaseUInputProps {
  isPitcher?: boolean;
}

interface TestResult {
  result?: string;
  leftResult?: string;
  rightResult?: string;
  notes?: string;
}

export function OnBaseUInput({ isPitcher = false }: OnBaseUInputProps) {
  const { currentSession, setStep, clearAssessment } = useAssessmentStore();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = isPitcher ? pitcherOnbaseUApi : onbaseUApi;

  // Fetch test definitions from API
  const { data: apiTests, isLoading: loadingTests } = useQuery({
    queryKey: [isPitcher ? 'pitcher-onbaseu-tests' : 'onbaseu-tests'],
    queryFn: () => api.getTests(),
  });

  // Use API tests or fallback to local definitions
  const tests = apiTests || ONBASEU_TESTS;

  // Group tests by category for navigation
  const testsByCategory = useMemo(() => {
    const grouped: Record<string, TestDefinition[]> = {};
    tests.forEach(test => {
      if (!grouped[test.category]) {
        grouped[test.category] = [];
      }
      grouped[test.category].push(test);
    });
    return grouped;
  }, [tests]);

  const categories = Object.keys(testsByCategory);
  const currentTest = tests[currentTestIndex];

  const submitMutation = useMutation({
    mutationFn: async (resultData: OnBaseUResultCreate[]) => {
      if (!currentSession) throw new Error('No active session');
      return api.createBulkResults(currentSession.id, resultData);
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

  const handleResultChange = (testCode: string, field: keyof TestResult, value: string) => {
    setResults(prev => ({
      ...prev,
      [testCode]: {
        ...prev[testCode],
        [field]: value,
      },
    }));
  };

  const getResultColor = (result: string | undefined): string => {
    if (!result) return '';
    const lowerResult = result.toLowerCase();
    if (lowerResult === 'pass' || lowerResult === '> 45°') return 'bg-green-500';
    if (lowerResult === 'neutral' || lowerResult === '= 45°' || lowerResult === 'improves with holding') return 'bg-yellow-500';
    if (lowerResult === 'fail' || lowerResult === '< 45°') return 'bg-red-500';
    return 'bg-gray-300';
  };

  const isTestComplete = (test: TestDefinition): boolean => {
    const testResult = results[test.code];
    if (!testResult) return false;
    if (test.is_bilateral) {
      return !!(testResult.leftResult && testResult.rightResult);
    }
    return !!testResult.result;
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
    const resultData: OnBaseUResultCreate[] = [];

    tests.forEach(test => {
      const testResult = results[test.code];
      if (!testResult) return;

      if (test.is_bilateral) {
        // Add left side result
        if (testResult.leftResult) {
          resultData.push({
            test_code: test.code,
            test_name: test.name,
            test_category: test.category,
            subcategory: test.subcategory,
            side: 'left',
            result: testResult.leftResult,
            notes: testResult.notes,
          });
        }
        // Add right side result
        if (testResult.rightResult) {
          resultData.push({
            test_code: test.code,
            test_name: test.name,
            test_category: test.category,
            subcategory: test.subcategory,
            side: 'right',
            result: testResult.rightResult,
            notes: testResult.notes,
          });
        }
      } else {
        // Add single result
        if (testResult.result) {
          resultData.push({
            test_code: test.code,
            test_name: test.name,
            test_category: test.category,
            subcategory: test.subcategory,
            result: testResult.result,
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

  if (loadingTests) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSubcategoryName = (subcategory: string | null | undefined): string => {
    if (!subcategory) return '';
    return subcategory
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {isPitcher ? 'Pitcher OnBaseU Assessment' : 'OnBaseU Assessment'}
              </h2>
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

      {/* Test Navigation */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Category Navigator */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {categories.map((category) => {
              const categoryTests = testsByCategory[category];
              const completedInCategory = categoryTests.filter(t => isTestComplete(t)).length;
              const isCurrentCategory = currentTest?.category === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    const firstTestIndex = tests.findIndex(t => t.category === category);
                    if (firstTestIndex >= 0) setCurrentTestIndex(firstTestIndex);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isCurrentCategory
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{formatCategoryName(category)}</span>
                    <span className={`text-xs ${
                      completedInCategory === categoryTests.length
                        ? 'text-green-600 font-medium'
                        : 'text-gray-500'
                    }`}>
                      {completedInCategory}/{categoryTests.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Current Test Input */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {formatCategoryName(currentTest.category)}
                  {currentTest.subcategory && ` - ${formatSubcategoryName(currentTest.subcategory)}`}
                </p>
                <CardTitle className="mt-1">{currentTest.name}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <TestInstructionsButton instruction={getOnBaseUInstruction(currentTest.code, isPitcher)} />
                <div className="text-sm text-muted-foreground">
                  Test {currentTestIndex + 1} of {tests.length}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentTest.is_bilateral ? (
              // Bilateral test - show left and right
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Side */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Left Side</label>
                  <div className="flex flex-wrap gap-2">
                    {currentTest.options?.map((option) => {
                      const isSelected = results[currentTest.code]?.leftResult === option;
                      return (
                        <button
                          key={`left-${option}`}
                          onClick={() => handleResultChange(currentTest.code, 'leftResult', option)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            isSelected
                              ? `${getResultColor(option)} text-white border-transparent`
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Right Side</label>
                  <div className="flex flex-wrap gap-2">
                    {currentTest.options?.map((option) => {
                      const isSelected = results[currentTest.code]?.rightResult === option;
                      return (
                        <button
                          key={`right-${option}`}
                          onClick={() => handleResultChange(currentTest.code, 'rightResult', option)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            isSelected
                              ? `${getResultColor(option)} text-white border-transparent`
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Single result test
              <div className="space-y-3">
                <label className="block text-sm font-medium">Result</label>
                <div className="flex flex-wrap gap-2">
                  {currentTest.options?.map((option) => {
                    const isSelected = results[currentTest.code]?.result === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleResultChange(currentTest.code, 'result', option)}
                        className={`px-6 py-4 rounded-lg border-2 transition-all font-medium text-lg ${
                          isSelected
                            ? `${getResultColor(option)} text-white border-transparent`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Notes (Optional)</label>
              <textarea
                value={results[currentTest.code]?.notes || ''}
                onChange={(e) => handleResultChange(currentTest.code, 'notes', e.target.value)}
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
      </div>

      {/* Test Overview Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Test Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {tests.map((test, index) => {
              const isComplete = isTestComplete(test);
              const isCurrent = index === currentTestIndex;

              return (
                <button
                  key={test.code}
                  onClick={() => setCurrentTestIndex(index)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : isComplete
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={test.name}
                >
                  {index + 1}
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
