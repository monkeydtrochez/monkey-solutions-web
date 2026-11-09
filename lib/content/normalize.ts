import type {
  Education,
  Profile,
  Project,
  SanityApiResponse,
  WorkExperience,
} from "@/app/models/sanityTypes";

export type SiteContent = {
  profile: Profile | null;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
};

const isProfile = (item: SanityApiResponse): item is Profile =>
  item._type === "profile";
const isEducation = (item: SanityApiResponse): item is Education =>
  item._type === "education";
const isWorkExperience = (item: SanityApiResponse): item is WorkExperience =>
  item._type === "workExperience";
const isProject = (item: SanityApiResponse): item is Project =>
  item._type === "project";

const bySortIndex = (a: { sortIndex: number }, b: { sortIndex: number }) =>
  a.sortIndex - b.sortIndex;

export function normalizeSanityData(
  data: SanityApiResponse[] | null | undefined
): SiteContent {
  const items = data ?? [];
  return {
    profile: items.find(isProfile) ?? null,
    education: items.filter(isEducation),
    workExperience: items.filter(isWorkExperience).sort(bySortIndex),
    projects: items.filter(isProject).sort(bySortIndex),
  };
}
