<template  >
   <!-- Style to show x and y scrollbar -->
   <div
      class="roadmapo-root"
      style="overflow-x: auto; overflow-y: auto; background: rgb(var(--v-theme-background));"
   >
      <v-alert
         v-if="isAlertVisible"
         type="error"
         title="Something's wrong here."
         :text="alertMessage"
         style="color: white; background-color: rgb(var(--v-theme-error)) !important;"
      ></v-alert>

      <v-row
         class="ma-2 ml-4"
         v-if="publication && publication.is_name_visible"
      >
         <div
            class="text-h4"
            style="color: rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity)) !important;"
         >{{ publication.name }}</div>
      </v-row>

      <v-row
         v-if="publication && publication.is_disclaimer_visible"
         class="ma-2 ml-4"
         style="text-align: start;"
      >
         <v-col class="pa-0">
            <div
               class="text-caption"
               style="color: rgba(var(--v-theme-on-background),var(--v-medium-emphasis-opacity)) !important;"
            >Disclaimer</div>
            <div
               class="text-subtitle-1"
               style="color: rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity)) !important;"
            >{{ publication.disclaimer }}</div>
         </v-col>
      </v-row>
      <v-row
         v-if="product && publication && publication.is_vision_visible"
         class="ma-2 ml-4 mb-0"
         style="text-align: start;"
      >
         <v-col class="pa-0">
            <div
               class="text-caption"
               style="color: rgba(var(--v-theme-on-background),var(--v-medium-emphasis-opacity)) !important;"
            >Vision</div>
            <div
               class="text-subtitle-1"
               style="color: rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity)) !important;"
            >{{ product.vision }}</div>
         </v-col>
      </v-row>

      <v-progress-circular
         v-if="loading"
         :width="3"
         :size="50"
         color="primary"
         indeterminate
         class="ma-6"
      ></v-progress-circular>

      <v-container fluid>
         <!-- :style="{ 'min-width': boardMinWidth.toString() + 'px' }" -->
         <v-row>
            <template
               v-for="timeframe in timeframeList"
               :key="timeframe.id"
            >
               <v-col class="pa-2">
                  <v-sheet
                     rounded
                     class="pa-1"
                     :style="{ 'min-width': columnMinWidth.toString() + 'px' }"
                  >
                     <h3 class="text-center font-weight-medium mt-2 mb-2">
                        {{ timeframe.name }}
                     </h3>

                     <span v-for="initiative in  filterInitiativesByColumn(timeframe.id)">

                        <v-hover v-slot="{ isHovering: isHoveringInitiative, props: hoveringInitiative }">

                           <v-sheet
                              v-bind="hoveringInitiative"
                              border
                              rounded
                              :elevation="isHoveringInitiative ? 3 : 1"
                              class="draggable mb-2 pa-4"
                              :initiative-id="initiative.id"
                              :initiative-rank="initiative.rank"
                              :style="{ 'background-color': useTheme().current.value.colors.background }"
                           >

                              <v-container
                                 v-if="initiative.objectives && publication && publication.is_objective_visible"
                                 class="mb-4"
                              >
                                 <v-row>
                                    <v-sheet
                                       v-for="objective in initiative.objectives"
                                       :key="objective.id"
                                       color="transparent"
                                       class="mr-3 mb-2"
                                    >
                                       <p
                                          class="text-subtitle-2"
                                          style=" padding-left: 1px; padding-right: 1px;"
                                       >{{ objective.name }}</p>
                                       <v-sheet
                                          rounded
                                          :color="objective.color"
                                          style=" min-height: 3px; margin-top: -1px;"
                                       ></v-sheet>
                                    </v-sheet>
                                 </v-row>
                              </v-container>

                              <h4 class="font-weight-medium mb-3 mt-3 text-center">
                                 {{ initiative.name }}
                              </h4>
                              <span class="text-body-2">
                                 {{ initiative.description }}
                              </span>

                              <span
                                 v-if="find(solutionList, { 'id_initiative': initiative.id }) && publication && publication.is_solution_visible"
                              >
                                 <h5 class="font-weight-medium ma-1 mt-6 text-left">Solutions</h5>
                                 <v-sheet
                                    border
                                    class="mb-1"
                                 >
                                    <span v-for=" solution  in  solutionList ">
                                       <v-sheet
                                          v-if="solution.id_initiative == initiative.id"
                                          border
                                          elevation="1"
                                          class="draggable text-center ma-0 rounded-0"
                                          :solution-id="solution.id"
                                          :solution-rank="solution.rank"
                                          :style="{ 'background-color': useTheme().current.value.colors.surface }"
                                       >
                                          <h5 class="font-weight-medium text-left ml-1 pa-2 ">
                                             {{ solution.name }}
                                          </h5>
                                       </v-sheet>
                                    </span>
                                 </v-sheet>
                              </span>

                           </v-sheet>
                        </v-hover>
                     </span>

                  </v-sheet>
               </v-col>
            </template>
         </v-row>
      </v-container>
   </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { useDisplay, useTheme } from 'vuetify'
import { find } from "lodash"
import { useRoute } from 'vue-router';

