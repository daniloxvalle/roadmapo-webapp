<template>
   <AlertSampleVersion />
   <v-container fluid>
      <v-row class="pa-3">
         <h3 class="align-self-center">Publications</h3>
      </v-row>
      <v-row
         v-if="useProductStore().workProduct.id == 0 && !usePublicationStore().publications"
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
      <v-row>
         <v-progress-circular
            v-if="useLoadingStore().isLoading && !usePublicationStore().publications"
            :width="3"
            :size="50"
            color="primary"
            indeterminate
            class="ma-6"
         ></v-progress-circular>

         <v-col
            v-for="(publication, index) in usePublicationStore().publications"
            :key="index"
            :style="usePublicationStore().publications?.length == 1 ? 'max-width: 340px;' : 'max-width: 100%'"
         >
            <v-card
               border
               :title=publication.name
               :text=publication.disclaimer
               min-width="260px"
               min-height="180px"
               height="100%"
               class="d-flex flex-column"
               @click.prevent.stop="onEdit(publication)"
            >
               <v-card-text class="pt-3 pb-4">
                  <div class="mb-3 mt-1">
                     <v-icon
                        icon="mdi-road-variant"
                        class="mr-2 mb-1"
                     />
                     Kanban
                  </div>
                  <div class="mb-3">
                     <span>
                        <v-tooltip
                           text="Information visibility"
                           activator="parent"
                           location="bottom"
                           open-delay="400"
                        >
                           <template v-slot:activator="{ props: propsTooltip }">
                              <v-icon
                                 v-bind="propsTooltip"
                                 icon="mdi-eye"
                                 class="mr-2 mb-1"
                              />
                           </template>
                        </v-tooltip>
                     </span>
                     <v-chip
                        v-if="publication.is_name_visible"
                        size="small"
                        class="mr-1 mb-1"
                     >
                        Title
                     </v-chip>
                     <v-chip
                        v-if="publication.is_disclaimer_visible"
                        size="small"
                        class="mr-1 mb-1"
                     >
                        Disclaimer
                     </v-chip>
                     <v-chip
                        v-if="publication.is_vision_visible"
                        size="small"
                        class="mr-1 mb-1"
                     >
                        Vision
                     </v-chip>
                     <v-chip
                        v-if="publication.is_solution_visible"
                        size="small"
                        class="mr-1 mb-1"
                     >
                        Solutions
                     </v-chip>
                     <v-chip
                        v-if="publication.is_objective_visible"
                        size="small"
                        class="mr-1 mb-1"
                     >
                        Objectives
                     </v-chip>
                  </div>
                  <div class="mb-2">
                     <span>
                        <v-tooltip
                           text="Theme"
                           activator="parent"
                           location="bottom"
                           open-delay="400"
                        >
                           <template v-slot:activator="{ props: propsTooltip }">
                              <v-icon
                                 v-bind="propsTooltip"
                                 icon="mdi-theme-light-dark"
                                 class="mr-2 mb-1"
                              />
                           </template>
                        </v-tooltip>
                     </span>
                     <span style="text-transform:capitalize;">
                        {{ publication.theme }}
                     </span>
                  </div>
                  <div class="mb-2">
                     <span>
                        <v-tooltip
                           text="Public link"
                           activator="parent"
                           location="bottom"
                           open-delay="400"
                        >
                           <template v-slot:activator="{ props: propsTooltip }">
                              <v-icon
                                 v-bind="propsTooltip"
                                 icon="mdi-link"
                                 class="mr-2 "
                              />
                           </template>
                        </v-tooltip>
                     </span>
                     <span
                        class="text-caption"
                        style="color:gray;"
                     >
                        {{ pathRoadmapLink + publication.nanoid }}
                     </span>
                     <v-btn
                        icon=""
                        variant="tonal"
                        @click.prevent.stop="copyRoadmapURL(publication.nanoid)"
                        size="x-small"
                        class="ml-1"
                     >
                        <v-icon icon="mdi-content-copy" />
                        <v-tooltip
                           activator="parent"
                           location="bottom"
                           open-delay="400"
                        >Copy URL</v-tooltip>
                     </v-btn>
                  </div>
               </v-card-text>
               <v-card-actions>
                  <v-row no-gutters>
                     <v-col style="max-width: 100%;">
                        <v-btn
                           border
                           block
                           class="text-none"
                           prepend-icon="mdi-pencil"
                           @click.prevent.stop="onEdit(publication)"
                        >
                           Edit
                        </v-btn>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ml-3">
                        <VBtnAccent
                           border
                           class="text-none"
                           prepend-icon="mdi-share-variant"
                           @click.prevent.stop="showInformationDialog(publication.nanoid)"
                        >
                           Share
                        </VBtnAccent>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ml-3">
                        <VBtnAccent
                           border
                           class="text-none"
                           prepend-icon="mdi-open-in-new"
                           @click.prevent.stop="onOpen(publication.nanoid)"
                        >
                           Open
                        </VBtnAccent>
                     </v-col>
                  </v-row>
               </v-card-actions>
            </v-card>
         </v-col>

         <v-sheet
            v-if="usePublicationStore().publications"
            border
            rounded
            justify="center"
            class="ma-3 pa-2"
            style=" height: 180px; width: 180px;"
         >
            <v-btn
               border
               block
               variant="text"
               class="text-none"
               style="height: 100%; border-style: dashed;"
               @click.prevent.stop="onNew()"
            >
               <v-icon
                  size="x-large"
                  icon="mdi-plus"
               />
               <v-tooltip
                  activator="parent"
                  location="bottom"
                  open-delay="400"
               >Add publication</v-tooltip>
            </v-btn>
         </v-sheet>

      </v-row>
   </v-container>

   <PublicationFormDialog
      :visible="isFormDialogVisible"
      :publication="publicationToEdit"
      @loadPublications="loadPublications()"
      @close="isFormDialogVisible = false"
   />

   <ShareInformationDialog
      :visible="isInformationDialogVisible"
      :nanoid="nanoidInformation"
      :pathRoadmapLink="pathRoadmapLink"
      :pathJsFile="pathJsFile"
      @close="isInformationDialogVisible = false"
   />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"

