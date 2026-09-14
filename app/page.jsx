import { supabasePublic } from '../lib/supabase';
import Hero from './Hero';
import BrandStory from './BrandStory';
import Athletes from './Athletes';
import Partners from './Partners';
import ClosingCTA from './ClosingCTA';

// Re-fetch the athletes list at most once a minute.
export const revalidate = 60;

export default async function Page() {
  const supabase = supabasePublic();
  const { data: athletes } = await supabase
    .from('athletes')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  return (
    <main>
      <Hero />
      <BrandStory />
      <Athletes athletes={athletes || []} />
      <Partners />
      <ClosingCTA />
    </main>
  );
}
