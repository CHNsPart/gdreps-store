// Path: app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandSlug = searchParams.get("brand");
    const categorySlug = searchParams.get("category");

    // Build the where clause properly for Prisma relations
    const where = {
      ...(brandSlug && {
        brand: {
          slug: brandSlug
        }
      }),
      ...(categorySlug && {
        category: {
          slug: categorySlug
        }
      }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}