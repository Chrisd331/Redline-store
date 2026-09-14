import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';
import { supabaseServer } from '../../lib/supabase-server';
import AppShell from './AppShell';
import IconSprite from './IconSprite';
import './coaching-app.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--rl-app-font',
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s — Redline Coaching',
    default: 'Redline Coaching',
  },
};

export default async function AccountLayout({ children }) {
  const supabase = supabaseServer();

  // getUser() (not getSession()) re-checks the token against Supabase Auth,
  // so this guards every screen under /account, not just this layout render.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={inter.variable}>
      <IconSprite />
      <AppShell>{children}</AppShell>
    </div>
  );
}
