import Stripe from 'stripe';
import { supabaseAdmin } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items, fulfilment } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    const fulfilmentMethod = fulfilment === 'pickup' ? 'pickup' : 'delivery';

    // Look up the real prices from the database — never trust prices sent by the browser.
    const supabase = supabaseAdmin();
    const ids = items.map((i) => i.id);
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids)
      .eq('active', true);

    if (error || !products || products.length === 0) {
      return Response.json({ error: 'Products not found.' }, { status: 400 });
    }

    const line_items = items.map((i) => {
      const p = products.find((x) => x.id === i.id);
      if (!p) throw new Error('Invalid product in cart.');
      const qty = Math.max(1, parseInt(i.quantity, 10) || 1);
      return {
        quantity: qty,
        price_data: {
          currency: p.currency,
          unit_amount: p.price_cents,
          product_data: { name: p.name },
        },
      };
    });

    const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${site}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/`,
      metadata: { fulfilment_method: fulfilmentMethod },
      // Pickup: no address needed, no shipping charge. Delivery: unchanged.
      ...(fulfilmentMethod === 'delivery' && {
        shipping_address_collection: { allowed_countries: ['AU'] },
      }),
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
