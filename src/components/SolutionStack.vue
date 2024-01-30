<template >
   <h5 class="font-weight-medium ma-1 mt-8 text-left">Solutions</h5>
   <v-hover
      v-slot="{ isHovering, props: hoveringProps }"
      open-delay="100"
      close-delay="100"
   >
      <v-sheet
         border
         class="mb-1"
         v-bind="hoveringProps"
      >
         <Sortable
            :list="solutionList"
            item-key="id"
            tag="div"
            :options="solutionSortableOptions"
            :initiative-id="props.initiative.id"
            @end="onEnd"
            style="width: 100%;"
         >
            <template #item="{ element, index }">
               <v-sheet
                  v-if="element.id_initiative == props.initiative.id"
                  border
                  elevation="1"
                  class="draggable text-center ma-0 rounded-0"
                  :key="index"
                  :solution-id="element.id"
                  :solution-rank="element.rank"
                  @click.prevent.stop="onEditSolution(element)"
                  :style="{ 'background-color': useTheme().current.value.colors.surface }"
                  style="cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
               >
                  <h5 class="font-weight-medium text-left ml-1 pa-2">
                     {{ truncateText(element.name, 110) }}
                  </h5>
               </v-sheet>
            </template>
         </Sortable>
         <v-sheet
            justify="center"
            class="pr-1 pl-1"
         >
            <v-btn
               size="small"
               border
               block
               variant="text"
               @click.prevent.stop="onNewSolution()"
               class="text-none mt-1 mb-1"
               style=" border-style: dashed;"
            >
               <v-icon icon="mdi-plus" />
               <v-tooltip
                  activator="parent"
                  location="bottom"
                  open-delay="400"
               >Add solution</v-tooltip>
            </v-btn>
         </v-sheet>
      </v-sheet>
   </v-hover>

   <SolutionFormDialog
      :visible="isSolutionFormVisible"
      :solution="solutionToEdit"
      @close="onCloseSolutionFormDialog"
      @load-solutions="emit('loadSolutions')"
   />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { Sortable } from "sortablejs-vue3"
import { useTheme } from 'vuetify'
import { LexoRank } from "lexorank"

import AuthService from "@/services/auth_service"
import Initiative from "@/models/initiative"
import Solution from "@/models/solution"
import SolutionService from "@/services/solution_service"
import { useSnackbarStore } from '@/store/snackbar_store'
import SolutionFormDialog from "@/components/forms/SolutionFormDialog.vue"
import { runTimeout, truncateText } from "@/helpers"
import { useOnboardingStore } from "@/store/onboarding_store"

const isSolutionFormVisible = ref<boolean>(false)
const solutionToEdit = ref(new Solution())
const emit = defineEmits(['reorderSolutionList', 'loadSolutions', 'onboardingGoToStep', 'onCloseSolutionFormDialog'])

const props = defineProps<{
   solutionList: any[],
   initiative: Initiative,
}>();

const solutionSortableOptions = {
   // forceFallback - fixes item falling from top of screen when selected
   forceFallback: true,
   animation: 500,
   group: 'solutionShared',
   emptyInsertThreshold: 20,
   delay: 30,
}

/**
 * onEnd is called by the sortable after an element move.
 * This function gets the source and target columns, and the elements involved in the movement
 * A new lexorank may be generated for the moved solution, if necessary, based on a close element and the list of all solutions.
 * For example, if the solution is being moved to an empty column, a new rank is not necessary, we just need to change the column index
 */
function onEnd(evt: any) {
   const source: HTMLElement = evt.from
   const target: HTMLElement = evt.to
   const targetInitiativeId = Number(target.getAttribute('initiative-id'))
   const sourceInitiativeId = Number(source.getAttribute('initiative-id'))

   const movedElement: HTMLElement = evt.item
   const aboveElement = target.children[evt.newIndex - 1]
   const belowElement = target.children[evt.newIndex + 1]

   const movedSolution: Solution = props.solutionList.find((solution: Solution) => {
      return solution.id === Number(movedElement.getAttribute('solution-id'))
   });
   let newLexorank: LexoRank = LexoRank.parse(movedSolution.rank)

   // If has a below element in the column
   if (belowElement) {
      const belowSolution: Solution = props.solutionList.find((solution: Solution) => {
         return solution.id === Number(belowElement.getAttribute('solution-id'));
      });
      newLexorank = generateLexorank(movedSolution, belowSolution, undefined)

   } else if (aboveElement) {
      //Only has above element in the column
      const aboveSolution: Solution = props.solutionList.find((solution: Solution) => {
         return solution.id === Number(aboveElement.getAttribute('solution-id'));
      });
      newLexorank = generateLexorank(movedSolution, undefined, aboveSolution)
   }

   // Update and reorder solutionList
   reorderSolutionList(movedSolution, newLexorank, targetInitiativeId)
   // Removes new element created by sortable, avoid duplication
   if (sourceInitiativeId != targetInitiativeId)
      target.removeChild(evt.item);
}

