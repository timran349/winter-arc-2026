import nodemailer from 'nodemailer';

/**
 * Utility to send transactional emails for password reset
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const fullResetUrl = resetUrl.startsWith('http')
    ? resetUrl
    : `https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'www.arc90.space'}${resetUrl}`;

  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #0b0c0a; color: #f8fafc; padding: 40px 20px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #141712; border: 1px solid rgba(159, 232, 112, 0.3); border-radius: 24px; padding: 32px;">
        <div style="font-weight: 900; font-size: 24px; color: #9fe870; letter-spacing: 1px; margin-bottom: 8px;">WINTER ARC 90</div>
        <h2 style="font-size: 28px; font-weight: 900; color: #f8fafc; margin-top: 0; text-transform: uppercase;">Reset Your Password</h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 28px;">
          You requested a password reset for your Winter Arc 90 account. Click the button below to set a new password. This link will expire in 1 hour.
        </p>
        <a href="${fullResetUrl}" style="display: inline-block; background-color: #9fe870; color: #163300; font-weight: 900; font-size: 14px; text-decoration: none; padding: 16px 32px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
          Reset My Password
        </a>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `;

  // 1. If SMTP settings are provided in process.env
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Winter Arc 90" <noreply@arc90.space>',
      to,
      subject: 'Reset Your Winter Arc 90 Password',
      html: htmlContent
    });
    return true;
  }

  // 2. If Resend API Key is provided
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Winter Arc 90 <noreply@arc90.space>',
        to: [to],
        subject: 'Reset Your Winter Arc 90 Password',
        html: htmlContent
      })
    });
    return res.ok;
  }

  // 3. Fallback for testing: Send via Nodemailer test account (Ethereal) & server log
  try {
    console.log(`[PASSWORD RESET EMAIL] Sent reset link to ${to}: ${fullResetUrl}`);
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    const info = await transporter.sendMail({
      from: '"Winter Arc 90" <noreply@arc90.space>',
      to,
      subject: 'Reset Your Winter Arc 90 Password',
      html: htmlContent
    });
    console.log('[Ethereal Email Preview URL]:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (err) {
    console.warn('Nodemailer test send error:', err);
    return true;
  }
}
