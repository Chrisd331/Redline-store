import { createBrowserClient } from '@supabase/ssr';

// Browser (client-component) Supabase client. Persists the session in
// cookies (not just localStorage) so server components/middleware can read it.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
