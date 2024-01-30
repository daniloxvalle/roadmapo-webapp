<template>
   <v-dialog
      v-model="show"
      max-width="850px"
      :persistent="useOnboardingStore().showOnboardingSolution"
      no-click-animation
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5">Solution</span>
               <v-spacer />
               <v-btn
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click.stop="show = false"
               />
            </v-row>
         </v-card-title>

         <v-card-text>
            <v-row>
               <v-col cols="12">
                  <v-row id="row-solution-name">
                     <v-col style="max-width: 100%;">
                        <v-textarea
                           label="Solution Name*"
                           required
                           v-model="solution.name"
                           rows="1"
                           :loading=isLoadingAIName
                           auto-grow
                        ></v-textarea>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ">
                        <v-btn
                           icon=""
                           size="small"
                           @click.stop="isConfirmAINameVisible = true"
                           :disabled="isLoadingAIName || isLoadingAIDescription || !useUserStore().isLoggedIn"
                           :loading="isLoadingAIName"
                        >
                           <v-icon icon="mdi-robot" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Propose Solution</v-tooltip>
                        </v-btn>
                     </v-col>
                  </v-row>
               </v-col>
               <v-col cols="12">
                  <v-row id="row-solution-description">
                     <v-col style="max-width: 100%;">
                        <v-textarea
                           label="User story"
                           required
                           v-model="solution.description"
                           rows="12"
                           :loading=isLoadingAIDescription
                           auto-grow
                        ></v-textarea>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ">
                        <v-btn
                           icon=""
                           size="small"
                           @click.stop="isConfirmAIDescriptionVisible = true"
                           :disabled="isLoadingAIName || isLoadingAIDescription"
                           :loading="isLoadingAIDescription"
                        >
                           <v-icon icon="mdi-robot" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Generate User Story</v-tooltip>
                        </v-btn>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions class="mr-4 mb-2">
            <v-spacer />
            <VBtnAccent
               class="text-none"
               prepend-icon="mdi-check"
               @click.stop="onSave"
            >Save</VBtnAccent>
            <v-btn
               v-if="solution.id != 0"
               border
               flat
               class="text-none"
               prepend-icon="mdi-delete"
               @click.stop="isConfirmDeleteDialogVisible = true"
               :disabled="!useUserStore().isLoggedIn"
            >Delete</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>

   <ConfirmDeleteDialog
      :visible="isConfirmDeleteDialogVisible"
      :onConfirm="onDelete"
      @close="isConfirmDeleteDialogVisible = false"
   />

   <ConfirmAIDialog
      :visible="isConfirmAINameVisible"
      message="Artificial intelligence will propose a solution for you, based on the initiative. The current solution name will be replaced. Are you sure you want to continue?"
      :onConfirm=onGenerateNameAI
      @close="isConfirmAINameVisible = false"
   />

   <ConfirmAIDialog
      :visible="isConfirmAIDescriptionVisible"
      message="Artificial intelligence will generate a user story for you, based on the solution name. The current description will be replaced. Are you sure you want to continue?"
      :onConfirm=onGenerateDescriptionAI
      @close="isConfirmAIDescriptionVisible = false"
   />
</template>

<script lang="ts" setup>

import { computed, ref } from "vue";

import Solution from "@/models/solution";
import SolutionService from "@/services/solution_service";
import AuthService from "@/services/auth_service";
import ConfirmDeleteDialog from "@/components/confirmation/ConfirmDeleteDialog.vue";
import ConfirmAIDialog from "@/components/confirmation/ConfirmAIDialog.vue";
import { shallowCopy } from "@/helpers";
import { useProductStore } from "@/store/product_store";
import { useSnackbarStore } from '@/store/snackbar_store'
import { OpenAIApiResponse } from "@/typings/interface";
import { useUserStore } from "@/store/user_store";
import { useOnboardingStore } from '@/store/onboarding_store'

const emit = defineEmits(['close', 'loadSolutions'])
const isConfirmDeleteDialogVisible = ref<boolean>(false)
const isConfirmAINameVisible = ref<boolean>(false)
const isConfirmAIDescriptionVisible = ref<boolean>(false)
const isLoadingAIName = ref<boolean>(false)
const isLoadingAIDescription = ref<boolean>(false)

const props = defineProps<{
   visible: boolean,
   solution: Solution,
}>()

const show = computed({
   get() {
      return props.visible
   },
   set(value) {
      if (!value) {
         emit('close')
      }
   }
})

function onSave() {
   const newSolution: Solution = new Solution()
   shallowCopy(props.solution, newSolution)
   newSolution.id_product = useProductStore().workProduct.id

   const authService = new AuthService()
   const solutionService = new SolutionService()
   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            if (newSolution.id == 0) {// add new
               solutionService.addSolution(token, newSolution).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Solution created')
                     emit('loadSolutions')
                     emit('close')
                  }
               })
            } else {// update
               solutionService.updateSolution(token, newSolution).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Solution saved')
                     emit('close')
                  }
               })
            }
         } else {
            // useSnackbarStore().showSnackbar('info', 'Please log in to save.')
            emit('close')
         }
      })
}

function onDelete() {
   const idSolution = props.solution.id
   const authService = new AuthService()
   const solutionService = new SolutionService()

   authService.runAfterToken((token: string) => {
      solutionService.deleteSolution(token, idSolution).then((response) => {
         if (typeof response === 'string') {
            useSnackbarStore().showSnackbar('error', response)
         }
         else if (typeof response === 'number') {
            useSnackbarStore().showSnackbar('success', 'Solution deleted')
            emit('loadSolutions')
            emit('close')
         }
      })
   })
}

function onGenerateNameAI() {
   const authService = new AuthService()
   const solutionService = new SolutionService()

   authService.runAfterToken((token: string) => {
      isLoadingAIName.value = true
      solutionService.generateNameAI(token, props.solution.id_initiative).then((response) => {
         if (typeof response === 'object') {
            const AIResponse: OpenAIApiResponse = <OpenAIApiResponse>response
            props.solution.name = AIResponse.choices[0].message.content
         } else {
            useSnackbarStore().showSnackbar('error', response)
         }
         isLoadingAIName.value = false
      })
   })
}

function onGenerateDescriptionAI() {
   const authService = new AuthService()
   const solutionService = new SolutionService()

   if (props.solution.name == '') {
      useSnackbarStore().showSnackbar('error', 'Solution name cannot be empty')
      return
   }

   authService.runAfterToken((token: string) => {
      isLoadingAIDescription.value = true
      solutionService.generateDescriptionAI(token, props.solution.name).then((response) => {
         if (typeof response === 'object') {
            const AIResponse: OpenAIApiResponse = <OpenAIApiResponse>response
            props.solution.description = AIResponse.choices[0].message.content
         } else {
            useSnackbarStore().showSnackbar('error', response)
         }
         isLoadingAIDescription.value = false
      })
   })
}

</script>
