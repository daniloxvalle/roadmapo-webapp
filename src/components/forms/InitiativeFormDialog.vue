<template>
   <v-dialog
      v-model="show"
      max-width="850px"
      :persistent="useOnboardingStore().showOnboardingInitiative"
      no-click-animation
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5">Initiative</span>
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
                  <v-row id="row-objectives">
                     <v-col style="min-width: 100px; max-width: 100%;">
                        <v-autocomplete
                           label="Objectives"
                           v-model="initiative.objectives as never"
                           :items="useObjectiveStore().objectives"
                           item-title="name"
                           item-value="id"
                           chips
                           closable-chips
                           multiple
                           return-object
                           variant="underlined"
                           eager
                        >
                           <!-- :menu-props="{ closeOnContentClick: true }" -->
                           <!-- eager - fixes a bug, in a small window size the list appears over the automplete and closes on start-->
                           <template v-slot:chip="{ props, item }">
                              <v-chip v-bind="props">
                                 <v-icon
                                    icon="mdi-circle"
                                    :color="item.value.color"
                                 />
                                 <strong class="ml-1"> {{ item.title }}</strong>
                              </v-chip>
                           </template>
                           <template v-slot:item="{ props, item }">
                              <v-list-item
                                 v-bind="props"
                                 :title="item.title"
                                 density="compact"
                              >
                                 <template v-slot:prepend>
                                    <v-icon
                                       size="small"
                                       icon="mdi-circle"
                                       :color="item.value.color"
                                       class="mr-2"
                                    ></v-icon>
                                 </template>
                                 <template v-slot:append>
                                    <v-btn
                                       size="x-small"
                                       icon=""
                                       variant="tonal"
                                       @click.prevent.stop="onEditObjective(item.value)"
                                       :disabled="!useUserStore().isLoggedIn"
                                    ><v-icon icon="mdi-pencil" />
                                       <v-tooltip
                                          activator="parent"
                                          location="bottom"
                                          open-delay="400"
                                       >Edit Objective</v-tooltip>
                                    </v-btn>
                                 </template>
                              </v-list-item>
                           </template>
                        </v-autocomplete>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ml-2 align-self-center">
                        <v-btn
                           icon=""
                           size="small"
                           @click.prevent.stop="onNewObjective"
                           :disabled="!useUserStore().isLoggedIn"
                        >
                           <v-icon icon="mdi-plus" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Add Objective</v-tooltip>
                        </v-btn>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <v-row id="row-initiative-name">
                     <v-col style="max-width: 100%;">
                        <v-text-field
                           label="Initiative Name*"
                           required
                           v-model="initiative.name"
                        ></v-text-field>
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
                           >Propose Initiative</v-tooltip>
                        </v-btn>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <v-row id="row-initiative-description">
                     <v-col style="max-width: 100%;">
                        <v-textarea
                           label="Story"
                           required
                           v-model="initiative.description"
                           rows="8"
                           auto-grow
                        ></v-textarea>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ">
                        <v-btn
                           icon=""
                           size="small"
                           @click.stop="isConfirmAIDescriptionVisible = true"
                           :disabled="isLoadingAIDescription || isLoadingAIName || !useUserStore().isLoggedIn"
                           :loading="isLoadingAIDescription"
                        >
                           <v-icon icon="mdi-robot" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Generate Story</v-tooltip>
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
               v-if="initiative.id != 0"
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

   <ObjectiveFormDialog
      :visible="isObjectiveFormDialogVisible"
      :objective="objectiveToEdit"
      @load-objectives="() => emit('loadObjectives')"
      @close="isObjectiveFormDialogVisible = false"
   />

   <ConfirmDeleteDialog
      :visible="isConfirmDeleteDialogVisible"
      :onConfirm="onDelete"
      @close="isConfirmDeleteDialogVisible = false"
   />

   <ConfirmAIDialog
      :visible="isConfirmAINameVisible"
      message="Artificial intelligence will propose an initiative for you, based on the objectives. The current initiative name and objectives will be replaced. Are you sure you want to continue?"
      :onConfirm=onGenerateNameAI
      @close="isConfirmAINameVisible = false"
   />

   <ConfirmAIDialog
      :visible="isConfirmAIDescriptionVisible"
      message="Artificial intelligence will generate a initiative story for you, based on the initiative name. The current initiative story will be replaced. Are you sure you want to continue?"
      :onConfirm=onGenerateDescriptionAI
      @close="isConfirmAIDescriptionVisible = false"
   />
</template>

<script lang="ts" setup>

import { computed, ref } from "vue";
import { find } from "lodash";

import { useProductStore } from '@/store/product_store'
import { useObjectiveStore } from '@/store/objective_store'
import { useOnboardingStore } from '@/store/onboarding_store'

