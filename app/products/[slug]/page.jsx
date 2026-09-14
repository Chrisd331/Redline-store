import { notFound } from 'next/navigation';
import { supabasePublic } from '../../../lib/supabase';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const supabase = supabasePublic();
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle();

  if (!product) return { title: 'Product — Redline Supplements' };
  return {
    title: `${product.name} — Redline Supplements`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }) {
  const supabase = supabasePublic();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle();

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
