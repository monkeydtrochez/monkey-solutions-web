import { createContext, useState, ReactNode } from "react";
import { SanityApiResponse } from "../models/sanityTypes";

// Define the shape of your context data
interface ContextType {
  siteContent: SanityApiResponse[] | null;
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
  const [siteContent, setSiteContent] = useState<SanityApiResponse[] | null>(
    null
  );
  const [showCV, setShowCV] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);

  // Define functions for updating states from other components

  const setSiteContentToContext = (data: SanityApiResponse[]) => {
    // todo ta datan och bryt ut i respektive type. Mappa datan till Profile, Eductaion & WorkExpecience
    // och exponera state för dessa tre olika för att enklare plocka ur från context.
    setSiteContent(data);
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
        siteContent,
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
