<template>
   <VOnboardingWrapper
      ref="onboardingWrapperProductEdit"
      :steps="onboardingProductEditSteps"
      :options="onboardingOptions"
   />
   <VOnboardingWrapper
      ref="onboardingWrapperProductSelect"
      :steps="onboardingProductSelectSteps"
      :options="onboardingOptions"
      @finish="useOnboardingStore().showOnboardingProductSelect = false"
   />
   <AlertSampleVersion />
   <v-container fluid>
      <v-row class="pa-3">
         <h3 class="align-self-center">Products</h3>
      </v-row>
      <v-row>
         <v-progress-circular
            v-if="useLoadingStore().isLoading &&
               !useProductStore().allProducts"
            :width="3"
            :size="50"
            color="primary"
            indeterminate
            class="ma-6"
         ></v-progress-circular>

         <v-col
            v-for="(product, index) in useProductStore().allProducts"
            :key="index"
            :style="useProductStore().allProducts?.length == 1 ? 'max-width: 340px;' : 'max-width: 100%'"
         >
            <v-card
               id="btn-select-product"
               border
               :title=product.name
               :subtitle=product.vision
               :text="truncateText(product.description, 220)"
               min-width="260px"
               min-height="180px"
               height="100%"
               class="d-flex flex-column"
               @click.prevent.stop="onSelectProduct(product)"
            >
               <v-spacer />
               <v-card-text
                  style="max-height: 48px;"
                  class="pt-1 pb-4"
               >
                  <p>
                     {{ product.count_initiative }} Initiatives
                  </p>
                  <p>
                     {{ product.count_solution }} Solutions
                  </p>
               </v-card-text>
               <v-card-actions>
                  <v-row no-gutters>
                     <v-col style="max-width: 100%;">
                        <v-btn
                           border
                           block
                           class="text-none"
                           prepend-icon="mdi-open-in-app"
                           @click.prevent.stop="onSelectProduct(product)"
                        >
                           Select
                        </v-btn>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0 ml-3">
                        <VBtnAccent
                           id="btn-edit-product"
                           border
                           class="text-none"
                           prepend-icon="mdi-pencil"
                           @click.prevent.stop="onEdit(product)"
                        >
                           Edit
                        </VBtnAccent>
                     </v-col>
                  </v-row>
               </v-card-actions>
            </v-card>
         </v-col>

         <v-sheet
            v-if="useProductStore().allProducts"
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
               @click.prevent.stop="onEdit()"
            >
               <v-icon
                  size="x-large"
                  icon="mdi-plus"
               />
               <v-tooltip
                  activator="parent"
                  location="bottom"
                  open-delay="400"
               >Add product</v-tooltip>
            </v-btn>
         </v-sheet>

      </v-row>
   </v-container>

   <ProductFormDialog
      :visible="isFormDialogVisible"
      :product="productToEdit"
      @loadProducts="loadProducts()"
      @close="onCloseProductFormDialog"
   />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
import 'v-onboarding/dist/style.css'
import '@/styles/onboarding.css'

import router from "@/router"
import { Product } from "@/models/product"
import ProductFormDialog from "@/components/forms/ProductFormDialog.vue"
import AlertSampleVersion from "@/components/AlertSampleVersion.vue"
import { useProductStore } from '@/store/product_store'
import { usePreferenceStore } from '@/store/preference_store'
import { useLoadingStore } from '@/store/loading_store'
import { useOnboardingStore } from '@/store/onboarding_store'
import { runTimeout, truncateText } from "@/helpers"
import { loadProducts } from '@/shared/product_shared'
import { onboardingOptions, onboardingProductEditSteps, onboardingProductSelectSteps } from "@/shared/onboarding"

const isFormDialogVisible = ref<boolean>(false)
const productToEdit = ref(new Product())

const onboardingWrapperProductEdit = ref()
const onboardingWrapperProductSelect = ref()
const { start: onboardingStartProductEdit, goToStep: onboardingGoToStepProductEdit } = useVOnboarding(onboardingWrapperProductEdit)
const { start: onboardingStartProductSelect } = useVOnboarding(onboardingWrapperProductSelect)

onMounted(() => {
   loadProducts(() => useOnboardingStore().showOnboardingProductEdit && onboardingStartProductEdit())
})

function onSelectProduct(product: Product) {
   useProductStore().selectProduct(product)
   usePreferenceStore().idWorkProduct = product.id
   router.push('/roadmap')
}

function onEdit(product?: Product) {
   productToEdit.value = product || new Product()
   isFormDialogVisible.value = true
   useOnboardingStore().showOnboardingProductEdit &&
      runTimeout(() => onboardingGoToStepProductEdit(1))
}

function onCloseProductFormDialog() {
   isFormDialogVisible.value = false
   if (useOnboardingStore().showOnboardingProductEdit)
      useOnboardingStore().showOnboardingProductEdit = false
   useOnboardingStore().showOnboardingProductSelect
      && onboardingStartProductSelect()
}

</script>
