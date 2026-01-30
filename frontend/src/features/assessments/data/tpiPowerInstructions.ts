import { TestInstruction } from '../components/TestInstructionsModal';

export const tpiPowerInstructions: Record<string, TestInstruction> = {
  'TPI-01': {
    testCode: 'TPI-01',
    testName: 'Vertical Jump',
    purpose:
      'Measure lower body explosive power through maximum vertical displacement. This is a key indicator of athletic potential and lower body force production.',
    equipment: [
      'Vertec or wall-mounted measurement device',
      'Chalk for marking (if using wall)',
      'Flat, non-slip surface',
    ],
    startingPosition:
      'Athlete stands directly under the Vertec or beside the wall. Feet shoulder-width apart, arms relaxed at sides. Measure standing reach first.',
    procedure: [
      'Have athlete stand flat-footed and reach up with dominant hand to establish standing reach height.',
      'Allow athlete to use a self-selected countermovement (arm swing and knee bend).',
      'Athlete jumps vertically and touches the highest possible vane/mark.',
      'Allow 2-3 attempts with adequate rest between jumps.',
      'Record the best jump height (highest point touched minus standing reach).',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Elite', range: '30+ inches' },
        { label: 'Good', range: '26-30 inches' },
        { label: 'Average', range: '22-25 inches' },
        { label: 'Below Average', range: '< 22 inches' },
      ],
    },
    commonErrors: [
      'Not recording accurate standing reach',
      'Stepping or drifting during jump',
      'Not allowing full countermovement',
      'Insufficient rest between attempts',
    ],
    modifications: [
      'For athletes with shoulder limitations, allow them to reach with the non-affected arm',
      'Use a jump mat for more precise measurement if available',
    ],
  },
  'TPI-02': {
    testCode: 'TPI-02',
    testName: 'Broad Jump',
    purpose:
      'Assess horizontal power production, which correlates with acceleration ability and overall lower body explosive strength.',
    equipment: [
      'Flat, non-slip surface',
      'Tape measure',
      'Tape for marking start line',
    ],
    startingPosition:
      'Athlete stands with toes behind the start line, feet shoulder-width apart. Arms are free to swing.',
    procedure: [
      'Athlete performs a countermovement with arms swinging back.',
      'Jump forward as far as possible, landing on both feet.',
      'Measure from the start line to the back of the closest heel upon landing.',
      'Athlete must stick the landing (no falling backward).',
      'Allow 2-3 attempts and record the best distance.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Elite', range: '9+ feet' },
        { label: 'Good', range: '8-9 feet' },
        { label: 'Average', range: '7-8 feet' },
        { label: 'Below Average', range: '< 7 feet' },
      ],
    },
    commonErrors: [
      'Falling backward after landing (void the attempt)',
      'Stepping over start line before jump',
      'Not using full arm swing',
      'Measuring to front of feet instead of back heel',
    ],
    modifications: [
      'Younger athletes may use a shorter approach if coordination is an issue',
    ],
  },
  'TPI-03': {
    testCode: 'TPI-03',
    testName: 'Med Ball Seated Shot Put',
    purpose:
      'Assess upper body pushing power while minimizing lower body contribution. Measures chest and tricep explosive strength.',
    equipment: [
      '6 lb medicine ball (standard)',
      'Tape measure',
      'Wall to sit against',
      'Tape for marking',
    ],
    startingPosition:
      'Athlete sits with back flat against wall, legs extended in front. Medicine ball is held at chest with both hands.',
    procedure: [
      'Keep back against wall throughout the throw.',
      'Push the ball away from chest as explosively as possible.',
      'Ball should travel in a relatively flat trajectory.',
      'Measure from the wall to where the ball first lands.',
      'Perform 2-3 attempts, record best distance.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Elite', range: '20+ feet' },
        { label: 'Good', range: '17-20 feet' },
        { label: 'Average', range: '14-17 feet' },
        { label: 'Below Average', range: '< 14 feet' },
      ],
    },
    commonErrors: [
      'Back coming off the wall during throw',
      'Using legs to push',
      'Throwing in an upward arc instead of straight',
      'Not using a consistent ball weight',
    ],
    modifications: [
      'Can use different ball weights but must note the weight used',
      'Compare to age/weight appropriate norms',
    ],
  },
  'TPI-04': {
    testCode: 'TPI-04',
    testName: 'Med Ball Rotational Throw (Right)',
    purpose:
      'Measure rotational power from the right side, simulating the motion used in throwing and hitting. Tests core rotational strength and hip-to-shoulder separation.',
    equipment: [
      '6 lb medicine ball',
      'Tape measure',
      'Wall (for safety/reference)',
      'Open space for throwing',
    ],
    startingPosition:
      'Athlete stands perpendicular to throwing direction with feet shoulder-width apart. Ball is held at waist level on the right side.',
    procedure: [
      'Initiate movement by loading into right hip.',
      'Rotate through hips, core, and shoulders sequentially.',
      'Release ball at approximately chest height.',
      'Allow both feet to pivot naturally.',
      'Measure from release point to first bounce.',
      'Perform 2-3 attempts, record best distance.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Elite', range: '35+ feet' },
        { label: 'Good', range: '30-35 feet' },
        { label: 'Average', range: '25-30 feet' },
        { label: 'Below Average', range: '< 25 feet' },
      ],
    },
    commonErrors: [
      'Using arms instead of rotational sequence',
      'Not loading into back hip',
      'Releasing too high or too low',
      'Feet staying planted (limiting rotation)',
    ],
    modifications: [
      'Lighter ball for younger athletes',
      'Step-behind variation for more power',
    ],
  },
  'TPI-05': {
    testCode: 'TPI-05',
    testName: 'Med Ball Rotational Throw (Left)',
    purpose:
      'Measure rotational power from the left side. Comparing to right side reveals asymmetries that may affect performance or indicate injury risk.',
    equipment: [
      '6 lb medicine ball',
      'Tape measure',
      'Wall (for safety/reference)',
      'Open space for throwing',
    ],
    startingPosition:
      'Athlete stands perpendicular to throwing direction with feet shoulder-width apart. Ball is held at waist level on the left side.',
    procedure: [
      'Initiate movement by loading into left hip.',
      'Rotate through hips, core, and shoulders sequentially.',
      'Release ball at approximately chest height.',
      'Allow both feet to pivot naturally.',
      'Measure from release point to first bounce.',
      'Perform 2-3 attempts, record best distance.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Elite', range: '35+ feet' },
        { label: 'Good', range: '30-35 feet' },
        { label: 'Average', range: '25-30 feet' },
        { label: 'Below Average', range: '< 25 feet' },
      ],
    },
    commonErrors: [
      'Using arms instead of rotational sequence',
      'Not loading into back hip',
      'Releasing too high or too low',
      'Significant asymmetry vs right side (>15% difference warrants attention)',
    ],
    modifications: [
      'Lighter ball for younger athletes',
      'Step-behind variation for more power',
    ],
  },
};

export function getTPIPowerInstruction(testCode: string): TestInstruction | null {
  return tpiPowerInstructions[testCode] || null;
}
