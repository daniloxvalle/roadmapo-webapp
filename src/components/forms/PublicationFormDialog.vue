<template>
   <v-dialog
      v-model="show"
      max-width="850px"
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5">Publication</span>
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
               <v-col
                  cols="12"
                  class="pt-3"
               >
                  <v-text-field
                     label="Title"
                     required
                     v-model="publication.name"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-text-field
                     label="Disclaimer"
                     required
                     v-model="publication.disclaimer"
                  ></v-text-field>
               </v-col>
               <v-col
                  cols="12"
                  class="pa-0 ml-3"
               >
                  <v-radio-group
                     inline
                     v-model="publication.theme"
                  >
                     <span style="align-self: center;"><v-icon
                           size="small"
                           icon="mdi-theme-light-dark"
                        /> Theme: </span>
                     <v-radio
                        label="Dark"
                        value="dark"
                     ></v-radio>
                     <v-radio
                        label="Light"
                        value="light"
                     ></v-radio>
                  </v-radio-group>
               </v-col>

               <v-col
                  cols="12"
                  class="pa-0 ml-3 pt-3"
               >
                  <span style="align-self: center;"><v-icon icon="mdi-eye" /> Visibility</span>
                  <v-switch
                     v-bind="props"
                     v-model="publication.is_name_visible"
                     density="compact"
                     class="pt-3"
                     icon="mdi-eye"
                  >
                     <template v-slot:label>
                        Title
                        <v-icon
                           v-if="publication.is_name_visible"
                           size="small"
                           icon="mdi-check"
                           class="ml-1"
                        />
                     </template>
                  </v-switch>
               </v-col>
               <v-col
                  cols="12"
                  class="pa-0 ml-3 mt-n2"
               >
                  <v-switch
                     v-bind="props"
                     v-model="publication.is_disclaimer_visible"
                     density="compact"
                  >
                     <template v-slot:label>
                        Disclaimer
                        <v-icon
                           v-if="publication.is_disclaimer_visible"
                           size="small"
                           icon="mdi-check"
                           class="ml-1"
                        />
                     </template>
                  </v-switch>
               </v-col>
               <v-col
                  cols="12"
                  class="pa-0 ml-3 mt-n2"
               >
                  <v-switch
                     v-bind="props"
                     v-model="publication.is_vision_visible"
                     density="compact"
                  >
                     <template v-slot:label>
                        Vision
                        <v-icon
                           v-if="publication.is_vision_visible"
                           size="small"
                           icon="mdi-check"
                           class="ml-1"
                        />
                     </template>
                  </v-switch>
               </v-col>
               <v-col
                  cols="12"
                  class="pa-0 ml-3 mt-n2"
               >
                  <v-switch
                     v-bind="props"
                     v-model="publication.is_solution_visible"
                     density="compact"
                  >
                     <template v-slot:label>
                        Solutions
                        <v-icon
                           v-if="publication.is_solution_visible"
                           size="small"
                           icon="mdi-check"
                           class="ml-1"
                        />
                     </template>
                  </v-switch>
               </v-col>
               <v-col
                  cols="12"
                  class="pa-0 ml-3 mt-n2"
               >
                  <v-switch
                     v-bind="props"
                     v-model="publication.is_objective_visible"
                     density="compact"
                  >
                     <template v-slot:label>
                        Objectives
                        <v-icon
                           v-if="publication.is_objective_visible"
                           size="small"
                           icon="mdi-check"
                           class="ml-1"
                        />
                     </template>
                  </v-switch>
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
               v-if="publication.id != 0"
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
</template>

<script lang="ts" setup>

import { computed, ref } from "vue";
import { nanoid } from 'nanoid'

import Publication from "@/models/publication";
import PublicationService from "@/services/publication_service";
import AuthService from "@/services/auth_service";
import ConfirmDeleteDialog from "@/components/confirmation/ConfirmDeleteDialog.vue";
import { useSnackbarStore } from '@/store/snackbar_store'
import { useUserStore } from '@/store/user_store'
import { shallowCopy } from "@/helpers";
import { useProductStore } from "@/store/product_store";

const emit = defineEmits(['close', 'loadPublications'])
const isConfirmDeleteDialogVisible = ref<boolean>(false)

const props = defineProps<{
   visible: boolean,
   publication: Publication,
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
   const newPublication: Publication = new Publication()
   shallowCopy(props.publication, newPublication)
   const authService = new AuthService()
   const publicationService = new PublicationService()

   authService.runAfterToken((token: string) => {
      if (token != '') {// add new
         if (newPublication.id == 0) {
            newPublication.nanoid = nanoid()
            newPublication.id_product = useProductStore().workProduct.id
            publicationService.addPublication(token, newPublication).then((response) => {
               if (typeof response === 'string') {
                  useSnackbarStore().showSnackbar('error', response)
               }
               else if (typeof response === 'number') {
                  useSnackbarStore().showSnackbar('success', 'Publication created')
                  emit('loadPublications')
                  emit('close')
               }
            })
         } else {// update
            publicationService.updatePublication(token, newPublication).then((response) => {
               if (typeof response === 'string') {
                  useSnackbarStore().showSnackbar('error', response)
               }
               else if (typeof response === 'number') {
                  useSnackbarStore().showSnackbar('success', 'Publication saved')
                  emit('close')
               }
            })
         }
      } else {
         useSnackbarStore().showSnackbar('info', 'Please log in to save.')
         emit('close')
      }
   })
}

function onDelete() {
   const idIimeframe = props.publication.id
   const authService = new AuthService()
   const publicationService = new PublicationService()

   authService.runAfterToken((token: string) => {
      publicationService.deletePublication(token, idIimeframe).then((response) => {
         if (typeof response === 'string') {
            useSnackbarStore().showSnackbar('error', response)
         }
         else if (typeof response === 'number') {
            useSnackbarStore().showSnackbar('success', 'Publication deleted')
            emit('loadPublications')
            emit('close')
         }
      })
   })
}

</script>
