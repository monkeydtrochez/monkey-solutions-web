import { defineType, defineField, defineArrayMember } from 'sanity'

export const post = defineType({
  type: "document",
  name: "post",
  title: "Blog post",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: "project" },
        }),
      ],
    }),
  ],
});

