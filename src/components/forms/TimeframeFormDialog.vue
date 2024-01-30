<template>
   <v-dialog
      v-model="show"
      max-width="850px"
      :persistent="useOnboardingStore().showOnboardingTimeframe"
      no-click-animation
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5">Time frame column</span>
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
                     label="Column Name*"
                     required
                     v-model="timeframe.name"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-text-field
                     label="Summary"
                     required
                     v-model="timeframe.summary"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-row class="ma-0">
                     <span id="btn-switch-archive">
                        <v-switch
                           v-bind="props"
                           v-model="timeframe.is_archived"
                           :disabled="false"
                           style="max-width:200px; "
                        >
                           <template v-slot:label>
                              Archive
                              (<v-icon
                                 size="small"
                                 :icon="timeframe.is_archived ? 'mdi-archive-check' : 'mdi-archive'"
                              />)
                           </template>
                        </v-switch>
                     </span>
                     <v-spacer />
                     <span>
                        <v-tooltip
                           text="Archiving guide"
                           activator="parent"
                           location="bottom"
                           open-delay="400"
                        >
                           <template v-slot:activator="{ props: propsTooltip }">
                              <v-icon
                                 v-bind="propsTooltip"
                                 icon="mdi-information"
                                 size="large"
                                 @click="isInformationDialogVisible = true"
                                 class="ma-3"
                                 :color="useTheme().current.value.colors.primary"
                              ></v-icon>
                           </template>
                        </v-tooltip>
                     </span>
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
               v-if="timeframe.id != 0"
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

   <TimeframeInformationDialog
      :visible="isInformationDialogVisible"
      @close="isInformationDialogVisible = false"
   />
</template>

<script lang="ts" setup>

import { computed, ref } from "vue";
import { useTheme } from 'vuetify'


import Timeframe from "@/models/timeframe";
import TimeframeService from "@/services/timeframe_service";
import AuthService from "@/services/auth_service";
import ConfirmDeleteDialog from "@/components/confirmation/ConfirmDeleteDialog.vue";
import TimeframeInformationDialog from "@/components/information/TimeframeInformationDialog.vue";
import { useProductStore } from "@/store/product_store";
import { useSnackbarStore } from '@/store/snackbar_store'
import { shallowCopy } from "@/helpers";
import { useUserStore } from "@/store/user_store";
import { useOnboardingStore } from "@/store/onboarding_store";

const emit = defineEmits(['close', 'loadTimeframes'])
const isConfirmDeleteDialogVisible = ref<boolean>(false)
const isInformationDialogVisible = ref<boolean>(false)

const props = defineProps<{
   visible: boolean,
   timeframe: Timeframe,
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
   const newTimeframe: Timeframe = new Timeframe()
   shallowCopy(props.timeframe, newTimeframe)
   newTimeframe.id_product = useProductStore().workProduct.id
   const authService = new AuthService()
   const timeframeService = new TimeframeService()

   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            if (newTimeframe.id == 0) {// add new
               timeframeService.addTimeframe(token, newTimeframe).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Timeframe created')
                     emit('loadTimeframes')
                     emit('close')
                  }
               })
            } else {// update
               timeframeService.updateTimeframe(token, newTimeframe).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Timeframe saved')
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
   const idIimeframe = props.timeframe.id
   const authService = new AuthService()
   const timeframeService = new TimeframeService()

   authService.runAfterToken((token: string) => {
      timeframeService.deleteTimeframe(token, idIimeframe).then((response) => {
         if (typeof response === 'string') {
            useSnackbarStore().showSnackbar('error', response)
         }
         else if (typeof response === 'number') {
            useSnackbarStore().showSnackbar('success', 'Timeframe deleted')
            emit('loadTimeframes')
            emit('close')
         }
      })
   })
}

</script>
