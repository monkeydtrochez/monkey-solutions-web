import {defineField, defineType} from 'sanity'

export const workExperience = defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'sortIndex',
      title: 'Sort Index',
      type: 'number',
      validation: (Rule) => Rule.required().error('A sort index is required.'),
    }),
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
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'The employer or client organisation name displayed in the timeline.',
    }),
    defineField({
      name: 'current',
      title: 'Current role',
      type: 'boolean',
      description: 'Enable for the active/current job. Controls the orange pulse dot in the timeline.',
      initialValue: false,
    }),
  ],
})
