import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'axonova2026';

const checkAuth = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  return token === ADMIN_PASSWORD;
};

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all message IDs from the inbox list
    const messageIds = await redis.lrange('message_inbox', 0, -1);
    
    if (!messageIds || messageIds.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // Fetch all message details in parallel using pipeline
    const pipeline = redis.pipeline();
    messageIds.forEach((id) => {
      pipeline.hgetall(`message:${id}`);
    });

    const results = await pipeline.exec();
    
    // Combine IDs with their data
    const messages = results.map((data, index) => {
      if (!data) return null;
      return {
        id: messageIds[index],
        ...data as object
      };
    }).filter(Boolean);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    await redis.hset(`message:${id}`, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Remove from list (0 means remove all occurrences of value id)
    await redis.lrem('message_inbox', 0, id);
    // Delete hash
    await redis.del(`message:${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
