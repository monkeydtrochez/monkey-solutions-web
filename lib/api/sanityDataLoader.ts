import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";
import { SanityApiResponse } from "@/app/models/sanityTypes";

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
      githubUrl,
      heroBio,
      aboutBody
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
        overview,
        kind,
        "metrics": metrics[]{ label, value, suffix }
    }
}`;

export const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION;

  if (!projectId || !dataset || !apiVersion) {
    throw new Error(
      `Missing Sanity env vars: ${[
        !projectId && "SANITY_PROJECT_ID",
        !dataset && "SANITY_DATASET",
        !apiVersion && "SANITY_API_VERSION",
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }

  const config: SanityClientConfig = {
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  };
  const sanityClient = createClientFromParam(config);
  return sanityClient.fetch(query);
};
