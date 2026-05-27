import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendTrackingUpdateEmail, isEmailConfigured } from '@/lib/email';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: 'SES is not configured. Add the SES_* environment variables in Amplify.' }, { status: 400 });
  }

  const { to, trackingNumber, status, description, location, estimatedDelivery } = await request.json();

  if (!to || !trackingNumber || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const result = await sendTrackingUpdateEmail({
    to,
    trackingNumber,
    status,
    description: description || 'Status updated',
    location,
    estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
  });

  return NextResponse.json(result);
}
