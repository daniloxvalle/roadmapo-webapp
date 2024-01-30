import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useObjectiveStore = defineStore('objective', () => {
   const objectives = ref([])

   function $reset() {
      objectives.value = []
   }

   return { $reset, objectives }
})
