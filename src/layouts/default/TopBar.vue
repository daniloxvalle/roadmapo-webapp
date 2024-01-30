<template >
   <v-app-bar
      density="compact"
      :elevation="2"
   >
      <template #prepend>
         <v-img
            height="32px"
            width="32px"
            src="@/assets/logo/spyglass_round.png"
            class="ma-1"
            style="cursor: pointer"
            @click="onLogoClicked"
         />
      </template>

      <v-app-bar-title class="flex text-center">
         <v-menu transition="slide-y-transition">
            <template #activator="{ props }">
               <v-btn
                  class="text-none text-subtitle-1 font-weight-regular"
                  variant="text"
                  v-bind="props"
                  color="v-application.primary--text"
               >
                  {{ useProductStore().workProduct.name == '' ?
                     'Select a product' : useProductStore().workProduct.name }}
                  <v-icon
                     icon="mdi-chevron-down"
                     size="small"
                  />
               </v-btn>
            </template>
            <v-list class="pb-0">
               <!-- v-for="(product, index) in useProductStore().lastProducts.slice(1)"
                  :key="index" -->
               <v-list-item
                  v-if="useProductStore().lastProduct.name != ''"
                  class="pa-0"
                  density="compact"
               >
                  <v-btn
                     block
                     variant="text"
                     color="v-application.primary--text"
                     @click="onProductSelectedDropdown()"
                  >
                     <v-list-item-title>{{ useProductStore().lastProduct.name }}</v-list-item-title>
                  </v-btn>
               </v-list-item>
               <v-divider />
               <v-list-item class="pa-0">
                  <v-btn
                     block
                     variant="text"
                     value="product"
                     to="/product"
                     prepend-icon="mdi-package-variant-closed"
                     :active=false
                  >
                     <v-list-item-title>
                        All Products
                     </v-list-item-title>
                  </v-btn>
               </v-list-item>
            </v-list>
         </v-menu>
      </v-app-bar-title>

      <template #append>
         <v-btn
            @click="toggleTheme"
            icon=""
         >
            <v-icon icon="mdi-theme-light-dark" />
            <v-tooltip
               activator="parent"
               location="bottom"
               open-delay="400"
            >{{ theme.global.name.value == 'light' ? 'Dark theme' : 'Light theme' }}</v-tooltip>
         </v-btn>
         <v-btn
            v-if="useUserStore().isLoggedIn"
            @click.stop="isConfirmLogoutDialogVisible = true"
            icon=""
         >
            <v-icon icon="mdi-logout" />
            <v-tooltip
               activator="parent"
               location="bottom"
               open-delay="400"
            >Log out</v-tooltip>
         </v-btn>
         <v-btn
            v-if="!useUserStore().isLoggedIn"
            @click.stop="handleSignIn"
            icon=""
         >
            <v-icon icon="mdi-login" />
            <v-tooltip
               activator="parent"
               location="bottom"
               open-delay="400"
            >Log in</v-tooltip>
         </v-btn>
         <v-avatar
            v-if="useUserStore().email"
            size="small"
            color="background"
         >
            <v-img :src=useUserStore().photoURL>
               <template #placeholder>
                  <span class="text-h5">
                     {{ useUserStore().email && useUserStore().email.charAt(0).toUpperCase() }}
                  </span>
               </template>
            </v-img>
            <v-tooltip
               activator="parent"
               location="bottom"
               open-delay="400"
            >{{ useUserStore().email }}</v-tooltip>
         </v-avatar>
      </template>
   </v-app-bar>

   <ConfirmLogoutDialog
      :visible="isConfirmLogoutDialogVisible"
      :onConfirm="handleSignOut"
      @close="isConfirmLogoutDialogVisible = false"
   />
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { ThemeInstance, useTheme } from 'vuetify'

import router from "@/router";
import { useProductStore } from '@/store/product_store'
import { usePreferenceStore } from '@/store/preference_store';
import { useUserStore } from '@/store/user_store';
import { useSnackbarStore } from '@/store/snackbar_store'
import ConfirmLogoutDialog from "@/components/confirmation/ConfirmLogoutDialog.vue";
// import { loadProducts } from '@/shared/product_shared'
import * as config from '@/config'

const isConfirmLogoutDialogVisible = ref<boolean>(false)
const theme: ThemeInstance = useTheme()

onMounted(() => {
   if (usePreferenceStore().theme)
      theme.global.name.value = usePreferenceStore().theme
   // if (!useProductStore().allProducts)
   //    loadProducts()
})

// function redirectIfEmptyWorkProduct() {
//    if (useProductStore().workProduct.id == 0)
//       router.push('/product')
// }

function toggleTheme() {
   theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
   usePreferenceStore().theme = theme.global.name.value
}

function onProductSelectedDropdown() {
   usePreferenceStore().idWorkProduct = useProductStore().lastProduct.id
   useProductStore().selectProduct(useProductStore().lastProduct)
}

function handleSignOut() {
   signOut(getAuth()).then(() => {
      // Sign-out successful.
      router.push('/login')
   }).catch((error) => {
      useSnackbarStore().showSnackbar('error', error.message)
   })
}

function handleSignIn() {
   router.push('/login')
}

function onLogoClicked() {
   window.open(config.logoRedirectUrl, '_self');
}

</script>
