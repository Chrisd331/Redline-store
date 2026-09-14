'use client';

import { useState } from 'react';

function Icon({ id, className = 'icon' }) {
  return (
    <svg className={className}>
      <use href={`#${id}`} />
    </svg>
  );
}

function EmptyPlanState({ data }) {
  return (
    <main className="rl-screen">
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">{data.dateLabel}</div>
            <h1>Morning, {data.clientFirstName}.</h1>
            <p className="sub">{data.subCopy}</p>
          </div>
        </div>
        <section className="card card-pad" style={{ marginTop: 24 }}>
          <div className="card-kicker">No active plan</div>
          <div className="card-title">You're all set to begin.</div>
          <p className="sub" style={{ marginTop: 8 }}>
            Once your coach assigns your plan, your targets, training and meals will show up
            here.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function HomeView({ data }) {
  const [tasks, setTasks] = useState(data.tasks || []);

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  if (!data.hasPlan) {
    return <EmptyPlanState data={data} />;
  }

  return (
    <main className="rl-screen">
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">{data.dateLabel}</div>
            <h1>Morning, {data.clientFirstName}.</h1>
            <p className="sub">{data.subCopy}</p>
          </div>
          {data.weekLabel && <div className="ghost-pill">{data.weekLabel}</div>}
        </div>

        <div className="home-layout">
          <div className="home-main">
            <section className="card hero">
              <div className="hero-top">
                <div className="status-chip">
                  <i className="status-dot" /> {data.hero.statusLabel}
                </div>
                <div className="cycle-count">
                  <b>{data.hero.cycleDay}</b>
                  {data.hero.cycleOf}
                </div>
              </div>
              <div className="fuel-title">
                {data.hero.titlePrefix} <em>{data.hero.titleEmphasis}</em> {data.hero.titleSuffix}
              </div>
              <p className="fuel-copy">{data.hero.copy}</p>
              <div className="hero-foot">
                <div className="cycle-track" aria-label="Carb cycle progress">
                  {data.hero.cycleSteps.map((step, i) => (
                    <i key={i} className={step === 'normal' ? 'cycle-step' : `cycle-step ${step}`} />
                  ))}
                </div>
                {data.hero.nextLabel && <span className="mini-label">{data.hero.nextLabel}</span>}
              </div>
            </section>

            <div className="grid macro-row" style={{ marginTop: 12 }}>
              {data.macros.map((macro) => (
                <section key={macro.key} className={`card macro-card${macro.carbs ? ' carbs' : ''}`}>
                  <Icon id={macro.icon} className="icon sm macro-icon" />
                  <div className="macro-label">{macro.label}</div>
                  <div className="macro-value">
                    {macro.value}
                    <span>{macro.unit}</span>
                  </div>
                </section>
              ))}
            </div>

            <div className="section-head">
              <h2>Today's plan</h2>
              <span>{tasks.length} priorities</span>
            </div>
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task${task.done ? ' done' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTask(task.id)}
                >
                  <div className="task-icon">
                    <Icon id={task.icon} />
                  </div>
                  <div>
                    <div className="task-name">{task.name}</div>
                    <div className="task-meta">{task.meta}</div>
                  </div>
                  <div className="check">
                    <Icon id="i-check" className="icon sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="home-side">
            <div className="section-head">
              <h2>Daily systems</h2>
              <span>tap to update</span>
            </div>
            <div className="grid habit-grid">
              {data.habits.map((habit) => (
                <section key={habit.key} className="card habit">
                  <div className="habit-top">
                    <Icon id={habit.icon} className="icon sm" />
                    <span className="mini-label">{habit.pct}%</span>
                  </div>
                  <div className="big">
                    {habit.big}
                    {habit.unit && <span className="unit">{habit.unit}</span>}
                  </div>
                  <div className="meter">
                    <i style={{ width: `${habit.pct}%` }} />
                  </div>
                  <div className="habit-caption">{habit.caption}</div>
                </section>
              ))}
            </div>

            <div className="section-head">
              <h2>Coach check-in</h2>
              <span>weekly</span>
            </div>
            <section className="card checkin">
              <div className="checkin-icon">
                <Icon id="i-calendar" />
              </div>
              <div className="checkin-copy">
                <b>{data.checkin.title}</b>
                <span>{data.checkin.copy}</span>
              </div>
              <Icon id="i-chevron" className="icon sm arrow" />
            </section>

            <div className="section-head">
              <h2>Coach note</h2>
              <span>today</span>
            </div>
            <section className="card card-pad">
              <div className="card-kicker">From your coach</div>
              <div className="card-title">{data.coachNote.title}</div>
              <p className="sub">{data.coachNote.body}</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
