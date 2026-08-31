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
      orderBy: { createdAt: 'desc' }
    });

    if (!arc) {
      return NextResponse.json({ checkIns: [] });
    }

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: { arcId: arc.id }
    });

    return NextResponse.json({ checkIns });
  } catch (err) {
    console.error('Fetch check-ins error:', err);
    return NextResponse.json({ error: 'Failed to fetch check-ins.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, completedCommitmentIds } = await req.json();

    if (!date || !Array.isArray(completedCommitmentIds)) {
      return NextResponse.json({ error: 'Date and completed commitment IDs are required.' }, { status: 400 });
    }

    const arc = await prisma.arc.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { commitments: true }
    });

    if (!arc) {
      return NextResponse.json({ error: 'No active Arc found for user.' }, { status: 404 });
    }

    // Upsert each commitment check-in status
    const operations = arc.commitments.map((comm) => {
      const isCompleted = completedCommitmentIds.includes(comm.id);
      return prisma.dailyCheckIn.upsert({
        where: {
          arcId_commitmentId_date: {
            arcId: arc.id,
            commitmentId: comm.id,
            date
          }
        },
        update: {
          completed: isCompleted
        },
        create: {
          arcId: arc.id,
          commitmentId: comm.id,
          date,
          completed: isCompleted
        }
      });
    });

    await prisma.$transaction(operations);

    const updatedCheckIns = await prisma.dailyCheckIn.findMany({
      where: { arcId: arc.id }
    });

    return NextResponse.json({ success: true, checkIns: updatedCheckIns });
  } catch (err) {
    console.error('Save check-in error:', err);
    return NextResponse.json({ error: 'Failed to save daily check-in.' }, { status: 500 });
  }
}
