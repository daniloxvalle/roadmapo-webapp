/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from '@/plugins/webfontloader'
import vuetify from '@/plugins/vuetify'
import posthog from '@/plugins/posthog'

import pinia from '@/store'
import router from '@/router'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
   loadFonts()
   app
      .use(vuetify)
      .use(posthog)
      .use(router)
      .use(pinia)
}
