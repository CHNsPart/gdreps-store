// app/api/admin/colors/route.ts
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

    const colors = await prisma.color.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.error('GET /api/admin/colors error:', error);
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
    const { name, hex } = body;

    if (!name || !hex) {
      return NextResponse.json(
        { error: "Name and hex code are required" }, 
        { status: 400 }
      );
    }

    const color = await prisma.color.create({
      data: { name, hex },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error('POST /api/admin/colors error:', error);
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
    const { id, name, hex } = body;

    if (!id || !name || !hex) {
      return NextResponse.json(
        { error: "ID, name and hex code are required" }, 
        { status: 400 }
      );
    }

    const color = await prisma.color.update({
      where: { id },
      data: { name, hex },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error('PATCH /api/admin/colors error:', error);
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
        { error: "Color ID is required" }, 
        { status: 400 }
      );
    }

    await prisma.color.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Color deleted" });
  } catch (error) {
    console.error('DELETE /api/admin/colors error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}