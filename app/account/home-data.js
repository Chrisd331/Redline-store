import { cache } from 'react';
import { supabaseServer } from '../../lib/supabase-server';

// ---------- date helpers (UTC-based: the schema has no per-client
// timezone yet, so "today" is computed in UTC — see report/assumptions) ----------

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function startOfIsoWeek(d) {
  const day = d.getUTCDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

function getWeekDates(today) {
  const monday = startOfIsoWeek(today);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setUTCDate(monday.getUTCDate() + i);
    return isoDate(dt);
  });
}

function formatDateLabel(d) {
  const weekday = new Intl.DateTimeFormat('en-AU', { weekday: 'long', timeZone: 'UTC' }).format(d);
  const day = new Intl.DateTimeFormat('en-AU', { day: 'numeric', timeZone: 'UTC' }).format(d);
  const month = new Intl.DateTimeFormat('en-AU', { month: 'long', timeZone: 'UTC' }).format(d);
  return `${weekday} · ${day} ${month}`;
}

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------- copy templates, selected by real day_type (not fabricated per-client facts) ----------

const DAY_TYPE_COPY = {
  low: {
    titlePrefix: 'LOW',
    titleEmphasis: 'CARB',
    titleSuffix: 'DAY',
    copy: 'Fuel is pulled back today. Protein stays high, carbs stay controlled, and your assigned meals already match the target.',
  },
  high: {
    titlePrefix: 'HIGH',
    titleEmphasis: 'CARB',
    titleSuffix: 'DAY',
    copy: 'Carbs are back up today to refill the tank. Hit your training hard and let the extra fuel do its job.',
  },
  refeed: {
    titlePrefix: '',
    titleEmphasis: 'REFEED',
    titleSuffix: 'DAY',
    copy: "Today's a planned refeed. Follow the numbers exactly — this is a deliberate part of the plan, not a cheat day.",
  },
};

const NO_DAY_COPY = {
  titlePrefix: 'NO',
  titleEmphasis: 'DAY',
  titleSuffix: 'SET',
  copy: "Your coach hasn't set today's targets yet. Check back soon, or message them if you're expecting an update.",
};

function firstName(profile, user) {
  const full = profile?.name || user.user_metadata?.full_name || '';
  const first = full.trim().split(/\s+/)[0];
  return first || 'there';
}

function computeWeekLabel(plan, today) {
  if (!plan.start_date) return null;
  const start = new Date(`${plan.start_date}T00:00:00Z`);
  const diffDays = Math.floor((today - start) / 86400000);
  const weekNum = Math.max(1, Math.floor(diffDays / 7) + 1);
  if (plan.end_date) {
    const end = new Date(`${plan.end_date}T00:00:00Z`);
    const totalDays = Math.floor((end - start) / 86400000) + 1;
    const totalWeeks = Math.max(weekNum, Math.ceil(totalDays / 7));
    return `Week ${weekNum} / ${totalWeeks}`;
  }
  return `Week ${weekNum}`;
}