import Initiative from "@/models/initiative";
import InitiativeService from "@/services/initiative_service";
import Objective from "@/models/objective";
import AuthService from "@/services/auth_service";
import ConfirmDeleteDialog from "@/components/confirmation/ConfirmDeleteDialog.vue";
import ConfirmAIDialog from "@/components/confirmation/ConfirmAIDialog.vue";
import ObjectiveFormDialog from "@/components/forms/ObjectiveFormDialog.vue";
import { useSnackbarStore } from '@/store/snackbar_store'
import { shallowCopy, removeJSONTraillingComma } from "@/helpers";
import { OpenAIApiResponse, OpenAIInitiative } from "@/typings/interface";
import { useUserStore } from "@/store/user_store";

const emit = defineEmits(['close', 'loadInitiatives', 'loadObjectives'])
const isConfirmDeleteDialogVisible = ref<boolean>(false)
const isObjectiveFormDialogVisible = ref<boolean>(false)
const objectiveToEdit = ref(new Objective())
const isConfirmAINameVisible = ref<boolean>(false)
const isConfirmAIDescriptionVisible = ref<boolean>(false)
const isLoadingAIName = ref<boolean>(false)
const isLoadingAIDescription = ref<boolean>(false)

const props = defineProps<{
   visible: boolean,
   initiative: Initiative,
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

function onEditObjective(objective: Objective) {
   objectiveToEdit.value = objective
   isObjectiveFormDialogVisible.value = true
}

function onNewObjective() {
   objectiveToEdit.value = new Objective()
   isObjectiveFormDialogVisible.value = true
}

function onSave() {
   const newInitiative: Initiative = new Initiative()
   shallowCopy(props.initiative, newInitiative)
   newInitiative.id_product = useProductStore().workProduct.id
   const authService = new AuthService()
   const initiativeService = new InitiativeService()

   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            if (newInitiative.id == 0) {// add new
               initiativeService.addInitiative(token, newInitiative).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Initiative created')
                     newInitiative.id = response
                     emit('loadInitiatives')
                     emit('close')
                  }
               })
            } else {// update
               initiativeService.updateInitiative(token, newInitiative).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Initiative saved')
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
   const idInitiative = props.initiative.id
   const authService = new AuthService()
   const initiativeService = new InitiativeService()

   authService.runAfterToken((token: string) => {
      initiativeService.deleteInitiative(token, idInitiative).then((response) => {
         if (typeof response === 'string') {
            useSnackbarStore().showSnackbar('error', response)
         }
         else if (typeof response === 'number') {
            useSnackbarStore().showSnackbar('success', 'Initiative deleted')
            emit('loadInitiatives')
            emit('close')
         }
      })
   })
}

function onGenerateNameAI() {
   const authService = new AuthService()
   const initiativeService = new InitiativeService()

   authService.runAfterToken((token: string) => {
      isLoadingAIName.value = true
      initiativeService.generateNameAI(token, useProductStore().workProduct.id).then((response) => {
         if (typeof response === 'object') {
            try {
               const AIResponse: OpenAIApiResponse = <OpenAIApiResponse>response
               const content = removeJSONTraillingComma(AIResponse.choices[0].message.content)
               const openAIInitiative: OpenAIInitiative = <OpenAIInitiative>JSON.parse(content)
               props.initiative.name = openAIInitiative.initiative_name
               const objective = find(useObjectiveStore().objectives, { name: openAIInitiative.objective_name })
               props.initiative.objectives = []
               if (objective) {
                  const newObjective = new Objective()
                  Object.assign(newObjective, objective)
                  props.initiative.objectives = [newObjective]
               }
            } catch (error) {
               useSnackbarStore().showSnackbar('error', 'Generator error, please retry')
            }
         } else {
            useSnackbarStore().showSnackbar('error', response)
         }
         isLoadingAIName.value = false
      })
   })
}


function onGenerateDescriptionAI() {
   const authService = new AuthService()
   const initiativeService = new InitiativeService()

   if (props.initiative.name == '') {
      useSnackbarStore().showSnackbar('error', 'Initiative name cannot be empty')
      return
   }

   props.initiative.id_product = useProductStore().workProduct.id
   authService.runAfterToken((token: string) => {
      isLoadingAIDescription.value = true
      initiativeService.generateDescriptionAI(token, props.initiative).then((response) => {
         if (typeof response === 'object') {
            const AIResponse: OpenAIApiResponse = <OpenAIApiResponse>response
            props.initiative.description = AIResponse.choices[0].message.content
         } else {
            useSnackbarStore().showSnackbar('error', response)
         }
         isLoadingAIDescription.value = false
      })
   })
}

</script>
