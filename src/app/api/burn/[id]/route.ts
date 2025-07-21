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
    // On first access, update accessed and clicks
    if (link.burnAfterRead && !link.accessed) {
      update.accessed = true;
    }
    update.clicks = (link.clicks || 0) + 1;
    update.lastAccessedAt = now;
    await collection.updateOne({ id }, { $set: update });

    // Fetch updated link to check if it should now be burned AFTER serving content
    const updatedLink = await collection.findOne({ id });
    let shouldBurnAfterResponse = false;
    if (updatedLink && updatedLink.maxViews && updatedLink.clicks === updatedLink.maxViews) {
      shouldBurnAfterResponse = true;
    }
    // Message-only or redirect
    let response;
    if (updatedLink && updatedLink.message) {
      response = NextResponse.json({ message: updatedLink.message, burned: false, clicks: updatedLink.clicks, maxViews: updatedLink.maxViews, analyticsEnabled: updatedLink.analyticsEnabled, expiresAt: updatedLink.expiresAt });
    } else if (updatedLink && updatedLink.targetUrl) {
      response = NextResponse.json({ targetUrl: updatedLink.targetUrl, burned: false, clicks: updatedLink.clicks, maxViews: updatedLink.maxViews, analyticsEnabled: updatedLink.analyticsEnabled, expiresAt: updatedLink.expiresAt });
    } else {
      response = NextResponse.json({ error: 'Invalid link type' }, { status: 400 });
    }
    if (shouldBurnAfterResponse) {
      // Burn the link after serving the content
      await collection.deleteOne({ id });
    }
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  }
}
