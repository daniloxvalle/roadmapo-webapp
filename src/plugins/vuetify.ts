/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */
import { customSvgIcons } from "@/components/icons/custom_svg_icons";

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components'

export default createVuetify({
   aliases: {
      VBtnAccent: VBtn,
   },
   defaults: {
      VBtn: {
         color: 'primary',
         //variant: 'outlined',
         //rounded: true,
      },
      VBtnAccent: {
         color: 'primary',
         variant: 'flat',
      },
      VTextField: {
         variant: 'outlined',
      },
      VTextarea: {
         variant: 'outlined',
      },
      VSwitch: {
         color: 'primary',
         inset: 'true',
      },
   },
   theme: {
      defaultTheme: 'dark',
      themes: {
         light: {
            colors: {
               primary: '#009688',
               background: '#FFFFFF',
               surface: "#F4F5F7",

               // primary: '#1867C0',
               // secondary: '#5CBBF6',
               // background: '#EEEEEE',
               // surface: "#FAFAFA",
            },
         },
         dark: {
            colors: {
               primary: '#00BFA5', // aqua green
               background: '#202020',
               surface: "#2D2E31",
            },
         },
      },
   },
   icons: {
      defaultSet: "mdi",
      sets: {
         custom: customSvgIcons,
      },
   },
})


/* colors: {
   background: "#15202b", -- Main view background
   surface: "#15202b",
   primary: "#3f51b5", -- Top and bottom bars
   secondary: "#03dac6", -- FAB buttom
   error: "#f44336",
   info: "#2196F3",
   success: "#4caf50",
   warning: "#fb8c00",
 },
*/
