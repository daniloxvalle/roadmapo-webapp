<template >
   <VOnboardingWrapper
      ref="onboardingWrapperRoadmap"
      :steps="onboardingRoadmapSteps"
      :options="onboardingOptions"
   />
   <AlertSampleVersion />
   <v-container fluid>
      <v-row class="pa-3">
         <h3 class="align-self-center">Roadmap</h3>
      </v-row>
      <v-row
         v-if="useProductStore().workProduct.id == 0"
         class="pa-3"
      >
         <v-btn
            class="text-none"
            to="/product"
            prepend-icon="mdi-open-in-app"
         >
            Select a product
         </v-btn>
      </v-row>
   </v-container>
   <v-row
      class="ma-3"
      v-if="useProductStore().workProduct.id != 0"
   >
      <v-text-field
         label="Vision"
         v-model="useProductStore().workProduct.vision"
         variant="plain"
         class="ml-3 mb-n6"
         :readonly="true"
      />
      <v-btn
         icon=""
         variant="tonal"
         class="float-right"
         @click="toggleArchivedVisible"
      >
         <v-icon :icon="isArchivedVisible ? 'custom:archive-eye-off-icon' : 'mdi-archive-eye'" />

         <v-tooltip
            activator="parent"
            location="bottom"
            open-delay="400"
         >{{ isArchivedVisible ? 'Hide archived' : 'Show archived' }}</v-tooltip>
      </v-btn>
   </v-row>

   <v-progress-circular
      v-if="useLoadingStore().isLoading"
      :width="3"
      :size="50"
      color="primary"
      indeterminate
      class="ma-6"
   ></v-progress-circular>

   <v-container
      v-if="useProductStore().workProduct.id != 0"
      fluid
      :style="{ 'min-width': boardMinWidth.toString() + 'px' }"
   >
      <v-row>
         <template
            v-for="timeframe in timeframeList"
            :key="timeframe.id"
         >
            <v-col
               v-if="!(!isArchivedVisible && timeframe.is_archived)"
               class="pa-2"
            >
               <v-hover
                  v-slot="{ isHovering: isHoveringTimeframe, props: hoveringTimeframeProps }"
                  open-delay="100"
                  close-delay="100"
               >
                  <v-sheet
                     v-bind="hoveringTimeframeProps"
                     rounded
                     class="pa-1"
                     :style="{ 'min-width': columnMinWidth.toString() + 'px' }"
                     style="cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
                     @click="onEditTimeframe(timeframe)"
                  >
                     <span id="timeframe-header">
                        <h3 class="text-center font-weight-medium mt-2">
                           {{ timeframe.name }}
                           <v-icon
                              v-if="timeframe.is_archived"
                              size="x-small"
                              icon="mdi-archive-check"
                              class="ml-1"
                           />
                        </h3>
                        <p
                           v-if="timeframe.summary"
                           class="text-subtitle-2 font-weight-light d-inline-block text-truncate ma-3 mb-1"
                           :style="{ 'max-width': columnMinWidth.toString() + 'px' }"
                        >{{ timeframe.summary }}</p>
                        <div
                           v-if="!timeframe.summary"
                           class="ma-3"
                        ></div>
                     </span>
                     <Sortable
                        :list="filterInitiativesByColumn(timeframe.id)"
                        item-key="id"
                        tag="div"
                        :options="sortableOptions"
                        :roadmap-column-id="timeframe.id"
                        @end="onEnd"
                        class="pb-1"
                        style="width: 100%; min-height: 80px;"
                     >
                        <template #item="{ element: initiative, index }">
                           <v-hover v-slot="{ isHovering: isHoveringInitiative, props: hoveringInitiative }">
                              <v-sheet
                                 id="initiative-card"
                                 v-bind="hoveringInitiative"
                                 border
                                 rounded
                                 :elevation="isHoveringInitiative ? 3 : 1"
                                 class="draggable mb-2 pa-4"
                                 :key="index"
                                 :initiative-id="initiative.id"
                                 :initiative-rank="initiative.rank"
                                 :style="{ 'background-color': useTheme().current.value.colors.background }"
                                 style="cursor: move;"
                                 @click.prevent.stop="onEditInitiative(initiative)"
                              >
                                 <v-container
                                    v-if="initiative.objectives"
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
                                 <!-- @pointerdown.prevent.stop="onEdit(element)" -->
                                 <h4 class="font-weight-medium mb-3 mt-3 text-center">
                                    {{ initiative.name }}
                                 </h4>
                                 <span class="text-body-2">
                                    {{ truncateText(initiative.description, 580) }}
                                 </span>
                                 <span id="solution-stack">
                                    <SolutionStack
                                       v-if="solutionList"
                                       :initiative="<Initiative>initiative"
                                       :solutionList="solutionList"
                                       @reorder-solution-list="reorderSolutionList"
                                       @load-solutions="loadSolutions"
                                       @onboardingGoToStep="onboardingGoToStep(1)"
                                       @onCloseSolutionFormDialog="onCloseSolutionFormDialog"
                                    />
                                 </span>
                              </v-sheet>
                           </v-hover>
                        </template>
                     </Sortable>

                     <v-sheet
                        justify="center"
                        class="pr-1 pl-1"
                     >
                        <v-btn
                           border
                           block
                           variant="text"
                           @click.prevent.stop="onNewInitiative(timeframe.id)"
                           class="text-none mb-1"
                           style=" border-style: dashed;"
                        >
                           <v-icon icon="mdi-plus" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Add initiative</v-tooltip>
                        </v-btn>
                     </v-sheet>

                  </v-sheet>

               </v-hover>
            </v-col>
         </template>
         <v-sheet
            v-if="!useLoadingStore().isLoading"
            rounded
            justify="center"
            class="ma-2 pa-2"
            style=" height: 160px; width: 66px;"
         >
            <v-btn
               border
               block
               variant="text"
               class="text-none"
               style="height: 100%; border-style: dashed;"
               @click="onNewTimeframe"
            >
               <v-icon
                  size="large"
                  icon="mdi-plus"
               />
               <v-tooltip
                  activator="parent"
                  location="bottom"
                  open-delay="400"
               >Add column</v-tooltip>
            </v-btn>
         </v-sheet>
      </v-row>
   </v-container>

   <TimeframeFormDialog
      :visible="isTimeframeFormVisible"
      :timeframe="timeframeToEdit"
      @load-timeframes="loadTimeframes"
      @close="onCloseTimeframeFormDialog"
   />
   <!-- @close="isTimeframeFormVisible = false" -->
   <InitiativeFormDialog
      :visible="isInitiativeFormVisible"
      :initiative="initiativeToEdit"
      @load-initiatives="loadInitiatives"
      @load-objectives="loadObjectives"
      @close="onCloseInitiativeFormDialog"
   />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { Sortable } from "sortablejs-vue3"
