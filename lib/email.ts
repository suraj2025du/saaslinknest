import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured, skipping email send');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    await transporter.sendMail({
      from: `"LinkNest" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: String(error) };
  }
}

export function welcomeEmail(name: string) {
  return {
    subject: 'Welcome to LinkNest! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Welcome to LinkNest, ${name}!</h1>
        <p>We're excited to have you on board. LinkNest helps you create beautiful link-in-bio pages in seconds.</p>
        <h3>Getting Started:</h3>
        <ul>
          <li>Create your profile with a unique username</li>
          <li>Add your first links</li>
          <li>Customize your page's appearance</li>
          <li>Share your link-in-bio URL everywhere</li>
        </ul>
        <a href="${process.env.APP_URL}/dashboard" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Go to Dashboard</a>
        <p>Need help? Check out our <a href="${process.env.APP_URL}/faq">FAQ</a> or <a href="${process.env.APP_URL}/contact">contact us</a>.</p>
      </div>
    `,
    text: `Welcome to LinkNest, ${name}! Get started by creating your profile and adding links at ${process.env.APP_URL}/dashboard`,
  };
}

export function passwordResetEmail(name: string, resetUrl: string) {
  return {
    subject: 'Reset Your LinkNest Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Reset Password</a>
        <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Hi ${name}, reset your password at: ${resetUrl}. This link expires in 1 hour.`,
  };
}

export function emailVerificationEmail(verificationUrl: string) {
  return {
    subject: 'Verify Your LinkNest Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Verify Your Email</h1>
        <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Verify Email</a>
        <p>This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
    text: `Verify your email at: ${verificationUrl}. This link expires in 24 hours.`,
  };
}

export function subscriptionConfirmationEmail(plan: string) {
  return {
    subject: `Your LinkNest ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan is Active! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Subscription Confirmed!</h1>
        <p>Your ${plan} plan is now active. You have access to all premium features.</p>
        <h3>What's included:</h3>
        <ul>
          <li>Unlimited links</li>
          <li>Advanced analytics</li>
          <li>Custom themes</li>
          ${plan === 'premium' ? '<li>Custom domain support</li>' : ''}
          <li>Priority support</li>
        </ul>
        <a href="${process.env.APP_URL}/dashboard" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Start Using Premium Features</a>
      </div>
    `,
    text: `Your ${plan} plan is active. Start using premium features at ${process.env.APP_URL}/dashboard`,
  };
}

export function contactFormConfirmationEmail(name: string) {
  return {
    subject: 'We Received Your Message - LinkNest',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Message Received</h1>
        <p>Hi ${name},</p>
        <p>Thank you for contacting us! We've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, check out our <a href="${process.env.APP_URL}/faq">FAQ</a> for quick answers.</p>
      </div>
    `,
    text: `Hi ${name}, we received your message and will respond within 24 hours.`,
  };
}

export function contactFormAdminNotification(name: string, email: string, subject: string, message: string) {
  return {
    subject: `[LinkNest Contact] ${subject || 'New Contact Submission'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">New Contact Form Submission</h1>
        <p>A new message has been submitted via the contact form:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td>
          </tr>
        </table>
        <a href="mailto:${email}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Reply to ${name}</a>
      </div>
    `,
    text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  };
}

export function feedbackAdminNotification(email: string, type: string, message: string) {
  return {
    subject: `[LinkNest Feedback] ${type.charAt(0).toUpperCase() + type.slice(1)} Submission`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">New Feedback Submission</h1>
        <p>A new ${type} has been submitted:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${type}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td>
          </tr>
        </table>
      </div>
    `,
    text: `New feedback submission:\n\nEmail: ${email}\nType: ${type}\nMessage: ${message}`,
  };
}

export function feedbackConfirmationEmail(type: string) {
  const typeLabel = type === 'bug' ? 'Bug Report' : type === 'feature_request' ? 'Feature Request' : 'Feedback';
  return {
    subject: `Thank You for Your ${typeLabel} - LinkNest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Thank You!</h1>
        <p>We've received your ${typeLabel.toLowerCase()} and appreciate you taking the time to help us improve LinkNest.</p>
        <p>Our team will review your submission and get back to you if needed.</p>
        <p>Best regards,<br/>The LinkNest Team</p>
      </div>
    `,
    text: `We've received your ${typeLabel.toLowerCase()} and appreciate your feedback. The LinkNest Team`,
  };
}

export function milestoneEmail(name: string, milestone: string) {
  return {
    subject: `🎉 You Hit a Milestone!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Congratulations, ${name}!</h1>
        <p>You've reached an amazing milestone: <strong>${milestone}</strong></p>
        <p>Keep up the great work! Your link-in-bio page is getting lots of attention.</p>
        <a href="${process.env.APP_URL}/dashboard" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">View Your Analytics</a>
      </div>
    `,
    text: `Congratulations ${name}! You've reached: ${milestone}`,
  };
}

export function paymentFailedEmail(name: string, amount: number) {
  return {
    subject: '⚠️ LinkNest Payment Failed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #DC2626;">Payment Failed</h1>
        <p>Hi ${name},</p>
        <p>We were unable to process your payment of $${(amount / 100).toFixed(2)} for your LinkNest subscription.</p>
        <p>Please update your payment method to avoid service interruption.</p>
        <a href="${process.env.APP_URL}/dashboard/billing" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Update Payment Method</a>
      </div>
    `,
    text: `Hi ${name}, your payment of $${(amount / 100).toFixed(2)} failed. Please update your payment method at ${process.env.APP_URL}/dashboard/billing`,
  };
}

export function teamInviteEmail(inviterName: string, profileName: string, acceptUrl: string) {
  return {
    subject: `You're invited to collaborate on ${profileName} - LinkNest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7C3AED;">Team Invitation</h1>
        <p>You've been invited by <strong>${inviterName}</strong> to collaborate on <strong>${profileName}</strong> in LinkNest.</p>
        <p>Click the button below to accept the invitation and join the team:</p>
        <a href="${acceptUrl}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Accept Invitation</a>
        <p>This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.</p>
        <p>Best regards,<br/>The LinkNest Team</p>
      </div>
    `,
    text: `You've been invited by ${inviterName} to collaborate on ${profileName} in LinkNest. Accept the invitation at: ${acceptUrl}`,
  };
}
