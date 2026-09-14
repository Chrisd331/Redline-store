import { createClient } from '@supabase/supabase-js';

// Public (anon) client — safe to use anywhere. Can only read active products.
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Admin client — SERVER ONLY. Bypasses Row Level Security.
// Never import this into a "use client" component.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
