import { TestInstruction } from '../components/TestInstructionsModal';

// Position Player OnBaseU Instructions - Based on RIT OnBaseU Screen documentation
// Test codes match backend: OBU-01 through OBU-16
export const positionPlayerOnbaseUInstructions: Record<string, TestInstruction> = {
  'OBU-01': {
    testCode: 'OBU-01',
    testName: 'Shoulder 46 Test',
    purpose:
      'Tests shoulder external rotation mobility. This position places the scapula approximately in the Connection position used during hitting.',
    equipment: ['Home plate (for angle reference)'],
    startingPosition:
      'Using home plate as a guideline, begin the test by standing tall parallel to the 3rd base line. Have the player place their right elbow by their side with their forearm parallel to the ground, thumb pointing up and fingers extended.',
    procedure: [
      'Without rotating the body, have the player externally rotate the right shoulder (rotate their arm towards first base) as far as possible.',
      'The player should be able to point their fingers past 2nd base towards the 4 position.',
      'Now repeat the test starting parallel to the 1st base line.',
      'Try to externally rotate the left shoulder as far as possible.',
      'The player should be able to point their fingers past 2nd base towards the 6 position.',
    ],
    scoringCriteria: {
      pass: 'Past 2nd base (towards the 4 or 6 position) - indicates good shoulder external rotation.',
      neutral: 'Equal to 2nd base - indicates average shoulder external rotation.',
      fail: 'Less than 2nd base - indicates limited shoulder external rotation.',
    },
    commonErrors: [
      'Letting elbow drift off of the body (keep it by their side)',
      'Body rotating, not just the shoulder',
      'Not maintaining elbow at side',
      'Allowing scapula to anteriorly tilt',
      'Athlete arching back to gain range',
    ],
    modifications: [
      'Three possible problems highlighted: Limited glenohumeral ER, limited shoulder girdle stability, or both.',
      'Shoulder instability: Humerus not staying centered in glenoid fossa due to rotator cuff imbalances.',
      'Overdevelopment of internal rotators (lats and subscapularis).',
      'Capsular tightness limiting range of motion.',
      'External rotator injury or weakness (teres minor/infraspinatus).',
      'Mid-scapular muscle weakness (rhomboids, mid-to-lower trapezius, serratus anterior).',
      'C-posture (Upper Crossed Syndrome) altering glenoid fossa position.',
    ],
  },
  'OBU-02': {
    testCode: 'OBU-02',
    testName: '90/90 Shoulder Test',
    purpose:
      'Assess shoulder external rotation at 90 degrees of abduction, important for arm action in throwing.',
    equipment: ['Open floor space'],
    startingPosition:
      'Athlete stands with shoulder abducted to 90 degrees and elbow flexed to 90 degrees.',
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
  'OBU-03': {
    testCode: 'OBU-03',
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
  'OBU-04': {
    testCode: 'OBU-04',
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
  'OBU-05': {
    testCode: 'OBU-05',
    testName: 'Hip 45 Test',
    purpose:
      'Tests the external rotational mobility of the lower quarter. Hip and tibial external rotation and ankle mobility are essential for proper hitting.',
    equipment: ['Home plate (for angle reference)'],
    startingPosition:
      'Have the player get into a 45 degree angle between their feet (use home plate for a guide if needed). Place their hands on their hips and all of their weight on their right leg.',
    procedure: [
      'Have the player try to rotate their pelvis as far as possible toward the unloaded foot (to the left), which is angled at 45 degrees away from the right foot.',
      'Make sure the player keeps the right foot planted firmly on the ground and all of the weight on the right leg.',
      'This forces the player to rotate only around the right leg.',
      'They should be able to rotate their pelvis past the 45 degree mark (their left foot).',
      'Repeat on the left leg and compare.',
    ],
    scoringCriteria: {
      pass: '> 45° of external rotation - indicates good hip external rotation (over 50 degrees average).',
      neutral: '= 45° of external rotation - indicates average hip external rotation.',
      fail: '< 45° of external rotation - indicates limited hip external rotation.',
    },
    commonErrors: [
      'Letting the testing foot move from the starting position',
      'Not keeping the weight on the limb being tested',
      'Allowing pelvis to rotate with the hip',
      'Rushing the measurement',
    ],
    modifications: [
      'Pain may be present - perform slowly and stop if there is any discomfort.',
      'Note any big discrepancies between left and right.',
      'For mobility issues: Check hip joint mobility and muscular/capsular/myofascial restrictions.',
    ],
  },
  'OBU-06': {
    testCode: 'OBU-06',
    testName: 'Pelvic Tilt Test',
    purpose:
      'Tests overall mobility of the hips and the lumbar spine and their ability to control the position of the pelvic posture. The ability to move and control the position of the pelvis is critical for optimal power transfer from the lower body to the upper body during the hitting motion.',
    equipment: ['Open space'],
    startingPosition:
      'Assume normal hitting posture then place arms across the chest (hands resting on the shoulders). Observe starting posture - notice if the lower back has an accentuated arch (S-posture), if it is flat (neutral posture), or if it is rounded into a slouched position (C-posture).',
    procedure: [
      'Once the starting position is established, ask player to tilt the pelvis anteriorly or forward, increasing the arch in the lumbar spine.',
      'Once this move is accomplished, ask player to tilt the pelvis posterior, or backward, removing the arch from the lower back.',
      'Proper execution yields a forward and backward tilting of the pelvis with minimal leg/knee movement and limited upper body forward and backward movement.',
      'Observe the smoothness or "shake and bake" nature of the movement - this indicates muscle usage frequency.',
      'Make sure to observe the amount of motion in both directions. There can be limitations found in one direction as compared to the other.',
    ],
    scoringCriteria: {
      pass: 'Athletic Posture/Neutral Tilt with Normal Motion in both directions and Smooth Movement.',
      neutral: 'Hard Time Arching Back OR Hard Time Flattening Back (one direction limited).',
      fail: 'S-Posture/C-Posture, Both Limited motion, or "Shake and Bake" Movement (jerky/choppy).',
    },
    commonErrors: [
      'Players attempting to tilt their pelvis with their knees and legs - shows as thrusting forward and backward with hips.',
      'Players attempting to tilt via their upper body and back - shows as thrusting forward and backward with torso.',
      'Players may be embarrassed - perform the movement with them at the same time.',
      'Not isolating pelvic movement from rest of body.',
    ],
    modifications: [
      'Lumbar Spine Mobility: If posterior tilt is limited, check for degenerative disc disease, joint arthritis, or disc pathologies.',
      'Lower Crossed Syndrome: Most common cause - tight hip flexors, tight erector spinae, weakness in abdominals and glutes.',
      'Poor coordination ("shake and bake"): Usually a disconnect between brain and pelvis or lack of training.',
    ],
  },
  'OBU-07': {
    testCode: 'OBU-07',
    testName: 'Pelvic Rotation Test',
    purpose:
      'Tests player\'s ability to rotate the lower body independently from the upper body. This is an important skill for properly sequencing the stride and to create a good separation between the upper and lower body. This movement requires good mobility of the spine, hips and pelvis, along with simultaneous stability of the thorax.',
    equipment: ['Open floor space'],
    startingPosition:
      'Assume normal hitting posture then place arms across the chest (hands resting on the shoulders). Feet should be shoulder width apart.',
    procedure: [
      'Tell player to not move their upper body while trying to rotate the lower body (belt and below) back and forth.',
      'Look for any movement of the shoulders or excessive lateral motion of the pelvis versus rotation.',
      'It should appear as if the player is doing the twist with no shoulder motion.',
      'Continue testing in both directions, monitoring the fluidity of motion.',
      'Monitor all body segments above the waist line including torso, shoulders, arms, and head/neck region.',
      'If they have difficulty, try to differentiate between stability or mobility problem: Hold their upper body stable for them while having them try to rotate. If they still can\'t separate, it\'s a mobility problem. If they can separate, it\'s a stability problem.',
    ],
    scoringCriteria: {
      pass: 'Good rotation without holding, smooth turn in both directions with no choppiness or lateral movement, and Good Rotary Movement coordination.',
      neutral: 'Limited without holding but Improves when holding shoulders (stability issue).',
      fail: 'Limited rotation that Doesn\'t Improve when holding, or More Lateral Movement than rotation (lateral shifting vs rotary motion).',
    },
    commonErrors: [
      'Allowing trunk to rotate with pelvis',
      'Shifting of pelvis in lateral direction instead of rotary motion',
      'Excessive knee bending and straightening',
      'Gross leg movement patterns (should be minimal)',
      'Not testing both conditions (without and with holding)',
    ],
    modifications: [
      'For Mobility Restrictions: Check thoracic/lumbar spine mobility and pelvic tilt position during test.',
      'Check for muscular/myofascial restrictions in lats, erector spinae, multifidus, deep spinal rotators, quadratus lumborum.',
      'Check hip mobility - hip internal rotation is a key factor.',
      'For Stability Loss: Usually due to lack of stability-dominated training.',
      'For Poor Coordination: Many players have physical abilities but need to learn the pattern using obliques, leg muscles and intrinsic hip rotators.',
    ],
  },
  'OBU-08': {
    testCode: 'OBU-08',
    testName: 'Deep Squat (SFMA Variation)',
    purpose:
      'Tests for bilateral symmetrical mobility of the hips, knees and ankles.',
    equipment: ['Open floor space'],
    startingPosition:
      'Feet together, arms out in front of their body, toes pointed straight ahead.',
    procedure: [
      'Descend as deeply as possible into a squat position, allowing the arms to remain out front.',
      'The squat position should be maintained with the heels on the floor and head and chest facing forward.',
      'If the player breaks parallel (hips below knees) at the bottom of the squat, have them try to lower their arms to touch their fists on the floor within their footprint.',
      'They should be able to remain stable at the bottom of the squat throughout the movement.',
      'Observe from the front and side.',
      'Foot position should remain unchanged throughout the movement.',
      'Knees are allowed to move outward during the squat.',
    ],
    scoringCriteria: {
      pass: 'Good Squat with arms in front - thighs break parallel, touches fists to floor within footprint, maintains sagittal plane, without excessive effort and/or motor control issues.',
      neutral: 'Limited Squat that improves with arms down (stability issue) - "Improves with Holding".',
      fail: 'Limited Squat that remains Unstable with arms down (mobility issue) - heels lift, falls over backwards, or cannot break parallel.',
    },
    commonErrors: [
      'Heels lifting off ground',
      'Ankles externally rotating',
      'Falls over backwards',
      'Knees caving inward',
      'Excessive forward trunk lean',
      'Do not coach the movement - simply repeat instructions if needed',
    ],
  },
  'OBU-09': {
    testCode: 'OBU-09',
    testName: 'Hurdle Step (FMS Variation)',
    purpose:
      'Requires proper coordination and stability between the hips, moving asymmetrically with one bearing the load of the body while the other moves freely. The pelvis and core must begin with and maintain stability and alignment throughout the movement pattern. Excessive upper body movement in basic stepping is viewed as compensation. The hurdle step challenges bilateral mobility and stability of the hips, knees and ankles, and offers an opportunity to observe functional symmetry.',
    equipment: ['Bat placed across shoulders (below neck)', 'Home plate (for alignment)'],
    startingPosition:
      'Stand tall, feet touching at both heels and toes and with the toes aligned and touching the base of home plate. Position the bat across the shoulders, below the neck.',
    procedure: [
      'Raise left foot up to knee height and touch the heel to the center of home plate while maintaining a tall spine, then return the moving leg to the starting position.',
      'The hurdle step is performed slowly and under control.',
      'Score the moving leg and repeat the test on both sides.',
      'Tell the player to stand as tall as possible at the beginning of the test.',
      'Watch for a stable torso.',
      'Observe from the front and side.',
      'Make sure the toes of the stance leg stay in contact with the plate during and after each repetition.',
    ],
    scoringCriteria: {
      pass: 'Good - hips, knees and ankles remain aligned in sagittal plane, minimal to no movement noted in lumbar spine, bat remains parallel.',
      neutral: 'Unstable Posture - completes movement but with compensations (alignment lost, movement in lumbar spine, or bat not parallel).',
      fail: 'Falls - cannot complete movement without loss of balance.',
    },
    commonErrors: [
      'Alignment is lost between hips, knees and ankles',
      'Movement noted in lumbar spine',
      'Bat does not remain parallel',
      'Loss of balance',
      'Hip hiking instead of true hip flexion',
      'Rushing the movement',
    ],
    modifications: [
      'Potential Mobility Limitations: Hip flexion/extension joint restrictions, ankle mobility restrictions, muscular/capsular/myofascial restrictions in hip and pelvic musculature.',
      'Potential Stability Limitations: Weight bearing hip/thorax/ankle stability dysfunction, postural stability problem.',
    ],
  },
  'OBU-10': {
    testCode: 'OBU-10',
    testName: 'Multi-Segmental Rotation (MSR)',
    purpose:
      'Tests for normal rotational mobility in the trunk, pelvis, hips, knees and feet. This test evaluates the coordinated rotational mobility essential for hitting and throwing mechanics.',
    equipment: ['Bat placed across the back of the top of the shoulders'],
    startingPosition:
      'Standing with feet together, toes pointing forward and hands holding the ends of a bat placed across the back of the top of the shoulders.',
    procedure: [
      'Player rotates their entire body – hips, shoulders, bat and head – as far as possible to the right while foot position remains unchanged.',
      'Have the player return to the starting position and rotate to the left.',
      'Observe from the back.',
      'Foot position should remain unchanged throughout the movement.',
      'Do not coach the movement; simply repeat the instructions if needed.',
      'Check for any pain during the movement.',
    ],
    scoringCriteria: {
      pass: '> 90° of total rotation (using line from AC joint to AC joint), maintains posture, maintains foot position, performs without excessive effort and/or motor control issues.',
      neutral: '= 90° of rotation - indicates average hip and thorax mobility.',
      fail: '< 90° of rotation - indicates limited hip and thorax mobility.',
    },
    commonErrors: [
      'Hip and/or knee flexion',
      'Spine and/or pelvis deviation',
      'Loss of foot/ankle position',
      'Allowing feet to pivot or lift',
    ],
    modifications: [
      'When limited: Check hip joint restrictions and muscular/capsular/myofascial restrictions in hip and pelvic musculature.',
      'Check thoracic spine mobility and muscular/myofascial restrictions in thorax and spinal muscles.',
      'Potential stability limitations: Weight bearing hip rotation dysfunction, Weight bearing thorax rotation dysfunction.',
    ],
  },
  'OBU-11': {
    testCode: 'OBU-11',
    testName: 'Toe Tap Test',
    purpose:
      'Tests hip internal rotation and highlights any limitations that may affect the player\'s ability to load the hips. Hip and tibial internal rotation and ankle mobility are essential for proper hitting. There is potential for excessive lateral motion in hitting (Sway, Loss of Posture, Drifting, etc.) anytime a player finds restrictions in internal rotation.',
    equipment: ['Bat (handle used as target)'],
    startingPosition:
      'Stand with feet one of their own foot lengths apart. Place handle of the bat directly between the feet.',
    procedure: [
      'Have the player try to rotate the left toe inwards (keeping the heel down) to touch the bat.',
      'This forces the player to rotate around the testing leg.',
      'The toe should easily reach the bat.',
      'Repeat on other leg and compare.',
      'Each lower quarter should be able to rotate enough to touch the bat.',
    ],
    scoringCriteria: {
      pass: 'Touches - toe reaches the bat with good internal hip rotation (over 50 degrees average each direction).',
      neutral: 'Improves with Holding - indicates stability issue rather than mobility.',
      fail: 'Short or No Change - indicates limited hip internal rotation or mobility issue (less than 40 degrees).',
    },
    commonErrors: [
      'Letting the heel come off the ground',
      'Not keeping the pelvis aligned',
      'Allowing the pelvis to tilt',
      'Leaning the trunk to compensate',
      'Moving too quickly through the test',
    ],
    modifications: [
      'Pain may be present with this test - perform slowly and stop if there is any discomfort.',
      'Make sure to note any big discrepancies between left and right.',
      'For mobility issues: Check hip joint mobility and muscular/capsular/myofascial restrictions in hip and pelvic musculature.',
    ],
  },
  'OBU-12': {
    testCode: 'OBU-12',
    testName: 'Ankle Rocking Test',
    purpose:
      'Tests ankle mobility and stability. This will show whether the player has the ability to invert and evert which is critical when loading and weight shifting.',
    equipment: ['Chair'],
    startingPosition:
      'Have player sit on a chair, keep their knees at 90 degrees and their legs separated.',
    procedure: [
      'Have player invert (turn out) both ankles then evert (turn in) both ankles without moving their knees.',
      'If they are unable to perform this without accessory motion, have them place their two fists between their knees to help stabilize.',
      'Have them repeat the test, this time not letting knees and hands separate.',
      'The fists should prevent accessory knee or hip movements and help improve stability dysfunctions.',
    ],
    scoringCriteria: {
      pass: 'Good Inversion and Good Eversion without holding.',
      neutral: 'Limited that Improves with holding - indicates a stability problem.',
      fail: 'If knees continue to move outward even with hands between knees - indicates mobility limitations in the ankles.',
    },
    commonErrors: [
      'Moving entire lower leg instead of isolating ankle',
      'Not testing both inversion and eversion',
      'Not comparing with and without stabilization',
    ],
    modifications: [
      'Ankle joint mobility restrictions are very common, especially with a history of ankle sprains.',
      'Check for muscular/capsular/myofascial restrictions in peroneals, anterior tibialis, gastrocs, soleus, flexors and extensors.',
      'Previous trauma and scar tissue can limit ankle inversion and eversion.',
    ],
  },
  'OBU-13': {
    testCode: 'OBU-13',
    testName: 'Push-Off Test',
    purpose:
      'Test for hip joint and groin mobility, combined with lower body motor control and stability. This is important for generating power during hitting.',
    equipment: ['Rubber or ground marking', 'Open floor space'],
    startingPosition:
      'Have the player stand with their right foot next to the rubber or some mark on the ground. Make sure the right foot is perpendicular to the rubber.',
    procedure: [
      'PART 1: Have the player try to stride out directly sideways as far as they can go, keeping the right foot parallel to the rubber and on the ground. Mark the distance they stepped (front of the rubber to the toe of the striding foot). Measure the distance using their own foot lengths. They should be able to stride at least 5 foot lengths.',
      'PART 2: Repeat Part 1, but this time, allow the player to drive off of the back foot - allowing the back foot to drag. Measure the gain in distance between the two strides. This should be at least 1/2 a foot length gain.',
    ],
    scoringCriteria: {
      pass: 'Good Push Off - Part 1: At least 5 foot lengths stride. Part 2: At least 1/2 foot length gain when driving.',
      neutral: 'Moderate - shows some limitation in stride length or drive distance.',
      fail: 'Limited Push Off - Part 1: Less than 5 foot lengths. Part 2: Less than 1/2 foot length gain.',
    },
    commonErrors: [
      'Collapsing through back leg',
      'Losing balance',
      'Not driving through hip',
      'Back foot not parallel to rubber',
    ],
  },
  'OBU-14': {
    testCode: 'OBU-14',
    testName: 'Separation Test (Elbow Up Slide Test)',
    purpose:
      'Tests the ability to horizontally adduct the shoulder (move the arm across the chest). This is an important skill for properly loading the lead shoulder and generating good power from the arms. This movement requires good mobility of the shoulder girdle and thoracic spine.',
    equipment: ['Bat'],
    startingPosition:
      'In a standing position, begin by holding the bat with their standard grip and position the hands over the right arm pit (with the middle of the handle at nipple height). Make sure the bat is pointing straight up vertical.',
    procedure: [
      'Have the player try to elevate their right elbow above their shoulder line, without tipping the bat, releasing the grip or tilting the spine. Take note of elbow position.',
      'Next, regardless of the height of the elbow, keeping the elbow elevated and the bat vertical, have the player try to shift the hands laterally away from the body as far as possible without rotating the shoulders or hips.',
      'Note the position of the hands: Inside the elbow joint, Over the elbow joint, or Outside the elbow joint.',
      'Repeat on the opposite side for symmetry.',
    ],
    scoringCriteria: {
      pass: 'Elbow Up with Hands Past Elbow (Outside of elbow joint) - indicates good shoulder horizontal adduction and scapular stability.',
      neutral: 'Elbow = or Above with Hands Over Elbow - indicates average mobility/stability.',
      fail: 'Elbow Below with Hands Inside of Elbow - indicates limited mobility or scapular stability.',
    },
    commonErrors: [
      'Trunk rotating during the screen',
      'Player not keeping their grip secured during the test',
      'Not observing both elbow and hands components',
      'Tipping the bat during the test',
      'Moving too quickly through the test',
    ],
    modifications: [
      'Possible problems: Poor glenohumeral joint mobility or stability, limited shoulder horizontal adduction, poor shoulder internal rotation (usually mirrors horizontal adduction), poor thorax mobility.',
      'For mobility issues: Check shoulder joint restrictions and muscular/capsular/myofascial restrictions in rotator cuff, posterior shoulder capsule, rib cage and thoracic spine.',
    ],
  },
  'OBU-15': {
    testCode: 'OBU-15',
    testName: 'Holding Angle Test',
    purpose:
      'Tests the mobility of the wrists to determine ability to hinge and set. Any limitation in wrist mobility can cause compensation in the set, path and release of the bat, which can ultimately lead to poor mechanics, injuries or both. This test measures wrist hinge (radial deviation) and wrist extension - critically important for maintaining lag in the bat and creating fast bat speed.',
    equipment: ['Bat'],
    startingPosition:
      'Hold bat with standard grip with arms extended straight out in front of them, and the bat held vertical or perpendicular to the ground.',
    procedure: [
      'Have the player slowly lower their hands as low as possible without letting the bat tip forward (it must stay vertical).',
      'Note how low the top of the top hand can go in relationship to the bottom of the sternum.',
      'Have player place finger on the bottom of their sternum before they start the test to give a good visual guideline.',
    ],
    scoringCriteria: {
      pass: 'Above the bottom of the sternum - indicates good wrist mobility (radial deviation and extension).',
      neutral: 'In line with the bottom of the sternum - indicates average wrist mobility.',
      fail: 'Below the bottom of the sternum - indicates limited wrist mobility.',
    },
    commonErrors: [
      'Player letting go or changing their grip during the test',
      'Player not keeping their elbows extended',
      'Bat not staying vertical',
      'Compensating with elbow position',
      'Rushing the assessment',
    ],
    modifications: [
      'For mobility issues: Check carpal mobility - restrictions between carpal bones are extremely common.',
      'Check for muscular/capsular/myofascial restrictions in the wrist and forearm musculature.',
    ],
  },
  'OBU-16': {
    testCode: 'OBU-16',
    testName: 'Seated Trunk Rotation Test (with Cervical Spine)',
    purpose:
      'Tests the rotational mobility in the cervical-thoraco-lumbar spine. Good separation between the upper and lower body is important for proper sequencing, to help generate speed and maintain a stable posture during hitting. Many players lack true thoracic or cervical spine rotation which may cause excessive lumbar spine rotational forces or overuse of the shoulder joint.',
    equipment: ['Chair', 'Bat placed across shoulders in "W" position', 'Home plate (for 45 degree reference)'],
    startingPosition:
      'Have player sit with knees and feet together, body straight up, and arms extended out in the "W" position supporting a bat across the shoulders. Put home plate on the ground to see a 45 degree angle.',
    procedure: [
      'First evaluate right rotation by having the player cross their right foot in front of their left leg and place the foot flat on the ground. This helps eliminate pelvic rotation during the test.',
      'Have the player rotate their thorax to the right as far as possible, keeping the knees together and the feet on the ground.',
      'See if they can rotate past the 45 degree mark.',
      'If they clear the 45 degree mark, ask them to rotate their head in the opposite direction, to the left. They should be able to get their chin over their clavicle (collarbone).',
      'In order to pass right rotation, they must clear both the shoulder turn and the head turn.',
      'Repeat in the opposite direction, switching legs (left on top of right).',
    ],
    scoringCriteria: {
      pass: '> 45° of rotation AND chin over clavicle - indicates good thorax and cervical rotation (typical range 45-60 degrees both directions).',
      neutral: '= 45° of rotation - indicates average thorax rotation.',
      fail: '< 45° of rotation - indicates limited thorax rotation.',
    },
    commonErrors: [
      'Allowing hips to rotate with the trunk',
      'Not keeping feet flat on floor',
      'Leaning instead of pure rotation',
      'Knees and pelvis not staying still and pointing forward',
      'Just rotating shoulder blades instead of true thoracic spine rotation',
    ],
    modifications: [
      'For thoracic spine mobility issues: Check for degenerative joint disease, facet subluxations, or rib cage restrictions.',
      'If thoracic spine has too much kyphosis ("C" Posture), mobility will be greatly reduced.',
      'Check for muscular/myofascial restrictions in lats, erector spinae, multifidus, deep spinal rotators, quadratus lumborum.',
      'Check cervical spine mobility - averages 70 degrees of rotation.',
    ],
  },
};

// Pitcher OnBaseU Instructions - Based on RIT OnBaseU Pitcher's Screen documentation
// Test codes match backend: POBU-01 through POBU-16
export const pitcherOnbaseUInstructions: Record<string, TestInstruction> = {
  'POBU-01': {
    testCode: 'POBU-01',
    testName: 'Shoulder 46 Test',
    purpose:
      'Tests shoulder external rotation mobility. This position places the scapula approximately in the Connection position used during pitching.',
    equipment: ['Home plate (for angle reference)'],
    startingPosition:
      'Using home plate as a guideline, begin the test by standing tall parallel to the 3rd base line. Have the player place their right elbow by their side with their forearm parallel to the ground, thumb pointing up and fingers extended.',
    procedure: [
      'Without rotating the body, have the player externally rotate the right shoulder (rotate their arm towards first base) as far as possible.',
      'The player should be able to point their fingers past 2nd base towards the 4 position.',
      'Now repeat the test starting parallel to the 1st base line.',
      'Try to externally rotate the left shoulder as far as possible.',
      'The player should be able to point their fingers past 2nd base towards the 6 position.',
    ],
    scoringCriteria: {
      pass: 'Past 2nd base (towards the 4 or 6 position) - indicates good shoulder external rotation.',
      neutral: 'Equal to 2nd base - indicates average shoulder external rotation.',
      fail: 'Less than 2nd base - indicates limited shoulder external rotation.',
    },
    commonErrors: [
      'Letting elbow drift off of the body (keep it by their side)',
      'Body rotating, not just the shoulder',
      'Not maintaining elbow at side',
      'Allowing scapula to anteriorly tilt',
      'Athlete arching back to gain range',
    ],
    modifications: [
      'Three possible problems highlighted: Limited glenohumeral ER, limited shoulder girdle stability, or both.',
      'Shoulder instability: Humerus not staying centered in glenoid fossa due to rotator cuff imbalances.',
      'Overdevelopment of internal rotators (lats and subscapularis).',
      'Capsular tightness limiting range of motion.',
      'External rotator injury or weakness (teres minor/infraspinatus).',
      'Mid-scapular muscle weakness (rhomboids, mid-to-lower trapezius, serratus anterior).',
      'C-posture (Upper Crossed Syndrome) altering glenoid fossa position.',
    ],
  },
  'POBU-02': {
    testCode: 'POBU-02',
    testName: 'Shoulder 90/90 Test',
    purpose:
      'Measure range of external rotation in the shoulder and ability to maintain scapular stability in an athletic posture versus a full stride posture. Highlights limitations in mobility of the glenohumeral joint and/or stability of the scapula-thoracic junction. Part of "The Arms" bucket for pitchers.',
    equipment: ['Open floor space'],
    startingPosition:
      'Have the player stand tall and hold their right arm out to the side with 90 degrees of flexion in their elbow and 90 degrees of side abduction at their shoulder joint.',
    procedure: [
      'Without letting them bend their thorax backward, have the player try to externally rotate (rotate up and back) their right hand as far as possible.',
      'Only continue rotating as far as the body will allow with no compromises in posture.',
      'Never perform this test to the point of pain or discomfort.',
      'Once fully rotated, look for position relative to spine angle: Less than Spine Angle, Spine Angle, or More than Spine Angle.',
      'Repeat on the other side.',
    ],
    scoringCriteria: {
      pass: 'Good Shoulder 90/90 - More than Spine Angle, indicates good shoulder external rotation and scapular stability.',
      neutral: 'Spine Angle - average shoulder external rotation.',
      fail: 'Limited Shoulder 90/90 - Less than Spine Angle, indicates limited glenohumeral ER and/or scapular stability.',
    },
    commonErrors: [
      'Scapula moving',
      'Back arching (thorax bending backward)',
      'Elbow dropping',
    ],
    modifications: [
      'For glenohumeral mobility issues: Check shoulder instability, overdevelopment of internal rotators (lats and subscapularis), capsular tightness, external rotator injury/weakness.',
      'For Scapular Stability Limitations: Mid-scapular muscular weakness (rhomboids, mid-to-lower trapezius, serratus anterior), C-posture (Upper Crossed Syndrome).',
    ],
  },
  'POBU-03': {
    testCode: 'POBU-03',
    testName: 'Lat Test',
    purpose:
      'Assess latissimus dorsi flexibility, which affects overhead mobility and can contribute to shoulder issues if restricted. Important for arm action in pitching.',
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
  'POBU-04': {
    testCode: 'POBU-04',
    testName: 'Hitchhiker Test',
    purpose:
      'Assess forearm pronation and supination mobility, important for grip and ball release during pitching.',
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
  'POBU-05': {
    testCode: 'POBU-05',
    testName: 'Hip 45 Test',
    purpose:
      'Tests the external rotational mobility of the lower quarter. Hip and tibial external rotation and ankle mobility are essential for proper pitching mechanics.',
    equipment: ['Home plate (for angle reference)'],
    startingPosition:
      'Have the player get into a 45 degree angle between their feet (use home plate for a guide if needed). Place their hands on their hips and all of their weight on their right leg.',
    procedure: [
      'Have the player try to rotate their pelvis as far as possible toward the unloaded foot (to the left), which is angled at 45 degrees away from the right foot.',
      'Make sure the player keeps the right foot planted firmly on the ground and all of the weight on the right leg.',
      'This forces the player to rotate only around the right leg.',
      'They should be able to rotate their pelvis past the 45 degree mark.',
      'Repeat on the left leg and compare.',
    ],
    scoringCriteria: {
      pass: '> 45 degrees - good hip external rotation (over 50 degrees average).',
      neutral: '= 45 degrees - average hip external rotation.',
      fail: '< 45 degrees - limited hip external rotation.',
    },
    commonErrors: [
      'Letting the testing foot move from starting position',
      'Not keeping weight on the limb being tested',
      'Allowing pelvis to rotate',
      'Rushing measurement',
    ],
    modifications: [
      'Pain may be present - perform slowly and stop if any discomfort.',
      'Note any big discrepancies between left and right.',
      'For mobility issues: Check hip joint mobility and muscular/capsular/myofascial restrictions.',
    ],
  },
  'POBU-06': {
    testCode: 'POBU-06',
    testName: 'Pelvic Tilt Test',
    purpose:
      'Tests overall mobility of the hips and the lumbar spine and their ability to control the position of the pelvic posture. The ability to move and control the position of the pelvis is critical for optimal power transfer from the lower body to the upper body during the pitching motion.',
    equipment: ['Open space'],
    startingPosition:
      'Assume normal hitting posture then place arms across the chest (hands resting on the shoulders). Observe starting posture - notice if the lower back has an accentuated arch (S-posture), if it is flat (neutral posture), or if it is rounded into a slouched position (C-posture).',
    procedure: [
      'Once the starting position is established, ask player to tilt the pelvis anteriorly or forward, increasing the arch in the lumbar spine.',
      'Once this move is accomplished, ask player to tilt the pelvis posterior, or backward, removing the arch from the lower back.',
      'Proper execution yields a forward and backward tilting of the pelvis with minimal leg/knee movement and limited upper body forward and backward movement.',
      'Observe the smoothness or "shake and bake" nature of the movement.',
      'Make sure to observe the amount of motion in both directions.',
    ],
    scoringCriteria: {
      pass: 'Normal Motion - good ability to tilt in both directions with smooth movement.',
      neutral: 'Hard Time Arching Back OR Hard Time Flattening Back (one direction limited).',
      fail: 'Both Limited - restricted motion in both directions, or "shake and bake" movement.',
    },
    commonErrors: [
      'Players attempting to tilt pelvis with knees and legs - shows as hip thrusting.',
      'Players attempting to tilt via upper body and back - shows as torso thrusting.',
      'Players may be embarrassed - perform the movement with them.',
      'Not isolating pelvic motion from lumbar spine.',
    ],
    modifications: [
      'Lumbar Spine Mobility: Check for degenerative disc disease, joint arthritis, or disc pathologies.',
      'Lower Crossed Syndrome: Tight hip flexors, tight erector spinae, weakness in abdominals and glutes.',
      'Poor coordination: Usually a disconnect between brain and pelvis.',
    ],
  },
  'POBU-07': {
    testCode: 'POBU-07',
    testName: 'Pelvic Rotation Test',
    purpose:
      'Tests player\'s ability to rotate the lower body independently from the upper body. This is an important skill for properly sequencing the stride and to create good separation between the upper and lower body. Requires good mobility of the spine, hips and pelvis, along with simultaneous stability of the thorax.',
    equipment: ['Open floor space'],
    startingPosition:
      'Assume normal hitting posture then place arms across the chest (hands resting on the shoulders). Feet should be shoulder width apart.',
    procedure: [
      'Tell player to not move their upper body while trying to rotate the lower body (belt and below) back and forth.',
      'Look for any movement of the shoulders or excessive lateral motion of the pelvis versus rotation.',
      'It should appear as if the player is doing the twist with no shoulder motion.',
      'Monitor the fluidity of motion in both directions.',
      'If they have difficulty, differentiate between stability or mobility problem by holding their upper body stable while they try to rotate.',
    ],
    scoringCriteria: {
      pass: 'Smooth Movement - good rotation without holding, no choppiness or lateral movement.',
      neutral: 'Shake and Bake Movement - indicates instability or lack of control.',
      fail: 'Did Not Test or More Lateral Movement than rotation.',
    },
    commonErrors: [
      'Using trunk to rotate instead of pelvis',
      'Shifting weight instead of rotating (lateral shifting)',
      'Not maintaining athletic posture',
      'Excessive knee bending and straightening',
    ],
    modifications: [
      'For Mobility Restrictions: Check spinal mobility, pelvic tilt position during test.',
      'Check for muscular/myofascial restrictions in lats, erector spinae, multifidus, quadratus lumborum.',
      'Check hip mobility - hip internal rotation is a key factor.',
      'For Stability Loss: Switch to stability-dominated training regimen.',
      'For Poor Coordination: Pattern must be learned using obliques, leg muscles and intrinsic hip rotators.',
    ],
  },
  'POBU-08': {
    testCode: 'POBU-08',
    testName: 'Wide Squat Test (Deep Squat)',
    purpose:
      'Tests for bilateral symmetry mobility of the hips, knees, and ankles. Part of the "Maintain Upright Posture" bucket for pitchers.',
    equipment: ['Open floor space'],
    startingPosition:
      'The player stands with their feet shoulder width apart and arms out in front of their body, toes pointed straight ahead.',
    procedure: [
      'Have them slowly descend into a squat as far as they can go, with their arms to stay out front.',
      'The squat position should be maintained with the heels on the floor and head and chest facing forward.',
      'If the player breaks parallel (hips below knees) at the bottom of the squat, have them lower their arms to touch their fists on the floor within their footprint.',
      'They should be able to remain stable at the bottom of the squat throughout movement.',
    ],
    scoringCriteria: {
      pass: 'Good Squat - thighs break parallel, touches fists to floor within footprint, maintains sagittal plane, without excessive effort and/or motor control issues.',
      neutral: 'Improves with Holding - limited squat that improves with arms down (stability issue).',
      fail: 'Limited Squat - restricted depth, heels lift, poor alignment, or cannot break parallel.',
    },
    commonErrors: [
      'Heels lifting',
      'Knees caving inward',
      'Excessive forward lean',
      'Cannot break parallel',
    ],
    modifications: [
      'For Mobility Issues: Check hip flexion, ankle mobility, knee flexion restrictions.',
      'Check muscular/capsular/myofascial restrictions in hip and pelvic musculature.',
      'For Stability Issues: Weight bearing hip/knee/ankle stability dysfunction.',
    ],
  },
  'POBU-09': {
    testCode: 'POBU-09',
    testName: 'Hurdle Step Test',
    purpose:
      'Requires proper coordination and stability between the hips. The pelvis and core must maintain stability and alignment throughout the movement pattern. Challenges bilateral mobility and stability of the hips, knees and ankles.',
    equipment: ['Bat placed across shoulders (below neck)', 'Home plate (for alignment)'],
    startingPosition:
      'Stand tall, feet touching at both heels and toes and with the toes aligned and touching the base of home plate. Position the bat across the shoulders, below the neck.',
    procedure: [
      'Raise left foot up to knee height and touch the heel to the center of home plate while maintaining a tall spine, then return the moving leg to the starting position.',
      'The hurdle step is performed slowly and under control.',
      'Score the moving leg and repeat the test on both sides.',
      'Watch for a stable torso.',
      'Observe from the front and side.',
    ],
    scoringCriteria: {
      pass: 'Good - hips, knees and ankles remain aligned in sagittal plane, minimal to no movement noted in lumbar spine, bat remains parallel.',
      neutral: 'Unstable Posture - completes movement but with compensations.',
      fail: 'Falls - cannot complete movement without loss of balance.',
    },
    commonErrors: [
      'Alignment is lost between hips, knees and ankles',
      'Movement noted in lumbar spine',
      'Bat does not remain parallel',
      'Loss of balance',
    ],
  },
  'POBU-10': {
    testCode: 'POBU-10',
    testName: 'Multi-Segmental Rotation (MSR)',
    purpose:
      'Tests for normal rotational mobility in the trunk, pelvis, hips, knees and feet. Essential for generating rotational power during pitching.',
    equipment: ['Bat placed across the back of the top of the shoulders'],
    startingPosition:
      'Standing with feet together, toes pointing forward and hands holding the ends of a bat placed across the back of the top of the shoulders.',
    procedure: [
      'Player rotates their entire body – hips, shoulders, bat and head – as far as possible to the right while foot position remains unchanged.',
      'Have the player return to the starting position and rotate to the left.',
      'Observe from the back.',
      'Foot position should remain unchanged throughout the movement.',
      'Do not coach the movement; simply repeat the instructions if needed.',
    ],
    scoringCriteria: {
      pass: '> 90° of total rotation (using line from AC joint to AC joint), maintains posture, maintains foot position.',
      neutral: '= 90° of rotation - indicates average hip and thorax mobility.',
      fail: '< 90° of rotation - indicates limited hip and thorax mobility.',
    },
    commonErrors: [
      'Hip and/or knee flexion',
      'Spine and/or pelvis deviation',
      'Loss of foot/ankle position',
      'Allowing feet to pivot or lift',
    ],
  },
  'POBU-11': {
    testCode: 'POBU-11',
    testName: 'Toe Tap Test',
    purpose:
      'Tests hip internal rotation and highlights any limitations that may affect the player\'s ability to load the hips. Hip and tibial internal rotation and ankle mobility are essential for proper pitching. There is potential for excessive lateral motion anytime a player finds restrictions in internal rotation.',
    equipment: ['Bat (handle used as target)'],
    startingPosition:
      'Stand with feet one of their own foot lengths apart. Place handle of the bat directly between the feet.',
    procedure: [
      'Have the player try to rotate the left toe inwards (keeping the heel down) to touch the bat.',
      'This forces the player to rotate around the testing leg.',
      'The toe should easily reach the bat.',
      'Repeat on other leg and compare.',
      'Each lower quarter should be able to rotate enough to touch the bat.',
    ],
    scoringCriteria: {
      pass: 'Touches - good internal hip rotation (over 50 degrees average).',
      neutral: 'No Improvement when stabilized - may need more work on control.',
      fail: 'Short - limited internal hip rotation (less than 40 degrees).',
    },
    commonErrors: [
      'Letting the heel come off the ground',
      'Not keeping the pelvis aligned',
      'Tilting pelvis to compensate',
      'Leaning trunk',
      'Moving too quickly',
    ],
    modifications: [
      'Pain may be present - perform slowly and stop if any discomfort.',
      'Note any big discrepancies between left and right.',
      'For mobility issues: Check hip joint mobility and muscular/capsular/myofascial restrictions.',
    ],
  },
  'POBU-12': {
    testCode: 'POBU-12',
    testName: 'Ankle Rock and Roll Test',
    purpose:
      'Test for ankle stability and mobility. This will show whether the player can invert and evert the ankles and rotate the tibia which are all critical when loading and weight shifting. Part of "The Stride" bucket for pitchers.',
    equipment: ['Chair'],
    startingPosition:
      'Having the player sit on a chair, keep their knees at 90 degrees and their legs separated.',
    procedure: [
      'ROCKING: Have the player evert both ankles (roll in) then invert both ankles (roll out) without moving their knees. If they are unable to do this without accessory motion, hold their knees to help stabilize and repeat the test.',
      'ROLLING: Have the player rotate their feet in and out (internally and externally), keeping the knee still and flexed.',
    ],
    scoringCriteria: {
      pass: 'Good Ankle Rocking - Rocking portion: 30 degrees inversion and 20 degrees eversion. Rolling portion: 20 degrees internal rotation and 40 degrees external rotation.',
      neutral: 'Moderate limitation - some restriction in one direction.',
      fail: 'Limited Ankle Rocking - If knees continue to move or they cannot move ankles when holding knees (mobility limitation). If they can\'t do motion without external stability but can when someone holds knees (stability problem).',
    },
    commonErrors: [
      'Moving entire lower leg',
      'Not isolating ankle motion',
      'Rushing the test',
      'Knees moving during test',
    ],
    modifications: [
      'Ankle Joint Mobility: Restrictions very common especially with history of ankle sprains.',
      'Fascial Restrictions: Any restriction in anterior or posterior chain can lead to ankle or tibial rotation limitations.',
    ],
  },
  'POBU-13': {
    testCode: 'POBU-13',
    testName: 'Push-Off Test',
    purpose:
      'Test for hip joint and groin mobility, combined with lower body motor control and stability. This is extremely important for a pitcher to be able to make a large stride. Part of "The Stride" bucket for pitchers.',
    equipment: ['Rubber or ground marking', 'Open floor space'],
    startingPosition:
      'Have the player stand with their right foot next to the rubber or some mark on the ground. Make sure the right foot is perpendicular to the rubber.',
    procedure: [
      'PART 1: Have the player try to stride out directly sideways as far as they can go, keeping the right foot parallel to the rubber and on the ground. Mark the distance they stepped (front of the rubber to the toe of the striding foot). Measure the distance using their own foot lengths. They should be able to stride at least 5 foot lengths.',
      'PART 2: Repeat Part 1, but this time, allow the player to drive off of the back foot as they would with a normal pitch - allowing the back foot to drag. Measure the gain in distance between the two strides. This should be at least 1/2 a foot length gain.',
    ],
    scoringCriteria: {
      pass: 'Good Push Off - Part 1: At least 5 foot lengths stride. Part 2: At least 1/2 foot length gain when driving.',
      neutral: 'Moderate - shows some limitation in stride or drive.',
      fail: 'Limited Push Off - Part 1: Less than 5 foot lengths. Part 2: Less than 1/2 foot length gain.',
    },
    commonErrors: [
      'Collapsing through back leg',
      'Losing balance',
      'Not driving through hip',
      'Back foot not parallel to rubber',
    ],
  },
  'POBU-14': {
    testCode: 'POBU-14',
    testName: 'Separation Test (Elbow Up Slide Test)',
    purpose:
      'Tests the ability to horizontally adduct the shoulder (move the arm across the chest). Important for properly loading the lead shoulder and generating power from the arms during pitching.',
    equipment: ['Bat'],
    startingPosition:
      'In a standing position, begin by holding the bat with their standard grip and position the hands over the right arm pit (with the middle of the handle at nipple height). Make sure the bat is pointing straight up vertical.',
    procedure: [
      'Have the player try to elevate their right elbow above their shoulder line, without tipping the bat, releasing the grip or tilting the spine.',
      'Next, keeping the elbow elevated and the bat vertical, have the player try to shift the hands laterally away from the body as far as possible without rotating the shoulders or hips.',
      'Note the position of the hands: Inside the elbow joint, Over the elbow joint, or Outside the elbow joint.',
      'Repeat on the opposite side for symmetry.',
    ],
    scoringCriteria: {
      pass: 'Elbow Up with Hands Past Elbow (Outside of elbow joint) - good shoulder horizontal adduction and scapular stability.',
      neutral: 'Elbow = or Above with Hands Over Elbow - average mobility/stability.',
      fail: 'Elbow Below with Hands Inside of Elbow - limited mobility or scapular stability.',
    },
    commonErrors: [
      'Trunk rotating during the screen',
      'Player not keeping their grip secured during the test',
      'Tipping the bat during the test',
    ],
  },
  'POBU-15': {
    testCode: 'POBU-15',
    testName: 'Holding Angle Test',
    purpose:
      'Tests the mobility of the wrists to determine ability to hinge and set. Wrist hinge (radial deviation) and wrist extension are important for grip and release during pitching.',
    equipment: ['Bat'],
    startingPosition:
      'Hold bat with standard grip with arms extended straight out in front of them, and the bat held vertical or perpendicular to the ground.',
    procedure: [
      'Have the player slowly lower their hands as low as possible without letting the bat tip forward (it must stay vertical).',
      'Note how low the top of the top hand can go in relationship to the bottom of the sternum.',
      'Have player place finger on the bottom of their sternum before they start the test to give a good visual guideline.',
    ],
    scoringCriteria: {
      pass: 'Above the bottom of the sternum - indicates good wrist mobility.',
      neutral: 'In line with the bottom of the sternum - indicates average wrist mobility.',
      fail: 'Below the bottom of the sternum - indicates limited wrist mobility.',
    },
    commonErrors: [
      'Player letting go or changing their grip during the test',
      'Player not keeping their elbows extended',
      'Bat not staying vertical',
    ],
  },
  'POBU-16': {
    testCode: 'POBU-16',
    testName: 'Seated Trunk Rotation Test',
    purpose:
      'Tests the rotational mobility in the cervical-thoraco-lumbar spine. Good separation between the upper and lower body is important for proper sequencing, to help generate speed and maintain a stable posture. Many players lack true thoracic or cervical spine rotation.',
    equipment: ['Chair', 'Bat placed across shoulders in "W" position', 'Home plate (for 45 degree reference)'],
    startingPosition:
      'Have player sit with knees and feet together, body straight up, and arms extended out in the "W" position supporting a bat across the shoulders. Put home plate on the ground to see a 45 degree angle.',
    procedure: [
      'First evaluate right rotation by having the player cross their right foot in front of their left leg and place the foot flat on the ground. This helps eliminate pelvic rotation during the test.',
      'Have the player rotate their thorax to the right as far as possible, keeping the knees together and the feet on the ground.',
      'See if they can rotate past the 45 degree mark.',
      'If they clear the 45 degree mark, ask them to rotate their head in the opposite direction. They should be able to get their chin over their clavicle.',
      'In order to pass right rotation, they must clear both the shoulder turn and the head turn.',
      'Repeat in the opposite direction, switching legs.',
    ],
    scoringCriteria: {
      pass: 'Good Seated Trunk Rotation - > 45° rotation AND chin over clavicle (typical range 45-60 degrees both directions).',
      neutral: '= 45° rotation - average thorax rotation.',
      fail: 'Limited Seated Trunk Rotation - < 45° rotation or cannot get chin over clavicle.',
    },
    commonErrors: [
      'Hips rotating with trunk',
      'Leaning instead of rotating',
      'Feet lifting off floor',
      'Knees and pelvis not staying still',
      'Just rotating shoulder blades instead of true thoracic spine rotation',
    ],
    modifications: [
      'Thoracic spine mobility: Check for degenerative joint disease, facet subluxations, or rib cage restrictions.',
      'If thoracic spine has too much kyphosis ("C" Posture), mobility will be greatly reduced.',
      'Check muscular/myofascial restrictions in lats, erector spinae, multifidus, deep spinal rotators, quadratus lumborum.',
      'Cervical spine mobility: Averages 70 degrees of rotation.',
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
