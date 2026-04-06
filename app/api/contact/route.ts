import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/schema';
import { sendEmail, contactFormConfirmationEmail, contactFormAdminNotification } from '@/lib/email';
import { rateLimit, getIP } from '@/lib/rate-limit';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

export async function POST(req: NextRequest) {
  try {
    const ip = await getIP();
    const rateLimitResult = await rateLimit(`contact:${ip}`, 3, 3600000); // 3 per hour
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Store in database
    await db.insert(contactSubmissions).values({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || 'General Inquiry',
      message: message.trim(),
    });

    // Send confirmation email to user
    try {
      const { subject: emailSubject, html, text } = contactFormConfirmationEmail(name.trim());
      await sendEmail({
        to: email.trim(),
        subject: emailSubject,
        html,
        text,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if confirmation email fails
    }

    // Send notification to admin
    if (ADMIN_EMAIL) {
      try {
        const adminEmail = contactFormAdminNotification(
          name.trim(),
          email.trim(),
          subject?.trim() || 'General Inquiry',
          message.trim()
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

    return NextResponse.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
