// Placeholder data for the client coaching app screens.
// Each getter is async on purpose: later stages swap the body for a real
// Supabase query (e.g. `await supabase.from('daily_logs').select(...)`)
// without needing to touch the page or view components that call these.

export async function getHomeData() {
  return {
    dateLabel: 'Thursday · 10 September',
    clientFirstName: 'Jake',
    weekLabel: 'Week 6 / 12',
    hero: {
      statusLabel: 'Engine map active',
      cycleDay: 'DAY 3',
      cycleOf: 'of 7-day cycle',
      titlePrefix: 'LOW',
      titleEmphasis: 'CARB',
      titleSuffix: 'DAY',
      copy: 'Fuel is pulled back today. Protein stays high, carbs stay controlled, and your assigned meals already match the target.',
      cycleSteps: ['low', 'low', 'active', 'normal', 'normal', 'low', 'normal'],
      nextLabel: 'Next: High · Fri',
    },
    macros: [
      { key: 'protein', icon: 'i-dumbbell', label: 'Protein', value: 180, unit: 'g' },
      { key: 'carbs', icon: 'i-bolt', label: 'Carbs', value: 90, unit: 'g', carbs: true },
      { key: 'fats', icon: 'i-flame', label: 'Fats', value: 70, unit: 'g' },
    ],
    tasks: [
      {
        id: 'training',
        icon: 'i-dumbbell',
        name: 'Upper Strength',
        meta: '5 exercises · 16 working sets · assigned',
        done: true,
      },
      {
        id: 'meals',
        icon: 'i-utensils',
        name: 'Meals on plan',
        meta: '3 of 4 meals complete · 1 remaining',
        done: false,
      },
    ],
    habits: [
      { key: 'water', icon: 'i-drop', pct: 80, big: '2.4', unit: 'L', caption: 'Target 3.0 L' },
      { key: 'steps', icon: 'i-foot', pct: 81, big: '8,100', unit: '', caption: 'Target 10,000' },
      { key: 'sleep', icon: 'i-moon', pct: 94, big: '7.5', unit: 'h', caption: 'Target 8.0 h' },
    ],
    checkin: {
      title: 'Check-in due Sunday',
      copy: 'Photos, weight and 60-second questionnaire.',
    },
    coachNote: {
      title: 'Keep today boring.',
      body: "Hit the exact meals, finish the upper session, and leave the extra conditioning alone. Tomorrow is the output day.",
    },
  };
}

export async function getTrainingData() {
  return {
    sessionLabel: 'Training · Session 3',
    title: 'Upper Strength',
    sub: 'Your targets are already loaded. Log only what you actually lift.',
    cyclePill: 'Low carb',
    hero: {
      kicker: "Today's assigned session",
      name: 'Upper Strength',
      badge: 'IN PROGRESS',
      stats: [
        { k: 'Exercises', v: '5' },
        { k: 'Working sets', v: '16' },
        { k: 'Est. time', v: '58 min' },
      ],
    },
    exercises: [
      {
        id: 1,
        num: '01',
        name: 'Barbell Bench Press',
        target: 'Target · 4 × 5 @ RPE 8',
        status: '3 / 4',
        statusMuted: false,
        sets: [
          { n: 1, weight: 105, reps: 5, on: true },
          { n: 2, weight: 105, reps: 5, on: true },
          { n: 3, weight: 105, reps: 5, on: true },
          { n: 4, weight: 105, reps: 5, on: false },
        ],
      },
      { id: 2, num: '02', name: 'Weighted Chin-up', target: 'Target · 4 × 6 · +20 kg', status: '0 / 4', statusMuted: true },
      { id: 3, num: '03', name: 'Incline DB Press', target: 'Target · 3 × 8 · 40 kg', status: '0 / 3', statusMuted: true },
      { id: 4, num: '04', name: 'Chest Supported Row', target: 'Target · 3 × 10 · controlled', status: '0 / 3', statusMuted: true },
      { id: 5, num: '05', name: 'Cable Lateral Raise', target: 'Target · 2 × 15 · each side', status: '0 / 2', statusMuted: true },
    ],
    brief: {
      kicker: 'Performance intent',
      title: 'Heavy, precise, no grinders.',
      body: 'Keep compounds at RPE 8. If bar speed drops sharply, hold the load rather than forcing progression.',
    },
    lastExposure: {
      kicker: 'Bench press',
      value: '102.5',
      unit: 'kg',
      note: '4 × 5 completed',
      delta: '+2.5 KG',
    },
  };
}

