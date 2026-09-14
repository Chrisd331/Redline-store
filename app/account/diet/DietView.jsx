'use client';

import { useState } from 'react';

function Icon({ id, className = 'icon' }) {
  return (
    <svg className={className}>
      <use href={`#${id}`} />
    </svg>
  );
}

export default function DietView({ data }) {
  const [meals, setMeals] = useState(data.meals);

  const toggleMeal = (id) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
  };

  return (
    <main className="rl-screen">
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">{data.dayLabel}</div>
            <h1>{data.title}</h1>
            <p className="sub">{data.sub}</p>
          </div>
          <div className="ghost-pill">{data.ghostPill}</div>
        </div>

        <div className="diet-layout">
          <div>
            <section className="card diet-status">
              <div className="fuel-mini">
                <div className="fuel-bolt">
                  <Icon id="i-bolt" />
                </div>
                <div>
                  <b>{data.status.title}</b>
                  <p>{data.status.copy}</p>
                </div>
              </div>
              <div className="calories">
                <strong>{data.status.calories}</strong>
                <span>kcal target</span>
              </div>
            </section>

            <div className="section-head">
              <h2>Macro position</h2>
              <span>current / target</span>
            </div>
            <section className="card macro-progress">
              {data.macros.map((macro) => (
                <div className={`mp-row${macro.carbs ? ' carbs' : ''}`} key={macro.key}>
                  <div className="mp-label">{macro.label}</div>
                  <div className="mp-track">
                    <i style={{ width: `${macro.pct}%` }} />
                  </div>
                  <div className="mp-value">
                    {macro.current} <span>/ {macro.target}{macro.unit}</span>
                  </div>
                </div>
              ))}
            </section>

            <div className="section-head">
              <h2>Today's meals</h2>
              <span>assigned plan</span>
            </div>
            <div className="meal-list">
              {meals.map((meal) => (
                <section className={`card meal${meal.done ? ' done' : ''}`} key={meal.id}>
                  <div className="meal-time">
                    <Icon id={meal.done ? 'i-check' : 'i-utensils'} />
                  </div>
                  <div>
                    <div className="meal-name">{meal.name}</div>
                    <div className="meal-desc">{meal.desc}</div>
                  </div>
                  <div className="meal-actions">
                    <button type="button" className="swap">
                      SWAP
                    </button>
                    <button type="button" className="meal-check" onClick={() => toggleMeal(meal.id)}>
                      <Icon id="i-check" className="icon sm" />
                    </button>
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside>
            <div className="section-head" style={{ marginTop: 0 }}>
              <h2>Timing rule</h2>
              <span>today</span>
            </div>
            <section className="card card-pad">
              <div className="card-kicker">{data.timingRule.kicker}</div>
              <div className="card-title">{data.timingRule.title}</div>
              <p className="sub">{data.timingRule.body}</p>
            </section>

            <div className="section-head">
              <h2>Allowed swaps</h2>
              <span>coach locked</span>
            </div>
            <section className="card card-pad">
              <div className="task-list">
                {data.swaps.map((swap) => (
                  <div className="task" style={{ gridTemplateColumns: '38px 1fr auto', minHeight: 62 }} key={swap.title}>
                    <div className="task-icon" style={{ width: 38, height: 38 }}>
                      <Icon id="i-repeat" className="icon sm" />
                    </div>
                    <div>
                      <div className="task-name">{swap.title}</div>
                      <div className="task-meta">{swap.meta}</div>
                    </div>
                    <Icon id="i-chevron" className="icon sm arrow" />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
