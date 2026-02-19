import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { generateEmailHtml } from '@/lib/email-templates';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'axonova2026';

const checkAuth = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  return token === ADMIN_PASSWORD;
};

// Rate limiting: 50 emails per hour
const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messageId, userEmail, userName, replyContent, subject } = await request.json();

    // 1. Validation
    if (!messageId || !userEmail || !replyContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (replyContent.length < 10 || replyContent.length > 5000) {
      return NextResponse.json({ error: 'Reply content must be between 10 and 5000 characters' }, { status: 400 });
    }

    // 2. Rate Limiting
    const rateLimitKey = `rate_limit:admin_reply:${new Date().getHours()}`;
    const currentCount = await redis.incr(rateLimitKey);
    
    if (currentCount === 1) {
      await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
    }

    if (currentCount > RATE_LIMIT) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    // 3. Send Email via Resend
    if (!process.env.RESEND_API_KEY) {
       // Mock for dev
       await new Promise(resolve => setTimeout(resolve, 1000));
       return NextResponse.json({ success: true, mocked: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format content with line breaks
    const formattedContent = replyContent.replace(/\n/g, '<br>');

    const emailHtml = generateEmailHtml({
      content: `
        <div style="margin-bottom: 20px;">
          ${formattedContent}
        </div>
      `,
      recipientName: userName
    });

    const emailResponse = await resend.emails.send({
      from: 'Synthesize Axonova <onboarding@resend.dev>', // Verified domain
      to: [userEmail],
      subject: `Re: ${subject}`,
      html: emailHtml,
    });

    if (emailResponse.error) {
      throw new Error(emailResponse.error.message);
    }

    // 4. Update Redis State
    const timestamp = new Date().toISOString();
    
    // Get existing history
    const historyJson = await redis.hget(`message:${messageId}`, 'replyHistory');
    let history = [];
    if (historyJson) {
      history = JSON.parse(historyJson as string);
    }

    const newReply = {
      content: replyContent,
      timestamp,
      adminId: 'admin' // Could be dynamic if multi-admin
    };

    history.push(newReply);

    await redis.hset(`message:${messageId}`, {
      status: 'replied',
      adminReply: replyContent,
      repliedAt: timestamp,
      repliedBy: 'admin',
      replyHistory: JSON.stringify(history)
    });

    // Refresh TTL for 90 days
    await redis.expire(`message:${messageId}`, 90 * 24 * 60 * 60);

    return NextResponse.json({ 
      success: true, 
      messageId, 
      timestamp,
      data: emailResponse 
    });

  } catch (error: any) {
    console.error("Admin reply failed:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
