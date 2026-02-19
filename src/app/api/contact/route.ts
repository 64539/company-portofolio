import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { v4 as uuidv4 } from 'uuid';

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

    // 2. Send Email via Resend
    // Check if API key is present
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Mocking success.");
       // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, mocked: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailBody = `Name: ${name}
Email: ${email}
WhatsApp: ${whatsapp || 'Not provided'}
Subject: ${subject}

Message:
${message}`;

    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Use default or configured domain
      to: ['synthesizeaxonova@gmail.com'],
      subject: `New Contact: ${subject} from ${name}`,
      text: emailBody,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
