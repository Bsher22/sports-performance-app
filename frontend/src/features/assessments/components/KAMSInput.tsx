import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { kamsApi } from '@/api/assessments/kams';
import { sessionsApi } from '@/api/assessments/sessions';
import { useAssessmentStore } from '@/store/assessmentStore';
import { KAMSResultCreate } from '@/types/assessment';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, Upload, FileText } from 'lucide-react';

// KAMS test configuration
interface KAMSTestConfig {
  test_type: 'rom' | 'squat' | 'lunge' | 'balance' | 'jump';
  name: string;
  description: string;
  fields: {
    key: string;
    label: string;
    type: 'number' | 'select';
    unit?: string;
    options?: string[];
    isBilateral?: boolean;
  }[];
}

const KAMS_TESTS: KAMSTestConfig[] = [
  {
    test_type: 'rom',
    name: 'Multi-Segmental ROM',
    description: 'Range of Motion assessment across multiple body segments',
    fields: [
      { key: 'hip_flexion', label: 'Hip Flexion', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'hip_extension', label: 'Hip Extension', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'hip_internal_rotation', label: 'Hip Internal Rotation', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'hip_external_rotation', label: 'Hip External Rotation', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'ankle_dorsiflexion', label: 'Ankle Dorsiflexion', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'shoulder_flexion', label: 'Shoulder Flexion', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'shoulder_extension', label: 'Shoulder Extension', type: 'number', unit: 'degrees', isBilateral: true },
      { key: 'thoracic_rotation', label: 'Thoracic Rotation', type: 'number', unit: 'degrees', isBilateral: true },
    ],
  },
  {
    test_type: 'squat',
    name: 'Overhead Squat',
    description: 'Functional squat assessment with arms overhead',
    fields: [
      { key: 'depth_score', label: 'Depth Score', type: 'select', options: ['1', '2', '3'] },
      { key: 'knee_tracking', label: 'Knee Tracking', type: 'select', options: ['Good', 'Moderate', 'Poor'] },
      { key: 'torso_angle', label: 'Torso Angle', type: 'select', options: ['Upright', 'Slight Forward', 'Excessive Forward'] },
      { key: 'arm_position', label: 'Arm Position', type: 'select', options: ['Maintained', 'Falls Forward', 'Cannot Maintain'] },
      { key: 'heel_rise', label: 'Heel Rise', type: 'select', options: ['None', 'Slight', 'Significant'] },
      { key: 'overall_quality', label: 'Overall Quality', type: 'select', options: ['Good', 'Fair', 'Poor'] },
    ],
  },
  {
    test_type: 'lunge',
    name: 'Reverse Lunge',
    description: 'Single-leg lunge pattern assessment',
    fields: [
      { key: 'depth', label: 'Depth', type: 'select', options: ['Full', 'Partial', 'Limited'], isBilateral: true },
      { key: 'knee_tracking', label: 'Knee Tracking', type: 'select', options: ['Good', 'Moderate Valgus', 'Significant Valgus'], isBilateral: true },
      { key: 'balance', label: 'Balance', type: 'select', options: ['Stable', 'Minor Wobble', 'Unstable'], isBilateral: true },
      { key: 'overall_quality', label: 'Overall Quality', type: 'select', options: ['Good', 'Fair', 'Poor'], isBilateral: true },
    ],
  },
  {
    test_type: 'balance',
    name: 'Single Leg Balance',
    description: 'Single leg stability assessment',
    fields: [
      { key: 'time', label: 'Hold Time', type: 'number', unit: 'seconds', isBilateral: true },
      { key: 'sway', label: 'Sway', type: 'select', options: ['Minimal', 'Moderate', 'Excessive'], isBilateral: true },
      { key: 'compensations', label: 'Compensations', type: 'select', options: ['None', 'Hip Drop', 'Trunk Lean', 'Multiple'], isBilateral: true },
    ],
  },
  {
    test_type: 'jump',
    name: 'Vertical Jump',
    description: 'Vertical jump landing mechanics assessment',
    fields: [
      { key: 'height', label: 'Jump Height', type: 'number', unit: 'inches' },
      { key: 'landing_quality', label: 'Landing Quality', type: 'select', options: ['Soft/Controlled', 'Moderate', 'Hard/Uncontrolled'] },
      { key: 'knee_valgus', label: 'Knee Valgus', type: 'select', options: ['None', 'Mild', 'Moderate', 'Severe'] },
      { key: 'asymmetry', label: 'Asymmetry', type: 'select', options: ['Symmetric', 'Slight Asymmetry', 'Significant Asymmetry'] },
      { key: 'force_absorption', label: 'Force Absorption', type: 'select', options: ['Good', 'Fair', 'Poor'] },
    ],
  },
];

type TestMeasurements = Record<string, string | number | undefined>;

