import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const materials = await prisma.rawMaterial.findMany({
      include: {
        prices: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, unit, initialPrice } = await request.json();

    // Validate input
    if (!name || !unit || !initialPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const material = await prisma.rawMaterial.create({
      data: {
        name: name.trim(),
        unit,
        prices: {
          create: {
            price: parseFloat(initialPrice),
          },
        },
      },
      include: {
        prices: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Material already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}
