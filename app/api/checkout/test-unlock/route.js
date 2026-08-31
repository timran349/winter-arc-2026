import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Set user accessStatus to PAID for founder testing
    await prisma.user.update({
      where: { id: user.id },
      data: { accessStatus: 'PAID' }
    });

    // Record test purchase
    await prisma.purchase.create({
      data: {
        userId: user.id,
        provider: 'lemonsqueezy_test',
        providerOrderId: `test_order_${Date.now()}`,
        amount: 1900,
        currency: 'USD',
        status: 'paid'
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Test unlock error:', err);
    return NextResponse.json({ error: 'Failed to trigger test unlock.' }, { status: 500 });
  }
}