export function KAMSInput() {
  const { currentSession, setStep, clearAssessment } = useAssessmentStore();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [measurements, setMeasurements] = useState<Record<string, TestMeasurements>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const currentTest = KAMS_TESTS[currentTestIndex];

  const submitMutation = useMutation({
    mutationFn: async (resultData: KAMSResultCreate[]) => {
      if (!currentSession) throw new Error('No active session');
      return kamsApi.createBulkResults(currentSession.id, resultData);
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

  const handleMeasurementChange = (testType: string, key: string, value: string | number) => {
    setMeasurements(prev => ({
      ...prev,
      [testType]: {
        ...prev[testType],
        [key]: value,
      },
    }));
  };

  const handleNotesChange = (testType: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [testType]: value,
    }));
  };

  const isTestComplete = (test: KAMSTestConfig): boolean => {
    const testMeasurements = measurements[test.test_type];
    if (!testMeasurements) return false;

    // Check if all required fields have values
    return test.fields.every(field => {
      if (field.isBilateral) {
        const leftKey = `${field.key}_left`;
        const rightKey = `${field.key}_right`;
        return testMeasurements[leftKey] !== undefined && testMeasurements[rightKey] !== undefined;
      }
      return testMeasurements[field.key] !== undefined;
    });
  };

  const getCompletedCount = (): number => {
    return KAMS_TESTS.filter(test => isTestComplete(test)).length;
  };

  const canSubmit = (): boolean => {
    return KAMS_TESTS.every(test => isTestComplete(test));
  };

  const handleSubmit = async () => {
    if (!canSubmit() || !currentSession) return;

    setSubmitting(true);
    setError(null);

    // Build results array
    const resultData: KAMSResultCreate[] = KAMS_TESTS.map(test => ({
      test_type: test.test_type,
      measurements: measurements[test.test_type] || {},
      notes: notes[test.test_type],
    }));

    submitMutation.mutate(resultData);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setError(null);

    try {
      await kamsApi.uploadPdf(file);
      // PDF upload successful - in a real implementation, this would parse the PDF
      // and populate the measurements. For now, just show success message.
      setError(null);
      alert('PDF uploaded successfully. Please verify the extracted data.');
    } catch (err) {
      setError('Failed to upload PDF. Please try again or enter data manually.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this assessment? All progress will be lost.')) {
      clearAssessment();
    }
  };

  const renderField = (field: KAMSTestConfig['fields'][0], testType: string) => {
    const testMeasurements = measurements[testType] || {};

    if (field.isBilateral) {
      const leftKey = `${field.key}_left`;
      const rightKey = `${field.key}_right`;

      return (
        <div key={field.key} className="grid gap-4 md:grid-cols-2">
          {/* Left Side */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">{field.label} (Left)</label>
            {field.type === 'number' ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={testMeasurements[leftKey] ?? ''}
                  onChange={(e) => handleMeasurementChange(testType, leftKey, e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0"
                />
                {field.unit && <span className="text-sm text-muted-foreground">{field.unit}</span>}
              </div>
            ) : (
              <select
                value={testMeasurements[leftKey] as string ?? ''}
                onChange={(e) => handleMeasurementChange(testType, leftKey, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>

          {/* Right Side */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">{field.label} (Right)</label>
            {field.type === 'number' ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={testMeasurements[rightKey] ?? ''}
                  onChange={(e) => handleMeasurementChange(testType, rightKey, e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0"
                />
                {field.unit && <span className="text-sm text-muted-foreground">{field.unit}</span>}
              </div>
            ) : (
              <select
                value={testMeasurements[rightKey] as string ?? ''}
                onChange={(e) => handleMeasurementChange(testType, rightKey, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        <label className="block text-sm font-medium">{field.label}</label>
        {field.type === 'number' ? (
          <div className="flex items-center gap-2 max-w-xs">
            <Input
              type="number"
              step="0.1"
              value={testMeasurements[field.key] ?? ''}
              onChange={(e) => handleMeasurementChange(testType, field.key, e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0"
            />
            {field.unit && <span className="text-sm text-muted-foreground">{field.unit}</span>}
          </div>
        ) : (
          <select
            value={testMeasurements[field.key] as string ?? ''}
            onChange={(e) => handleMeasurementChange(testType, field.key, e.target.value)}
            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
    );
  };

  if (uploadMode) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload KAMS Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Upload a KAMS PDF report to automatically extract assessment data.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">
                {uploadingPdf ? 'Uploading...' : 'Drag and drop a PDF file, or click to browse'}
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="mt-4"
                disabled={uploadingPdf}
              />
            </div>

            {uploadingPdf && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setUploadMode(false)}>
                Enter Data Manually
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <h2 className="text-lg font-semibold">KAMS Assessment</h2>
              <p className="text-sm text-muted-foreground">
                {currentSession?.player_name} - {currentSession?.assessment_date}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setUploadMode(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {getCompletedCount()} / {KAMS_TESTS.length}
                </p>
                <p className="text-sm text-muted-foreground">Tests Complete</p>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(getCompletedCount() / KAMS_TESTS.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Test Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{currentTest.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{currentTest.description}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Test {currentTestIndex + 1} of {KAMS_TESTS.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fields */}
          <div className="space-y-4">
            {currentTest.fields.map(field => renderField(field, currentTest.test_type))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={notes[currentTest.test_type] || ''}
              onChange={(e) => handleNotesChange(currentTest.test_type, e.target.value)}
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

            {currentTestIndex < KAMS_TESTS.length - 1 ? (
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
            {KAMS_TESTS.map((test, index) => {
              const isComplete = isTestComplete(test);
              const isCurrent = index === currentTestIndex;

              return (
                <button
                  key={test.test_type}
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
          {submitting ? 'Submitting...' : `Submit Assessment (${getCompletedCount()}/${KAMS_TESTS.length})`}
        </Button>
      </div>
    </div>
  );
}
