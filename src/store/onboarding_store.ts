import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
    const showOnboardingProductEdit = ref(false)
    const showOnboardingProductSelect = ref(false)
    const showOnboardingTimeframe = ref(false)
    const showOnboardingInitiative = ref(false)
    const showOnboardingSolution = ref(false)
    const showOnboardingPublication = ref(false)

    function $reset() {
        showOnboardingProductEdit.value = false
        showOnboardingProductSelect.value = false
        showOnboardingTimeframe.value = false
        showOnboardingInitiative.value = false
        showOnboardingSolution.value = false
        showOnboardingPublication.value = false
    }

    return {
        $reset, showOnboardingProductEdit, showOnboardingProductSelect, showOnboardingTimeframe,
        showOnboardingInitiative, showOnboardingSolution, showOnboardingPublication
    }
}, { persist: true })
