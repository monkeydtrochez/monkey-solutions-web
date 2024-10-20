import React, { useContext } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import logo from "@/app/monkeylogo.png";
import { Button } from "./ui/button";
import { Github, Linkedin } from "lucide-react";
import GlobalContext from "@/app/context/GlobalContext";

const BusinessCard = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  } // Ensure context is available

  const { animateCard, handleViewCV } = globalContext;

  return (
    <>
      {/* Business Card Section */}
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
              className="mx-auto mb-2"
            />
            <p className="text-gray-600 mb-4">Software Development</p>
            <div className="flex justify-center space-x-4 mb-4">
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              {/* <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button> */}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              daniel@monkeysolutions.se | +4676 032 07 26
            </p>
            <Button onClick={handleViewCV}>Curriculum Vitae</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BusinessCard;
