import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized!", { status: 401 });
  }

  try {
    // Every page shares the [lang] root layout, so this purges both languages.
    revalidatePath("/", "layout");

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
