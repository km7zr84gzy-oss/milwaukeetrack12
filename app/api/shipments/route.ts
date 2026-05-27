import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createShipmentSchema = z.object({
  trackingNumber: z.string().min(8),
  carrier: z.string().min(2),
  origin: z.string().optional(),
  destination: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const shipments = await prisma.shipment.findMany({
    where: { userId },
    include: {
      events: {
        orderBy: { timestamp: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(shipments);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await request.json();

  const parsed = createShipmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const shipment = await prisma.shipment.create({
    data: {
      trackingNumber: data.trackingNumber.toUpperCase(),
      carrier: data.carrier,
      origin: data.origin,
      destination: data.destination,
      estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : null,
      userId,
      status: 'Pending',
    },
  });

  // Create initial event
  await prisma.trackingEvent.create({
    data: {
      shipmentId: shipment.id,
      status: 'Pending',
      description: 'Shipment registered in system',
    },
  });

  return NextResponse.json(shipment, { status: 201 });
}
