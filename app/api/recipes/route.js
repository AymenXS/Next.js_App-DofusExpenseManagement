import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CORRECT: Use the new relationship name "materials" not "ingredients"
    const recipes = await prisma.recipe.findMany({
      include: {
        materials: {
          // ← Changed from "ingredients" to "materials"
          include: {
            material: true, // This brings in the RawMaterial details
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, quantity, materials } = await request.json();

    // Validate input
    if (!name || !materials) {
      return NextResponse.json({ error: 'Name and materials are required' }, { status: 400 });
    }

    // Use transaction to ensure all operations succeed or fail together
    const recipe = await prisma.$transaction(async (transaction) => {
      // 1. Create the recipe
      const newRecipe = await transaction.recipe.create({
        data: {
          name: name.trim(),
          quantity: parseInt(quantity) || 1,
        },
      });

      // 2. Create all recipe materials
      const recipeMaterialsData = materials.map((recipeMaterial) => ({
        recipeId: newRecipe.id,
        materialId: parseInt(recipeMaterial.materialId),
        quantity: parseInt(recipeMaterial.quantity),
      }));

      await transaction.recipeMaterial.createMany({
        data: recipeMaterialsData,
      });

      // 3. Return the complete recipe with materials
      return await transaction.recipe.findUnique({
        where: { id: newRecipe.id },
        include: {
          materials: {
            include: {
              material: true,
            },
          },
        },
      });
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);

    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Recipe already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
