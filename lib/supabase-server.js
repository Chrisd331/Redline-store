import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-component Supabase client. Reads the logged-in user's session from
// cookies. Respects Row Level Security (uses the anon key, not the service role).
export function supabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called during a Server Component render, where cookies can't be
            // written. Safe to ignore — middleware.js keeps the session fresh.
          }
        },
      },
    }
  );
}
