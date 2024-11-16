import { Button } from "./button";
import { Github, Linkedin } from "lucide-react";

interface SocialMediaProps {
  linkedInUrl: string;
  githubUrl: string;
}

const SocialMediaButtons = ({ linkedInUrl, githubUrl }: SocialMediaProps) => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon">
          <Linkedin className="h-4 w-4" />
        </Button>
      </a>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon">
          <Github className="h-4 w-4" />
        </Button>
      </a>
    </div>
  );
};

export default SocialMediaButtons;