import { LexoRank } from "lexorank";
import { useDisplay, useTheme } from 'vuetify'
import { find } from "lodash";
import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
import 'v-onboarding/dist/style.css'
import '@/styles/onboarding.css'

import { runTimeout, truncateText } from "@/helpers"
import { useProductStore } from '@/store/product_store'
import { useObjectiveStore } from '@/store/objective_store'
import { useLoadingStore } from '@/store/loading_store'
import AuthService from "@/services/auth_service"
import Timeframe from "@/models/timeframe"
import TimeframeService from "@/services/timeframe_service"
import TimeframeFormDialog from "@/components/forms/TimeframeFormDialog.vue"
import Initiative from "@/models/initiative"
import InitiativeService from "@/services/initiative_service"
import InitiativeFormDialog from "@/components/forms/InitiativeFormDialog.vue"
import Solution from "@/models/solution"
import SolutionService from "@/services/solution_service"
import SolutionStack from "@/components/SolutionStack.vue"
import Objective from "@/models/objective"
import ObjectiveService from "@/services/objective_service"
import { useSnackbarStore } from '@/store/snackbar_store'
import AlertSampleVersion from "@/components/AlertSampleVersion.vue"
import * as config from '@/config'
import {
   onboardingOptions, onboardingRoadmapStepsTimeframe, onboardingRoadmapStepsInitiative,
   onboardingRoadmapStepsSolution, onboardingRoadmapStepsPublication
} from "@/shared/onboarding"
import { useOnboardingStore } from "@/store/onboarding_store";

