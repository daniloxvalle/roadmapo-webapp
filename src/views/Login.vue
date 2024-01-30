<template >
   <v-container class="d-flex justify-center">
      <v-card
         width="330px"
         class="pa-2"
      >
         <v-card-title>

            <v-layout class="pa-2">
               <v-spacer />
               <v-img
                  height="40"
                  src="@/assets/logo/spyglass_round.png"
               />
               <v-spacer />
            </v-layout>

            <v-layout class="pa-2">
               <v-spacer />
               {{ isRegisterPage ? 'Create account' : 'Log in' }}
               <v-spacer />
            </v-layout>

         </v-card-title>

         <v-card-text>

            <v-form
               fast-fail
               @submit.prevent="onSubmit"
            >
               <!-- v-model="isFormValid" -->
               <v-text-field
                  v-model="username"
                  :rules="[validation.required, validation.email]"
                  variant="outlined"
                  label="e-mail"
                  class="mb-3"
               />

               <v-text-field
                  v-model="password"
                  :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :rules="[validation.required, validation.min]"
                  variant="outlined"
                  label="password"
                  class="mb-3"
               />

               <v-layout class="mt-n1">
                  <v-spacer />
                  <v-btn
                     @click="forgotPassword"
                     v-if="!isRegisterPage"
                     size="small"
                     variant="text"
                     class="text-none pa-0 ma-0"
                  >Forgot Password?</v-btn>
               </v-layout>
               <!-- :disabled="!isFormValid" -->

               <v-btn
                  type="submit"
                  block
                  class="mt-4"
                  :loading="useLoadingStore().isLoading"
               >
                  <!-- {{ isRegisterPage ? 'Sign up' : 'Log in' }} -->
                  Continue
               </v-btn>

            </v-form>

            <v-container
               @click="signInWithGoogle"
               class="mt-4 rounded cursor-pointer"
               style="background-color:white"
            >
               <v-row style="cursor: pointer">
                  <v-spacer />
                  <v-img
                     height="22px"
                     src="@/assets/google-logo/g-logo.png"
                     class="ma-1"
                  >
                  </v-img>
                  <span
                     class="pa-1 mr-2"
                     style="display: inline-block; vertical-align: middle; padding-left: 42px; padding-right: 42px; font-size: 14px; font-weight: bold; color: #0000008A;"
                  >
                     Sign in with Google
                  </span>
                  <v-spacer />
               </v-row>
            </v-container>

            <v-btn
               @click='togglePage'
               variant="text"
               block
               class="text-none mt-4"
            >
               {{ isRegisterPage ? 'Have an account? Log in' : "Don't have an account? Sign in" }}
            </v-btn>

         </v-card-text>

      </v-card>

   </v-container>

   <v-container class="text-center mt-3">
      <p class="text-button text-center ma-3">OR</p>
      <v-btn
         @click='redirectToProductPage'
         class="text-none"
         width="160px"
         color="info"
      >
         Try demo
      </v-btn>
   </v-container>
</template> 

<script lang="ts" setup>

import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"

import { validation } from '@/helpers'
import AuthService from '@/services/auth_service'
import router from '@/router'
import { useLoadingStore } from '@/store/loading_store'

const isRegisterPage = ref(true)
const username = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
// const isFormValid = ref(false)
const auth = getAuth();

function redirectToProductPage() {
   router.push('/product')
}

onMounted(() => {
   onAuthStateChanged(auth, (user) => {
      if (user) {
         redirectToProductPage()
      }
   });
})

function togglePage() {
   isRegisterPage.value = !isRegisterPage.value
}

function onSubmit() {
   if (isRegisterPage.value)
      register()
   else login()
}

function login() {
   const authService: AuthService = new AuthService
   authService.login(username.value, password.value)
}

function register() {
   const authService: AuthService = new AuthService
   authService.register(username.value, password.value)
}

function signInWithGoogle() {
   const authService: AuthService = new AuthService
   authService.signInWithGoogle()
}

function forgotPassword() {
   const authService: AuthService = new AuthService
   authService.forgotPassword(username.value)
}

</script>
