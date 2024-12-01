"use client";
import React, { useContext, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import GlobalContext from "@/app/context/GlobalContext";
import Education from "./Education";
import Profile from "./Profile";
import WorkExperience from "./WorkExperience";
import { buildImageUrlFor } from "@/app/utilities/imageUrlBuilder";
import { useSanityConfigLoader } from "@/lib/hooks/sanityConfigLoader";
import { SanityClientConfig } from "@/app/sanityClient";
import ProfileIntro from "./ProfileIntro";

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
          <div className="mb-8">
            <h1 className="text-5xl font-light mb-2">
              Daniel <span className="text-orange-500 font-normal">T</span>
              rochez
            </h1>
            <h2 className="text-xl text-gray-600 mb-6">SOFTWARE DEVELOPER</h2>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:hidden mb-8">
              {profile && (
                <ProfileIntro profile={profile} imageUrl={imageUrl} />
              )}
            </div>
            <div className="md:w-2/3 pr-8">
              <Profile />
              <WorkExperience />
            </div>
            <div className="md:w-1/3">
              <div className="hidden sm:block">
                {profile && (
                  <ProfileIntro profile={profile} imageUrl={imageUrl} />
                )}
              </div>
              <Education />
              <div>
                <h3 className="text-lg font-semibold mb-2">OTHER</h3>
                <h4 className="text-sm font-semibold">
                  Active board member for a .NET program
                </h4>
                <p className="text-sm text-gray-600">
                  Handelsakademin Göteborg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CV;
