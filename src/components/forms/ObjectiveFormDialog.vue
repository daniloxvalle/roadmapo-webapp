<template>
   <v-dialog
      v-model="show"
      max-width="560px"
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5">Objective</span>
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
                  <v-text-field
                     label="Objective Name*"
                     required
                     v-model="objective.name"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  Color
                  <v-icon
                     size="small"
                     icon="mdi-circle"
                     :color="objective.color"
                  ></v-icon>
                  <v-color-picker
                     border
                     v-model="objective.color"
                     elevation="0"
                     hide-canvas
                     hide-inputs
                     show-swatches
                     hide-sliders
                     :swatches="swatches"
                     style="border-width: 2px; padding: 0px; margin:0px; color-picker-swatch-color-height:30px"
                  />
               </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions class="mr-4 mb-2 mt-4">
            <v-spacer />
            <VBtnAccent
               class="text-none"
               prepend-icon="mdi-check"
               @click.stop="onSave"
            >Save</VBtnAccent>
            <v-btn
               v-if="objective.id != 0"
               border
               flat
               class="text-none"
               prepend-icon="mdi-delete"
               @click.stop="isConfirmDeleteDialogVisible = true"
            >Delete</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>

   <ConfirmDeleteDialog
      :visible="isConfirmDeleteDialogVisible"
      :onConfirm="onDelete"
      @close="isConfirmDeleteDialogVisible = false"
   />
</template>

<script lang="ts" setup>

import { computed, ref } from "vue";

import Objective from "@/models/objective";
import ObjectiveService from "@/services/objective_service";
import AuthService from "@/services/auth_service";
import ConfirmDeleteDialog from "@/components/confirmation/ConfirmDeleteDialog.vue";
import { useProductStore } from "@/store/product_store";
import { useSnackbarStore } from '@/store/snackbar_store'
import { shallowCopy } from "@/helpers";

const emit = defineEmits(['close', 'loadObjectives'])
const isConfirmDeleteDialogVisible = ref<boolean>(false)

const props = defineProps<{
   visible: boolean,
   objective: Objective,
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
   const newObjective: Objective = new Objective()
   shallowCopy(props.objective, newObjective)
   newObjective.id_product = useProductStore().workProduct.id

   const authService = new AuthService()
   const objectiveService = new ObjectiveService()
   // add new
   if (newObjective.id == 0) {
      authService.runAfterToken((token: string) => {
         objectiveService.addObjective(token, newObjective).then((response) => {
            if (typeof response === 'string') {
               useSnackbarStore().showSnackbar('error', response)
            }
            else if (typeof response === 'number') {
               useSnackbarStore().showSnackbar('success', 'Objective created')
               emit('loadObjectives')
               emit('close')
            }
         })
      })
   } else {
      // update
      authService.runAfterToken((token: string) => {
         objectiveService.updateObjective(token, newObjective).then((response) => {
            if (typeof response === 'string') {
               useSnackbarStore().showSnackbar('error', response)
            }
            else if (typeof response === 'number') {
               useSnackbarStore().showSnackbar('success', 'Objective saved')
               emit('loadObjectives')
               emit('close')
            }
         })
      })
   }
}

function onDelete() {
   const idObjective = props.objective.id
   const authService = new AuthService()
   const objectiveService = new ObjectiveService()

   authService.runAfterToken((token: string) => {
      objectiveService.deleteObjective(token, idObjective).then((response) => {
         if (typeof response === 'string') {
            useSnackbarStore().showSnackbar('error', response)
         }
         else if (typeof response === 'number') {
            useSnackbarStore().showSnackbar('success', 'Objective deleted')
            emit('loadObjectives')
            emit('close')
         }
      })
   })
}

const swatches = [
   ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],
   ['#3F51B5', '#2196F3', '#03A9F4', '#00BCD4'],
   ['#009688', '#4CAF50', '#8BC34A', '#CDDC39'],
   ['#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
   ['#795548', '#607D8B', '#9E9E9E', '#000000']
]

</script>
