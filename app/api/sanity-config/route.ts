import { NextResponse } from "next/server";
import { SanityClientConfig } from "@/app/sanityClient";

export async function GET() {
  const config: SanityClientConfig = {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "",
    apiVersion: process.env.SANITY_API_VERSION || "",
    useCdn: process.env.SANITY_USE_CDN === "true",
  };

  return NextResponse.json(config, { status: 200 });
}
