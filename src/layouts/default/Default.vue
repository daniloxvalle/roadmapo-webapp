<template>
   <v-app>
      <default-bar />
      <default-drawer />
      <!-- Style to keep x scrollbar visible -->
      <v-main style="position: absolute; top: 0; left: 0; right:0; bottom:0; overflow-x: auto;">
         <router-view />
      </v-main>
   </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from '@/layouts/default/TopBar.vue'
import DefaultDrawer from '@/layouts/default/NavDrawer.vue'
</script>
