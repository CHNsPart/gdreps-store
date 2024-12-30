import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const id = await params.id;

    if (!user || user.email !== 'imchn24@gmail.com') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const id = params.id;

    if (!user || user.email !== 'imchn24@gmail.com') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      prodCategory, 
      brand, 
      images, 
      sku, 
      shippingCost, 
      price, 
      productDetails, // Added new field
      size, 
      colors, 
      inStock 
    } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        categoryId: prodCategory,
        brandId: brand,
        images: JSON.stringify(images),
        sku,
        shippingCost: parseFloat(shippingCost),
        price: parseFloat(price),
        productDetails: productDetails || null, // Added new field
        sizes: {
          set: [],
          connect: size.map((id: string) => ({ id }))
        },
        colors: {
          set: [],
          connect: colors.map((id: string) => ({ id }))
        },
        inStock: Boolean(inStock)
      },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_UPDATE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}