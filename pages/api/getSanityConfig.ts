import type { NextApiRequest, NextApiResponse } from "next";
import { SanityClientConfig } from "@/app/sanityClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SanityClientConfig>
) {
  const config: SanityClientConfig = {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "",
    apiVersion: process.env.SANITY_API_VERSION || "",
    useCdn: process.env.SANITY_USE_CDN === "true",
  };
  res.status(200).json(config);
}
