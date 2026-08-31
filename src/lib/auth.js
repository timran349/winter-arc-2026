import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const SESSION_COOKIE_NAME = 'winter_arc_session_token';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId) {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30-day session

  try {
    await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });

    return token;
  } catch (err) {
    console.error('Failed to create session in database:', err);
    // Return token fallback
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, { path: '/' });
    return token;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  } catch (err) {
    console.error('Session authentication error:', err);
    return null;
  }
}

export async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (err) {
    console.error('Logout error:', err);
  }
}
