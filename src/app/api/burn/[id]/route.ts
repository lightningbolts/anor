import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/utils/mongoUtils';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  // Extract id from the pathname
  const urlParts = req.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 1];
  const password = req.nextUrl.searchParams.get('password');

  try {
    const collection = await getCollection('burner-links');
    const link = await collection.findOne({ id });
    if (!link) {
      return NextResponse.json({ error: 'Link not found or burned' }, { status: 404 });
    }
    const now = new Date();
    if (link.expiresAt && now > new Date(link.expiresAt)) {
      await collection.deleteOne({ id });
      return NextResponse.json({ error: 'Link expired and burned' }, { status: 410 });
    }
    if (link.passwordHash) {
      if (!password || !(await bcrypt.compare(password, link.passwordHash))) {
        return NextResponse.json({ error: 'Password required or incorrect' }, { status: 401 });
      }
    }
    // Burn after read or maxViews logic
    let update: any = {};
    // If burnAfterRead is enabled and link has already been accessed, burn it
    if (link.burnAfterRead && link.accessed) {
      await collection.deleteOne({ id });
      return NextResponse.json({ error: 'This link has been burned.', burned: true }, { status: 410 });
    }
    // If maxViews is reached, burn it
    if (link.maxViews && link.clicks >= link.maxViews) {
      await collection.deleteOne({ id });
      return NextResponse.json({ error: 'Link burned after max views', burned: true }, { status: 410 });
    }
    // On first access, update accessed and clicks, but do NOT mark as burned
    if (link.burnAfterRead && !link.accessed) {
      update.accessed = true;
    }
    update.clicks = (link.clicks || 0) + 1;
    update.lastAccessedAt = now;
    await collection.updateOne({ id }, { $set: update });
    // Message-only or redirect
    if (link.message) {
      return NextResponse.json({ message: link.message, burned: false, clicks: update.clicks, maxViews: link.maxViews, analyticsEnabled: link.analyticsEnabled, expiresAt: link.expiresAt });
    } else if (link.targetUrl) {
      return NextResponse.json({ targetUrl: link.targetUrl, burned: false, clicks: update.clicks, maxViews: link.maxViews, analyticsEnabled: link.analyticsEnabled, expiresAt: link.expiresAt });
    } else {
      return NextResponse.json({ error: 'Invalid link type' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  }
}
