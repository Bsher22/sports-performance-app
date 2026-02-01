import { TestInstruction } from '../components/TestInstructionsModal';

// Position Player OnBaseU Instructions
export const positionPlayerOnbaseUInstructions: Record<string, TestInstruction> = {
  'OBU-01': {
    testCode: 'OBU-01',
    testName: 'Multi-Segmental Rotation (MSR)',
    purpose:
      'Assess the ability to rotate through the hips and thorax in a coordinated manner. This test evaluates rotational mobility which is essential for hitting and throwing mechanics.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands with feet together, arms crossed over chest with hands on opposite shoulders.',
    procedure: [
      'Have the athlete rotate their entire body to the left as far as possible while keeping feet planted.',
      'Observe the total rotation achieved.',
      'Repeat to the right side.',
      'Compare bilateral rotation.',
    ],
    scoringCriteria: {
      pass: '> 90° of rotation - indicates good hip and thorax mobility.',
      neutral: '= 90° of rotation - indicates average hip and thorax mobility.',
      fail: '< 90° of rotation - indicates limited hip and thorax mobility.',
    },
    commonErrors: [
      'Allowing feet to pivot or lift',
      'Bending at the waist instead of rotating',
      'Not keeping arms firmly crossed',
    ],
  },
  'OBU-02': {
    testCode: 'OBU-02',
    testName: 'Toe Tap Test',
    purpose:
      'Assess hip internal rotation mobility and stability. Limited internal rotation can affect lower body mechanics in hitting and fielding.',
    equipment: ['Chair or bench'],
    startingPosition:
      'Athlete sits on edge of chair with knees bent at 90 degrees, feet flat on floor.',
    procedure: [
      'Have athlete lift one foot and rotate it inward (internal rotation) to tap the toe on the ground.',
      'First test without holding the knee (tests mobility).',
      'Then test while holding the knee stable (tests if limitation is mobility vs stability).',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Touches - toe reaches the ground with good internal hip rotation.',
      neutral: 'Improves with Holding - indicates stability issue rather than mobility.',
      fail: 'Short or No Change - indicates limited hip internal rotation or mobility issue.',
    },
    commonErrors: [
      'Allowing the pelvis to tilt',
      'Leaning the trunk to compensate',
      'Moving too quickly through the test',
    ],
  },
  'OBU-03': {
    testCode: 'OBU-03',
    testName: 'Hip 45 Test',
    purpose:
      'Assess hip external rotation mobility. Adequate hip external rotation is important for proper stance and weight transfer during hitting.',
    equipment: ['Treatment table or flat surface'],
    startingPosition:
      'Athlete lies supine with hip and knee flexed to 90 degrees.',
    procedure: [
      'Stabilize the pelvis with one hand.',
      'Externally rotate the hip by moving the foot inward.',
      'Measure the angle of rotation achieved.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: '> 45° of external rotation - indicates good hip external rotation.',
      neutral: '= 45° of external rotation - indicates average hip external rotation.',
      fail: '< 45° of external rotation - indicates limited hip external rotation.',
    },
    commonErrors: [
      'Allowing pelvis to rotate with the hip',
      'Not maintaining 90 degrees of hip and knee flexion',
      'Rushing the measurement',
    ],
  },
  'OBU-04': {
    testCode: 'OBU-04',
    testName: 'Seated Trunk Rotation Test',
    purpose:
      'Assess thoracic spine rotation mobility, which is critical for generating rotational power in the swing and for proper throwing mechanics.',
    equipment: ['Chair', 'Bat or dowel'],
    startingPosition:
      'Athlete sits upright on chair with feet flat on floor. Test is performed two ways: with bat behind back and while turning head.',
    procedure: [
      'BAT BEHIND BACK: Place bat behind back in crook of elbows. Rotate torso to each side.',
      'TURNING HEAD: Have athlete turn head to look over shoulder while rotating.',
      'Measure rotation angle achieved in each variation.',
      'Compare left and right sides for both variations.',
    ],
    scoringCriteria: {
      pass: '> 45° of rotation - indicates good thorax rotation.',
      neutral: '= 45° of rotation - indicates average thorax rotation.',
      fail: '< 45° of rotation - indicates limited thorax rotation.',
    },
    commonErrors: [
      'Allowing hips to rotate with the trunk',
      'Not keeping feet flat on floor',
      'Leaning instead of pure rotation',
    ],
  },
  'OBU-05': {
    testCode: 'OBU-05',
    testName: 'Pelvic Tilt Test',
    purpose:
      'Assess the ability to control pelvic position and movement. Proper pelvic control is essential for maintaining athletic posture and generating power.',
    equipment: ['Wall or flat surface'],
    startingPosition:
      'Athlete stands with back against wall, knees slightly bent.',
    procedure: [
      'POSTURE: Observe natural standing posture - Athletic Posture, Neutral Tilt, S-Posture (excessive arch), or C-Posture (rounded).',
      'MOTION: Have athlete flatten lower back against wall (posterior tilt) then arch away from wall (anterior tilt).',
      'MOVEMENT: Observe quality of pelvic rotation movement - smooth vs "shake and bake" (jerky).',
    ],
    scoringCriteria: {
      pass: 'Athletic Posture/Neutral Tilt with Normal Motion and Smooth Movement.',
      neutral: 'Hard Time Arching Back OR Hard Time Flattening Back (one direction limited).',
      fail: 'S-Posture/C-Posture, Both Limited motion, or Shake and Bake Movement.',
    },
    commonErrors: [
      'Not isolating pelvic movement from lumbar spine',
      'Moving too quickly',
      'Not observing all three components',
    ],
  },
  'OBU-06': {
    testCode: 'OBU-06',
    testName: 'Pelvic Rotation Test',
    purpose:
      'Assess the ability to rotate the pelvis independently from the upper body. This separation is crucial for generating rotational power in hitting.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands in athletic position with feet shoulder-width apart.',
    procedure: [
      'WITHOUT HOLDING SHOULDERS: Have athlete rotate pelvis left and right while keeping shoulders still.',
      'HOLDING SHOULDERS: Examiner stabilizes shoulders while athlete rotates pelvis.',
      'COORDINATION: Observe quality of rotary movement vs lateral shifting.',
      'Compare left and right rotation in both conditions.',
    ],
    scoringCriteria: {
      pass: 'Good rotation without holding and Good Rotary Movement coordination.',
      neutral: 'Limited without holding but Improves when holding shoulders (stability issue).',
      fail: "Limited rotation that Doesn't Improve when holding, or More Lateral Movement than rotation.",
    },
    commonErrors: [
      'Allowing trunk to rotate with pelvis',
      'Shifting weight laterally instead of rotating',
      'Not testing both conditions',
    ],
  },
  'OBU-07': {
    testCode: 'OBU-07',
    testName: 'Shoulder 46 Test',
    purpose:
      'Assess shoulder external rotation at 46 degrees of abduction, which mimics the arm position during the swing. This is critical for proper bat path.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with shoulder abducted to approximately 46 degrees (elbow at side), elbow flexed to 90 degrees.',
    procedure: [
      'Stabilize the scapula.',
      'Externally rotate the shoulder, allowing forearm to move toward the table.',
      'Note the position achieved relative to landmarks.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Past 2nd base (reference point) - indicates good shoulder external rotation.',
      neutral: 'Equal to 2nd base - indicates average shoulder external rotation.',
      fail: 'Less than 2nd base - indicates limited shoulder external rotation.',
    },
    commonErrors: [
      'Not maintaining elbow at side (46 degrees)',
      'Allowing scapula to anteriorly tilt',
      'Athlete arching back to gain range',
    ],
  },
  'OBU-08': {
    testCode: 'OBU-08',
    testName: 'Separation Test',
    purpose:
      'Assess shoulder horizontal adduction and scapular stability. This relates to the ability to create separation between hips and shoulders during the swing.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands with arm at 90 degrees of abduction and elbow flexed.',
    procedure: [
      'ELBOW POSITION: Have athlete horizontally adduct the arm. Observe if elbow stays up, at level, or drops below.',
      'HANDS SLIDE: Have athlete slide hands across chest. Note if hands go past elbow, over elbow, or stay inside elbow.',
      'Compare left and right sides for both components.',
    ],
    scoringCriteria: {
      pass: 'Elbow Up with Hands Past Elbow - indicates good shoulder horizontal adduction and scapular stability.',
      neutral: 'Elbow = or Above with Hands Over Elbow - indicates average mobility/stability.',
      fail: 'Elbow Below with Hands Inside of Elbow - indicates limited mobility or scapular stability.',
    },
    commonErrors: [
      'Not observing both elbow and hands components',
      'Allowing trunk rotation to compensate',
      'Moving too quickly through the test',
    ],
  },
  'OBU-09': {
    testCode: 'OBU-09',
    testName: 'Deep Squat Test',
    purpose:
      'Assess overall lower body mobility including hip flexion, ankle dorsiflexion, and core stability.',
    equipment: ['Open floor space', 'Dowel (optional)'],
    startingPosition:
      'Athlete stands with feet shoulder-width apart, toes pointing forward.',
    procedure: [
      'ARMS IN FRONT: Have athlete squat as deep as possible with arms extended in front.',
      'ARMS DOWN: If limited, have athlete squat with arms down at sides.',
      'Observe if squat improves with arms down (indicates stability vs mobility issue).',
    ],
    scoringCriteria: {
      pass: 'Good Squat with arms in front and Stable with arms down.',
      neutral: 'Limited Squat that improves with arms down (stability issue).',
      fail: 'Limited Squat that remains Unstable with arms down (mobility issue).',
    },
    commonErrors: [
      'Heels lifting off ground',
      'Knees caving inward',
      'Excessive forward trunk lean',
    ],
  },
  'OBU-10': {
    testCode: 'OBU-10',
    testName: 'Holding Angle Test',
    purpose:
      'Assess wrist mobility and the ability to achieve proper bat angle at contact position.',
    equipment: ['Bat or dowel'],
    startingPosition:
      'Athlete holds bat in front of body as if at contact position.',
    procedure: [
      'Have athlete bring the bat to the contact position.',
      'Observe the angle of the wrists relative to the sternum.',
      'Note the position achieved.',
    ],
    scoringCriteria: {
      pass: 'Above Bottom of Sternum - indicates good wrist mobility.',
      neutral: 'Over Bottom of Sternum - indicates average wrist mobility.',
      fail: 'Below Bottom of Sternum - indicates limited wrist mobility.',
    },
    commonErrors: [
      'Compensating with elbow position',
      'Not maintaining proper grip',
      'Rushing the assessment',
    ],
  },
  'OBU-11': {
    testCode: 'OBU-11',
    testName: 'Ankle Rocking Test',
    purpose:
      'Assess ankle inversion and eversion mobility, which affects stance stability and weight transfer during the swing.',
    equipment: ['Chair'],
    startingPosition:
      'Athlete sits with feet flat on floor.',
    procedure: [
      'SEATED WITHOUT HOLDING: Have athlete rock ankles inward (inversion) and outward (eversion).',
      'SEATED HOLDING: If limited, have athlete hold knee stable while rocking ankle.',
      'Note if limitation improves with stabilization (stability vs mobility issue).',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Good Inversion and Good Eversion without holding.',
      neutral: 'Limited that Improves with holding (stability issue).',
      fail: 'Limited Inversion or Limited Eversion that remains limited with holding (mobility issue).',
    },
    commonErrors: [
      'Moving entire lower leg instead of isolating ankle',
      'Not testing both inversion and eversion',
      'Not comparing with and without stabilization',
    ],
  },
  'OBU-12': {
    testCode: 'OBU-12',
    testName: 'Hurdle Step Test',
    purpose:
      'Assess single-leg stance stability and hip mobility during dynamic movement.',
    equipment: ['Hurdle or string at knee height'],
    startingPosition:
      'Athlete stands on one leg facing the hurdle.',
    procedure: [
      'Have athlete step over the hurdle with one leg and return.',
      'Observe posture and stability throughout movement.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Good - completes movement with stable posture.',
      neutral: 'Unstable Posture - completes movement but with compensations.',
      fail: 'Falls - cannot complete movement without loss of balance.',
    },
    commonErrors: [
      'Leaning trunk excessively',
      'Hip hiking instead of true hip flexion',
      'Rushing the movement',
    ],
  },
  'OBU-13': {
    testCode: 'OBU-13',
    testName: 'Single Leg Squat',
    purpose:
      'Assess single-leg strength, stability, and control - important for fielding and weight transfer.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands on one leg with opposite foot off the ground.',
    procedure: [
      'Have athlete squat down as far as controlled on one leg.',
      'Observe knee tracking, trunk position, and balance.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Good Squat - controlled descent with good alignment.',
      neutral: 'Limited Squat - restricted range or minor compensations.',
      fail: 'Unstable - significant balance issues or inability to control movement.',
    },
    commonErrors: [
      'Knee caving inward (valgus)',
      'Excessive trunk lean',
      'Using momentum instead of control',
    ],
  },
  'OBU-14': {
    testCode: 'OBU-14',
    testName: 'Inline Lunge',
    purpose:
      'Assess hip mobility, ankle mobility, and stability in a split stance position similar to batting stance.',
    equipment: ['2x6 board or tape line'],
    startingPosition:
      'Athlete stands with feet in line (heel to toe) on the board or line.',
    procedure: [
      'Have athlete descend into lunge position.',
      'Back knee should touch behind front heel.',
      'Observe balance and alignment.',
      'Compare left and right lead leg.',
    ],
    scoringCriteria: {
      pass: 'Good - completes lunge with balance and proper alignment.',
      neutral: 'Unstable Posture - completes but with compensations.',
      fail: 'Falls - cannot maintain position.',
    },
    commonErrors: [
      'Front knee moving past toes',
      'Losing balance laterally',
      'Not achieving full depth',
    ],
  },
  'OBU-15': {
    testCode: 'OBU-15',
    testName: '90/90 Shoulder Test',
    purpose:
      'Assess shoulder external rotation at 90 degrees of abduction, important for arm action in throwing.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with shoulder abducted to 90 degrees and elbow flexed to 90 degrees.',
    procedure: [
      'STANDING UPRIGHT: Test external rotation in standard position.',
      '135 DEGREES: Test with trunk at 135 degree angle (mimics layback position).',
      'Note position of forearm relative to spine angle.',
      'Compare left and right sides in both positions.',
    ],
    scoringCriteria: {
      pass: 'Past Spine Angle - indicates good shoulder external rotation.',
      neutral: 'Spine Angle - indicates average shoulder external rotation.',
      fail: 'Less than Spine Angle - indicates limited shoulder external rotation.',
    },
    commonErrors: [
      'Not stabilizing the scapula',
      'Allowing trunk extension to compensate',
      'Not testing both positions',
    ],
  },
  'OBU-16': {
    testCode: 'OBU-16',
    testName: 'Lat Test',
    purpose:
      'Assess latissimus dorsi flexibility, which affects overhead mobility and can contribute to shoulder issues if restricted.',
    equipment: ['Wall'],
    startingPosition:
      'Athlete stands with back against wall, arms at sides.',
    procedure: [
      'Have athlete raise both arms overhead while keeping back flat against wall.',
      'Note the position achieved relative to landmarks.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Standing Upright - arms reach wall while maintaining back position.',
      neutral: 'To the Wall or To the Nose - moderate lat flexibility.',
      fail: 'Before the Nose - indicates limited lat flexibility.',
    },
    commonErrors: [
      'Allowing lower back to arch away from wall',
      'Bending elbows to gain range',
      'Shrugging shoulders',
    ],
  },
  'OBU-17': {
    testCode: 'OBU-17',
    testName: 'Hitchhiker Test',
    purpose:
      'Assess forearm pronation and supination mobility, important for bat control and grip.',
    equipment: ['Open space'],
    startingPosition:
      'Athlete holds arms out with elbows at 90 degrees, thumbs pointing up.',
    procedure: [
      'PRONATION: Have athlete rotate forearms so thumbs point down (palms face down).',
      'SUPINATION: Have athlete rotate forearms so thumbs point up and out (palms face up).',
      'Measure rotation achieved in both directions.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: '> 90° Pronation AND > 90° Supination - indicates good forearm rotation.',
      neutral: 'One direction limited but other is good.',
      fail: '< 90° Pronation OR < 90° Supination - indicates limited forearm rotation.',
    },
    commonErrors: [
      'Compensating with shoulder rotation',
      'Not isolating forearm movement',
      'Moving elbow position during test',
    ],
  },
};

