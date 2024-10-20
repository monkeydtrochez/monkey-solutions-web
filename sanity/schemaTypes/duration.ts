import { defineType, defineField } from 'sanity'

export const duration = defineType({
  type: "object",
  name: "duration",
  title: "Duration",
  fields: [
    defineField({
      type: "datetime",
      name: "start",
      title: "Start",
    }),
    defineField({
      type: "datetime",
      name: "end",
      title: "End",
    }),
  ],
});

