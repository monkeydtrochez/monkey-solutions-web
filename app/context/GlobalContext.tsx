import { createContext, useState, ReactNode } from "react";
import {
  SanityApiResponse,
  Profile,
  Education,
  WorkExperience,
} from "../models/sanityTypes";

// Define the shape of your context data
interface ContextType {
  profile: Profile | null;
  education: Education | null;
  workExperience: WorkExperience[] | null;
  showCV: boolean;
  animateCard: boolean;
  setSiteContentToContext: (data: SanityApiResponse[]) => void;
  handleViewCV: () => void;
  handleBackButton: () => void;
  toggleCardAnimation: (shouldAnimate: boolean) => void;
}

// Create the context
const GlobalContext = createContext<ContextType | null>(null);

// Define the provider component
export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Create state for siteContent, showCV and animateCard
  const [profile, setProfileData] = useState<Profile | null>(null);
  const [education, setEducationData] = useState<Education | null>(null);
  const [workExperience, setWorkExperienceData] = useState<
    WorkExperience[] | null
  >(null);

  const [showCV, setShowCV] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);

  // Define functions for updating states from other components

  const setSiteContentToContext = (data: SanityApiResponse[] | null) => {
    const profileData = data?.find((item) => item._type === "profile");
    if (profileData) {
      setProfileData(profileData);
    }

    const educationData = data?.find((item) => item._type === "education");
    if (educationData) {
      setEducationData(educationData);
    }

    if (!workExperience) {
      const workExperienceArray = data?.filter(
        (data) => data._type === "workExperience"
      );

      if (workExperienceArray) {
        setWorkExperienceData(workExperienceArray);
      }
    }
  };

  const handleViewCV = () => {
    setShowCV(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackButton = () => {
    setShowCV(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCardAnimation = (shouldAnimate: boolean) => {
    setAnimateCard(shouldAnimate);
  };

  // Return provider and expose the public fields and methods
  return (
    <GlobalContext.Provider
      value={{
        profile,
        education,
        workExperience,
        showCV,
        animateCard,
        setSiteContentToContext,
        handleViewCV,
        handleBackButton,
        toggleCardAnimation,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
