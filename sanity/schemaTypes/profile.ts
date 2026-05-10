import {defineArrayMember, defineField, defineType} from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Profile',
    }),
    defineField({
      name: 'profilePicture',
      title: 'Profile picture',
      type: 'image',
    }),
    defineField({
      name: 'linkedInUrl',
      title: 'LinkedIn Url',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Url',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Profile Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'personalitySkills',
      title: 'Personality skills',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'professionalSkills',
      title: 'Professional skills',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroBio',
      title: 'Hero Bio',
      type: 'string',
      description: 'Short lede paragraph displayed in the hero section.',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Body',
      type: 'text',
      description: 'About section body copy (2+ paragraphs). Separate paragraphs with a blank line.',
    }),
  ],
})
