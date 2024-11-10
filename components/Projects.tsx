import React, { useContext } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, ExternalLink, Link } from "lucide-react";
import Image from "next/image";
import GlobalContext from "@/app/context/GlobalContext";

// Sample project data (replace with your actual projects)
const mockedProjects = [
  {
    clientName: "TechCorp",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "A modern e-commerce platform for tech gadgets",
    techniques: ["React", "Next.js", "Tailwind CSS", "Stripe"],
    url: "https://techcorp-ecommerce.com",
  },
  {
    clientName: "HealthHub",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Telemedicine application for remote patient consultations",
    techniques: ["Vue.js", "Node.js", "Express", "MongoDB", "WebRTC"],
    url: "https://healthhub-telemedicine.com",
  },
  {
    clientName: "EcoTrack",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Environmental monitoring dashboard for smart cities",
    techniques: ["React", "D3.js", "Python", "Flask", "PostgreSQL"],
    url: "https://ecotrack-smartcity.com",
  },
];

const Projects = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { showProjects, project, handleBackButton } = globalContext;

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
            {mockedProjects.map((project, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                      <Image
                        src={project.thumbnail}
                        alt={`${project.clientName} project thumbnail`}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-semibold mb-2">
                        {project.clientName}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.description}
                      </p>
                      <h4 className="font-semibold mb-2">Technologies used:</h4>
                      <ul className="list-disc list-inside mb-4">
                        {project.techniques.map((tech, techIndex) => (
                          <li key={techIndex} className="text-sm text-gray-600">
                            {tech}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
