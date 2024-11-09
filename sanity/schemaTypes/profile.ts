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
  ],
})
