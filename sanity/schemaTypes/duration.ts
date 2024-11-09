import {defineType, defineField} from 'sanity'

const lastFiftyYears = () => {
  let years = []
  const currentYear = new Date().getFullYear()
  for (let index = 0; index < 50; index++) {
    years.push((currentYear - index).toString())
  }

  return years
}

export const duration = defineType({
  type: 'object',
  name: 'duration',
  title: 'Duration',
  fields: [
    defineField({
      type: 'string',
      name: 'startYear',
      title: 'Start year',
      options: {
        list: lastFiftyYears(),
      },
    }),
    defineField({
      type: 'string',
      name: 'endYear',
      title: 'End year',
      options: {
        list: lastFiftyYears(),
      },
    }),
  ],
})
