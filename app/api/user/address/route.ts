import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { shippingAddress } = body;

    if (!shippingAddress) {
      return new NextResponse("Shipping address is required", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        shippingAddress,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_ADDRESS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}