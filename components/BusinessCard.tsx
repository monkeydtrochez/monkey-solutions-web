import React, { useContext } from "react";
import { Card, CardContent } from "./ui/card";
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
            <h1 className="text-3xl font-bold mb-2">Monkey Solutions</h1>
            <p className="text-gray-600 mb-4">Software development</p>
            <div className="flex justify-center space-x-4 mb-4">
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              daniel@monkeysolutions.se | +4676 032 07 26
            </p>
            <Button onClick={handleViewCV}>View Full CV</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BusinessCard;
