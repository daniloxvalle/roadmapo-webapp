import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
   const isLoading = ref(false)

   function $reset() {
      isLoading.value = false
   }

   return { $reset, isLoading }
})
