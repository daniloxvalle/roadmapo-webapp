<template>
   <v-dialog
      v-model="show"
      max-width="850px"
      :persistent="useOnboardingStore().showOnboardingProductEdit"
      no-click-animation
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5">Product</span>
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
                     id="field-product-name"
                     label="Product Name*"
                     required
                     v-model="product.name"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-row id="row-product-description">
                     <v-col style="max-width: 100%;">
                        <v-textarea
                           label="Description"
                           required
                           v-model="product.description"
                           rows="5"
                           :loading=isLoadingDescriptionAI
                           auto-grow
                        ></v-textarea>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0">
                        <v-btn
                           icon=""
                           size="small"
                           @click.stop="isConfirmAIDescriptionVisible = true"
                           :disabled="isLoadingDescriptionAI || isLoadingVisionAI"
                           :loading="isLoadingDescriptionAI"
                        >
                           <v-icon icon="mdi-robot" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Generate Description</v-tooltip>
                        </v-btn>
                     </v-col>
                  </v-row>
               </v-col>
               <v-col cols="12">
                  <v-row id="row-product-vision">
                     <v-col style="max-width: 100%;">
                        <v-textarea
                           label="Product Vision"
                           required
                           v-model="product.vision"
                           rows="2"
                           :loading=isLoadingVisionAI
                           auto-grow
                        ></v-textarea>
                     </v-col>
                     <v-col class="flex-grow-0 flex-shrink-0">
                        <v-btn
                           id="btn-gen-vision"
                           icon=""
                           size="small"
                           @click.stop="isConfirmAIVisionVisible = true"
                           :disabled="isLoadingDescriptionAI || isLoadingVisionAI"
                           :loading="isLoadingVisionAI"
                        >
                           <v-icon icon="mdi-robot" />
                           <v-tooltip
                              activator="parent"
                              location="bottom"
                              open-delay="400"
                           >Generate Vision</v-tooltip>
                        </v-btn>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions class="mr-4 mb-2">
            <v-spacer />
            <VBtnAccent
               id="btn-save-product"
               class="text-none"
               prepend-icon="mdi-check"
               @click.stop="onSave"
            >Save</VBtnAccent>
            <v-btn
               v-if="product.id != 0"
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
      message="Artificial intelligence will generate the product description for you, based on the product name. 
         The current description will be replaced. Are you sure you want to continue?"
      :visible="isConfirmAIDescriptionVisible"
      :onConfirm="onGenerateDescriptionAI"
      @close="isConfirmAIDescriptionVisible = false"
   />

   <ConfirmAIDialog
      message="Artificial intelligence will generate the product vision for you, based on the product name and description. 
         The current vision will be replaced. Are you sure you want to continue?"
      :visible="isConfirmAIVisionVisible"
      :onConfirm="onGenerateVisionAI"
      @close="isConfirmAIVisionVisible = false"
   />
</template>

<script lang="ts" setup>

import { computed, ref } from "vue";

import Product from "@/models/product";
import ProductService from "@/services/product_service";
import AuthService from "@/services/auth_service";
import ConfirmDeleteDialog from "@/components/confirmation/ConfirmDeleteDialog.vue";
import ConfirmAIDialog from "@/components/confirmation/ConfirmAIDialog.vue";
import { shallowCopy } from "@/helpers";
import { useProductStore } from '@/store/product_store'
import { useSnackbarStore } from '@/store/snackbar_store'
import { OpenAIApiResponse } from "@/typings/interface";
import { useUserStore } from "@/store/user_store";
import { useOnboardingStore } from "@/store/onboarding_store";

const emit = defineEmits(['close', 'loadProducts'])
const isConfirmDeleteDialogVisible = ref<boolean>(false)
const isConfirmAIDescriptionVisible = ref<boolean>(false)
const isConfirmAIVisionVisible = ref<boolean>(false)
const isLoadingDescriptionAI = ref<boolean>(false)
const isLoadingVisionAI = ref<boolean>(false)

const props = defineProps<{
   visible: boolean,
   product: Product,
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
   const newProduct: Product = new Product()
   shallowCopy(props.product, newProduct)
   const authService = new AuthService()
   const productService = new ProductService()

   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            if (newProduct.id == 0) {// add new
               productService.addProduct(token, newProduct).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Product added')
                     emit('loadProducts')
                     emit('close')
                  }
               })
            } else {// update
               productService.updateProduct(token, newProduct).then((response) => {
                  if (typeof response === 'string') {
                     useSnackbarStore().showSnackbar('error', response)
                  }
                  else if (typeof response === 'number') {
                     useSnackbarStore().showSnackbar('success', 'Product saved')
                     if (useProductStore().workProduct.id == newProduct.id)
                        useProductStore().workProduct = newProduct
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
   const idProduct = props.product.id
   const authService = new AuthService()
   const productService = new ProductService()

   authService.runAfterToken((token: string) => {
      productService.deleteProduct(token, idProduct).then((response) => {
         if (typeof response === 'string') {
            useSnackbarStore().showSnackbar('error', response)
         }
         else if (typeof response === 'number') {
            useSnackbarStore().showSnackbar('success', 'Product deleted')
            if (useProductStore().workProduct.id == idProduct)
               useProductStore().workProduct = new Product()
            emit('loadProducts')
            emit('close')
         }
      })
   })
}

function onGenerateDescriptionAI() {
   const authService = new AuthService()
   const productService = new ProductService()

   if (props.product.name == '')
      useSnackbarStore().showSnackbar('error', 'Product name is required')
   else {
      authService.runAfterToken((token: string) => {
         isLoadingDescriptionAI.value = true
         productService.generateDescriptionAI(token, props.product).then((response) => {
            if (typeof response === 'object') {
               const AIResponse: OpenAIApiResponse = <OpenAIApiResponse>response
               props.product.description = AIResponse.choices[0].message.content
            } else {
               useSnackbarStore().showSnackbar('error', response)
            }
            isLoadingDescriptionAI.value = false
         })
      })
   }
}

function onGenerateVisionAI() {
   const authService = new AuthService()
   const productService = new ProductService()

   if (props.product.name == '' || props.product.description == '')
      useSnackbarStore().showSnackbar('error', 'Product name and description are required')
   else {
      authService.runAfterToken((token: string) => {
         isLoadingVisionAI.value = true
         productService.generateVisionAI(token, props.product).then((response) => {
            if (typeof response === 'object') {
               const AIResponse: OpenAIApiResponse = <OpenAIApiResponse>response
               props.product.vision = AIResponse.choices[0].message.content
            } else {
               useSnackbarStore().showSnackbar('error', response)
            }
            isLoadingVisionAI.value = false
         })
      })
   }
}

</script>