export async function getDietData() {
  return {
    dayLabel: 'Diet · Day 3',
    title: 'Low-carb plan',
    sub: "Meals are matched to today's target. Tick them off; swap only inside your coach's rules.",
    ghostPill: '3 / 4 meals',
    status: {
      title: 'Low-carb engine map',
      copy: '90 g carbohydrate target · pre-calculated',
      calories: '1,710',
    },
    macros: [
      { key: 'protein', label: 'Protein', pct: 78, current: 141, target: 180, unit: 'g' },
      { key: 'carbs', label: 'Carbs', pct: 74, current: 67, target: 90, unit: 'g', carbs: true },
      { key: 'fats', label: 'Fats', pct: 86, current: 60, target: 70, unit: 'g' },
    ],
    meals: [
      { id: 1, name: 'Meal 1 · Breakfast', desc: 'Eggs, egg whites, avocado, spinach · 43P / 12C / 24F', done: true },
      { id: 2, name: 'Meal 2 · Lunch', desc: 'Chicken thigh, jasmine rice, greens · 48P / 35C / 16F', done: true },
      { id: 3, name: 'Meal 3 · Pre-training', desc: 'Greek yoghurt, berries, whey · 36P / 20C / 5F', done: true },
      { id: 4, name: 'Meal 4 · Dinner', desc: 'Lean beef, vegetables, olive oil · 53P / 23C / 25F', done: false },
    ],
    timingRule: {
      kicker: 'Carbohydrate placement',
      title: 'Most carbs sit around training.',
      body: 'The plan has already distributed them. No macro maths or manual insulin-timing calculations required from the client.',
    },
    swaps: [
      { title: 'Protein for protein', meta: 'Matched serving only' },
      { title: 'Carb for carb', meta: 'Coach-approved options' },
    ],
  };
}

export async function getSleepData() {
  return {
    eyebrow: 'Recovery · Sleep',
    title: 'Recovery signal',
    sub: 'A fast nightly log with enough trend data to make it useful to training decisions.',
    ghostPill: '7-day avg 7h 28m',
    score: {
      value: 85,
      dashArray: 320.4,
      dashOffset: 48,
      lastNight: '7h 32m · good quality',
      note: "You're close to target and above your 4-week average. No recovery adjustment needed today.",
      qualities: ['Poor', 'Fair', 'Good', 'Great'],
      activeQuality: 'Good',
    },
    log: {
      duration: '7.5',
      wakeups: '1',
    },
    trend: {
      caption: 'Hours slept',
      subcaption: 'Target line · 8h',
      areaPath: 'M0 78 L100 54 L200 70 L300 38 L400 62 L500 45 L600 49 L600 132 L0 132 Z',
      linePath: 'M0 78 L100 54 L200 70 L300 38 L400 62 L500 45 L600 49',
      xLabels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    },
    context: {
      kicker: 'Training response',
      title: 'Stable across the last 7 days.',
      body: 'Sleep has held above 7 hours on five of seven nights while training completion remains 100%.',
    },
    tonightTarget: { kicker: 'Minimum target', value: '8.0', unit: 'hours' },
  };
}

export async function getProgressData() {
  return {
    eyebrow: 'Progress · Week 6',
    title: 'Proof of work.',
    sub: "Trend first, noise second. See what's actually changing across the coaching block.",
    ghostPill: '42 days tracked',
    hero: {
      kicker: 'Current bodyweight',
      value: '85.6',
      unit: 'kg',
      delta: '↓ 2.8 kg since start',
      goalPct: 72,
    },
    weightTrend: {
      caption: 'Bodyweight',
      subcaption: '88.4 kg → 85.6 kg',
      areaPath: 'M0 30 L90 43 L180 45 L270 66 L360 73 L450 89 L540 95 L600 103 L600 132 L0 132 Z',
      linePath: 'M0 30 L90 43 L180 45 L270 66 L360 73 L450 89 L540 95 L600 103',
      xLabels: ['W1', '', 'W2', 'W3', 'W4', 'W5', 'W6'],
    },
    photos: [
      { label: 'Week 1' },
      { label: 'Week 6' },
    ],
    measurements: [
      { key: 'waist', name: 'Waist', delta: '−4.1', value: '82.4', unit: 'cm' },
      { key: 'chest', name: 'Chest', delta: '+0.8', value: '108.2', unit: 'cm' },
      { key: 'thigh', name: 'Thigh', delta: '+0.4', value: '61.9', unit: 'cm' },
      { key: 'arm', name: 'Arm', delta: '+0.6', value: '39.8', unit: 'cm' },
    ],
    cycleHistory: {
      completionPct: 93,
      bars: [
        { h: 82, type: 'high' }, { h: 58, type: 'normal' }, { h: 61, type: 'normal' }, { h: 100, type: 'refeed' },
        { h: 64, type: 'normal' }, { h: 86, type: 'high' }, { h: 60, type: 'normal' }, { h: 58, type: 'normal' },
        { h: 98, type: 'refeed' }, { h: 63, type: 'normal' }, { h: 84, type: 'high' }, { h: 60, type: 'normal' },
        { h: 62, type: 'normal' }, { h: 96, type: 'refeed' },
      ],
    },
    coachAssessment: {
      title: 'Trend is ahead of target.',
      body: 'Weight is moving down while key upper-body measurements are holding. No change to the current cycle yet.',
    },
  };
}
