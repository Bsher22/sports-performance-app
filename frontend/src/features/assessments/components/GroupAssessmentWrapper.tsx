import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Check, ChevronLeft, ChevronRight, Users, User } from 'lucide-react';

interface GroupAssessmentWrapperProps {
  children: ReactNode;
}

export function GroupAssessmentWrapper({ children }: GroupAssessmentWrapperProps) {
  const {
    mode,
    groupSessions,
    currentGroupIndex,
    setCurrentGroupIndex,
    getGroupProgress,
  } = useAssessmentStore();

  // Only render wrapper in group mode
  if (mode !== 'group') {
    return <>{children}</>;
  }

  const progress = getGroupProgress();
  const currentPlayer = groupSessions[currentGroupIndex];

  return (
    <div className="space-y-4">
      {/* Group Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Group Assessment</h3>
                <p className="text-sm text-blue-600">
                  {progress.completed} of {progress.total} athletes completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentGroupIndex(currentGroupIndex - 1)}
                disabled={currentGroupIndex === 0}
                className="border-blue-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 bg-white rounded-md text-sm font-medium text-blue-700 border border-blue-200">
                {currentGroupIndex + 1} / {groupSessions.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentGroupIndex(currentGroupIndex + 1)}
                disabled={currentGroupIndex === groupSessions.length - 1}
                className="border-blue-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Player Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {groupSessions.map((session, index) => {
              const isCurrent = index === currentGroupIndex;
              const isComplete = session.isComplete;

              return (
                <button
                  key={session.playerId}
                  onClick={() => setCurrentGroupIndex(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md'
                      : isComplete
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="max-w-[120px] truncate">{session.playerName}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Player Indicator */}
      {currentPlayer && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm">
          <User className="h-5 w-5 text-blue-600" />
          <span className="font-medium">Currently assessing:</span>
          <span className="text-blue-600 font-semibold">{currentPlayer.playerName}</span>
          {currentPlayer.isComplete && (
            <span className="ml-auto flex items-center gap-1 text-green-600 text-sm">
              <Check className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>
      )}

      {/* Assessment Content */}
      {children}
    </div>
  );
}
