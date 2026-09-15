import Stripe from 'stripe';
import { supabaseAdmin } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe needs the raw, unparsed body to verify the signature.
export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook signature error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const supabase = supabaseAdmin();
    await supabase.from('orders').insert({
      email: session.customer_details?.email ?? null,
      total_cents: session.amount_total ?? 0,
      currency: session.currency ?? 'aud',
      status: 'paid',
      stripe_session_id: session.id,
      fulfilment_method: session.metadata?.fulfilment_method === 'pickup' ? 'pickup' : 'delivery',
    });
  }

  return new Response('ok', { status: 200 });
}
