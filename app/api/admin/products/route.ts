import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

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

    if (!title || !prodCategory || !brand || !sku || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        categoryId: prodCategory,
        brandId: brand,
        images: JSON.stringify(images),
        sku,
        shippingCost: parseFloat(shippingCost),
        price: parseFloat(price),
        productDetails: productDetails || null, // Added new field
        inStock: Boolean(inStock),
        sizes: {
          connect: size.map((sizeId: string) => ({ id: sizeId }))
        },
        colors: {
          connect: colors.map((colorId: string) => ({ id: colorId }))
        }
      },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== 'imchn24@gmail.com') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brand");
    const categoryId = searchParams.get("category");

    const where = {
      ...(brandId && { brandId }),
      ...(categoryId && { categoryId }),
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
    if (error instanceof Error) {
      console.error('[PRODUCTS_GET]', error.message);
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== 'imchn24@gmail.com') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    // Delete the product and disconnect all relations
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[PRODUCT_DELETE]', error.message);
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== 'imchn24@gmail.com') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      id,
      title, 
      prodCategory, 
      brand, 
      images, 
      sku, 
      shippingCost, 
      price, 
      size, 
      colors, 
      inStock 
    } = body;

    if (!id) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    // Update the product with relations
    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...(title && { title }),
        ...(prodCategory && { categoryId: prodCategory }),
        ...(brand && { brandId: brand }),
        ...(images && { images: JSON.stringify(images) }),
        ...(sku && { sku }),
        ...(shippingCost && { shippingCost: parseFloat(shippingCost) }),
        ...(price && { price: parseFloat(price) }),
        ...(inStock !== undefined && { inStock: Boolean(inStock) }),
        // Update sizes if provided
        ...(size && {
          sizes: {
            set: [], // First disconnect all
            connect: size.map((sizeId: string) => ({ id: sizeId }))
          }
        }),
        // Update colors if provided
        ...(colors && {
          colors: {
            set: [], // First disconnect all
            connect: colors.map((colorId: string) => ({ id: colorId }))
          }
        })
      },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof Error) {
      console.error('[PRODUCT_UPDATE]', error.message);
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}