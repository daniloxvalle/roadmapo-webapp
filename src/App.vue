<template>
   <router-view />
   <SnackbarStore />
</template>

<script lang="ts" setup>

import { getAuth, onAuthStateChanged } from "firebase/auth"

import SnackbarStore from "@/components/SnackBarStore.vue"
import { useUserStore } from '@/store/user_store'
import { useProductStore } from '@/store/product_store'
import { useObjectiveStore } from '@/store/objective_store'
import { useLoadingStore } from '@/store/loading_store'
import { usePublicationStore } from "./store/publication_store"

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
   if (user) {
      // console.log('User is signed in: ' + user.uid)
      useUserStore().isLoggedIn = true
      useUserStore().email = user.email
      useUserStore().emailVerified = user.emailVerified
      if (user.photoURL)
         useUserStore().photoURL = user.photoURL
      if (user.displayName)
         useUserStore().displayName = user.displayName
   } else {
      // console.log('User is signed out')
      useUserStore().$reset()
      useProductStore().$reset()
      useObjectiveStore().$reset()
      usePublicationStore().$reset()
      useLoadingStore().$reset()
   }
});

</script>