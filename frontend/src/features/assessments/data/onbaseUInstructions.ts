import { TestInstruction } from '../components/TestInstructionsModal';

export const onbaseUInstructions: Record<string, TestInstruction> = {
  'OBU-01': {
    testCode: 'OBU-01',
    testName: 'Shoulder 46 Test',
    purpose:
      'Assess shoulder external rotation range of motion at 46 degrees of abduction, which mimics the throwing position during the late cocking phase.',
    equipment: ['Treatment table or flat surface', 'Goniometer (optional)'],
    startingPosition:
      'Athlete lies supine with shoulder abducted to approximately 46 degrees from the side. Elbow is flexed to 90 degrees with forearm perpendicular to the ground.',
    procedure: [
      'Stabilize the scapula by applying gentle pressure to the anterior shoulder.',
      'Slowly externally rotate the shoulder by allowing the forearm to move toward the table.',
      'Note the range of motion achieved and any compensatory movements.',
      'Compare bilaterally for symmetry.',
    ],
    scoringCriteria: {
      pass: 'Forearm reaches parallel to table (90+ degrees external rotation) with no pain or compensation.',
      neutral: 'Forearm reaches 70-89 degrees with minimal compensation.',
      fail: 'Forearm less than 70 degrees OR significant compensation/pain observed.',
    },
    commonErrors: [
      'Allowing the scapula to anteriorly tilt',
      'Not maintaining 46 degrees of abduction',
      'Athlete arching lower back to gain more range',
    ],
    modifications: [
      'Use a towel roll under the humerus for athletes with limited range',
    ],
  },
  'OBU-02': {
    testCode: 'OBU-02',
    testName: 'Shoulder IR 90/90',
    purpose:
      'Assess shoulder internal rotation at 90 degrees of abduction, important for the follow-through phase of throwing.',
    equipment: ['Treatment table or flat surface'],
    startingPosition:
      'Athlete lies supine with shoulder abducted to 90 degrees and elbow flexed to 90 degrees. Forearm starts perpendicular to the floor.',
    procedure: [
      'Stabilize the scapula with one hand.',
      'Internally rotate the shoulder, moving the forearm toward the table.',
      'Stop when compensation occurs or end range is reached.',
      'Assess both sides for comparison.',
    ],
    scoringCriteria: {
      pass: 'At least 70 degrees of internal rotation with no compensation.',
      neutral: '50-69 degrees of internal rotation.',
      fail: 'Less than 50 degrees OR pain/significant compensation.',
    },
    commonErrors: [
      'Allowing scapular protraction',
      'Not maintaining 90 degrees of abduction',
      'Moving too quickly through the motion',
    ],
  },
  'OBU-03': {
    testCode: 'OBU-03',
    testName: 'Lat Length Test',
    purpose:
      'Assess the flexibility of the latissimus dorsi muscle, which can limit overhead mobility and contribute to shoulder impingement.',
    equipment: ['Treatment table or wall'],
    startingPosition:
      'Athlete lies supine with knees bent and feet flat. Arms start at sides.',
    procedure: [
      'Have athlete raise both arms overhead, keeping elbows straight.',
      'Attempt to touch thumbs to the table/floor above the head.',
      'Observe for lower back arching or rib flare.',
      'Note bilateral differences.',
    ],
    scoringCriteria: {
      pass: 'Arms reach table with back flat and no rib flare.',
      neutral: 'Arms within 2 inches of table with minimal compensation.',
      fail: 'Arms more than 2 inches from table OR significant back arch/rib flare.',
    },
    commonErrors: [
      'Allowing excessive lumbar extension',
      'Bending elbows to gain range',
      'Not fully extending through the shoulders',
    ],
  },
  'OBU-04': {
    testCode: 'OBU-04',
    testName: 'Pec Minor Length',
    purpose:
      'Assess the length of the pectoralis minor muscle, which when tight can cause forward shoulder posture and limit overhead mechanics.',
    equipment: ['Treatment table', 'Ruler or measuring device'],
    startingPosition:
      'Athlete lies supine with arms relaxed at sides, palms facing up.',
    procedure: [
      'Observe resting position of the shoulders.',
      'Measure the distance from the posterior acromion to the table.',
      'A normal measurement is approximately 1 inch or less.',
      'Compare bilaterally.',
    ],
    scoringCriteria: {
      pass: 'Less than 1 inch from table bilaterally.',
      neutral: '1-1.5 inches from table.',
      fail: 'Greater than 1.5 inches OR significant asymmetry (>0.5 inch difference).',
    },
    commonErrors: [
      'Athlete actively pressing shoulders down',
      'Not having athlete fully relaxed',
      'Measuring at wrong landmark',
    ],
  },
  'OBU-05': {
    testCode: 'OBU-05',
    testName: 'Trunk Rotation Test',
    purpose:
      'Assess thoracic spine rotation mobility, essential for generating rotational power in throwing and hitting.',
    equipment: ['Chair or stool', 'Dowel or PVC pipe'],
    startingPosition:
      'Athlete sits upright on chair with feet flat on floor, holding dowel across chest with arms crossed.',
    procedure: [
      'Have athlete rotate torso to one side as far as possible.',
      'Ensure hips remain stationary and facing forward.',
      'Observe total rotation achieved.',
      'Repeat to opposite side.',
    ],
    scoringCriteria: {
      pass: '45+ degrees of rotation to each side.',
      neutral: '35-44 degrees of rotation.',
      fail: 'Less than 35 degrees OR significant asymmetry (>10 degree difference).',
    },
    commonErrors: [
      'Allowing hip rotation to contribute to movement',
      'Leaning or side-bending instead of pure rotation',
      'Not keeping feet flat on floor',
    ],
  },
  'OBU-06': {
    testCode: 'OBU-06',
    testName: 'Hip IR (Prone)',
    purpose:
      'Assess hip internal rotation in prone position, important for proper hip function during athletic movements.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies prone with knee flexed to 90 degrees.',
    procedure: [
      'Stabilize the pelvis with one hand.',
      'Allow the lower leg to fall outward (this creates hip internal rotation).',
      'Note the angle achieved before pelvic compensation.',
      'Compare bilaterally.',
    ],
    scoringCriteria: {
      pass: '35+ degrees of internal rotation bilaterally.',
      neutral: '25-34 degrees of internal rotation.',
      fail: 'Less than 25 degrees OR >10 degree asymmetry.',
    },
    commonErrors: [
      'Allowing pelvis to rotate',
      'Not keeping knee at 90 degrees',
      'Pushing beyond natural end range',
    ],
  },
  'OBU-07': {
    testCode: 'OBU-07',
    testName: 'Hip ER (Prone)',
    purpose:
      'Assess hip external rotation in prone position, essential for hip clearance during rotational movements.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies prone with knee flexed to 90 degrees.',
    procedure: [
      'Stabilize the pelvis with one hand.',
      'Move the lower leg inward (this creates hip external rotation).',
      'Note the angle achieved before pelvic compensation.',
      'Compare bilaterally.',
    ],
    scoringCriteria: {
      pass: '45+ degrees of external rotation bilaterally.',
      neutral: '35-44 degrees of external rotation.',
      fail: 'Less than 35 degrees OR >10 degree asymmetry.',
    },
    commonErrors: [
      'Allowing pelvis to lift or rotate',
      'Confusing internal and external rotation',
      'Not maintaining knee flexion angle',
    ],
  },
  'OBU-08': {
    testCode: 'OBU-08',
    testName: 'Thomas Test (Hip Flexor)',
    purpose:
      'Assess hip flexor length, particularly the iliopsoas and rectus femoris muscles.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete sits at the end of the table, then lies back while pulling one knee to chest.',
    procedure: [
      'Have athlete hold one knee firmly to chest.',
      'Allow the opposite leg to hang off the table.',
      'Observe the position of the hanging thigh and knee.',
      'Note if thigh lifts above horizontal or knee extends.',
    ],
    scoringCriteria: {
      pass: 'Thigh rests at or below horizontal with knee flexed to 90 degrees.',
      neutral: 'Thigh slightly above horizontal OR knee extension limited.',
      fail: 'Thigh significantly above horizontal AND/OR knee fully extends.',
    },
    commonErrors: [
      'Not pulling test knee far enough to flatten lumbar spine',
      'Allowing low back to arch',
      'Not starting at edge of table',
    ],
  },
  'OBU-09': {
    testCode: 'OBU-09',
    testName: 'Adductor Length Test',
    purpose:
      'Assess the flexibility of the hip adductor muscles.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with legs extended.',
    procedure: [
      'Passively abduct one leg while keeping knee straight.',
      'Stabilize the opposite leg and pelvis.',
      'Note the angle of abduction achieved.',
      'Compare bilaterally.',
    ],
    scoringCriteria: {
      pass: '45+ degrees of abduction bilaterally.',
      neutral: '35-44 degrees of abduction.',
      fail: 'Less than 35 degrees OR >10 degree asymmetry.',
    },
    commonErrors: [
      'Allowing pelvis to tilt',
      'Bending the knee during test',
      'Not stabilizing opposite leg',
    ],
  },
  'OBU-10': {
    testCode: 'OBU-10',
    testName: 'Hamstring 90/90',
    purpose:
      'Assess hamstring flexibility with hip at 90 degrees of flexion.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with one hip and knee flexed to 90 degrees.',
    procedure: [
      'Hold the thigh vertical (90 degrees hip flexion).',
      'Extend the knee as far as possible.',
      'Note the knee extension angle achieved.',
      'Compare bilaterally.',
    ],
    scoringCriteria: {
      pass: 'Knee extends to within 20 degrees of full extension.',
      neutral: 'Knee extension lacks 20-35 degrees.',
      fail: 'Knee extension lacks more than 35 degrees.',
    },
    commonErrors: [
      'Allowing hip flexion angle to change',
      'Not stabilizing the pelvis',
      'Athlete contracting hamstrings',
    ],
  },
  'OBU-11': {
    testCode: 'OBU-11',
    testName: 'Ankle Dorsiflexion (Knee Bent)',
    purpose:
      'Assess ankle dorsiflexion with knee flexed, isolating the soleus and joint mobility.',
    equipment: ['Wall', 'Tape measure'],
    startingPosition:
      'Athlete in half-kneeling position facing wall, test foot forward.',
    procedure: [
      'Place front foot approximately 4 inches from wall.',
      'Drive knee forward toward wall while keeping heel down.',
      'Progressively move foot back until heel just lifts.',
      'Measure maximum distance from wall where heel stays down.',
    ],
    scoringCriteria: {
      pass: '4+ inches from wall with heel down.',
      neutral: '3-4 inches from wall.',
      fail: 'Less than 3 inches OR >1 inch asymmetry.',
    },
    commonErrors: [
      'Allowing heel to lift',
      'Foot not aligned straight ahead',
      'Knee collapsing inward',
    ],
  },
  'OBU-12': {
    testCode: 'OBU-12',
    testName: 'Ankle Dorsiflexion (Knee Straight)',
    purpose:
      'Assess ankle dorsiflexion with knee extended, testing gastrocnemius length.',
    equipment: ['Wall', 'Tape measure'],
    startingPosition:
      'Athlete stands facing wall in staggered stance, test leg back.',
    procedure: [
      'Keep back knee straight and heel on ground.',
      'Lean forward into wall.',
      'Note when heel wants to lift.',
      'Compare bilaterally.',
    ],
    scoringCriteria: {
      pass: 'Can achieve 10+ degrees dorsiflexion with knee straight.',
      neutral: '5-10 degrees of dorsiflexion.',
      fail: 'Less than 5 degrees of dorsiflexion.',
    },
    commonErrors: [
      'Bending the back knee',
      'Allowing heel to lift',
      'Turning foot outward',
    ],
  },
  'OBU-13': {
    testCode: 'OBU-13',
    testName: 'Core - Dead Bug',
    purpose:
      'Assess ability to maintain neutral spine while moving extremities, indicating core stability.',
    equipment: ['Mat or treatment table'],
    startingPosition:
      'Athlete lies supine with hips and knees at 90 degrees, arms reaching toward ceiling.',
    procedure: [
      'Have athlete press low back into table/mat.',
      'Slowly extend one leg and opposite arm.',
      'Return and repeat on opposite side.',
      'Observe for loss of low back contact.',
    ],
    scoringCriteria: {
      pass: 'Maintains low back contact throughout 5 reps each side.',
      neutral: 'Slight loss of contact but self-corrects.',
      fail: 'Cannot maintain low back position during movement.',
    },
    commonErrors: [
      'Holding breath',
      'Moving too quickly',
      'Extending leg too far too fast',
    ],
  },
  'OBU-14': {
    testCode: 'OBU-14',
    testName: 'Core - Bird Dog',
    purpose:
      'Assess ability to maintain neutral spine in quadruped while extending opposite arm and leg.',
    equipment: ['Mat'],
    startingPosition:
      'Athlete on hands and knees with spine in neutral position.',
    procedure: [
      'Extend one arm and opposite leg simultaneously.',
      'Hold for 2 seconds.',
      'Return and repeat on opposite side.',
      'Observe for spinal rotation or extension.',
    ],
    scoringCriteria: {
      pass: 'Maintains neutral spine for 5 reps each side with no rotation.',
      neutral: 'Minor wobble or rotation but maintains general position.',
      fail: 'Significant spinal movement or cannot perform movement.',
    },
    commonErrors: [
      'Rotating trunk toward lifted leg',
      'Hyperextending lumbar spine',
      'Not reaching full extension of limbs',
    ],
  },
  'OBU-15': {
    testCode: 'OBU-15',
    testName: 'Core - Side Plank',
    purpose:
      'Assess lateral core stability and hip abductor endurance.',
    equipment: ['Mat'],
    startingPosition:
      'Athlete lies on side, propped on forearm with elbow under shoulder.',
    procedure: [
      'Lift hips off ground to create straight line from head to feet.',
      'Hold position.',
      'Time how long position can be maintained with good form.',
    ],
    scoringCriteria: {
      pass: 'Holds 45+ seconds with good alignment.',
      neutral: 'Holds 30-44 seconds.',
      fail: 'Less than 30 seconds OR significant form breakdown.',
    },
    commonErrors: [
      'Hips sagging toward floor',
      'Rolling forward or backward',
      'Holding breath',
    ],
  },
  'OBU-16': {
    testCode: 'OBU-16',
    testName: 'Core - Plank',
    purpose:
      'Assess anterior core stability and overall trunk endurance.',
    equipment: ['Mat'],
    startingPosition:
      'Athlete in forearm plank position with elbows under shoulders.',
    procedure: [
      'Maintain straight line from head to heels.',
      'Keep core engaged and avoid sagging or piking.',
      'Time how long position can be maintained.',
    ],
    scoringCriteria: {
      pass: 'Holds 60+ seconds with good alignment.',
      neutral: 'Holds 45-59 seconds.',
      fail: 'Less than 45 seconds OR significant form breakdown.',
    },
    commonErrors: [
      'Hips sagging or piking up',
      'Head dropping or jutting forward',
      'Holding breath',
    ],
  },
};

export function getOnBaseUInstruction(testCode: string): TestInstruction | null {
  return onbaseUInstructions[testCode] || null;
}
