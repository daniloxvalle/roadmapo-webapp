<template>
   <v-alert
      v-if="!useUserStore().isLoggedIn"
      type="info"
      title="Demo mode"
      class="ma-3"
      @click.stop="redirectToLogin()"
      style="cursor: pointer;"
   >Click here to sign in and earn six months of free access! Limited time offer.
   </v-alert>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user_store';
import router from '@/router';

function redirectToLogin() {
   router.push('/login')
}

</script>
