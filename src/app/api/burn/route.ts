import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/utils/mongoUtils';
import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { targetUrl, password, burnAfterSeconds = 300, burnAfterRead = true, message, maxViews, analyticsEnabled } = body;

  if (!targetUrl && !message) {
    return NextResponse.json({ error: 'targetUrl or message required' }, { status: 400 });
  }

  const id = nanoid();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (burnAfterSeconds * 1000));
  let passwordHash = undefined;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const doc = {
    id,
    targetUrl,
    passwordHash,
    createdAt: now,
    expiresAt,
    accessed: false,
    burnAfterRead,
    message,
    clicks: 0,
    lastAccessedAt: null,
    maxViews,
    analyticsEnabled: !!analyticsEnabled,
  };

  try {
    const collection = await getCollection(process.env.MONGODB_COLLECTION_NAME || 'burnerLinks');
    await collection.insertOne(doc);
    // Dynamically get protocol and host from request headers
    const headers = req.headers;
    const protocol = headers.get('x-forwarded-proto') || 'https';
    const host = headers.get('x-forwarded-host') || headers.get('host');
    const url = `${protocol}://${host}/b/${id}`;
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('API /api/burn error:', err);
    return NextResponse.json({ error: 'Database error', details: err?.message || err }, { status: 500 });
  }
}