import Publication from "@/models/publication"
import PublicationService from "@/services/publication_service"
import Product from "@/models/product"
import ProductService from "@/services/product_service"
import Timeframe from "@/models/timeframe"
import TimeframeService from "@/services/timeframe_service"
import Initiative from "@/models/initiative"
import InitiativeService from "@/services/initiative_service"
import Solution from "@/models/solution"
import SolutionService from "@/services/solution_service"

const publication = ref()
const product = ref()
const timeframeList = ref()
const initiativeList = ref()
const solutionList = ref()
const isAlertVisible = ref(false)
const alertMessage = ref()

const columnMinWidth = 380
const boardMinWidth = ref(columnMinWidth)
const { name } = useDisplay()

const loading = ref(false)
const nanoid = ref()
const theme = useTheme()

/**
 * Publication nanoid is received by props, when used as a web component, embed in a page.
 * Or by query string, when accessed directly in roadmapo page
 */
const props = defineProps<{
   n?: string,
}>()
const roadmapKanbanPath = '/ce/roadmap-kanban'

const roadmapNotExistMessage = 'The roadmap you are looking for is no longer here, or never existed in the first place. ' +
   'You can try contacting the person who shared this link with you or send a message to us at support@roadmapo.com'

/**
 * Watch the display size change
 */
watch(name, (newValue) => setBoardMinWidth(newValue));

/**
 * Load the list of initiatives at startup
 */
onMounted(() => {
   loadNanoId()
   loadPublication()
   loadProduct()
   loadTimeframes()
   loadInitiatives()
   loadSolutions()
})

function showError(message: string) {
   isAlertVisible.value = true
   alertMessage.value = message
}

function loadNanoId() {
   if (props.n)
      nanoid.value = props.n
   else if (useRoute()) {
      const path = useRoute().path
      const urlNanoid = useRoute().query.n?.toString()
      if (path == roadmapKanbanPath && urlNanoid)
         nanoid.value = urlNanoid
   }
   else
      showError(roadmapNotExistMessage)
}

/**
 * Filter the initiatives list based on the column
 */
function filterInitiativesByColumn(idColumn: number) {
   if (initiativeList.value) {
      return initiativeList.value.filter((initiative: Initiative) => {
         return initiative.id_timeframe == idColumn
      });
   }
}

/**
 * Load page theme from the publication
 */
function loadTheme() {
   if (['light', 'dark'].indexOf(publication.value.theme) > -1)
      theme.global.name.value = publication.value.theme
   else
      theme.global.name.value = 'dark'
}

/**
 * Load publication from the API
 */
async function loadPublication() {
   const publicationService = new PublicationService()
   loading.value = true
   if (nanoid)
      publicationService.getPublicationPublication(nanoid.value).then((response: Publication[] | string) => {
         if (typeof response === 'object') {
            if (response.length > 0) {
               publication.value = response[0]
               loadTheme()
            }
            else
               showError(roadmapNotExistMessage)
         } else {
            showError(response)
         }
         loading.value = false
      })
}

/**
 * Load product from the API
 */
async function loadProduct() {
   const productService = new ProductService()
   loading.value = true
   if (nanoid)
      productService.getProductPublication(nanoid.value).then((response: Product[] | string) => {
         if (typeof response === 'object') {
            if (response.length > 0)
               product.value = response[0]
            else
               showError(roadmapNotExistMessage)
         } else {
            showError(response)
         }
         loading.value = false
      })
}

/**
 * Load timeframes from the API
 */
async function loadTimeframes() {
   const timeframeService = new TimeframeService()
   loading.value = true
   if (nanoid)
      timeframeService.getTimeframePublication(nanoid.value).then((response: Timeframe[] | string) => {
         if (typeof response === 'object') {
            timeframeList.value = response
            setBoardMinWidth(name.value)
         } else {
            showError(response)
         }
         loading.value = false
      })
}

/**
 * Load initiatives from the API
 */
async function loadInitiatives() {
   const initiativeService = new InitiativeService()
   loading.value = true
   if (nanoid)
      initiativeService.getInitiativesPublication(nanoid.value).then((response: Initiative[] | string) => {
         if (typeof response === 'object') {
            initiativeList.value = response
         } else {
            showError(response)
         }
         loading.value = false
      })
}

/**
 * Load solutions from the API
 */
async function loadSolutions() {
   const solutionService = new SolutionService()
   loading.value = true
   if (nanoid)
      solutionService.getSolutionsPublication(nanoid.value).then((response: Solution[] | string) => {
         if (typeof response === 'object') {
            solutionList.value = response
         } else {
            showError(response)
         }
         loading.value = false
      })
}

/**
 * Sets the board min width, used to keep all column in a sigle row.
 * And in small displays use a single column.
 */
function setBoardMinWidth(newBreakpoint: string) {
   if (!(newBreakpoint == 'xs' || newBreakpoint == 'sm')) {
      let visibleTimeframeList: Timeframe[] = timeframeList.value
      visibleTimeframeList = timeframeList.value.filter((timeframe: Timeframe) => {
         return timeframe.is_archived == false
      });
      boardMinWidth.value = (visibleTimeframeList.length + 1) * columnMinWidth
   }
   else
      boardMinWidth.value = columnMinWidth
}
</script>

<style>
@import 'vuetify/dist/vuetify.min.css';
</style>
