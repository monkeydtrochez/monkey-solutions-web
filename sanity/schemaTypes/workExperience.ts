import {defineField, defineType} from 'sanity'

export const workExperience = defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'duration',
    }),
    defineField({
      name: 'description',
      title: 'Work Description',
      type: 'blockContent',
    }),
  ],
})
