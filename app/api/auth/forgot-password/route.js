import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/src/utils/sendEmail';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    const standardSuccessMessage =
      'If an account exists for that email address, password reset instructions have been sent to your inbox.';

    if (!user) {
      // Return uniform message for security & privacy
      return NextResponse.json({
        success: true,
        message: standardSuccessMessage
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour token expiration

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry
      }
    });

    const resetUrl = `/forgot-password?token=${token}`;

    // Send email securely without exposing token to the client JSON response
    await sendPasswordResetEmail({
      to: normalizedEmail,
      resetUrl
    });

    return NextResponse.json({
      success: true,
      message: standardSuccessMessage
    });
  } catch (err) {
    console.error('Forgot Password API error:', err);
    return NextResponse.json({ error: 'Server error processing request.' }, { status: 500 });
  }
}
