import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.accessStatus !== 'PAID') {
      return NextResponse.json(
        { error: 'Paid access required for weekly reviews.' },
        { status: 403 }
      );
    }

    const arc = await prisma.arc.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!arc) {
      return NextResponse.json({ reviews: [] });
    }

    const reviews = await prisma.weeklyReview.findMany({
      where: { arcId: arc.id },
      orderBy: { weekNumber: 'asc' }
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('Fetch reviews error:', err);
    return NextResponse.json({ error: 'Failed to fetch weekly reviews.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.accessStatus !== 'PAID') {
      return NextResponse.json(
        { error: 'Paid access required for weekly reviews.' },
        { status: 403 }
      );
    }

    const { weekNumber, wentWell, obstacles, nextWeek } = await req.json();

    if (!weekNumber) {
      return NextResponse.json({ error: 'Week number is required.' }, { status: 400 });
    }

    const arc = await prisma.arc.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!arc) {
      return NextResponse.json({ error: 'No active Arc found for user.' }, { status: 404 });
    }

    const review = await prisma.weeklyReview.upsert({
      where: {
        arcId_weekNumber: {
          arcId: arc.id,
          weekNumber: Number(weekNumber)
        }
      },
      update: {
        wentWell,
        obstacles,
        nextWeek
      },
      create: {
        arcId: arc.id,
        weekNumber: Number(weekNumber),
        wentWell,
        obstacles,
        nextWeek
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error('Save weekly review error:', err);
    return NextResponse.json({ error: 'Failed to save weekly review.' }, { status: 500 });
  }
}
