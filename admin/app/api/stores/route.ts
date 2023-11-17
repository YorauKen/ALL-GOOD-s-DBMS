import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { insertCategory } from "@/db/controllers/apiController";


export async function POST(
	req:Request,
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name } = body;
 
		if(!userId){
			return new NextResponse("Unauthorized" , { status: 401});
		}
		if (!name){
			return new NextResponse("Name is required" , { status: 400});
		}
		const storeId = await insertCategory({
			data:{
				name,
				userId,
			}
		});
		return NextResponse.json(storeId);

	} catch (error) {
		console.log('[STORES_POST]',error);
		return new NextResponse("Internal error",{status:500});
	}
}