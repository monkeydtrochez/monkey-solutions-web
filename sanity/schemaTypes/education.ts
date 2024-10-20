import {defineField, defineType} from 'sanity'

const lastFiftyYears = () => {
  let years = []
  const currentYear = new Date().getFullYear()
  for (let index = 0; index < 50; index++) {
    years.push((currentYear - index).toString())
  }

  return years
}

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'education',
      title: 'Education',
      type: 'string',
    }),
    defineField({
      name: 'school',
      title: 'School',
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
  ],
})
