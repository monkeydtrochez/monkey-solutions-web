import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zj7baet4',
    dataset: 'production'
  },
  // Hosted Studio at https://monkey-solutions.sanity.studio/ — skips the hostname prompt on deploy.
  studioHost: 'monkey-solutions',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
