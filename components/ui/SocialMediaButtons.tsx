import React from "react";
import { Button } from "./button";
import { Github, Linkedin } from "lucide-react";

const SocialMediaButtons = () => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <Button variant="outline" size="icon">
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Github className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialMediaButtons;
