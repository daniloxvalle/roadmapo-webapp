import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
   const showOnboardingProductEdit = ref(true)
   const showOnboardingProductSelect = ref(true)
   const showOnboardingTimeframe = ref(true)
   const showOnboardingInitiative = ref(true)
   const showOnboardingSolution = ref(true)
   const showOnboardingPublication = ref(true)

   function $reset() {
      showOnboardingProductEdit.value = true
      showOnboardingProductSelect.value = true
      showOnboardingTimeframe.value = true
      showOnboardingInitiative.value = true
      showOnboardingSolution.value = true
      showOnboardingPublication.value = true
   }

   return {
      $reset, showOnboardingProductEdit, showOnboardingProductSelect, showOnboardingTimeframe,
      showOnboardingInitiative, showOnboardingSolution, showOnboardingPublication
   }
}, { persist: true })
