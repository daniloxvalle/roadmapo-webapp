import { defineStore } from 'pinia'
import { ref } from 'vue'

import Publication from '@/models/publication'

export const usePublicationStore = defineStore('publication', () => {
   const publications = ref<Publication[]>()

   function $reset() {
      publications.value = undefined
   }

   return { $reset, publications }
})
