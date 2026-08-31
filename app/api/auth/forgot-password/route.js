import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      // Return ambiguous message for privacy
      return NextResponse.json({
        success: true,
        message: 'If an account exists for that email, password reset instructions have been generated.'
      });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry
      }
    });

    const resetUrl = `/forgot-password?token=${token}`;

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetToken: token,
      resetUrl
    });
  } catch (err) {
    console.error('Forgot Password API error:', err);
    return NextResponse.json({ error: 'Server error processing request.' }, { status: 500 });
  }
}
