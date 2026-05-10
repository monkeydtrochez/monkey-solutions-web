import {defineType, defineField, defineArrayMember} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projects',
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
      description: 'This field is the title of your project.',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('A title is required.'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'duration',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'site',
      title: 'Site',
      type: 'url',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      options: {layout: 'tags'},
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Overview',
      type: 'blockContent',
      description: 'Single summary paragraph shown in the expanded accordion row.',
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      description: 'Display label, e.g. "E-commerce · Headless", "iOS · Education", "SaaS · Product".',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
})