const timeframeList = ref()
const initiativeList = ref()
const solutionList = ref()
const objectiveList = ref()

const columnMinWidth = 380
const boardMinWidth = ref(columnMinWidth)
const { name } = useDisplay()

const isTimeframeFormVisible = ref<boolean>(false)
const timeframeToEdit = ref(new Timeframe())
const isInitiativeFormVisible = ref<boolean>(false)
const initiativeToEdit = ref(new Initiative())
const isArchivedVisible = ref<boolean>(true)

const onboardingWrapperRoadmap = ref()
const { start: onboardingStart, goToStep: onboardingGoToStep, finish: onboardingFinish } = useVOnboarding(onboardingWrapperRoadmap)
const onboardingRoadmapSteps = ref()

const sortableOptions = {
   // forceFallback - fixes item falling from top of screen when selected
   forceFallback: true,
   animation: 500,
   group: 'shared',
   emptyInsertThreshold: 10,
   delay: 30,
}

/**
 * Watch the display size change
 */
watch(name, (newValue) => setBoardMinWidth(newValue));

/**
 * Watch the selected product change
 */
watch(() => useProductStore().workProduct, (newValue) => {
   loadRoadmapData()
})

/**
 * Load the list of initiatives at startup
 */
onMounted(() => {
   loadRoadmapData()
})

/**
 * Load all roadmap data
 */
function loadRoadmapData() {
   if (useProductStore().workProduct.id != 0) {
      loadTimeframes()
      loadInitiatives()
      loadSolutions()
      loadObjectives(startLastOnboarding)
   }
}

/**
 * Start from the last onboarding step
 */
