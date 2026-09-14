'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/account', match: (p) => p === '/account', icon: 'i-home', label: 'Home' },
  { href: '/account/training', match: (p) => p.startsWith('/account/training'), icon: 'i-dumbbell', label: 'Training' },
  { href: '/account/diet', match: (p) => p.startsWith('/account/diet'), icon: 'i-utensils', label: 'Diet' },
  { href: '/account/sleep', match: (p) => p.startsWith('/account/sleep'), icon: 'i-moon', label: 'Sleep' },
  { href: '/account/progress', match: (p) => p.startsWith('/account/progress'), icon: 'i-chart', label: 'Progress' },
];

export default function AppShell({ children, initials = 'JM' }) {
  const pathname = usePathname() || '/account';

  return (
    <div className="rl-app">
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true" />
            <div className="brand-copy">
              <div className="brand-name">REDLINE</div>
              <div className="brand-sub">COACHING / PERFORMANCE</div>
            </div>
          </div>
          <div className="top-actions">
            <button type="button" className="icon-btn" aria-label="Notifications">
              <svg className="icon">
                <use href="#i-bell" />
              </svg>
            </button>
            <div className="avatar" aria-label="Client profile">
              {initials}
            </div>
          </div>
        </header>

        {children}
      </div>

      <div className="bottom-nav-wrap">
        <nav className="bottom-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link key={item.href} href={item.href} className={`nav-btn${active ? ' active' : ''}`}>
                <svg className="icon lg">
                  <use href={`#${item.icon}`} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
