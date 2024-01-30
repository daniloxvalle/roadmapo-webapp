<template>
   <v-navigation-drawer
      permanent
      :rail="rail"
      :width="170"
   >
      <!-- v-model="drawer" -->
      <v-list
         :key="componentKey"
         nav
      >
         <v-list-item
            rounded
            prepend-icon="mdi-package-variant-closed"
            title="Products"
            value="product"
            to="/product"
         />
         <v-list-item
            rounded
            prepend-icon="mdi-map-outline"
            title="Roadmap"
            value="roadmap"
            to="/roadmap"
         />
         <v-list-item
            id="navbar-publish"
            rounded
            prepend-icon="mdi-publish"
            title="Publications"
            value="publish"
            to="/publish"
         />
         <!-- <v-list-item
            rounded="xl"
            prepend-icon="mdi-family-tree"
            title="Solution Tree"
            value="ostree"
            to="/"
            exact
         />
         <v-list-item
            rounded="xl"
            prepend-icon="mdi-apps"
            title="User Story Map"
            value="usmap"
            to="/"
            exact
         />
         <v-list-item
            rounded="xl"
            prepend-icon="mdi-message-bulleted"
            title="Release Notes"
            value="release-notes"
            to="/"
            exact
         /> -->
         <v-row>
            <v-spacer></v-spacer>
            <v-btn
               size="small"
               elevation="0"
               @click.stop="rail = !rail"
               color="transparent"
               class="ma-1 mt-3"
            >
               <v-icon v-if="rail">mdi-chevron-double-right</v-icon>
               <v-icon v-else>mdi-chevron-double-left</v-icon>
            </v-btn>
         </v-row>
      </v-list>
      <template #append>
         <!-- <p class="text-center text-caption text-disabled pa-1">
            v 1.0.4
         </p> -->
         <div
            v-if="!rail"
            class="text-caption text-disabled ma-3 mb-2"
         >support@roadmapo.com</div>
      </template>
   </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify'

// import Product from '@/models/product';
// import { useProductStore } from '@/store/product_store'
const { name } = useDisplay()

const rail = ref(false);
// const drawer = ref(false);
const route = useRoute()
const componentKey = ref(0);

// onMounted(() => {
//    if (name.value == 'xs' || name.value == 'sm')
//       rail.value = true
// })

/**
 * Watch the selected product change
 */
// watch(() => useProductStore().workProduct, (newValue) => checkWorkProduct(newValue), { immediate: true })

/**
 * Watch the route value
 * Workaround to unmark the drawer links if the route is changed to Products in TopBar
 */
watch(route, (newValue, oldValue) => {
   if (newValue.path == "/product")
      componentKey.value += 1;
})

/**
 * Watch the display size change
 */
watch(name, (newValue) => {
   if (newValue == 'xs' || newValue == 'sm')
      rail.value = true
   else
      rail.value = false
})

/**
 * Check the selected product and hiddes the drawer if no product was selected
 */
// function checkWorkProduct(product: Product) {
//    if (product.name == '')
//       drawer.value = false
//    else
//       drawer.value = true
// }

</script>
