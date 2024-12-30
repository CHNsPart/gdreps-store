// app/api/admin/brands/route.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to validate admin
const validateAdmin = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imchn24@gmail.com') {
    return false;
  }
  return true;
};

// Helper function to generate slug
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== 'imchn24@gmail.com') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
    console.error('[BRANDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await validateAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const slug = generateSlug(name);

    // Check if brand with same name or slug exists
    const existing = await prisma.brand.findFirst({
      where: {
        OR: [
          { name: name },
          { slug: slug }
        ]
      }
    });

    if (existing) {
      return new NextResponse("Brand already exists", { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('[BRANDS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!await validateAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return new NextResponse("ID and name are required", { status: 400 });
    }

    const slug = generateSlug(name);

    // Check if another brand with same name or slug exists
    const existing = await prisma.brand.findFirst({
      where: {
        OR: [
          { name: name },
          { slug: slug }
        ],
        NOT: {
          id: id
        }
      }
    });

    if (existing) {
      return new NextResponse("Brand already exists", { status: 400 });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('[BRANDS_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!await validateAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Brand ID required", { status: 400 });
    }

    // Delete the brand
    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Brand deleted" });
  } catch (error) {
    console.error('[BRANDS_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}