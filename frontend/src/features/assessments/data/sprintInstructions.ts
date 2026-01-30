import { TestInstruction } from '../components/TestInstructionsModal';

export const sprintInstructions: Record<string, TestInstruction> = {
  'SPR-01': {
    testCode: 'SPR-01',
    testName: '81 ft Sprint',
    purpose:
      'Assess maximum linear speed over 81 feet (baseline to baseline on a basketball court). This measures acceleration and top-end speed capacity.',
    equipment: [
      'Timing system (laser timing gates preferred)',
      'Stopwatch (if electronic timing unavailable)',
      'Cones to mark start and finish',
      '81 feet of flat running surface',
    ],
    startingPosition:
      'Athlete assumes a 2-point or 3-point stance at the start line. Front foot is on or behind the line. Body is leaning forward with weight on the balls of the feet.',
    procedure: [
      'On "Go" command (or when athlete breaks first timing gate), athlete sprints maximally.',
      'Sprint through the finish line, not slowing until past the end.',
      'Record time to hundredths of a second.',
      'Allow 2-3 minutes rest between attempts.',
      'Perform 2-3 trials, record best time.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Optimal', range: '< 3.00 seconds' },
        { label: 'Adequate', range: '3.00-3.30 seconds' },
        { label: 'Needs Work', range: '> 3.30 seconds' },
      ],
    },
    commonErrors: [
      'Slowing down before crossing finish line',
      'Poor start position causing balance issues',
      'Not fully recovering between trials',
      'False starts affecting timing',
    ],
    modifications: [
      'Adjust standards based on age and position',
      'Use rolling start for athletes with acceleration limitations',
    ],
  },
  'SPR-02': {
    testCode: 'SPR-02',
    testName: '54 ft Sprint',
    purpose:
      'Measure acceleration and speed over a shorter distance (54 feet / home to first base). Emphasizes acceleration phase over top-end speed.',
    equipment: [
      'Timing system',
      'Stopwatch (backup)',
      'Cones to mark distance',
      '54 feet of flat surface',
    ],
    startingPosition:
      'Athlete in athletic stance at start line. May use standing start or simulate game-realistic position.',
    procedure: [
      'On command, sprint maximally through the finish.',
      'Maintain full effort past the finish line.',
      'Record time to hundredths of a second.',
      'Rest 2-3 minutes between trials.',
      'Perform 2-3 attempts, use best time.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Optimal', range: '< 2.00 seconds' },
        { label: 'Adequate', range: '2.00-2.25 seconds' },
        { label: 'Needs Work', range: '> 2.25 seconds' },
      ],
    },
    commonErrors: [
      'Decelerating before the line',
      'Leaning backward at start',
      'Over-striding on first few steps',
      'Inadequate rest between runs',
    ],
  },
  'SPR-03': {
    testCode: 'SPR-03',
    testName: '5-10-5 Pro Agility',
    purpose:
      'Assess change of direction ability and lateral quickness. Tests acceleration, deceleration, and re-acceleration in a short space.',
    equipment: [
      'Timing system',
      'Three cones (5 yards apart)',
      'Flat, non-slip surface',
      'Stopwatch (backup)',
    ],
    startingPosition:
      'Athlete straddles the middle cone in athletic stance. Hand touches the ground at the start cone.',
    procedure: [
      'On "Go," athlete sprints 5 yards to one side, touches the line with hand.',
      'Turns and sprints 10 yards to the far cone, touches the line.',
      'Turns and sprints 5 yards back through the start/finish.',
      'Must touch both outside lines with hand.',
      'Perform 1-2 trials starting each direction.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Optimal', range: '< 4.20 seconds' },
        { label: 'Adequate', range: '4.20-4.50 seconds' },
        { label: 'Needs Work', range: '> 4.50 seconds' },
      ],
    },
    commonErrors: [
      'Not touching the lines',
      'Wide turns instead of tight cuts',
      'Slipping at change of direction',
      'Rising up out of athletic position on cuts',
    ],
    modifications: [
      'Allow dominant direction only if comparing to baseline',
      'Note surface conditions (turf vs. hardwood)',
    ],
  },
  'SPR-04': {
    testCode: 'SPR-04',
    testName: '60 Yard Sprint',
    purpose:
      'The standard baseball speed test measuring time from home to first extended. Tests acceleration and speed maintenance over competition-relevant distance.',
    equipment: [
      'Timing system (starting pistol optional)',
      'Cones at 0 and 60 yards',
      'Grass or turf surface',
      'Stopwatch (backup)',
    ],
    startingPosition:
      'Athlete in a comfortable starting stance. Many use a standing start or slight crouch. This should mimic how they would run bases.',
    procedure: [
      'Start on "Go" or whistle/clap.',
      'Sprint maximally for 60 yards.',
      'Run through the finish line at full speed.',
      'Allow 3-5 minutes rest between runs.',
      'Perform 2 trials, use best time.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Optimal', range: '< 6.80 seconds' },
        { label: 'Adequate', range: '6.80-7.20 seconds' },
        { label: 'Needs Work', range: '> 7.20 seconds' },
      ],
    },
    commonErrors: [
      'Poor start execution',
      'Tightening up and losing speed late',
      'Running in wrong footwear',
      'Not enough warm-up before testing',
    ],
    modifications: [
      'Standards vary by position (catchers/1B vs outfielders)',
      'Age-based adjustments needed',
    ],
  },
  'SPR-05': {
    testCode: 'SPR-05',
    testName: 'Curved Sprint (Bases)',
    purpose:
      'Assess curvilinear running speed, specific to running the bases. Tests ability to maintain speed through turns.',
    equipment: [
      'Baseball/softball infield or simulated base path',
      'Timing system',
      'Bases or cones at proper distances',
    ],
    startingPosition:
      'Athlete starts at home plate in game-realistic position (as if running out a hit).',
    procedure: [
      'Start timing on first movement or departure from home.',
      'Run the curved path around first base (or through second if testing longer distance).',
      'Focus on maintaining speed through the turn.',
      'Time to specific base or completion of circuit.',
      'Note running path and technique through turns.',
    ],
    scoringCriteria: {
      numeric: [
        { label: 'Optimal', range: 'Home to 2nd < 7.50 seconds' },
        { label: 'Adequate', range: '7.50-8.00 seconds' },
        { label: 'Needs Work', range: '> 8.00 seconds' },
      ],
    },
    commonErrors: [
      'Swinging too wide on the curve',
      'Slowing down significantly at the turn',
      'Not hitting the inside corner of the base',
      'Losing balance through the curve',
    ],
    modifications: [
      'Can test home-to-first as a shorter curvilinear test',
      'Adjust standards based on age and level',
    ],
  },
};

export function getSprintInstruction(testCode: string): TestInstruction | null {
  return sprintInstructions[testCode] || null;
}
