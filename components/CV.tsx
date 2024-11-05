import React, { useContext, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Github, Linkedin } from "lucide-react";
import GlobalContext from "@/app/context/GlobalContext";
import Skills from "./Skills";
import Education from "./Education";
import Profile from "./Profile";
import WorkExperience from "./WorkExperience";
import { buildImageUrlFor } from "@/app/utilities/imageUrlBuilder";
import { useSanityConfigLoader } from "@/app/hooks/sanityConfigLoader";
import { SanityClientConfig } from "@/app/sanityClient";

const CV = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { config } = useSanityConfigLoader();

  const { showCV, profile, handleBackButton } = globalContext;

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (profile?.profilePicture.asset._ref) {
      setImageUrl(
        buildImageUrlFor(
          config as SanityClientConfig,
          profile?.profilePicture.asset._ref
        )
      );
    }
  }, [config, profile?.profilePicture.asset._ref]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-white overflow-y-auto shadow-lg rounded-lg transition-all duration-1000 ease-in-out ${
          showCV ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <div className="max-w-4xl mx-auto p-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackButton}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 pr-8">
              <Profile />
              <WorkExperience />
            </div>
            <div className="md:w-1/3">
              <div className="bg-gray-100 rounded-t-full overflow-hidden mb-6">
                <img
                  src={imageUrl}
                  alt="Daniel Trochez"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex justify-center space-x-4 mb-8">
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
              <Skills />
              <Education />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CV;
