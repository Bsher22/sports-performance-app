import { TestInstruction } from '../components/TestInstructionsModal';

export const kamsInstructions: Record<string, TestInstruction> = {
  rom: {
    testCode: 'KAMS-ROM',
    testName: 'Range of Motion Assessment',
    purpose:
      'Comprehensively assess joint range of motion across multiple body segments using the KAMS system. Identifies mobility restrictions that may affect movement quality and performance.',
    equipment: [
      'KAMS measurement device or goniometer',
      'Treatment table',
      'Recording device/tablet',
    ],
    startingPosition:
      'Varies by joint being assessed. Generally, athlete is positioned to isolate the specific joint while stabilizing adjacent segments.',
    procedure: [
      'Position athlete to isolate the target joint.',
      'Stabilize proximal segment to prevent compensation.',
      'Move the joint through its full available range.',
      'Record end-range position in degrees.',
      'Note any pain, clicking, or compensation patterns.',
      'Compare bilateral measurements.',
      'Document: Hip IR, Hip ER, Shoulder IR, Shoulder ER, Ankle DF, T-Spine Rotation, Knee Flexion, Knee Extension.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Hip IR', range: 'Normal: 35-45 degrees' },
        { label: 'Hip ER', range: 'Normal: 45-60 degrees' },
        { label: 'Shoulder IR', range: 'Normal: 70-90 degrees' },
        { label: 'Shoulder ER', range: 'Normal: 90-110 degrees' },
        { label: 'Ankle DF', range: 'Normal: 15-20 degrees' },
        { label: 'T-Spine Rotation', range: 'Normal: 45+ degrees each side' },
      ],
    },
    commonErrors: [
      'Not properly stabilizing the joint being tested',
      'Allowing compensation from adjacent joints',
      'Not comparing bilaterally',
      'Moving through range too quickly',
    ],
    modifications: [
      'Use alternative positions if standard position causes discomfort',
      'Note any modifications made to standardized protocol',
    ],
  },
  squat: {
    testCode: 'KAMS-SQT',
    testName: 'Squat Assessment',
    purpose:
      'Analyze squat movement pattern to identify limitations in mobility, stability, and motor control. The squat is a fundamental movement pattern that reveals dysfunction throughout the kinetic chain.',
    equipment: [
      'Open space',
      'Video recording device (optional but recommended)',
      'Dowel or PVC pipe (optional for overhead squat)',
    ],
    startingPosition:
      'Athlete stands with feet approximately shoulder-width apart, toes pointing forward or slightly out (up to 15 degrees). Arms may be at sides, crossed on chest, or overhead depending on variation.',
    procedure: [
      'Instruct athlete to squat down as low as possible while maintaining good form.',
      'Observe from front, side, and back views.',
      'Note depth achieved, heel position, knee tracking, trunk angle, and arm position.',
      'Score each component based on movement quality.',
      'Identify primary limitation (ankle, hip, thoracic, core stability).',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Depth', range: 'Full: thighs below parallel | Partial: above parallel' },
        { label: 'Heels', range: 'Down throughout | Heels rise | Cannot keep down' },
        { label: 'Knee Tracking', range: 'Over toes | Valgus (collapse) | Varus (out)' },
        { label: 'Trunk', range: 'Upright | Moderate lean | Excessive lean' },
        { label: 'Overall', range: '1-3 scale (3 = optimal, 1 = significant dysfunction)' },
      ],
    },
    commonErrors: [
      'Not assessing from multiple angles',
      'Not noting where compensation begins',
      'Cueing athlete during assessment (assess natural pattern first)',
      'Not testing with and without heel lift to identify ankle vs hip limitation',
    ],
    modifications: [
      'Overhead squat to assess thoracic mobility',
      'Heel lift to isolate hip from ankle mobility',
      'Box squat to assess depth control',
    ],
  },
  lunge: {
    testCode: 'KAMS-LNG',
    testName: 'Lunge Assessment',
    purpose:
      'Evaluate single-leg stability, hip mobility, and movement symmetry through the lunge pattern. Reveals deficits that bilateral tests may miss.',
    equipment: [
      'Open space',
      'Video recording device (optional)',
    ],
    startingPosition:
      'Athlete stands in a split stance or starts from feet together position depending on protocol.',
    procedure: [
      'Instruct athlete to perform a forward or reverse lunge.',
      'Front knee should track over toes without valgus collapse.',
      'Back knee descends toward floor without touching.',
      'Torso remains upright throughout movement.',
      'Assess both legs and compare symmetry.',
      'Note balance, control, and any compensations.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Knee Tracking', range: 'Proper alignment | Valgus | Varus' },
        { label: 'Depth', range: 'Full (back knee near floor) | Partial | Minimal' },
        { label: 'Balance', range: 'Stable | Minor wobble | Loss of balance' },
        { label: 'Torso Position', range: 'Upright | Slight lean | Significant lean' },
        { label: 'Symmetry', range: 'Equal L/R | Minor asymmetry | Significant asymmetry' },
      ],
    },
    commonErrors: [
      'Not assessing both legs',
      'Front knee traveling past toes (context dependent)',
      'Not noting hip drop or trunk lateral lean',
      'Moving too fast through the assessment',
    ],
    modifications: [
      'Static split squat for athletes with balance limitations',
      'Use support initially if significant balance deficit',
      'Walking lunge to assess dynamic control',
    ],
  },
  balance: {
    testCode: 'KAMS-BAL',
    testName: 'Balance Assessment',
    purpose:
      'Assess static and dynamic balance, proprioception, and neuromuscular control. Balance deficits increase injury risk and limit athletic performance.',
    equipment: [
      'Stable floor surface',
      'Foam pad (for progression)',
      'Timer/stopwatch',
      'Balance board (optional)',
    ],
    startingPosition:
      'Athlete stands on one leg with opposite foot off the ground. Hands may be on hips or at sides depending on protocol.',
    procedure: [
      'Start timer when athlete establishes single-leg stance.',
      'Observe for excessive trunk movement, hip drop, or support leg movement.',
      'Stop timer if athlete touches down, hops, or uses arms excessively.',
      'Record time maintained (up to 30-60 seconds).',
      'Assess eyes open, then eyes closed for progression.',
      'Test both legs and note asymmetries.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Eyes Open', range: 'Optimal: 45+ sec | Adequate: 30-45 sec | Needs work: < 30 sec' },
        { label: 'Eyes Closed', range: 'Optimal: 20+ sec | Adequate: 10-20 sec | Needs work: < 10 sec' },
        { label: 'Quality', range: 'Minimal movement | Moderate sway | Significant movement' },
        { label: 'Symmetry', range: 'Note L/R difference > 10 seconds or significant quality difference' },
      ],
    },
    commonErrors: [
      'Not standardizing arm position',
      'Not testing both eyes open and closed',
      'Allowing athlete to fix gaze on one point (unless that is the protocol)',
      'Not noting quality of balance, only duration',
    ],
    modifications: [
      'Use stable surface before foam',
      'Progress to dynamic balance tasks',
      'Y-Balance Test for more detailed assessment',
    ],
  },
  jump: {
    testCode: 'KAMS-JMP',
    testName: 'Jump Landing Assessment',
    purpose:
      'Evaluate jump mechanics, landing strategy, and lower extremity alignment during plyometric activity. Poor landing mechanics are a major risk factor for ACL and other lower extremity injuries.',
    equipment: [
      'Box or step (12-18 inches)',
      'Video recording device (strongly recommended)',
      'Flat landing surface',
    ],
    startingPosition:
      'For drop jump: Athlete stands on box with toes at edge. For standing jump: Athlete in athletic stance.',
    procedure: [
      'For drop jump: step off box and immediately jump vertically upon landing.',
      'For broad/vertical jump: perform jump and stick the landing.',
      'Observe from front and side views.',
      'Note knee valgus, asymmetry, trunk position, and landing stiffness.',
      'Assess single-leg landing if appropriate.',
      'Score based on movement quality and symmetry.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Knee Alignment', range: 'Over toes | Mild valgus | Significant valgus' },
        { label: 'Symmetry', range: 'Equal weight distribution | Favoring one side | Significant asymmetry' },
        { label: 'Landing Strategy', range: 'Soft/quiet | Moderate stiffness | Stiff/loud' },
        { label: 'Trunk Control', range: 'Neutral | Slight flexion | Excessive flexion/rotation' },
        { label: 'Hip/Knee Flexion', range: 'Adequate absorption | Limited flexion | Minimal absorption' },
      ],
    },
    commonErrors: [
      'Not assessing from multiple angles',
      'Not using video for detailed review',
      'Testing when athlete is fatigued',
      'Not progressing from double-leg to single-leg appropriately',
    ],
    modifications: [
      'Lower box height for less experienced athletes',
      'Double-leg only if single-leg is contraindicated',
      'Tuck jump assessment for repeated landing quality',
    ],
  },
};

export function getKAMSInstruction(testType: string): TestInstruction | null {
  return kamsInstructions[testType] || null;
}
