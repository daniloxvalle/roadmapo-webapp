<template>
   <v-snackbar
      v-model="useSnackbarStore().isVisible"
      :color="useSnackbarStore().color"
      timeout="3000"
   >
      {{ useSnackbarStore().message }}
   </v-snackbar>
</template>

<script lang="ts" setup>

import { useSnackbarStore } from '@/store/snackbar_store'

</script>
