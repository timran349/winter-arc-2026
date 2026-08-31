import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !token.trim()) {
      return NextResponse.json({ error: 'Reset token is required.' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. You can now log in.'
    });
  } catch (err) {
    console.error('Reset Password API error:', err);
    return NextResponse.json({ error: 'Server error resetting password.' }, { status: 500 });
  }
}
