'use client';

import { useRef, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabase-browser';

function Icon({ id, className = 'icon' }) {
  return (
    <svg className={className}>
      <use href={`#${id}`} />
    </svg>
  );
}

// Neutralises default <input> chrome so it sits inside the existing
// .set-field box looking identical to the old static display value.
const inputResetStyle = {
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  font: 'inherit',
  width: '100%',
  padding: 0,
  outline: 'none',
};

function ExerciseCard({ exercise, sessionId, clientId }) {
  const [sets, setSets] = useState(exercise.sets || []);

  // Per-set-number promise chain. Two saves for the SAME set (e.g. a field's
  // onBlur firing right as the checkbox is tapped) must never race — each
  // write waits for the previous one for that set to finish first, so the
  // save that reflects the latest on-screen state is always the one that
  // lands last in the database, regardless of individual network timing.
  const saveQueue = useRef({});

  const saveSet = (setValue) => {
    const supabase = supabaseBrowser();
    const n = setValue.n;
    const prior = saveQueue.current[n] || Promise.resolve();
    saveQueue.current[n] = prior
      .catch(() => {})
      .then(() =>
        supabase.from('session_exercise_logs').upsert(
          {
            session_exercise_id: exercise.sessionExerciseId,
            session_id: sessionId,
            client_id: clientId,
            set_number: n,
            actual_reps: setValue.reps === '' || setValue.reps == null ? null : Number(setValue.reps),
            actual_load: setValue.weight === '' || setValue.weight == null ? null : Number(setValue.weight),
            completed: !!setValue.on,
          },
          { onConflict: 'session_exercise_id,set_number' }
        )
      );
  };

  // Local-only edit (typing into a field) — no save until blur.
  const updateSet = (n, patch) => {
    setSets((prev) => prev.map((s) => (s.n === n ? { ...s, ...patch } : s)));
  };

  // Reads the CURRENT state via the functional setState form (React
  // guarantees this sees the latest value, not a stale closure) and saves
  // exactly that — used for both "save on blur" and "toggle + save".
  const commitSet = (n, patch = {}) => {
    setSets((prev) => {
      const next = prev.map((s) => (s.n === n ? { ...s, ...patch } : s));
      saveSet(next.find((s) => s.n === n));
      return next;
    });
  };

  const toggleSet = (n) => {
    const current = sets.find((s) => s.n === n);
    commitSet(n, { on: !current?.on });
  };

  const completed = sets.filter((s) => s.on).length;
  const status = sets.length ? `${completed} / ${sets.length}` : exercise.status;
  const statusMuted = sets.length ? completed === 0 : exercise.statusMuted;

  return (
    <section className="card exercise">
      <div className="ex-head">
        <div className="ex-num">{exercise.num}</div>
        <div>
          <div className="ex-name">{exercise.name}</div>
          <div className="ex-target">{exercise.target}</div>
        </div>
        <div className="ex-status" style={statusMuted ? { color: 'var(--muted)' } : undefined}>
          {status}
        </div>
      </div>
      {sets.length > 0 && (
        <div className="set-grid">
          {sets.map((set) => (
            <div className="set-row" key={set.n}>
              <div className="set-n">{set.n}</div>
              <div className="set-field">
                <input
                  type="number"
                  inputMode="decimal"
                  style={inputResetStyle}
                  value={set.weight}
                  onChange={(e) => updateSet(set.n, { weight: e.target.value })}
                  onBlur={() => commitSet(set.n)}
                  aria-label={`Set ${set.n} weight`}
                />
                <span>KG</span>
              </div>
              <div className="set-field">
                <input
                  type="number"
                  inputMode="numeric"
                  style={inputResetStyle}
                  value={set.reps}
                  onChange={(e) => updateSet(set.n, { reps: e.target.value })}
                  onBlur={() => commitSet(set.n)}
                  aria-label={`Set ${set.n} reps`}
                />
                <span>REPS</span>
              </div>
              <button type="button" className={`set-check${set.on ? ' on' : ''}`} onClick={() => toggleSet(set.n)}>
                <Icon id="i-check" className="icon sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyTrainingState({ data }) {
  return (
    <main className="rl-screen">
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Training</div>
            <h1>No session today.</h1>
            <p className="sub">{data.subCopy}</p>
          </div>
          {data.cyclePill && <div className="ghost-pill">{data.cyclePill}</div>}
        </div>
        <section className="card card-pad" style={{ marginTop: 24 }}>
          <div className="card-kicker">Rest day</div>
          <div className="card-title">Nothing assigned for today.</div>
          <p className="sub" style={{ marginTop: 8 }}>
            Your coach hasn't scheduled a training session for today — check back once your next
            session is assigned.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function TrainingView({ data }) {
  const [finishing, setFinishing] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(data.sessionCompleted);

  if (!data.hasSession) {
    return <EmptyTrainingState data={data} />;
  }

  const finishSession = async () => {
    setFinishing(true);
    const supabase = supabaseBrowser();
    await supabase.from('training_session_logs').upsert(
      {
        session_id: data.sessionId,
        client_id: data.clientId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    );
    setSessionCompleted(true);
    setFinishing(false);
  };

  const badge = sessionCompleted ? 'COMPLETED' : data.hero.badge;

  return (
    <main className="rl-screen">
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">{data.sessionLabel}</div>
            <h1>{data.title}</h1>
            <p className="sub">{data.sub}</p>
          </div>
          {data.cyclePill && <div className="ghost-pill">{data.cyclePill}</div>}
        </div>

        <div className="training-layout">
          <div>
            <section className="card session-hero">
              <div className="session-top">
                <div>
                  <div className="card-kicker">{data.hero.kicker}</div>
                  <div className="session-name">{data.hero.name}</div>
                </div>
                <div className="session-badge">{badge}</div>
              </div>
              <div className="session-stats">
                {data.hero.stats.map((stat) => (
                  <div className="session-stat" key={stat.k}>
                    <div className="k">{stat.k}</div>
                    <div className="v">{stat.v}</div>
                  </div>
                ))}
              </div>
            </section>

            <div className="section-head">
              <h2>Exercises</h2>
              <span>tap sets as completed</span>
            </div>
            <div className="exercise-list">
              {data.exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} sessionId={data.sessionId} clientId={data.clientId} />
              ))}
            </div>
          </div>

          <aside>
            <div className="section-head" style={{ marginTop: 0 }}>
              <h2>Session brief</h2>
              <span>coach assigned</span>
            </div>
            <section className="card card-pad">
              <div className="card-kicker">{data.brief.kicker}</div>
              <div className="card-title">{data.brief.title}</div>
              <p className="sub">{data.brief.body}</p>
            </section>

            <div className="section-head">
              <h2>Last exposure</h2>
              <span>most recent</span>
            </div>
            <section className="card card-pad">
              {data.lastExposure ? (
                <>
                  <div className="card-kicker">{data.lastExposure.kicker}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div className="macro-value">
                        {data.lastExposure.value}
                        <span>{data.lastExposure.unit}</span>
                      </div>
                      <div className="sub" style={{ marginTop: 5 }}>
                        {data.lastExposure.note}
                      </div>
                    </div>
                    {data.lastExposure.delta && (
                      <div style={{ color: 'var(--green)', fontSize: 10, fontWeight: 850 }}>{data.lastExposure.delta}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="card-kicker">No history yet</div>
                  <div className="card-title">First time logging this session.</div>
                  <p className="sub" style={{ marginTop: 5 }}>
                    Once you log today's sets, you'll see them here next time.
                  </p>
                </>
              )}
            </section>
            <button type="button" className="primary-btn" onClick={finishSession} disabled={finishing || sessionCompleted}>
              {sessionCompleted ? 'Session finished' : finishing ? 'Saving…' : 'Finish session'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
