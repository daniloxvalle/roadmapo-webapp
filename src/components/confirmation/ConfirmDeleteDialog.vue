<template>
   <v-dialog
      v-model="show"
      max-width="360px"
   >
      <v-card class="pa-2">
         <v-card-text class="mb-3 mt-3">
            Are you sure you want to delete?
         </v-card-text>
         <v-card-actions class="ma-1">
            <v-spacer />
            <VBtnAccent
               class="text-none"
               prepend-icon="mdi-delete"
               @click.stop="onConfirm"
            >Delete</VBtnAccent>
            <v-btn
               border
               flat
               class="text-none"
               prepend-icon="mdi-close"
               @click.stop="show = false"
            >Cancel</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>
 
<script lang="ts" setup>

import { computed } from "vue";

const emit = defineEmits(['close'])

const props = defineProps<{
   visible: boolean,
   onConfirm: any,
}>()

const show = computed({
   get() {
      return props.visible
   },
   set(value) {
      if (!value) {
         emit('close')
      }
   }
})

function onConfirm() {
   props.onConfirm()
   emit('close')
}

</script>
