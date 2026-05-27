import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get('number');

  if (!number) {
    return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        trackingNumber: number.toUpperCase(),
      },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // Return public-safe data (no userId or internal fields)
    return NextResponse.json({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      estimatedDelivery: shipment.estimatedDelivery?.toISOString(),
      events: shipment.events.map((e) => ({
        status: e.status,
        location: e.location,
        description: e.description,
        timestamp: e.timestamp.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
