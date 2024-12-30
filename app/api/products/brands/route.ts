// Path: app/api/products/brands/route.ts
import { BRANDS } from "@/lib/brands";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // First get all brands from the database
    const brands = await prisma.brand.findMany({
      where: {
        slug: {
          in: [...BRANDS] // Use the BRANDS array to filter by slug, converting it to a mutable array
        }
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Transform the data to match the expected format
    const brandCounts = brands.map(brand => ({
      brand: brand.slug,
      count: brand._count.products
    }));

    return NextResponse.json(brandCounts);
  } catch (error) {
    console.error("[BRANDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}