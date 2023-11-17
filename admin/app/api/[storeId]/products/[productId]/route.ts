import { authorizedStore } from "@/db/controllers/apiController";
import { deleteProduct, getProduct, updateProduct } from "@/db/controllers/productApiController";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { productId: string } }
) {
	try {
		
		if(!params.productId){
			return new NextResponse("Product Id is required",{status:400});
		}

		const product = await getProduct(params.productId);

	return NextResponse.json(product);

	} catch (error) {
		console.log("[PRODUCT_GET]:", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
};

export async function PATCH(
  req: Request,
  { params }: { params: { storeId:string  ,productId: string } }
) {
  try {
    const { userId } = auth();
    const {
		name,
		imageUrl,
		price,
		quantity,
		subCategoryId,
		sizeId,
		isFeatured,
	} = await req.json();
    
	if (!userId) {
      	return new NextResponse("Unauthenticated", { status: 401 });
    }
	if (!name){
		return new NextResponse("name is required" , { status: 400});
	}
	if (!price){
		return new NextResponse("Price is required" , { status: 400});
	}
	if(!imageUrl){
		return new NextResponse("Images are required" , { status: 400});
	}
	if (!sizeId){
		return new NextResponse("Size Id is required" , { status: 400});
	}
	if (!subCategoryId){
		return new NextResponse("Category Id is required" , { status: 400});
	}
	if(!params.productId){
		return new NextResponse("Product 	Id is required",{status:400});
	}

	const storeByUserId = await authorizedStore(params.storeId,userId);

	if(!storeByUserId){
		return new NextResponse("UnAuthorized",{status:403});
	}
	const product = await updateProduct(params.productId,name,price,subCategoryId,sizeId,quantity,isFeatured,imageUrl);

	return NextResponse.json(product);

  } catch (error) {
    console.log("[PRODUCT_PATCH]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId:string ,productId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}
		
		if(!params.productId){
			return new NextResponse("Product Id is required",{status:400});
		}

		const storeByUserId = await authorizedStore(params.storeId,userId);
	
		if(!storeByUserId){
			return new NextResponse("UnAuthorized",{status:403});
		}

		const product = await deleteProduct(params.productId);

	return NextResponse.json(product);

	} catch (error) {
		console.log("[PRODUCT_DELETE]:", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
};