import { Publication } from "@/models/publication"
import PublicationFormDialog from "@/components/forms/PublicationFormDialog.vue"
import ShareInformationDialog from "@/components/information/ShareInformationDialog.vue";
import { usePublicationStore } from '@/store/publication_store'
import { useLoadingStore } from '@/store/loading_store'
import AuthService from "@/services/auth_service"
import PublicationService from "@/services/publication_service"
import { useProductStore } from "@/store/product_store"
import { useSnackbarStore } from "@/store/snackbar_store"
import { useOnboardingStore } from "@/store/onboarding_store"
import AlertSampleVersion from "@/components/AlertSampleVersion.vue"
import * as config from '@/config'

const isFormDialogVisible = ref<boolean>(false)
const isInformationDialogVisible = ref<boolean>(false)
const publicationToEdit = ref(new Publication())
const nanoidInformation = ref<string>('')

const host = window.location.host
const protocol = window.location.protocol
const pathRoadmapLink = protocol + '//' + host + '/ce/kb.html?n='
const pathJsFile = protocol + '//' + host + '/ce'

watch(() => useProductStore().workProduct, (newValue) => {
   loadPublications()
})

onMounted(() => {
   loadPublications()
   if (useOnboardingStore().showOnboardingPublication) {
      useOnboardingStore().showOnboardingPublication = false
   }
})

async function loadPublications() {
   const authService = new AuthService()
   const publicationService = new PublicationService()

   authService.runAfterToken(
      (token: string) => {
         useLoadingStore().isLoading = true
         if (token != '') {
            const idProduct = useProductStore().workProduct.id
            if (idProduct != 0) {
               publicationService.getPublications(token, idProduct).then(
                  (response: Publication[] | string) => {
                     if (typeof response === 'object') {
                        usePublicationStore().publications = response
                     } else {
                        useSnackbarStore().showSnackbar('error', response)
                     }
                     useLoadingStore().isLoading = false
                  })
            } else {
               useLoadingStore().isLoading = false
               usePublicationStore().$reset()
            }

         } else {
            publicationService.getPublicationPublication(config.sampleNanoid).then(
               (response: Publication[] | string) => {
                  if (typeof response === 'object') {
                     usePublicationStore().publications = response
                  } else {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  useLoadingStore().isLoading = false
               })
         }
      }
   )
}

function copyRoadmapURL(nanoid: string) {
   navigator.clipboard.writeText(pathRoadmapLink + nanoid);
}

function showInformationDialog(nanoid: string) {
   isInformationDialogVisible.value = true
   nanoidInformation.value = nanoid
}

function onEdit(publication: Publication) {
   publicationToEdit.value = publication
   isFormDialogVisible.value = true
}

function onNew() {
   publicationToEdit.value = new Publication()
   isFormDialogVisible.value = true
}

function onOpen(nanoid: string) {
   let roadmapURL = pathRoadmapLink + nanoid
   if (host.slice(0, 9) == 'localhost')
      roadmapURL = protocol + '//' + host + '/dist/ce/kb.html?n=' + nanoid

   window.open(roadmapURL, '_blank');
}

</script>
