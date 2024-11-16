import React, { useContext } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import logo from "@/app/monkeylogo.png";
import { Button } from "./ui/button";
import GlobalContext from "@/app/context/GlobalContext";
import SocialMediaButtons from "./ui/SocialMediaButtons";

const BusinessCard = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { profile, animateCard, handleViewCV, handleViewProjects } =
    globalContext;

  return (
    <>
      <Card
        className={`mb-8 transition-all duration-1000 ease-in-out ${
          animateCard
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0"
        }`}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Image
              src={logo}
              alt="Monkey Solutions Logo"
              width={300}
              height={100}
              priority={true}
              className="mx-auto mb-2 w-auto h-auto"
            />
            <p className="text-gray-600 mb-4">Software Development</p>
            {profile && (
              <SocialMediaButtons
                githubUrl={profile.githubUrl}
                linkedInUrl={profile.linkedInUrl}
              />
            )}
            {profile && (
              <p className="text-sm text-gray-500 mb-4">
                {profile?.email} | {profile?.mobile}
              </p>
            )}
            <div className="flex justify-center space-x-4">
              <Button onClick={handleViewProjects}>Projects</Button>
              <Button onClick={handleViewCV}>Resume</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BusinessCard;
