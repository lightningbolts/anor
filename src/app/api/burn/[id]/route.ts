import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/utils/mongoUtils';

export async function GET(req: NextRequest) {
  // Extract id from the pathname
  const urlParts = req.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 1];
  // No password for E2EE; key is never sent to server

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
    // No password check for E2EE
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
    let burnedReason = null;
    if (updatedLink && updatedLink.maxViews && updatedLink.clicks === updatedLink.maxViews) {
      shouldBurnAfterResponse = true;
      burnedReason = 'maxViews';
    }
    // Always return ciphertext, iv, and salt for E2EE
    let response;
    if (updatedLink) {
      response = NextResponse.json({
        message: updatedLink.message,
        targetUrl: updatedLink.targetUrl,
        ivMsg: updatedLink.ivMsg,
        ivUrl: updatedLink.ivUrl,
        salt: updatedLink.salt,
        burned: false,
        clicks: updatedLink.clicks,
        maxViews: updatedLink.maxViews,
        analyticsEnabled: updatedLink.analyticsEnabled,
        expiresAt: updatedLink.expiresAt,
        burnedReason: null
      });
    } else {
      response = NextResponse.json({ error: 'Invalid link type' }, { status: 400 });
    }
    if (shouldBurnAfterResponse) {
      // Burn the link after serving the content
      await collection.deleteOne({ id });
      // Return a burned response if this was the last allowed view
      return NextResponse.json({
        error: 'This link has been burned (max views reached).',
        burned: true,
        burnedReason: 'maxViews',
        clicks: updatedLink.clicks,
        maxViews: updatedLink.maxViews
      }, { status: 410 });
    }
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  }
}
