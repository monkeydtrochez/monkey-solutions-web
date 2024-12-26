import { NextResponse } from "next/server";
import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";

const query = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
    _id,
    _type,
    title,

    _type == 'profile' => {
    profilePicture,
      description,
      languages,
      mobile,
      email,
      location,
      personalitySkills,
      professionalSkills,
      linkedInUrl,
      githubUrl
    },

      _type == 'education' => {
    school,
      start,
      end
    },

      _type == 'workExperience' => {
      sortIndex,
      duration,
      description
    },

      _type == 'project' => {
      sortIndex,
      title,
      coverImage,
      duration,
        client,
        site,
        tags,
        body
    }
}`;

export async function GET() {
  const config: SanityClientConfig = {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "",
    apiVersion: process.env.SANITY_API_VERSION || "",
    useCdn: process.env.SANITY_USE_CDN === "true",
  };

  const sanityClient = createClientFromParam(config);
  const response = await sanityClient?.fetch(query, { time: Date.now() });

  return NextResponse.json(response, {
    status: 200,
    headers: new Headers({
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    }),
  });
}
