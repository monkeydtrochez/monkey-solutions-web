import React, { useContext } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import GlobalContext from "@/app/context/GlobalContext";
import ProjectDetails from "./ProjectDetails";
import { Project } from "@/app/models/sanityTypes";

const Projects = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { showProjects, projects, handleBackButton } = globalContext;

  return (
    <>
      <div
        className={`fixed inset-0 bg-white overflow-y-auto shadow-lg rounded-lg transition-all duration-1000 ease-in-out ${
          showProjects
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
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
          <h2 className="text-3xl font-bold mb-6">Projects</h2>
          <div className="grid gap-8">
            {projects &&
              projects.map((project: Project, index: number) => (
                <ProjectDetails key={index} project={project} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
