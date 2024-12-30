import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const includeOrders = searchParams.get('includeOrders') === 'true';

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        orders: includeOrders ? {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            items: {
              include: {
                product: {
                  include: {
                    brand: true
                  }
                }
              }
            }
          }
        } : false
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phoneNumber } = body;

    // Basic validation
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      return new NextResponse("Invalid phone number format", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        phoneNumber: phoneNumber || null,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PROFILE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Basic phone number validation
function isValidPhoneNumber(phone: string) {
  // This is a basic validation - adjust based on your requirements
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}