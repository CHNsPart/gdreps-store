// app/api/admin/sizes/route.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const validateAdmin = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return user?.email === 'imchn24@gmail.com';
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
};

export async function GET() {
  try {
    const isAdmin = await validateAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sizes = await prisma.size.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.error('GET /api/admin/sizes error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await validateAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" }, 
        { status: 400 }
      );
    }

    const size = await prisma.size.create({
      data: { name, type },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error('POST /api/admin/sizes error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await validateAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, type } = body;

    if (!id || !name || !type) {
      return NextResponse.json(
        { error: "ID, name and type are required" }, 
        { status: 400 }
      );
    }

    const size = await prisma.size.update({
      where: { id },
      data: { name, type },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error('PATCH /api/admin/sizes error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const isAdmin = await validateAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Size ID is required" }, 
        { status: 400 }
      );
    }

    await prisma.size.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Size deleted" });
  } catch (error) {
    console.error('DELETE /api/admin/sizes error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}