// Pitcher OnBaseU Instructions
export const pitcherOnbaseUInstructions: Record<string, TestInstruction> = {
  'POBU-01': {
    testCode: 'POBU-01',
    testName: 'Pelvic Tilt Test',
    purpose:
      'Assess pelvic control and positioning, critical for maintaining proper posture throughout the pitching motion.',
    equipment: ['Wall or flat surface'],
    startingPosition:
      'Athlete stands with back against wall.',
    procedure: [
      'Observe natural pelvic position.',
      'Have athlete posteriorly tilt (flatten back) and anteriorly tilt (arch back).',
      'Note range and quality of motion.',
    ],
    scoringCriteria: {
      pass: 'Normal Motion - good ability to tilt in both directions.',
      neutral: 'Hard Time Arching Back OR Hard Time Flattening Back.',
      fail: 'Both Limited - restricted motion in both directions.',
    },
    commonErrors: [
      'Not isolating pelvic motion from lumbar spine',
      'Bending knees excessively',
      'Moving too quickly',
    ],
  },
  'POBU-02': {
    testCode: 'POBU-02',
    testName: 'Pelvic Rotation Test',
    purpose:
      'Assess ability to rotate pelvis smoothly, essential for hip-to-shoulder separation in pitching.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands in athletic position.',
    procedure: [
      'Have athlete rotate pelvis left and right.',
      'Observe quality of movement - smooth vs jerky.',
    ],
    scoringCriteria: {
      pass: 'Smooth Movement - indicates good pelvic rotation control.',
      neutral: 'Shake and Bake Movement - indicates instability or lack of control.',
      fail: 'Did Not Test - unable to perform.',
    },
    commonErrors: [
      'Using trunk to rotate instead of pelvis',
      'Shifting weight instead of rotating',
      'Not maintaining athletic posture',
    ],
  },
  'POBU-03': {
    testCode: 'POBU-03',
    testName: 'Toe Tap Test',
    purpose:
      'Assess hip internal rotation, important for the drive leg action in pitching.',
    equipment: ['Chair'],
    startingPosition:
      'Athlete sits on chair with feet flat on floor.',
    procedure: [
      'Have athlete internally rotate hip to tap toe on ground.',
      'Compare left and right sides.',
    ],
    scoringCriteria: {
      pass: 'Touches - good internal hip rotation.',
      neutral: 'No Improvement when stabilized - may need more work on control.',
      fail: 'Short - limited internal hip rotation.',
    },
    commonErrors: [
      'Tilting pelvis to compensate',
      'Leaning trunk',
      'Moving too quickly',
    ],
  },
  'POBU-04': {
    testCode: 'POBU-04',
    testName: 'Hip 45 Test',
    purpose:
      'Assess hip external rotation mobility for proper hip clearance during pitching.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with hip and knee at 90 degrees.',
    procedure: [
      'Externally rotate hip by moving foot inward.',
      'Measure angle achieved.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: '> 45 degrees - good hip external rotation.',
      neutral: '= 45 degrees - average hip external rotation.',
      fail: '< 45 degrees - limited hip external rotation.',
    },
    commonErrors: [
      'Allowing pelvis to rotate',
      'Not maintaining hip/knee position',
      'Rushing measurement',
    ],
  },
  'POBU-05': {
    testCode: 'POBU-05',
    testName: 'Half-Kneeling Narrow Base Test',
    purpose:
      'Assess hip rotation and balance in a position similar to the stride phase of pitching.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete in half-kneeling position with narrow base.',
    procedure: [
      'Have athlete rotate and reach toward target.',
      'Note range achieved and balance.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Touches target - good hip rotation and balance.',
      fail: 'Short - limited hip rotation or balance.',
    },
    commonErrors: [
      'Widening the base',
      'Losing balance',
      'Not fully rotating through hips',
    ],
  },
  'POBU-06': {
    testCode: 'POBU-06',
    testName: 'Lunge with Extension Test',
    purpose:
      'Assess hip flexibility and stability in a stride-like position.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete in lunge position.',
    procedure: [
      'Have athlete extend arms overhead while in lunge.',
      'Note hip position and trunk stability.',
      'Compare left and right lead leg.',
    ],
    scoringCriteria: {
      pass: 'Touches - good hip flexibility and stability.',
      fail: 'Short - limited hip flexibility or stability.',
    },
    commonErrors: [
      'Back knee lifting',
      'Excessive trunk lean',
      'Hip dropping',
    ],
  },
  'POBU-07': {
    testCode: 'POBU-07',
    testName: 'Wide Squat Test',
    purpose:
      'Assess hip and ankle flexibility in a wide stance.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands with wide stance, toes pointed slightly out.',
    procedure: [
      'Have athlete squat down keeping heels on ground.',
      'Note depth achieved and alignment.',
    ],
    scoringCriteria: {
      pass: 'Good Squat - full depth with good alignment.',
      fail: 'Limited Squat - restricted depth or poor alignment.',
    },
    commonErrors: [
      'Heels lifting',
      'Knees caving inward',
      'Excessive forward lean',
    ],
  },
  'POBU-08': {
    testCode: 'POBU-08',
    testName: 'Side Step Walkout Test',
    purpose:
      'Assess hip stability and control during lateral movement.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete in athletic stance.',
    procedure: [
      'Have athlete side step and reach to target.',
      'Note hip control and stability.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Touches - good hip stability and control.',
      fail: 'Short - limited hip stability or control.',
    },
    commonErrors: [
      'Trunk leaning excessively',
      'Hip dropping',
      'Loss of balance',
    ],
  },
  'POBU-09': {
    testCode: 'POBU-09',
    testName: 'Push Off Test',
    purpose:
      'Assess lower body strength and stability for the push-off phase of pitching.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete in pitching stance position.',
    procedure: [
      'Have athlete simulate push-off from rubber.',
      'Note power and stability.',
    ],
    scoringCriteria: {
      pass: 'Good Push Off - good lower body strength and stability.',
      fail: 'Limited Push Off - limited strength or stability.',
    },
    commonErrors: [
      'Collapsing through back leg',
      'Losing balance',
      'Not driving through hip',
    ],
  },
  'POBU-10': {
    testCode: 'POBU-10',
    testName: 'Heel Lift Test',
    purpose:
      'Assess ankle flexibility and calf mobility.',
    equipment: ['Wall'],
    startingPosition:
      'Athlete stands facing wall in split stance.',
    procedure: [
      'Have athlete drive knee toward wall while keeping heel down.',
      'Note when heel lifts.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Heel Lift - good ankle flexibility.',
      fail: 'Limited Heel Lift - limited ankle flexibility.',
    },
    commonErrors: [
      'Heel lifting early',
      'Knee tracking inward',
      'Not driving knee straight forward',
    ],
  },
  'POBU-11': {
    testCode: 'POBU-11',
    testName: 'Shoulder 90/90 Test',
    purpose:
      'Assess shoulder external rotation at 90 degrees abduction, critical for arm action in pitching.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with shoulder and elbow at 90 degrees.',
    procedure: [
      'Externally rotate shoulder.',
      'Note range achieved.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Shoulder 90/90 - good shoulder flexibility.',
      fail: 'Limited Shoulder 90/90 - limited shoulder flexibility.',
    },
    commonErrors: [
      'Scapula moving',
      'Back arching',
      'Elbow dropping',
    ],
  },
  'POBU-12': {
    testCode: 'POBU-12',
    testName: 'Shoulder Windshield Wiper Test',
    purpose:
      'Assess shoulder internal and external rotation mobility.',
    equipment: ['Treatment table'],
    startingPosition:
      'Athlete lies supine with arm at side, elbow at 90 degrees.',
    procedure: [
      'Rotate forearm like a windshield wiper (internal and external rotation).',
      'Note range in both directions.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Shoulder Windshield Wiper - good shoulder flexibility and control.',
      fail: 'Limited Shoulder Windshield Wiper - limited shoulder flexibility or control.',
    },
    commonErrors: [
      'Moving the elbow',
      'Compensating with trunk',
      'Moving too quickly',
    ],
  },
  'POBU-13': {
    testCode: 'POBU-13',
    testName: 'Forearm 80/80 Test',
    purpose:
      'Assess forearm pronation and supination mobility.',
    equipment: ['Open space'],
    startingPosition:
      'Athlete holds arm with elbow at 80 degrees.',
    procedure: [
      'Rotate forearm through full pronation and supination.',
      'Note range achieved.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Forearm 80/80 - good forearm rotation.',
      fail: 'Limited Forearm 80/80 - limited forearm rotation.',
    },
    commonErrors: [
      'Moving entire arm instead of forearm',
      'Compensating with shoulder',
      'Not achieving full range',
    ],
  },
  'POBU-14': {
    testCode: 'POBU-14',
    testName: 'Ankle Rocking Test',
    purpose:
      'Assess ankle inversion and eversion mobility.',
    equipment: ['Chair'],
    startingPosition:
      'Athlete sits with feet flat on floor.',
    procedure: [
      'Rock ankles inward and outward.',
      'Note range in both directions.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Ankle Rocking - good ankle flexibility.',
      fail: 'Limited Ankle Rocking - limited ankle flexibility.',
    },
    commonErrors: [
      'Moving entire lower leg',
      'Not isolating ankle motion',
      'Rushing the test',
    ],
  },
  'POBU-15': {
    testCode: 'POBU-15',
    testName: 'Foot Windshield Wiper Test',
    purpose:
      'Assess foot and ankle mobility in rotation.',
    equipment: ['Chair'],
    startingPosition:
      'Athlete sits with feet hanging.',
    procedure: [
      'Rotate foot inward and outward like windshield wiper.',
      'Note range of motion.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Foot Windshield Wiper - good foot flexibility and control.',
      fail: 'Limited Foot Windshield Wiper - limited foot flexibility or control.',
    },
    commonErrors: [
      'Moving from knee instead of ankle',
      'Not achieving full range',
      'Moving too quickly',
    ],
  },
  'POBU-16': {
    testCode: 'POBU-16',
    testName: 'Seated Trunk Rotation Test',
    purpose:
      'Assess thoracic rotation mobility, essential for hip-shoulder separation.',
    equipment: ['Chair'],
    startingPosition:
      'Athlete sits upright with feet flat on floor.',
    procedure: [
      'Rotate trunk to each side.',
      'Note range achieved.',
      'Compare left and right.',
    ],
    scoringCriteria: {
      pass: 'Good Seated Trunk Rotation - good thoracic flexibility.',
      fail: 'Limited Seated Trunk Rotation - limited thoracic flexibility.',
    },
    commonErrors: [
      'Hips rotating with trunk',
      'Leaning instead of rotating',
      'Feet lifting off floor',
    ],
  },
};

// Helper function to get instruction based on test code and player type
export function getOnBaseUInstruction(testCode: string, isPitcher: boolean = false): TestInstruction | null {
  if (isPitcher) {
    return pitcherOnbaseUInstructions[testCode] || null;
  }
  return positionPlayerOnbaseUInstructions[testCode] || null;
}
