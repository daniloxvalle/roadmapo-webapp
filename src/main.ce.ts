import { defineCustomElementWrapped } from '@/helpers/defineCustomElementWithStyles.js'
import RoadmapKanbanComponent from '@/components/web-components/RoadmapKanban.ce.vue'
import vuetify from '@/plugins/vuetify'

const RoadmapKanban = defineCustomElementWrapped(RoadmapKanbanComponent, {
   plugins: [vuetify],
})

customElements.define('roadmap-kanban', RoadmapKanban)
