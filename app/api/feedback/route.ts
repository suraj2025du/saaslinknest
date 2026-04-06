import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedbacks } from '@/lib/schema';
import { getIP, rateLimit } from '@/lib/rate-limit';
import { sendEmail, feedbackAdminNotification, feedbackConfirmationEmail } from '@/lib/email';
import { z } from 'zod';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

const feedbackSchema = z.object({
  email: z.string().email(),
  type: z.enum(['bug', 'feature_request', 'feedback']),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const ip = await getIP();
    const { success } = await rateLimit(`feedback:${ip}`, 5, 60000); // 5 per minute

    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const validated = feedbackSchema.parse(body);

    await db.insert(feedbacks).values({
      email: validated.email,
      type: validated.type,
      message: validated.message,
    });

    // Send admin notification
    if (ADMIN_EMAIL) {
      try {
        const adminEmail = feedbackAdminNotification(
          validated.email,
          validated.type,
          validated.message
        );
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: adminEmail.subject,
          html: adminEmail.html,
          text: adminEmail.text,
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    // Send confirmation email to user
    try {
      const confirmationEmail = feedbackConfirmationEmail(validated.type);
      await sendEmail({
        to: validated.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input: ' + error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
