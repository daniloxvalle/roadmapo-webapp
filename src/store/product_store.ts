import { defineStore } from 'pinia'
import { ref } from 'vue'

import Product from '@/models/product'

export const useProductStore = defineStore('product', () => {
   const workProduct = ref(new Product())
   const lastProduct = ref(new Product())
   let allProducts = ref<Product[]>()

   function $reset() {
      workProduct.value = new Product()
      lastProduct.value = new Product()
      workProduct.value = new Product()
      allProducts.value = undefined
   }

   function selectProduct(selectedProduct: Product) {
      if (workProduct.value.id != selectedProduct.id) {
         lastProduct.value = workProduct.value
         workProduct.value = selectedProduct
      }
   }

   return { $reset, workProduct, lastProduct, allProducts, selectProduct }
})

// TODO: Find how to use with an array and use this function
// const lastProducts: Product[] = reactive([])
// function addLastProduct(selectedProduct: Product) {
//    // Add if not present, if present move to first position
//    const index = lastProducts.indexOf(selectedProduct)
//    if (index != -1)
//       lastProducts.splice(index, 1)
//    else if (lastProducts.length > 3)
//       lastProducts.splice(-1)
//    lastProducts.unshift(selectedProduct)
// }


// TIP
// You can watch the whole state on the pinia instance with a single watch():
/* watch(
   pinia.state,
   (state) => {
      // persist the whole state to the local storage whenever it changes
      localStorage.setItem('piniaState', JSON.stringify(state))
   },
   { deep: true }
) */