function startLastOnboarding() {
   if (useOnboardingStore().showOnboardingTimeframe) {
      onboardingRoadmapSteps.value = onboardingRoadmapStepsTimeframe
   } else if (useOnboardingStore().showOnboardingInitiative) {
      onboardingRoadmapSteps.value = onboardingRoadmapStepsInitiative
   } else if (useOnboardingStore().showOnboardingSolution) {
      onboardingRoadmapSteps.value = onboardingRoadmapStepsSolution
   } else if (useOnboardingStore().showOnboardingPublication) {
      onboardingRoadmapSteps.value = onboardingRoadmapStepsPublication
   } else return
   runTimeout(() => onboardingStart())
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
 * Load timeframes from the API
 */
async function loadTimeframes() {
   const authService = new AuthService()
   const timeframeService = new TimeframeService()

   authService.runAfterToken(
      (token: string) => {
         useLoadingStore().isLoading = true
         if (token != '') {
            const idProduct = useProductStore().workProduct.id
            timeframeService.getTimeframes(token, idProduct).then((response: Timeframe[] | string) => {
               if (typeof response === 'object') {
                  timeframeList.value = response
                  setBoardMinWidth(name.value)
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         } else {
            timeframeService.getTimeframePublication(config.sampleNanoid).then((response: Timeframe[] | string) => {
               if (typeof response === 'object') {
                  timeframeList.value = response
                  setBoardMinWidth(name.value)
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         }
      }
   )
}

/**
 * Load initiatives from the API
 */
async function loadInitiatives() {
   const authService = new AuthService()
   const initiativeService = new InitiativeService()

   authService.runAfterToken(
      (token: string) => {
         useLoadingStore().isLoading = true
         if (token != '') {
            const idProduct = useProductStore().workProduct.id
            initiativeService.getInitiatives(token, idProduct).then((response: Initiative[] | string) => {
               if (typeof response === 'object') {
                  initiativeList.value = response
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         } else {
            initiativeService.getInitiativesPublication(config.sampleNanoid).then((response: Initiative[] | string) => {
               if (typeof response === 'object') {
                  initiativeList.value = response
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         }
      }
   )
}

/**
 * Load solutions from the API
 */
async function loadSolutions() {
   const authService = new AuthService()
   const solutionService = new SolutionService()

   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            useLoadingStore().isLoading = true
            const idProduct = useProductStore().workProduct.id
            solutionService.getSolutions(token, idProduct).then((response: Solution[] | string) => {
               if (typeof response === 'object') {
                  solutionList.value = response
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         } else {
            useLoadingStore().isLoading = true
            solutionService.getSolutionsPublication(config.sampleNanoid).then((response: Solution[] | string) => {
               if (typeof response === 'object') {
                  solutionList.value = response
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         }
      }
   )
}

/**
 * Load objectives from the API
 */
async function loadObjectives(callback?: () => void) {
   const authService = new AuthService()
   const objectiveService = new ObjectiveService()

   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            const idProduct = useProductStore().workProduct.id
            objectiveService.getObjectives(token, idProduct).then((response: Objective[] | string) => {
               if (typeof response === 'object') {
                  objectiveList.value = response
                  useObjectiveStore().objectives = objectiveList.value
                  updateInitiativeToEdit()
                  callback && callback()
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
            })
         } else {
            objectiveService.getObjectivesPublication(config.sampleNanoid).then((response: Objective[] | string) => {
               if (typeof response === 'object') {
                  objectiveList.value = response
                  useObjectiveStore().objectives = objectiveList.value
                  updateInitiativeToEdit()
                  callback && callback()
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
            })
         }
      }
   )
}

/**
 * Update the objectives of the initiative being edited
 */
function updateInitiativeToEdit() {
   if (initiativeToEdit.value.id != 0 && initiativeToEdit.value.objectives) {
      initiativeToEdit.value.objectives.forEach((objective: Objective) => {
         const newObjective = find(objectiveList.value, { id: objective.id })
         if (newObjective) {
            objective.name = newObjective.name
            objective.color = newObjective.color
         } else { // Objective was removed
            initiativeToEdit.value.objectives = initiativeToEdit.value.objectives.filter((filteredObjective: Objective) => {
               return filteredObjective.id != objective.id
            })
         }
      })
   }
}

/**
 * Sets the board min width, used to keep all column in a sigle row.
 * And in small displays use a single column.
 */
function setBoardMinWidth(newBreakpoint: string) {
   if (!(newBreakpoint == 'xs' || newBreakpoint == 'sm')) {
      let visibleTimeframeList: Timeframe[] = timeframeList.value
      if (!isArchivedVisible.value)
         visibleTimeframeList = timeframeList.value.filter((timeframe: Timeframe) => {
            return timeframe.is_archived == false
         });
      if (visibleTimeframeList)
         boardMinWidth.value = (visibleTimeframeList.length + 1) * columnMinWidth
   }
   else
      boardMinWidth.value = columnMinWidth
}

/**
 * Show/Hide archived columns
 */
function toggleArchivedVisible() {
   isArchivedVisible.value = !isArchivedVisible.value
   setBoardMinWidth(name.value)
}

/**
 * Saves the initiatives using the API
 */
function saveInitiative(initiative: Initiative) {
   const authService = new AuthService()
   const initiativeService = new InitiativeService()
   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            initiativeService.updateInitiative(token, initiative).then((response) => {
               if (typeof response === 'string') {
                  useSnackbarStore().showSnackbar('error', response)
               }
            })
         }
      }
   )
}

/**
 * onEnd is called by the sortable after an element move.
 * This function gets the source and target columns, and the elements involved in the movement
 * A new lexorank may be generated for the moved initiative, if necessary, based on a close element and the list of all initiatives.
 * For example, if the initiative is being moved to an empty column, a new rank is not necessary, we just need to change the column index
 */
function onEnd(evt: any) {
   const source: HTMLElement = evt.from
   const target: HTMLElement = evt.to
   const targetTimeframeId = Number(target.getAttribute('roadmap-column-id'))
   const sourceTimeframeId = Number(source.getAttribute('roadmap-column-id'))

   const movedElement: HTMLElement = evt.item
   const aboveElement = target.children[evt.newIndex - 1]
   const belowElement = target.children[evt.newIndex + 1]

   const movedInitiative: Initiative = initiativeList.value.find((initiative: Initiative) => {
      return initiative.id === Number(movedElement.getAttribute('initiative-id'))
   });
   let newLexorank: LexoRank = LexoRank.parse(movedInitiative.rank)

   // If has a below element in the column
   if (belowElement) {
      const belowInitiative: Initiative = initiativeList.value.find((initiative: Initiative) => {
         return initiative.id === Number(belowElement.getAttribute('initiative-id'));
      });
      newLexorank = generateLexorank(movedInitiative, belowInitiative, undefined)

   } else if (aboveElement) {
      //Only has above element in the column
      const aboveInitiative: Initiative = initiativeList.value.find((initiative: Initiative) => {
         return initiative.id === Number(aboveElement.getAttribute('initiative-id'));
      });
      newLexorank = generateLexorank(movedInitiative, undefined, aboveInitiative)
   }

   // Update and reorder initiativeList
   reorderInitiativeList(movedInitiative, newLexorank, targetTimeframeId)
   // Removes new element created by sortable, avoid duplication
   if (sourceTimeframeId != targetTimeframeId)
      target.removeChild(evt.item);
}

/**
 * Initiatives sorting is made using lexorank indices.
 * The sorting happens in the list of initiatives, considering all initiatives of a project.
 * The roadmap columns are only filters for this list.
 * The function below take as reference one close initiative in the board.
 * After getting a close initiative on the board, it gets the next initiative considering the list of all initiatives.
 * A new rank is created, considering a between initiatives position, top or bottom of the list
 */
function generateLexorank(movedInitiative: Initiative, belowInitiative?: Initiative, aboveInitiative?: Initiative) {
   let newLexorank: LexoRank = LexoRank.parse(movedInitiative.rank)

   if (belowInitiative) {
      const belowInitiativeIndex: number = initiativeList.value.indexOf(belowInitiative)
      const belowLexorank: LexoRank = LexoRank.parse(belowInitiative.rank)

      // Moving to general first initiative position
      if (belowInitiativeIndex == 0) {
         newLexorank = belowLexorank.genPrev()
      } else {
         // Moving between initiatives
         const aboveInitiative: Initiative = initiativeList.value[belowInitiativeIndex - 1]
         const aboveLexorank: LexoRank = LexoRank.parse(aboveInitiative.rank)
         if ((aboveInitiative != movedInitiative))
            newLexorank = belowLexorank.between(aboveLexorank)
      }
   } else if (aboveInitiative) {
      const aboveInitiativeIndex: number = initiativeList.value.indexOf(aboveInitiative)
      const aboveLexorank: LexoRank = LexoRank.parse(aboveInitiative.rank)

      // Moving to general last initiative position
      if (aboveInitiativeIndex == initiativeList.value.length - 1) {
         newLexorank = aboveLexorank.genNext()
      } else {
         // Moving between initiatives
         const belowInitiative: Initiative = initiativeList.value[aboveInitiativeIndex + 1]
         const belowLexorank: LexoRank = LexoRank.parse(belowInitiative.rank)
         if ((belowInitiative != movedInitiative))
            newLexorank = belowLexorank.between(aboveLexorank)
      }
   }
   return newLexorank
}

/**
 * Reorder the initiative list based on the rank
 */
function reorderInitiativeList(movedInitiative: Initiative, newLexorank: LexoRank, targetTimeframeId: number) {
   movedInitiative.rank = newLexorank.toString()
   movedInitiative.id_timeframe = targetTimeframeId
   initiativeList.value.sort((a: Initiative, b: Initiative) => (a.rank > b.rank) ? 1 : -1)
   saveInitiative(movedInitiative)
}

/**
 * Reorder the solution list based on the rank
 */
function reorderSolutionList() {
   solutionList.value.sort((a: Solution, b: Solution) => (a.rank > b.rank) ? 1 : -1)
}

/**
 * Add a new initiative
 * The lexorank is defined based on the last initiative of the list
 */
function onNewInitiative(idTimeframe: number) {
   let newLexoRank = LexoRank.middle()

   if (initiativeList.value.length > 0) {
      const lastInitiative: Initiative = initiativeList.value[initiativeList.value.length - 1]
      const lastLexorank: LexoRank = LexoRank.parse(lastInitiative.rank)
      newLexoRank = lastLexorank.genNext()
   }

   initiativeToEdit.value = new Initiative()
   initiativeToEdit.value.rank = newLexoRank.toString()
   initiativeToEdit.value.id_timeframe = idTimeframe

   isInitiativeFormVisible.value = true
}

/**
 * Edit an initiative
 */
function onEditInitiative(initiative: Initiative) {
   initiativeToEdit.value = initiative
   isInitiativeFormVisible.value = true
   useOnboardingStore().showOnboardingInitiative &&
      runTimeout(() => onboardingGoToStep(1))
}

/**
 * Add a new timeframe
 */
function onNewTimeframe() {
   timeframeToEdit.value = new Timeframe()
   isTimeframeFormVisible.value = true
}

/**
* Edit a timeframe
*/
function onEditTimeframe(timeframe: Timeframe) {
   timeframeToEdit.value = timeframe
   isTimeframeFormVisible.value = true
   useOnboardingStore().showOnboardingTimeframe &&
      runTimeout(() => onboardingGoToStep(1))
}

function onCloseTimeframeFormDialog() {
   isTimeframeFormVisible.value = false
   if (useOnboardingStore().showOnboardingTimeframe) {
      useOnboardingStore().showOnboardingTimeframe = false
      onboardingFinish()
      onboardingRoadmapSteps.value = onboardingRoadmapStepsInitiative
      runTimeout(() => onboardingStart())
   }
}

function onCloseInitiativeFormDialog() {
   isInitiativeFormVisible.value = false
   if (useOnboardingStore().showOnboardingInitiative) {
      useOnboardingStore().showOnboardingInitiative = false
      onboardingFinish()
      onboardingRoadmapSteps.value = onboardingRoadmapStepsSolution
      runTimeout(() => onboardingStart())
   }
}

function onCloseSolutionFormDialog() {
   if (useOnboardingStore().showOnboardingSolution) {
      useOnboardingStore().showOnboardingSolution = false
      onboardingFinish()
      onboardingRoadmapSteps.value = onboardingRoadmapStepsPublication
      runTimeout(() => onboardingStart())
   }
}

/* function testLexoRank() {
   // middle() -  Use for first element - "0|hzzzzz"
   // genNext() - Use to add a new item on the list
   // between - Use to insert an item between elements

   // min
   const minLexoRank = LexoRank.min();
   // max
   const maxLexoRank = LexoRank.max();
   // middle
   const middleLexoRank = LexoRank.middle();
   // parse
   const parsedLexoRank = LexoRank.parse('0|0i0000:');
   // any lexoRank
   const lexoRank = LexoRank.middle();
   // generate next lexorank
   const nextLexoRank = lexoRank.genNext();
   // generate previous lexorank
   const prevLexoRank = lexoRank.genPrev();
   // toString
   const lexoRankStr = lexoRank.toString();
   // any lexorank
   const any1LexoRank = LexoRank.min();
   // another lexorank
   const any2LexoRank = any1LexoRank.genNext().genNext();
   // calculate between
   const betweenLexoRank = any1LexoRank.between(any2LexoRank);
} */

</script>
