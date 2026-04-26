import { SanityApiResponse } from "@/app/models/sanityTypes";
import axios from "axios";

export const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await axios.get<SanityApiResponse[]>(
    `${baseUrl}/api/sanity-data`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch Sanity data. Status: ${response.status}`);
  }

  return response.data;
};
