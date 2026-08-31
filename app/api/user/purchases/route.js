import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ purchases: [] }, { status: 401 });
    }

    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        providerOrderId: true,
        amount: true,
        currency: true,
        status: true,
        purchasedAt: true
      }
    });

    return NextResponse.json({ purchases });
  } catch (err) {
    console.error('Fetch purchases error:', err);
    return NextResponse.json({ purchases: [] }, { status: 500 });
  }
}
