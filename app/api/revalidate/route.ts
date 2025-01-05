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

    // revalidatePath("/api/sanity-data");
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

    return NextResponse.json("Successful reloading of sanity data!", {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(`Failed reloading data: ${error}`, {
      status: 500,
    });
  }
}
