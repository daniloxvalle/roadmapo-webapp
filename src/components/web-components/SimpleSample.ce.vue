<template>
   <div class="roadmapo-root">
      <v-row class="ma-3">
         <v-text-field
            label="Vision"
            variant="plain"
            class="ml-3 mb-n6"
            :readonly="true"
         />
         <v-btn
            icon=""
            variant="tonal"
            class="float-right"
         >

            <v-tooltip
               activator="parent"
               location="bottom"
               open-delay="400"
            >{{ 'Show archived' }}</v-tooltip>
         </v-btn>
      </v-row>

      <v-container fluid>
         <v-row class="pa-3">
            <h3 class="align-self-center">Products</h3>
         </v-row>
         <v-row>
            <v-progress-circular
               v-if="!produtos"
               :width="3"
               :size="50"
               color="primary"
               indeterminate
               class="ma-6"
            ></v-progress-circular>

            <v-col
               v-for="(product, index) in produtos"
               :key="index"
               :style="produtos.length == 1 ? 'max-width: 340px;' : 'max-width: 100%'"
            >
               <v-card
                  border
                  :title=product.name
                  :subtitle=product.vision
                  :text="truncateText(product.description, 140)"
                  min-width="260px"
                  min-height="180px"
                  height="100%"
                  class="d-flex flex-column"
                  @click.prevent.stop="onEdit(product)"
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
                        <v-col style="min-width: 100px; max-width: 100%;">
                           <VBtnAccent
                              border
                              block
                              class="text-none"
                              prepend-icon="mdi-open-in-app"
                           >
                              Select
                           </VBtnAccent>
                        </v-col>
                        <v-col class="flex-grow-0 flex-shrink-0 ml-3">
                           <v-btn
                              border
                              class="text-none"
                              prepend-icon="mdi-pencil"
                           >
                              Edit
                           </v-btn>
                        </v-col>
                     </v-row>
                  </v-card-actions>
               </v-card>
            </v-col>

            <v-sheet
               v-if="produtos"
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
                  >Add product</v-tooltip>
               </v-btn>
            </v-sheet>

         </v-row>
      </v-container>
   </div>
</template>


<script lang="ts" setup>
import { ref, onMounted } from "vue"

import { Product } from "@/models/product"
import { truncateText } from "@/helpers"

const isFormDialogVisible = ref<boolean>(false)
const productToEdit = ref(new Product())
const produtos = ref()

import vuetify from '@/plugins/vuetify'

onMounted(() => {
   // if (!useProductStore().allProducts) {
   loadProducts(true)
   // }
})

async function loadProducts(redirect: boolean) {
   // const authService = new AuthService()
   // const productService = new ProductService()
   produtos.value =
      [{ id: 15, name: 'Product BB1212', description: 'The vision statement isn’t a static document and i… to offer input on the product vision statement. ', vision: 'To bringing the best user experience to its custom…its innovative hardware, software, and services. ', count_initiative: '10' },
      { id: 41, name: 'New Product X1', description: 'Descr X3', vision: 'Vision X2', count_initiative: '0' },
      { id: 42, name: 'Product Y1', description: 'Descr Y', vision: 'Vision Y', count_initiative: '0' },
      { id: 43, name: 'Product J1', description: 'Desc J', vision: 'VIsion J', count_initiative: '0' }]

   // authService.runAfterToken(
   //    (token: string) => productService.getProducts(token).then((response: Product[] | string) => {
   //       if (typeof response === 'object') {
   //          useProductStore().allProducts = response

   //          if (usePreferenceStore().idWorkProduct) {
   //             const preferenceWorkProduct = find(response, { 'id': usePreferenceStore().idWorkProduct })
   //             if (preferenceWorkProduct) {
   //                useProductStore().workProduct = preferenceWorkProduct
   //                if (redirect)
   //                   router.push('/roadmap')
   //             }
   //          }
   //       }
   //    })
   // )
}

function onEdit(product: Product) {
   productToEdit.value = product
   isFormDialogVisible.value = true
}

function onNew() {
   productToEdit.value = new Product()
   isFormDialogVisible.value = true
}
</script>
<style>
/* @import 'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css'; */
@import 'vuetify/dist/vuetify.min.css';
</style>