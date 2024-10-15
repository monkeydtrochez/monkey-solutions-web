import { createContext, useState, ReactNode } from "react";

// Define the shape of your context data
interface ContextType {
  showCV: boolean;
  animateCard: boolean;
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
  // Create state for showCV and animateCard
  const [showCV, setShowCV] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);

  // Define functions for updating states from other components
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
        showCV,
        animateCard,
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