/**
 * Solutions sorting is made using lexorank indices.
 * The sorting happens in the list of solutions, considering all solutions of a project.
 * The roadmap columns are only filters for this list.
 * The function below take as reference one close solution in the board.
 * After getting a close solution on the board, it gets the next solution considering the list of all solutions.
 * A new rank is created, considering a between solutions position, top or bottom of the list
 */
function generateLexorank(movedSolution: Solution, belowSolution?: Solution, aboveSolution?: Solution) {
   let newLexorank: LexoRank = LexoRank.parse(movedSolution.rank)

   if (belowSolution) {
      const belowSolutionIndex: number = props.solutionList.indexOf(belowSolution)
      const belowLexorank: LexoRank = LexoRank.parse(belowSolution.rank)

      // Moving to general first solution position
      if (belowSolutionIndex == 0) {
         newLexorank = belowLexorank.genPrev()
      } else {
         // Moving between solutions
         const aboveSolution: Solution = props.solutionList[belowSolutionIndex - 1]
         const aboveLexorank: LexoRank = LexoRank.parse(aboveSolution.rank)
         if ((aboveSolution != movedSolution))
            newLexorank = belowLexorank.between(aboveLexorank)
      }
   } else if (aboveSolution) {
      const aboveSolutionIndex: number = props.solutionList.indexOf(aboveSolution)
      const aboveLexorank: LexoRank = LexoRank.parse(aboveSolution.rank)

      // Moving to general last solution position
      if (aboveSolutionIndex == props.solutionList.length - 1) {
         newLexorank = aboveLexorank.genNext()
      } else {
         // Moving between solutions
         const belowSolution: Solution = props.solutionList[aboveSolutionIndex + 1]
         const belowLexorank: LexoRank = LexoRank.parse(belowSolution.rank)
         if ((belowSolution != movedSolution))
            newLexorank = belowLexorank.between(aboveLexorank)
      }
   }
   return newLexorank
}

/**
 * Reorder the solution list based on the rank
 */
function reorderSolutionList(movedSolution: Solution, newLexorank: LexoRank, targetInitiativeId: number) {
   movedSolution.rank = newLexorank.toString()
   movedSolution.id_initiative = targetInitiativeId
   emit('reorderSolutionList')
   saveSolution(movedSolution)
}

/**
 * Saves the solutions using the API
 */
function saveSolution(solution: Solution) {
   const authService = new AuthService()
   const solutionService = new SolutionService()

   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            solutionService.updateSolution(token, solution).then((response) => {
               if (typeof response === 'string') {
                  useSnackbarStore().showSnackbar('error', response)
               }
            })
         }
      }
   )
}

/**
 * Edit a solution
 */
function onEditSolution(solution: Solution) {
   solutionToEdit.value = solution
   isSolutionFormVisible.value = true

   useOnboardingStore().showOnboardingSolution &&
      runTimeout(() => emit('onboardingGoToStep'))
}

/**
 * Add a new solution
 * The lexorank is defined based on the last solution of the list
 */
function onNewSolution() {
   let newLexoRank = LexoRank.middle()

   if (props.solutionList.length > 0) {
      const lastSolution: Solution = props.solutionList[props.solutionList.length - 1]
      const lastLexorank: LexoRank = LexoRank.parse(lastSolution.rank)
      newLexoRank = lastLexorank.genNext()
   }

   solutionToEdit.value = new Solution()
   solutionToEdit.value.rank = newLexoRank.toString()
   solutionToEdit.value.id_initiative = props.initiative.id

   isSolutionFormVisible.value = true
}

function onCloseSolutionFormDialog() {
   isSolutionFormVisible.value = false
   emit('onCloseSolutionFormDialog')
}

</script>
