import { supabasePublic } from '../../lib/supabase';
import ProductsClient from './ProductsClient';

// Re-fetch product list at most once a minute.
export const revalidate = 60;

export const metadata = {
  title: 'Shop the range — Redline Supplements',
  description: 'Australian-made performance supplements. Free shipping over $99.',
};

export default async function ProductsPage() {
  const supabase = supabasePublic();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: true });

  return <ProductsClient products={products || []} />;
}
