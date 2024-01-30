import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferenceStore = defineStore('preference', () => {
   const idWorkProduct = ref()
   const theme = ref()

   return { idWorkProduct, theme }
}, { persist: true })