// Fetches everything the Home screen needs for the CURRENTLY AUTHENTICATED
// client only — every query below is scoped by client_id = this user's own
// id, and RLS (migration 0004) independently enforces the same boundary
// server-side regardless of what this code does. cache() dedupes this
// within a single request (the layout already called auth.getUser() once).
export const getHomeData = cache(async function getHomeData() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The account layout already redirects logged-out visitors before this
  // ever renders, but fail safe rather than crash if it's ever called
  // without a session.
  if (!user) {
    return {
      hasPlan: false,
      dateLabel: formatDateLabel(new Date()),
      clientFirstName: 'there',
      subCopy: 'Log in to see your plan.',
    };
  }

  const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).maybeSingle();

  const now = new Date();
  const todayStr = isoDate(now);
  const clientFirstName = firstName(profile, user);
  const dateLabel = formatDateLabel(now);

  // ---- the ONE active plan driving this screen ----
  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('client_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) {
    return {
      hasPlan: false,
      dateLabel,
      clientFirstName,
      subCopy: "Your coach hasn't set up an active plan yet.",
    };
  }

  // ---- today's plan_day, and the current Mon–Sun week for the cycle strip ----
  const weekDates = getWeekDates(now);
  const [{ data: planDay }, { data: weekDays }] = await Promise.all([
    supabase.from('plan_days').select('*').eq('plan_id', plan.id).eq('date', todayStr).maybeSingle(),
    supabase.from('plan_days').select('date, day_type').eq('plan_id', plan.id).in('date', weekDates),
  ]);

  const weekDaysByDate = new Map((weekDays || []).map((d) => [d.date, d.day_type]));
  const cycleSteps = weekDates.map((date) => {
    if (date === todayStr) return 'active';
    if (weekDaysByDate.get(date) === 'low') return 'low';
    return 'normal';
  });

  const todayJsDay = now.getUTCDay(); // 0=Sun..6=Sat
  const todayIsoWeekday = todayJsDay === 0 ? 7 : todayJsDay; // 1=Mon..7=Sun

  let nextLabel = null;
  const todayIndex = weekDates.indexOf(todayStr);
  for (let i = todayIndex + 1; i < weekDates.length; i++) {
    const dayType = weekDaysByDate.get(weekDates[i]);
    if (dayType === 'high' || dayType === 'refeed') {
      const weekday = WEEKDAY_ABBR[new Date(`${weekDates[i]}T00:00:00Z`).getUTCDay()];
      nextLabel = `Next: ${dayType[0].toUpperCase()}${dayType.slice(1)} · ${weekday}`;
      break;
    }
  }

  const dayCopy = planDay ? DAY_TYPE_COPY[planDay.day_type] || NO_DAY_COPY : NO_DAY_COPY;

  const proteinVal = planDay?.protein_g ?? plan.protein_g ?? null;
  const carbsVal = planDay?.carbs_g ?? plan.carbs_g ?? null;
  const fatsVal = planDay?.fats_g ?? plan.fats_g ?? null;

  // ---- today's assigned training session (via plan_day.training_session_id) ----
  let session = null;
  let exerciseCount = 0;
  let workingSets = 0;
  let sessionDone = false;

  if (planDay?.training_session_id) {
    const [{ data: s }, { data: exercises }, { data: sessionLog }] = await Promise.all([
      supabase.from('training_sessions').select('id, name').eq('id', planDay.training_session_id).maybeSingle(),
      supabase.from('session_exercises').select('target_sets').eq('session_id', planDay.training_session_id),
      supabase
        .from('training_session_logs')
        .select('completed')
        .eq('session_id', planDay.training_session_id)
        .eq('client_id', user.id)
        .maybeSingle(),
    ]);
    session = s;
    exerciseCount = exercises?.length || 0;
    workingSets = (exercises || []).reduce((sum, e) => sum + (e.target_sets || 0), 0);
    sessionDone = sessionLog?.completed === true;
  }

  // ---- today's meals (via plan_day) ----
  let mealsTotal = 0;
  let mealsDone = 0;

  if (planDay) {
    const { data: meals } = await supabase.from('meals').select('id').eq('plan_day_id', planDay.id);
    mealsTotal = meals?.length || 0;
    if (mealsTotal > 0) {
      const { data: logs } = await supabase
        .from('meal_logs')
        .select('completed')
        .in('meal_id', meals.map((m) => m.id))
        .eq('completed', true);
      mealsDone = logs?.length || 0;
    }
  }

  const tasks = [];
  if (session) {
    tasks.push({
      id: 'training',
      icon: 'i-dumbbell',
      name: session.name,
      meta: `${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'} · ${workingSets} working sets · assigned`,
      done: sessionDone,
    });
  }
  if (mealsTotal > 0) {
    tasks.push({
      id: 'meals',
      icon: 'i-utensils',
      name: 'Meals on plan',
      meta: `${mealsDone} of ${mealsTotal} meals complete · ${mealsTotal - mealsDone} remaining`,
      done: mealsDone === mealsTotal,
    });
  }

  // ---- today's wellness logs ----
  const [{ data: stepLog }, { data: sleepLog }] = await Promise.all([
    supabase.from('step_logs').select('steps').eq('client_id', user.id).eq('log_date', todayStr).maybeSingle(),
    supabase
      .from('sleep_logs')
      .select('duration_hours')
      .eq('client_id', user.id)
      .eq('log_date', todayStr)
      .maybeSingle(),
  ]);

  const steps = stepLog?.steps ?? 0;
  const sleepHours = sleepLog?.duration_hours ?? 0;

  const habits = [
    // No water_logs table exists yet (out of scope for this migration) —
    // shown as a known "not tracked" state rather than invented numbers.
    { key: 'water', icon: 'i-drop', pct: 0, big: '—', unit: '', caption: 'Not tracked yet' },
    {
      key: 'steps',
      icon: 'i-foot',
      pct: Math.min(100, Math.round((steps / 10000) * 100)),
      big: steps.toLocaleString(),
      unit: '',
      caption: 'Target 10,000',
    },
    {
      key: 'sleep',
      icon: 'i-moon',
      pct: Math.min(100, Math.round((sleepHours / 8) * 100)),
      big: Number(sleepHours).toFixed(1),
      unit: 'h',
      caption: 'Target 8.0 h',
    },
  ];

  return {
    hasPlan: true,
    dateLabel,
    clientFirstName,
    subCopy: 'Everything is set. Follow the day exactly as assigned.',
    weekLabel: computeWeekLabel(plan, now),
    hero: {
      statusLabel: 'Engine map active',
      cycleDay: `DAY ${todayIsoWeekday}`,
      cycleOf: 'of 7-day cycle',
      ...dayCopy,
      cycleSteps,
      nextLabel,
    },
    macros: [
      { key: 'protein', icon: 'i-dumbbell', label: 'Protein', value: proteinVal ?? '—', unit: proteinVal != null ? 'g' : '' },
      {
        key: 'carbs',
        icon: 'i-bolt',
        label: 'Carbs',
        value: carbsVal ?? '—',
        unit: carbsVal != null ? 'g' : '',
        carbs: true,
      },
      { key: 'fats', icon: 'i-flame', label: 'Fats', value: fatsVal ?? '—', unit: fatsVal != null ? 'g' : '' },
    ],
    tasks,
    habits,
    // No check-ins or coach-notes tables exist yet — see report/assumptions.
    checkin: {
      title: 'No check-in scheduled',
      copy: "Your coach hasn't scheduled a check-in yet.",
    },
    coachNote: {
      title: "Notes from your coach will appear here.",
      body: "This isn't wired up yet — nothing's been sent.",
    },
  };
});
