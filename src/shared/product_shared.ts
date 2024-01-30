import { find } from "lodash"

import { ProductService } from '@/services/product_service'
import { Product } from "@/models/product"
import AuthService from "@/services/auth_service"
import { useProductStore } from '@/store/product_store'
import { usePreferenceStore } from '@/store/preference_store'
import { useSnackbarStore } from '@/store/snackbar_store'
import { useLoadingStore } from '@/store/loading_store'
import * as config from '@/config'

export async function loadProducts(callback?: () => void) {
   const authService = new AuthService()
   const productService = new ProductService()

   useLoadingStore().isLoading = true
   authService.runAfterToken(
      (token: string) => {
         if (token != '') {
            productService.getProducts(token).then((response: Product[] | string) => {
               if (typeof response === 'object') {
                  useProductStore().allProducts = response

                  if (usePreferenceStore().idWorkProduct) {
                     const preferenceWorkProduct = find(response, { 'id': usePreferenceStore().idWorkProduct })
                     if (preferenceWorkProduct) {
                        useProductStore().workProduct = preferenceWorkProduct
                     } else {
                        usePreferenceStore().idWorkProduct = undefined
                     }
                  }
                  callback && callback()
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })

         } else {
            productService.getProductPublication(config.sampleNanoid).then((response: Product[] | string) => {
               if (typeof response === 'object') {
                  useProductStore().allProducts = response
                  usePreferenceStore().idWorkProduct = response[0].id

                  const preferenceWorkProduct = find(response, { 'id': usePreferenceStore().idWorkProduct })
                  if (preferenceWorkProduct) {
                     useProductStore().workProduct = preferenceWorkProduct
                  }
                  callback && callback()
               } else {
                  useSnackbarStore().showSnackbar('error', response)
               }
               useLoadingStore().isLoading = false
            })
         }

      }
   )

}
