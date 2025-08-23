import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { price, date } = await request.json();
    const materialId = parseInt(params.id);

    if (!price) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }

    const newPrice = await prisma.rawMaterialPrice.create({
      data: {
        materialId,
        price: parseInt(price),
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(newPrice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }
}


