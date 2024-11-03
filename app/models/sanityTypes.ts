// Base interface for common properties
interface BaseType {
  _type: string;
  title: string;
}

// Type for `profile`
interface Profile extends BaseType {
  _type: "profile";
  location: string;
  professionalSkills: string[];
  personalitySkills: string[];
  profilePicture: ImageReference;
  description: string | null;
  mobile: string;
  email: string;
}

// Type for the `profilePicture` field
interface ImageReference {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

// Type for `education`
interface Education extends BaseType {
  _type: "education";
  school: string;
  start: string;
  end: string;
}

// Type for `workExperience`
interface WorkExperience extends BaseType {
  _type: "workExperience";
  start: string;
  end: string;
  description: WorkDescriptionBlock[];
}

// Type for the `description` array in `workExperience`
interface WorkDescriptionBlock {
  _type: "block";
  style: string;
  _key: string;
  markDefs: any[];
  children: WorkDescriptionSpan[];
  listItem?: string;
  level?: number;
}

// Type for `span` children in `workExperience` description
interface WorkDescriptionSpan {
  _type: "span";
  text: string;
  _key: string;
  marks: any[];
}

// Union type to represent all possible entries
export type SanityApiResponse = Profile | Education | WorkExperience;
