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

export const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const config: SanityClientConfig = {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "",
    apiVersion: process.env.SANITY_API_VERSION || "",
    useCdn: false,
  };
  const sanityClient = createClientFromParam(config);
  if (!sanityClient) throw new Error("Sanity client could not be created");
  return sanityClient.fetch(query);
};
