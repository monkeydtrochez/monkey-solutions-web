import {defineField, defineType} from 'sanity'

const lastFiftyYears = () => {
  let years = []
  const currentYear = new Date().getFullYear()
  for (let index = 0; index < 50; index++) {
    years.push((currentYear - index).toString())
  }

  return years
}

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
      name: 'start',
      title: 'Start',
      type: 'string',
      options: {
        list: lastFiftyYears(),
      },
    }),
    defineField({
      name: 'end',
      title: 'End',
      type: 'string',
      options: {
        list: lastFiftyYears(),
      },
    }),
    defineField({
      name: 'description',
      title: 'Work Description',
      type: 'blockContent',
    }),
  ],
})
