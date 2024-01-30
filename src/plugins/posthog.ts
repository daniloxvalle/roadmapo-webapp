import posthog from 'posthog-js'
import { App } from 'vue'

import * as config from '@/config'

export default {
    install(app: App) {
        app.config.globalProperties.$posthog = posthog.init(
            config.posthogConfig.apiKey,
            {
                api_host: config.posthogConfig.apiHost,
            }
        )
    }
}
