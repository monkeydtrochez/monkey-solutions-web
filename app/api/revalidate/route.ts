import {
  getSanityDataFromCache,
  revalidateCache,
} from "@/lib/api/sanityDataLoader";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== process.env.CRON_SECRET) {
    return new Response("Unauthorized!", { status: 401 });
  }

  try {
    const dataBeforeRevalidated = await getSanityDataFromCache();
    const projectsDataBeforeRevalidation = dataBeforeRevalidated?.find(
      (data) => data._type === "project" && data.client === "Monkey Solutions"
    );
    console.log(
      "Title BEFORE revalidation: ",
      projectsDataBeforeRevalidation?.title
    );

    revalidatePath("/api/sanity-data");
    revalidatePath("/");
    await revalidateCache();
    // revalidatePath("/api/sanity-data");

    const dataAfterRevalidated = await getSanityDataFromCache();
    const projectsDataAfterRevalidation = dataAfterRevalidated?.find(
      (data) => data._type === "project" && data.client === "Monkey Solutions"
    );
    console.log(
      "Title AFTER revalidation: ",
      projectsDataAfterRevalidation?.title
    );

    const response = NextResponse.json("Successful reloading of sanity data!", {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });

    return response;
  } catch (error) {
    const errorResponse = NextResponse.json(`Failed reloading data: ${error}`, {
      status: 500,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return errorResponse;
  }
}
