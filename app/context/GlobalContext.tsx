"use client";
import { createContext, useState, useCallback, ReactNode } from "react";
import {
  SanityApiResponse,
  Profile,
  Education,
  WorkExperience,
  Project,
} from "../models/sanityTypes";

interface ContextType {
  profile: Profile | null;
  education: Education | null;
  workExperience: WorkExperience[] | null;
  projects: Project[] | null;
  setSiteContentToContext: (data: SanityApiResponse[] | null) => void;
}

const GlobalContext = createContext<ContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [profile, setProfileData] = useState<Profile | null>(null);
  const [education, setEducationData] = useState<Education | null>(null);
  const [workExperience, setWorkExperienceData] = useState<
    WorkExperience[] | null
  >(null);
  const [projects, setProjects] = useState<Project[] | null>(null);

  const setSiteContentToContext = useCallback(
    (data: SanityApiResponse[] | null) => {
      const profileData = data?.find((item) => item._type === "profile");
      if (profileData) {
        setProfileData(profileData);
      }

      const educationData = data?.find((item) => item._type === "education");
      if (educationData) {
        setEducationData(educationData);
      }

      const workExperienceArray = data?.filter(
        (item) => item._type === "workExperience"
      );
      if (workExperienceArray != null) {
        const sortedList = [...workExperienceArray].sort(
          (a, b) => a.sortIndex - b.sortIndex
        );
        setWorkExperienceData(sortedList);
      }

      const projectsData = data?.filter((item) => item._type === "project");
      if (projectsData != null) {
        const sortedList = [...projectsData].sort(
          (a, b) => a.sortIndex - b.sortIndex
        );
        setProjects(sortedList);
      }
    },
    []
  );

  return (
    <GlobalContext.Provider
      value={{
        profile,
        education,
        workExperience,
        projects,
        setSiteContentToContext,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
