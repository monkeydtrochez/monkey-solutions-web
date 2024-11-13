import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { ExternalLink, Link } from "lucide-react";
import { Button } from "./ui/button";
import { Project } from "@/app/models/sanityTypes";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { buildImageUrlFor } from "@/app/utilities/imageUrlBuilder";
import { SanityClientConfig } from "@/app/sanityClient";
import { useSanityConfigLoader } from "@/app/hooks/sanityConfigLoader";

interface ProjectDetailsProps {
  project: Project;
  index: number;
}

const ProjectDetails = ({ project, index }: ProjectDetailsProps) => {
  const tags = project.tags;
  const contentComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        return <p className="text-sm text-gray-600 mb-2">{children}</p>;
      },
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          {children}
        </ul>
      ),
    },
  };

  const { config } = useSanityConfigLoader();

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (project.coverImage.asset._ref) {
      setImageUrl(
        buildImageUrlFor(
          config as SanityClientConfig,
          project.coverImage.asset._ref
        )
      );
    }
  }, [config, project.coverImage.asset._ref]);

  return (
    <>
      <Card key={project._id}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={`${project.client} project thumbnail`}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48"
                />
              )}
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">{project.client}</h3>
              <PortableText
                value={project.body}
                components={contentComponents}
              />
              <h4 className="font-semibold mb-2">Technologies used:</h4>
              <ul className="list-disc list-inside mb-4">
                {tags && // todo fix render tags with badge component
                  tags.map((tag, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {tag}
                    </li>
                  ))}
              </ul>
              <Link
                href={project.site}
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
    </>
  );
};

export default ProjectDetails;
