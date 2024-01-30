<template>
   <v-dialog
      v-model="show"
      max-width="460px"
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5 text-wrap">Archiving</span>
               <v-spacer />
               <v-btn
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click.stop="show = false"
               />
            </v-row>
         </v-card-title>
         <v-card-text>
            <v-row>
               <v-col
                  cols="12"
                  class="text-wrap"
               >
                  <p class="mb-6">Your roadmap is divided into columns, these columns represent time frames.</p>
                  <p class="mb-6">Normally a roadmap is divided in months, quarters or semesters. You may also use the
                     now, next, later format, or any time frame of your choice.</p>
                  <p class="mb-6">You may archive a column, it allows you to hide it from your roadmap. Normally
                     you will do it after a time period is over.</p>
                  <p class="mb-6">To show or hide the archived time frames click this button
                     (<v-icon icon="mdi-archive-eye" />) at the top of the roadmap screen.
                  </p>
               </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions class="mr-4 mb-2">
            <v-spacer />
            <VBtnAccent
               class="text-none"
               prepend-icon="mdi-check"
               @click.stop="show = false"
            >Ok</VBtnAccent>

         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script lang="ts" setup>

import { computed } from "vue";

const emit = defineEmits(['close'])

const props = defineProps<{
   visible: boolean,
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
