import type { NextApiRequest, NextApiResponse } from "next";
import { SanityApiResponse } from "@/app/models/sanityTypes";
import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";

const query = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
    _id,
    _type,
    title,

    _type == 'profile' => {
    profilePicture,
      description,
      mobile,
      email,
      location,
      personalitySkills,
      professionalSkills
    },

      _type == 'education' => {
    school,
      start,
      end
    },

      _type == 'workExperience' => {
      duration,
      description
    },

      _type == 'project' => {
      title,
      coverImage,
      duration,
        client,
        site,
        tags,
        body
    }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SanityApiResponse[]>
) {
  const config: SanityClientConfig = {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "",
    apiVersion: process.env.SANITY_API_VERSION || "",
    useCdn: process.env.SANITY_USE_CDN === "true",
  };

  const sanityClient = createClientFromParam(config);
  const response = await sanityClient?.fetch(query);
  res.status(200).json(response);
}
