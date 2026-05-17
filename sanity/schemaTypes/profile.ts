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
      name: 'communityWork',
      title: 'Community & Board work',
      description: 'Extra assignments shown in the "Also / Community" section.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'communityEntry',
          fields: [
            defineField({
              name: 'assignment',
              title: 'Assignment',
              type: 'string',
              description: 'What you do, e.g. "Active board member for a .NET program"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'organisation',
              title: 'Organisation',
              type: 'string',
              description: 'Who you do it for, e.g. "Handelsakademin Göteborg"',
            }),
          ],
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
      title: 'Professional skills (legacy)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'skillGroups',
      title: 'Professional skills (categorized)',
      description: 'Used by the redesigned site. Each skill has a name and a category.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'skillEntry',
          fields: [
            defineField({
              name: 'name',
              title: 'Skill name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  {title: 'Languages', value: 'Languages'},
                  {title: 'Frontend', value: 'Frontend'},
                  {title: 'Backend & Infra', value: 'Backend & Infra'},
                  {title: 'Craft', value: 'Craft'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'heroBio',
      title: 'Hero Bio',
      type: 'string',
      description: 'Short lede paragraph displayed in the hero section.',
    }),
  ],
})
