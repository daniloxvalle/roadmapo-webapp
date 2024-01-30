<template>
   <v-dialog
      v-model="show"
      max-width="460px"
   >
      <v-card class="pa-3">
         <v-card-title>
            <v-row class="ma-1">
               <span class="text-h5 text-wrap">Sharing a Roadmap</span>

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
                  <p class="mb-6">You can share your roadmaps in two ways:</p>
                  <p class="mb-6">1. Using a public link. Just copy and past the link below in your browser or share
                     it with
                     your team.</p>
                  <v-sheet
                     border
                     elevation="1"
                     class="text-body-2 pa-3 mb-3"
                     style="color:gray;"
                  >
                     {{ pathRoadmapLink + nanoid }}
                  </v-sheet>
                  <p class="mb-6 mt-10">2. Embedding a roadmap into your web page. To do that, simply
                     add
                     the
                     code below to your webpage HTML file.</p>
                  <v-sheet
                     border
                     elevation="1"
                     class="text-body-2 pa-3 mb-3"
                     style="color:gray;"
                  >
                     &lt;script src="{{ pathJsFile }}/roadmap-kanban.umd.js"&gt;&lt;/script&gt;
                     &lt;roadmap-kanban n="{{ props.nanoid }}"&gt;&lt;/roadmap-kanban&gt;
                  </v-sheet>
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
   nanoid: string,
   pathRoadmapLink: string,
   pathJsFile: string,
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
