import { defineType, defineField, defineArrayMember } from 'sanity'

export const milestone = defineType({
  name: "milestone",
  title: "Milestone",
  type: "object",
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
    }),
    defineField({
      type: "string",
      name: "description",
      title: "Description",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description:
        "This image will be used as the milestone's cover image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description:
        "Tags to help categorize the milestone. For example: name of the university course, name of the project, the position you held within the project etc. ",
      options: { layout: "tags" },
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
    }),
    defineField({
      type: "duration",
      name: "duration",
      title: "Duration",
    }),
  ],
});

