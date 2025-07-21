import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongoClient';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  // Extract id from the pathname
  const urlParts = req.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 1];
  const password = req.nextUrl.searchParams.get('password');

  try {
    const client = await clientPromise;
    const db = client.db();
    const link = await db.collection('burnerLinks').findOne({ id });
    if (!link) {
      return NextResponse.json({ error: 'Link not found or burned' }, { status: 404 });
    }
    const now = new Date();
    if (link.expiresAt && now > new Date(link.expiresAt)) {
      await db.collection('burnerLinks').deleteOne({ id });
      return NextResponse.json({ error: 'Link expired and burned' }, { status: 410 });
    }
    if (link.passwordHash) {
      if (!password || !(await bcrypt.compare(password, link.passwordHash))) {
        return NextResponse.json({ error: 'Password required or incorrect' }, { status: 401 });
      }
    }
    // Burn after read or maxViews logic
    let burned = false;
    let update: any = {};
    if (link.burnAfterRead && !link.accessed) {
      update.accessed = true;
      burned = true;
    }
    if (link.maxViews && link.clicks + 1 >= link.maxViews) {
      await db.collection('burnerLinks').deleteOne({ id });
      return NextResponse.json({ error: 'Link burned after max views' }, { status: 410 });
    }
    update.clicks = (link.clicks || 0) + 1;
    update.lastAccessedAt = now;
    await db.collection('burnerLinks').updateOne({ id }, { $set: update });
    // Message-only or redirect
    if (link.message) {
      return NextResponse.json({ message: link.message, burned, clicks: update.clicks, maxViews: link.maxViews, analyticsEnabled: link.analyticsEnabled, expiresAt: link.expiresAt });
    } else if (link.targetUrl) {
      return NextResponse.json({ targetUrl: link.targetUrl, burned, clicks: update.clicks, maxViews: link.maxViews, analyticsEnabled: link.analyticsEnabled, expiresAt: link.expiresAt });
    } else {
      return NextResponse.json({ error: 'Invalid link type' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  }
}
