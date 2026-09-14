'use client';

function Icon({ id, className = 'icon', style }) {
  return (
    <svg className={className} style={style}>
      <use href={`#${id}`} />
    </svg>
  );
}

export default function ProgressView({ data }) {
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

        <div className="progress-layout">
          <div>
            <section className="card progress-hero">
              <div>
                <div className="card-kicker">{data.hero.kicker}</div>
                <div className="weight-now">
                  {data.hero.value}
                  <span>{data.hero.unit}</span>
                </div>
                <div className="delta">{data.hero.delta}</div>
              </div>
              <div className="goal-ring-wrap">
                <div
                  className="goal-ring"
                  style={{ background: `conic-gradient(var(--red) 0 ${data.hero.goalPct}%, #2b2b32 ${data.hero.goalPct}% 100%)` }}
                />
                <div className="goal-ring-copy">
                  <b>{data.hero.goalPct}%</b>TO GOAL
                </div>
              </div>
            </section>

            <div className="section-head">
              <h2>Weight trend</h2>
              <span>6 weeks</span>
            </div>
            <section className="card chart-card">
              <div className="chart-head">
                <b>{data.weightTrend.caption}</b>
                <span>{data.weightTrend.subcaption}</span>
              </div>
              <svg className="chart" viewBox="0 0 600 132" preserveAspectRatio="none">
                <g className="chart-grid">
                  <line x1="0" y1="24" x2="600" y2="24" />
                  <line x1="0" y1="66" x2="600" y2="66" />
                  <line x1="0" y1="108" x2="600" y2="108" />
                </g>
                <path className="chart-area" d={data.weightTrend.areaPath} />
                <path className="chart-line" d={data.weightTrend.linePath} />
              </svg>
              <div className="xlabels">
                {data.weightTrend.xLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </section>

            <div className="section-head">
              <h2>Progress photos</h2>
              <span>front · side · back</span>
            </div>
            <div className="photo-strip">
              {data.photos.map((photo) => (
                <div className="photo" data-label={photo.label} key={photo.label} />
              ))}
              <div className="photo add">
                <div className="photo-add-inner">
                  <Icon id="i-camera" />
                  ADD PHOTO
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="section-head" style={{ marginTop: 0 }}>
              <h2>Measurements</h2>
              <span>vs. start</span>
            </div>
            <div className="grid measure-grid">
              {data.measurements.map((m) => (
                <section className="card measure" key={m.key}>
                  <div className="measure-top">
                    <span className="measure-name">{m.name}</span>
                    <span className="measure-delta">{m.delta}</span>
                  </div>
                  <div className="measure-val">
                    {m.value}
                    <span>{m.unit}</span>
                  </div>
                </section>
              ))}
            </div>

            <div className="section-head">
              <h2>Carb cycle adherence</h2>
              <span>last 14 days</span>
            </div>
            <section className="card cycle-history">
              <div className="card-kicker">Plan completion · {data.cycleHistory.completionPct}%</div>
              <div className="cycle-bars">
                {data.cycleHistory.bars.map((bar, i) => (
                  <i
                    key={i}
                    className={`cycle-col${bar.type !== 'normal' ? ` ${bar.type}` : ''}`}
                    style={{ height: `${bar.h}%` }}
                  />
                ))}
              </div>
              <div className="cycle-legend">
                <span>
                  <i className="legend-dot" />
                  Low
                </span>
                <span>
                  <i className="legend-dot high" />
                  High
                </span>
                <span>
                  <i className="legend-dot refeed" />
                  Refeed
                </span>
              </div>
            </section>

            <div className="section-head">
              <h2>Coach assessment</h2>
              <span>this week</span>
            </div>
            <section className="card card-pad">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon id="i-trending" style={{ color: 'var(--green)', marginTop: 1 }} />
                <div>
                  <div className="card-title">{data.coachAssessment.title}</div>
                  <p className="sub">{data.coachAssessment.body}</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
