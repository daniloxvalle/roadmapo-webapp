/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from '@/App.vue'

// Composables
import { createApp } from 'vue'

//Firebase
import { initializeApp } from "firebase/app"

// Plugins
import { registerPlugins } from '@/plugins'

import * as config from '@/config'

// Initialize Firebase
initializeApp(config.firebaseConfig)

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
