import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { clearCostCache } from '@/lib/calculation';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        ingredients: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, quantity, isFinal, sellingPrice, ingredients } = await request.json();

    if (!name || !ingredients) {
      return NextResponse.json({ error: 'Name and ingredients are required' }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        quantity: parseInt(quantity) || 1,
        isFinal: Boolean(isFinal),
        sellingPrice: sellingPrice ? parseInt(sellingPrice) : null,
        ingredients: {
          create: ingredients.map((ing) => ({
            ingredientId: parseInt(ing.ingredientId),
            ingredientType: ing.ingredientType,
            quantity: parseInt(ing.quantity) || 1,
          })),
        },
      },
      include: {
        ingredients: true,
      },
    });

    clearCostCache();
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating item:', error);

    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Item already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
