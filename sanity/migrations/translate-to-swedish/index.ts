import {at, defineMigration, setIfMissing} from 'sanity/migrate'
import {swedishPatches, translationFor, type SourceDoc} from './patches'
import {translations} from './translations'

// Fills the `<field>Sv` siblings from translations.ts. setIfMissing never
// overwrites Swedish text already written in the Studio, so the migration is
// safe to re-run. Dry-run by default:
//   npx sanity migration run translate-to-swedish
//   npx sanity migration run translate-to-swedish --no-dry-run
export default defineMigration({
  title: 'Translate existing content to Swedish',
  documentTypes: ['profile', 'project', 'workExperience', 'education'],
  migrate: {
    document(doc) {
      const t = translationFor(doc._id, translations)
      if (!t) return undefined
      return swedishPatches(doc as unknown as SourceDoc, t).map(({path, value}) =>
        at(path, setIfMissing(value)),
      )
    },
  },
})
