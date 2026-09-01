import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '@/src/lib/prisma';

export async function POST(req) {
  try {
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not configured.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const rawBody = await req.text();
    const signatureHeader = req.headers.get('x-signature');

    if (!signatureHeader) {
      return NextResponse.json({ error: 'Missing x-signature header' }, { status: 401 });
    }

    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(signatureHeader, 'utf8');

    if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
      console.error('Invalid Lemon Squeezy webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || payload.data?.attributes?.custom_data || {};
    let userId = customData.user_id;

    const data = payload.data;
    if (!data) {
      return NextResponse.json({ message: 'No payload data' }, { status: 200 });
    }

    const orderId = String(data.id);
    const attributes = data.attributes || {};
    const variantId = String(
      attributes.first_order_item?.variant_id || attributes.variant_id || ''
    );
    const expectedVariantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    // Verify Product Variant if expectedVariantId is configured
    if (expectedVariantId && variantId && variantId !== expectedVariantId) {
      console.warn(
        `Webhook variant mismatch. Received: ${variantId}, Expected: ${expectedVariantId}`
      );
      return NextResponse.json(
        { message: 'Ignored webhook for different product variant' },
        { status: 200 }
      );
    }

    if (eventName === 'order_created') {
      const orderStatus = attributes.status || 'paid';
      const amount = attributes.total || 1900;
      const currency = attributes.currency || 'USD';
      const buyerEmail = (attributes.user_email || customData.email || '').toLowerCase().trim();
      const buyerName = attributes.user_name || customData.name || 'Arc Traveler';

      if (orderStatus === 'paid') {
        let targetUser = null;

        if (userId) {
          targetUser = await prisma.user.findUnique({ where: { id: userId } });
        }

        if (!targetUser && buyerEmail) {
          targetUser = await prisma.user.findUnique({ where: { email: buyerEmail } });

          if (!targetUser) {
            // Auto-provision user account for guest buyer
            const tempPasswordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
            targetUser = await prisma.user.create({
              data: {
                name: buyerName,
                email: buyerEmail,
                passwordHash: tempPasswordHash,
                accessStatus: 'PAID'
              }
            });
          }
        }

        if (targetUser) {
          userId = targetUser.id;

          // Idempotent purchase creation
          await prisma.purchase.upsert({
            where: {
              provider_providerOrderId: {
                provider: 'lemonsqueezy',
                providerOrderId: orderId
              }
            },
            update: {
              status: orderStatus,
              amount: amount,
              currency: currency,
              purchasedAt: new Date(attributes.created_at || Date.now())
            },
            create: {
              userId: userId,
              provider: 'lemonsqueezy',
              providerOrderId: orderId,
              providerProductId: String(attributes.product_id || ''),
              providerVariantId: variantId,
              amount: amount,
              currency: currency,
              status: orderStatus,
              purchasedAt: new Date(attributes.created_at || Date.now())
            }
          });

          // Grant PAID access status to User
          await prisma.user.update({
            where: { id: userId },
            data: { accessStatus: 'PAID' }
          });

          console.log(`Successfully granted PAID access to user ${userId} for order ${orderId}`);
        }
      }
    } else if (eventName === 'order_refunded') {
      if (userId) {
        await prisma.purchase.updateMany({
          where: {
            provider: 'lemonsqueezy',
            providerOrderId: orderId
          },
          data: { status: 'refunded' }
        });

        // Revert access to FREE
        await prisma.user.update({
          where: { id: userId },
          data: { accessStatus: 'FREE' }
        });

        console.log(`Reverted access to FREE for user ${userId} due to order refund ${orderId}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
