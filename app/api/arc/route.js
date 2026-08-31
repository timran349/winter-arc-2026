import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const arc = await prisma.arc.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        commitments: true,
        checkIns: true,
        reviews: true
      }
    });

    return NextResponse.json({ arc: arc || null });
  } catch (err) {
    console.error('Fetch Arc error:', err);
    return NextResponse.json({ error: 'Failed to fetch Arc data.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, duration = 90, intention, commitments } = await req.json();

    if (!startDate || !intention || !Array.isArray(commitments)) {
      return NextResponse.json({ error: 'Start date, intention, and commitments are required.' }, { status: 400 });
    }

    if (commitments.length < 4 || commitments.length > 6) {
      return NextResponse.json({ error: 'An Arc must contain between 4 and 6 commitments.' }, { status: 400 });
    }

    // Create Arc & Commitments in transaction
    const arc = await prisma.arc.create({
      data: {
        userId: user.id,
        startDate,
        duration: Number(duration) || 90,
        intention,
        commitments: {
          create: commitments.map((c) => ({
            name: c.name,
            category: c.category || 'GENERAL'
          }))
        }
      },
      include: {
        commitments: true
      }
    });

    return NextResponse.json({ success: true, arc });
  } catch (err) {
    console.error('Create Arc error:', err);
    return NextResponse.json({ error: 'Failed to create Arc. Please try again.' }, { status: 500 });
  }
}
