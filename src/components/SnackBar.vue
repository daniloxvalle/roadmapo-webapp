<template>
   <v-snackbar
      v-model="show"
      :color="color"
      timeout="4000"
   >
      {{ message }}
      <template #actions>
         <v-btn
            append-icon="mdi-close"
            @click="emit('close')"
            color="white"
         />
      </template>
   </v-snackbar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const emit = defineEmits(['close'])

const props = defineProps<{
   visible: boolean,
   message: string,
   color: string,
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

</script>
