"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink, Link } from "lucide-react";
import { Project } from "@/app/models/sanityTypes";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { buildImageUrlFor } from "@/app/utilities/imageUrlBuilder";
import { SanityClientConfig } from "@/app/sanityClient";
import { useSanityConfigLoader } from "@/lib/hooks/sanityConfigLoader";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
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
              <h4 className="font-semibold mb-2">Technologies:</h4>
              <div className="flex flex-wrap gap-1 mb-4">
                {tags &&
                  tags.map((tag, index) => (
                    <Badge key={index} className="text-xs text-gray-700">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <a href={project.site} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectDetails;
