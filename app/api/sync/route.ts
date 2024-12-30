import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Upsert user - create if doesn't exist, update if exists
    const dbUser = await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        profileImage: user.picture ?? "",
      },
      create: {
        id: user.id,
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        profileImage: user.picture ?? "",
      },
    });

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("[AUTH_SYNC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}