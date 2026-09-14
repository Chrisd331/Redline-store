import { cache } from 'react';
import { supabaseServer } from '../../../lib/supabase-server';

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

const DAY_TYPE_PILL = { low: 'Low carb', high: 'High carb', refeed: 'Refeed' };

function formatTarget(ex) {
  const parts = [`${ex.target_sets ?? '—'} × ${ex.target_reps ?? '—'}`];
  if (ex.target_load != null) parts.push(`${ex.target_load} kg`);
  if (ex.target_rpe != null) parts.push(`RPE ${ex.target_rpe}`);
  return `Target · ${parts.join(' · ')}`;
}

// Fetches TODAY's assigned training session for the CURRENTLY AUTHENTICATED
// client only. Every query is scoped to this user's own id (or to rows
// already reached through a query scoped that way) — RLS from migration
// 0004 enforces the same boundary independently either way.
export const getTrainingData = cache(async function getTrainingData() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { hasSession: false, subCopy: 'Log in to see your session.' };
  }

  const clientId = user.id;
  const todayStr = isoDate(new Date());

  // ---- the ONE active plan, same rule as Home ----
  const { data: plan } = await supabase
    .from('plans')
    .select('id')
    .eq('client_id', clientId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) {
    return { hasSession: false, subCopy: "Your coach hasn't set up an active plan yet." };
  }

  const { data: planDay } = await supabase
    .from('plan_days')
    .select('day_type, training_session_id')
    .eq('plan_id', plan.id)
    .eq('date', todayStr)
    .maybeSingle();

  const cyclePill = planDay?.day_type ? DAY_TYPE_PILL[planDay.day_type] : null;

  if (!planDay?.training_session_id) {
    return {
      hasSession: false,
      cyclePill,
      subCopy: 'Nothing assigned today — rest, or check with your coach.',
    };
  }

  const sessionId = planDay.training_session_id;

  const { data: session } = await supabase
    .from('training_sessions')
    .select('id, program_id, name, session_date')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) {
    return { hasSession: false, cyclePill, subCopy: 'Nothing assigned today — rest, or check with your coach.' };
  }

  const [{ data: exercises }, { data: sessionLog }, { data: programSessions }] = await Promise.all([
    supabase
      .from('session_exercises')
      .select('id, name, sort_order, target_sets, target_reps, target_load, target_rpe')
      .eq('session_id', sessionId)
      .order('sort_order', { ascending: true }),
    supabase.from('training_session_logs').select('completed').eq('session_id', sessionId).eq('client_id', clientId).maybeSingle(),
    supabase
      .from('training_sessions')
      .select('id, session_date')
      .eq('program_id', session.program_id)
      .order('session_date', { ascending: true }),
  ]);

  const exerciseList = exercises || [];
  const exerciseIds = exerciseList.map((e) => e.id);

  const { data: todayLogs } = exerciseIds.length
    ? await supabase
        .from('session_exercise_logs')
        .select('session_exercise_id, set_number, actual_reps, actual_load, completed')
        .in('session_exercise_id', exerciseIds)
    : { data: [] };

  const todayLogsByExercise = new Map();
  (todayLogs || []).forEach((log) => {
    if (!todayLogsByExercise.has(log.session_exercise_id)) todayLogsByExercise.set(log.session_exercise_id, new Map());
    todayLogsByExercise.get(log.session_exercise_id).set(log.set_number, log);
  });

  // ---- previous performance: most recent PRIOR session (any program) that
  // used the same exercise name, so the client can see what to beat ----
  const exerciseNames = [...new Set(exerciseList.map((e) => e.name))];
  const priorSetsByName = new Map();
  const priorSummaryByName = new Map();

  if (exerciseNames.length) {
    const [{ data: pastSessions }, { data: pastExercises }] = await Promise.all([
      supabase
        .from('training_sessions')
        .select('id, session_date')
        .eq('client_id', clientId)
        .neq('id', sessionId)
        .order('session_date', { ascending: false })
        .limit(200),
      supabase
        .from('session_exercises')
        .select('id, session_id, name')
        .eq('client_id', clientId)
        .in('name', exerciseNames)
        .neq('session_id', sessionId),
    ]);

    const sessionRank = new Map((pastSessions || []).map((s, i) => [s.id, i]));
    const bestByName = new Map(); // name -> { exerciseId, rank }
    (pastExercises || []).forEach((ex) => {
      const rank = sessionRank.get(ex.session_id);
      if (rank === undefined) return;
      const current = bestByName.get(ex.name);
      if (!current || rank < current.rank) bestByName.set(ex.name, { exerciseId: ex.id, rank });
    });

    const priorExerciseIds = [...bestByName.values()].map((v) => v.exerciseId);
    if (priorExerciseIds.length) {
      const { data: priorLogs } = await supabase
        .from('session_exercise_logs')
        .select('session_exercise_id, set_number, actual_reps, actual_load, completed')
        .in('session_exercise_id', priorExerciseIds)
        .order('set_number', { ascending: true });

      const logsByExerciseId = new Map();
      (priorLogs || []).forEach((log) => {
        if (!logsByExerciseId.has(log.session_exercise_id)) logsByExerciseId.set(log.session_exercise_id, []);
        logsByExerciseId.get(log.session_exercise_id).push(log);
      });

      bestByName.forEach(({ exerciseId }, name) => {
        const logs = logsByExerciseId.get(exerciseId) || [];
        priorSetsByName.set(name, new Map(logs.map((l) => [l.set_number, l])));
        const completedLogs = logs.filter((l) => l.completed);
        const loads = completedLogs.map((l) => l.actual_load).filter((v) => v != null);
        priorSummaryByName.set(name, {
          maxLoad: loads.length ? Math.max(...loads) : null,
          completedCount: completedLogs.length,
          totalCount: logs.length,
        });
      });
    }
  }

  const finalExercises = exerciseList.map((ex, i) => {
    const todayForEx = todayLogsByExercise.get(ex.id) || new Map();
    const priorForEx = priorSetsByName.get(ex.name) || new Map();
    const setCount = ex.target_sets || todayForEx.size || 0;

    const sets = Array.from({ length: setCount }, (_, idx) => {
      const n = idx + 1;
      const todayLog = todayForEx.get(n);
      const priorLog = priorForEx.get(n);
      const defaultLoad = todayLog?.actual_load ?? priorLog?.actual_load ?? ex.target_load ?? '';
      const defaultReps = todayLog?.actual_reps ?? priorLog?.actual_reps ?? ex.target_reps ?? '';
      return {
        n,
        weight: defaultLoad,
        reps: defaultReps,
        on: todayLog?.completed === true,
      };
    });

    const completedCount = sets.filter((s) => s.on).length;

    return {
      id: ex.id,
      sessionExerciseId: ex.id,
      num: String(i + 1).padStart(2, '0'),
      name: ex.name,
      target: formatTarget(ex),
      status: `${completedCount} / ${sets.length}`,
      statusMuted: completedCount === 0,
      sets,
    };
  });

  const totalWorkingSets = exerciseList.reduce((sum, e) => sum + (e.target_sets || 0), 0);

  const sessionIndex = (programSessions || []).findIndex((s) => s.id === sessionId);
  const sessionNumber = sessionIndex >= 0 ? sessionIndex + 1 : null;

  const anyLogged = (todayLogs || []).length > 0;
  const badge = sessionLog?.completed ? 'COMPLETED' : anyLogged ? 'IN PROGRESS' : 'NOT STARTED';

  const firstExercise = exerciseList[0];
  const firstSummary = firstExercise ? priorSummaryByName.get(firstExercise.name) : null;
  const lastExposure =
    firstExercise && firstSummary && firstSummary.maxLoad != null
      ? {
          kicker: firstExercise.name,
          value: String(firstSummary.maxLoad),
          unit: 'kg',
          note: `${firstSummary.completedCount} of ${firstSummary.totalCount} sets logged`,
          delta: '',
        }
      : null;

  return {
    hasSession: true,
    clientId,
    sessionId,
    sessionLabel: sessionNumber ? `Training · Session ${sessionNumber}` : 'Training',
    title: session.name,
    sub: 'Your targets are already loaded. Log only what you actually lift.',
    cyclePill,
    hero: {
      kicker: "Today's assigned session",
      name: session.name,
      badge,
      stats: [
        { k: 'Exercises', v: String(exerciseList.length) },
        { k: 'Working sets', v: String(totalWorkingSets) },
        { k: 'Est. time', v: '—' },
      ],
    },
    exercises: finalExercises,
    brief: {
      kicker: 'Performance intent',
      title: 'Follow the prescribed load and RPE.',
      body: "Log exactly what you lift — your coach reviews this to adjust next week's targets.",
    },
    lastExposure,
    sessionCompleted: sessionLog?.completed === true,
  };
});
