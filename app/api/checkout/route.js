import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      console.error('Missing Lemon Squeezy environment variables');
      return NextResponse.json(
        { error: 'Payment provider configuration missing on server.' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://winter-arc-2026.vercel.app';

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: user.email,
              name: user.name,
              custom: {
                user_id: user.id
              }
            },
            product_options: {
              redirect_url: `${appUrl}/payment/success`
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: String(storeId)
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: String(variantId)
              }
            }
          }
        }
      })
    });

    const resData = await response.json();

    if (!response.ok || !resData.data?.attributes?.url) {
      console.error('Lemon Squeezy Checkout API error:', resData);
      return NextResponse.json(
        { error: resData.errors?.[0]?.detail || 'Failed to create checkout session.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: resData.data.attributes.url });
  } catch (err) {
    console.error('Checkout handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
