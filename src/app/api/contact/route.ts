import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { v4 as uuidv4 } from 'uuid';
import { generateEmailHtml, getAutoReplyContent, getAdminNotificationContent } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const { name, email, whatsapp, subject, message } = await request.json();

    // 1. Store in Redis
    try {
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      
      const messageData = {
        id,
        name,
        email,
        whatsapp: whatsapp || '',
        subject,
        message,
        status: 'unread',
        createdAt: timestamp,
      };

      // Store individual message hash
      await redis.hset(`message:${id}`, messageData);
      
      // Add ID to the inbox list (LIFO - latest first)
      await redis.lpush('message_inbox', id);
      
    } catch (redisError) {
      console.error("Redis storage failed:", redisError);
      // We continue to send email even if Redis fails, but log it.
    }

    // 2. Send Emails via Resend
    // Check if API key is present
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Mocking success.");
       // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, mocked: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Prepare Email Content
    const adminHtml = generateEmailHtml({
      content: getAdminNotificationContent({ name, email, whatsapp, subject, message }),
      isAdminNotification: true
    });

    const userHtml = generateEmailHtml({
      content: getAutoReplyContent(name),
      recipientName: name
    });

    // Send Admin Notification and Auto-Reply in parallel
    const [adminEmail, userEmail] = await Promise.all([
      resend.emails.send({
        from: 'Axonova System <onboarding@resend.dev>', // Should be verified domain
        to: ['synthesizeaxonova@gmail.com'],
        subject: `[New Inquiry] ${subject} - ${name}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: 'Synthesize Axonova <onboarding@resend.dev>', // Should be verified domain
        to: [email],
        subject: `Thank you for initializing project, ${name}`,
        html: userHtml,
      })
    ]);

    return NextResponse.json({ success: true, adminEmail, userEmail });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
