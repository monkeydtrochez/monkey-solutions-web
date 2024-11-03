import type { NextApiRequest, NextApiResponse } from "next";
import { SanityApiResponse } from "@/app/models/sanityTypes";
import sanityClient from "@/app/sanityClient";

const query = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education'] {
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
      start,
      end,
      description
    }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SanityApiResponse[]>
) {
  const response = await sanityClient.fetch(query);
  res.status(200).json(response);
}
