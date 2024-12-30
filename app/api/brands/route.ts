import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Remove any authentication check
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("[BRANDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}