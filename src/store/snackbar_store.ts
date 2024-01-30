import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
   const isVisible = ref(false)
   const color = ref('')
   const message = ref('')

   function showSnackbar(showColor: string, showMessage: string) {
      isVisible.value = true
      color.value = showColor
      message.value = showMessage
   }

   return { isVisible, message, color, showSnackbar }
})
