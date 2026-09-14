'use client';

import { useState } from 'react';

function Icon({ id, className = 'icon', style }) {
  return (
    <svg className={className} style={style}>
      <use href={`#${id}`} />
    </svg>
  );
}

export default function SleepView({ data }) {
  const [activeQuality, setActiveQuality] = useState(data.score.activeQuality);

  return (
    <main className="rl-screen">
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">{data.eyebrow}</div>
            <h1>{data.title}</h1>
            <p className="sub">{data.sub}</p>
          </div>
          <div className="ghost-pill">{data.ghostPill}</div>
        </div>

        <div className="sleep-layout">
          <div>
            <section className="card sleep-score">
              <div className="ring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle className="track" cx="60" cy="60" r="51" fill="none" strokeWidth="8" />
                  <circle
                    className="value"
                    cx="60"
                    cy="60"
                    r="51"
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray={data.score.dashArray}
                    strokeDashoffset={data.score.dashOffset}
                  />
                </svg>
                <div className="ring-copy">
                  <b>{data.score.value}</b>
                  <span>Recovery</span>
                </div>
              </div>
              <div className="sleep-summary">
                <div className="card-kicker">Last night</div>
                <h2>{data.score.lastNight}</h2>
                <p>{data.score.note}</p>
                <div className="quality-pills">
                  {data.score.qualities.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`q-pill${activeQuality === q ? ' active' : ''}`}
                      onClick={() => setActiveQuality(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="section-head">
              <h2>Log last night</h2>
              <span>two taps + one number</span>
            </div>
            <div className="sleep-log">
              <section className="card number-card">
                <label>Sleep duration</label>
                <div className="number-input">
                  <strong>{data.log.duration}</strong>
                  <span>hours</span>
                </div>
              </section>
              <section className="card number-card">
                <label>Wake-ups</label>
                <div className="number-input">
                  <strong>{data.log.wakeups}</strong>
                  <span>time</span>
                </div>
              </section>
            </div>

            <div className="section-head">
              <h2>Sleep trend</h2>
              <span>last 7 nights</span>
            </div>
            <section className="card chart-card">
              <div className="chart-head">
                <b>{data.trend.caption}</b>
                <span>{data.trend.subcaption}</span>
              </div>
              <svg className="chart" viewBox="0 0 600 132" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e01e2b" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#e01e2b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className="chart-grid">
                  <line x1="0" y1="24" x2="600" y2="24" />
                  <line x1="0" y1="66" x2="600" y2="66" />
                  <line x1="0" y1="108" x2="600" y2="108" />
                </g>
                <path className="chart-area" d={data.trend.areaPath} />
                <path className="chart-line" d={data.trend.linePath} />
              </svg>
              <div className="xlabels">
                {data.trend.xLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="section-head" style={{ marginTop: 0 }}>
              <h2>Recovery context</h2>
              <span>coach view</span>
            </div>
            <section className="card card-pad">
              <div className="card-kicker">{data.context.kicker}</div>
              <div className="card-title">{data.context.title}</div>
              <p className="sub">{data.context.body}</p>
            </section>

            <div className="section-head">
              <h2>Tonight's target</h2>
              <span>set by coach</span>
            </div>
            <section className="card card-pad">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-kicker">{data.tonightTarget.kicker}</div>
                  <div className="macro-value">
                    {data.tonightTarget.value}
                    <span>{data.tonightTarget.unit}</span>
                  </div>
                </div>
                <Icon id="i-moon" className="icon lg" style={{ color: '#ff6570' }} />
              </div>
            </section>
            <button type="button" className="primary-btn">
              Save sleep log
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
