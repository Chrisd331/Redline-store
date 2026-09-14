'use client';

import { usePathname } from 'next/navigation';

// Hides the marketing header/footer on the coaching app routes, which have
// their own topbar + bottom nav (ported from the client-app prototype).
export default function ChromeGate({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/account')) return null;
  return children;
}
