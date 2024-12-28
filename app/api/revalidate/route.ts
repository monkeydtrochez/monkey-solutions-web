import { revalidatePath } from "next/cache";
import { revalidateCache } from "@/lib/api/sanityDataLoader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== process.env.CRON_SECRET) {
    return new Response("Unauthorized!", { status: 401 });
  }

  try {
    await revalidateCache();
    revalidatePath("/");
    return NextResponse.json("Successful reloading of sanity data!", {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(`Failed reloading data: ${error}`, {
      status: 500,
    });
  }
}
