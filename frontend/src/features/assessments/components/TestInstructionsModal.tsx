import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HelpCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface TestInstruction {
  testCode: string;
  testName: string;
  purpose: string;
  equipment?: string[];
  startingPosition: string;
  procedure: string[];
  scoringCriteria?: {
    pass?: string;
    neutral?: string;
    fail?: string;
    numeric?: { label: string; range: string }[];
  };
  commonErrors?: string[];
  modifications?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

interface TestInstructionsModalProps {
  instruction: TestInstruction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TestInstructionsModal({ instruction, isOpen, onClose }: TestInstructionsModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['procedure', 'scoring'])
  );

  if (!isOpen || !instruction) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between py-2 text-left font-semibold text-gray-900 hover:text-blue-600"
    >
      {title}
      {expandedSections.has(section) ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-hidden">
        <CardHeader className="border-b bg-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">{instruction.testCode}</p>
              <CardTitle className="text-xl">{instruction.testName}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto p-6 space-y-4">
          {/* Purpose */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
            <p className="text-gray-700">{instruction.purpose}</p>
          </div>

          {/* Equipment */}
          {instruction.equipment && instruction.equipment.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Equipment Needed</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {instruction.equipment.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Starting Position */}
          <div className="border-t pt-4">
            <SectionHeader title="Starting Position" section="position" />
            {expandedSections.has('position') && (
              <p className="text-gray-700 mt-2">{instruction.startingPosition}</p>
            )}
          </div>

          {/* Procedure */}
          <div className="border-t pt-4">
            <SectionHeader title="Procedure" section="procedure" />
            {expandedSections.has('procedure') && (
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mt-2">
                {instruction.procedure.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Scoring Criteria */}
          {instruction.scoringCriteria && (
            <div className="border-t pt-4">
              <SectionHeader title="Scoring Criteria" section="scoring" />
              {expandedSections.has('scoring') && (
                <div className="mt-2 space-y-2">
                  {instruction.scoringCriteria.pass && (
                    <div className="flex items-start gap-3 p-2 rounded bg-green-50">
                      <span className="font-medium text-green-700 min-w-[60px]">Pass:</span>
                      <span className="text-green-800">{instruction.scoringCriteria.pass}</span>
                    </div>
                  )}
                  {instruction.scoringCriteria.neutral && (
                    <div className="flex items-start gap-3 p-2 rounded bg-yellow-50">
                      <span className="font-medium text-yellow-700 min-w-[60px]">Neutral:</span>
                      <span className="text-yellow-800">{instruction.scoringCriteria.neutral}</span>
                    </div>
                  )}
                  {instruction.scoringCriteria.fail && (
                    <div className="flex items-start gap-3 p-2 rounded bg-red-50">
                      <span className="font-medium text-red-700 min-w-[60px]">Fail:</span>
                      <span className="text-red-800">{instruction.scoringCriteria.fail}</span>
                    </div>
                  )}
                  {instruction.scoringCriteria.numeric && (
                    <div className="space-y-1">
                      {instruction.scoringCriteria.numeric.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                          <span className="font-medium text-gray-700 min-w-[80px]">
                            {item.label}:
                          </span>
                          <span className="text-gray-800">{item.range}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Common Errors */}
          {instruction.commonErrors && instruction.commonErrors.length > 0 && (
            <div className="border-t pt-4">
              <SectionHeader title="Common Errors to Avoid" section="errors" />
              {expandedSections.has('errors') && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                  {instruction.commonErrors.map((error, i) => (
                    <li key={i} className="text-red-700">
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Modifications */}
          {instruction.modifications && instruction.modifications.length > 0 && (
            <div className="border-t pt-4">
              <SectionHeader title="Modifications" section="modifications" />
              {expandedSections.has('modifications') && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                  {instruction.modifications.map((mod, i) => (
                    <li key={i}>{mod}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface TestInstructionsButtonProps {
  instruction: TestInstruction | null;
}

export function TestInstructionsButton({ instruction }: TestInstructionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!instruction) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-1"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Instructions</span>
      </Button>
      <TestInstructionsModal
        instruction={instruction}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
