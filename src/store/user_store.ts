import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
   const email = ref()
   const emailVerified = ref()
   const displayName = ref()
   const photoURL = ref()
   const isLoggedIn = ref(false)

   function $reset() {
      email.value = undefined
      emailVerified.value = undefined
      displayName.value = undefined
      photoURL.value = undefined
      isLoggedIn.value = false
   }

   return { $reset, email, emailVerified, displayName, photoURL, isLoggedIn }
})
