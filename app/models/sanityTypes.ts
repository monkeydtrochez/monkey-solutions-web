// Base interface for common properties
interface BaseType {
  _id: string;
  _type: string;
  title: string;
}

// Type for `profile`
export interface Profile extends BaseType {
  _type: "profile";
  location: string;
  languages: string[];
  professionalSkills: string[];
  personalitySkills: string[];
  profilePicture: ImageReference;
  description: WorkDescriptionBlock[];
  mobile: string;
  email: string;
}

// Type for `education`
export interface Education extends BaseType {
  _type: "education";
  school: string;
  start: string;
  end: string;
}

// Type for `workExperience`
export interface WorkExperience extends BaseType {
  _type: "workExperience";
  duration: Duration;
  description: WorkDescriptionBlock[];
}

export interface Project extends BaseType {
  _type: "project";
  coverImage: ImageReference;
  title: string;
  client: string;
  site: string;
  tags: string[];
  body: WorkDescriptionBlock[];
}

// Type for the `profilePicture` field
interface ImageReference {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

interface Duration {
  _type: "duration";
  startYear: string;
  endYear: string;
}

// Type for the `description` array in `workExperience`
interface WorkDescriptionBlock {
  _type: "block";
  style: string;
  _key: string;
  markDefs: never[];
  children: WorkDescriptionSpan[];
  listItem?: string;
  level?: number;
}

// Type for `span` children in `workExperience` description
interface WorkDescriptionSpan {
  _type: "span";
  text: string;
  _key: string;
  marks: never[];
}

// Union type to represent all possible entries
export type SanityApiResponse = Profile | Education | WorkExperience | Project;
