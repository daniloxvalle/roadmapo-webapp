/**
 *        @file objective.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Objective Class
 * @description Defines the structure for Objective model
 */

import { shallowCopy } from "@/helpers";

export class Objective {
   public id: number = 0
   public id_product: number = 0
   public name: string = ''
   public color: string = randomColor()

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

}

function randomColor() {
   const index = Math.floor(Math.random() * colors.length)
   return colors[index]
}

/**
 * Colors from Vuetify Material design
 * https://vuetifyjs.com/en/styles/colors/
 */
const colors: string[] = [
   '#F44336', '#E91E63', '#9C27B0', '#673AB7',
   '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
   '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
   '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
   '#795548', '#607D8B', '#9E9E9E', '#000000',
]

export default Objective

/**
 * Colors from Material design
 * https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors
 */
// const colorsMd: string[] = [
//    "#F44336", // red 500
//    "#F06292", // pink 300
//    "#BA68C8", // purple 300
//    "#2196F3", // blue 500
//    "#4FC3F7", // light blue 300
//    "#00BCD4", // cyan 500
//    "#4DB6AC", // teal 300
//    "#4CAF50", // green 500
//    "#AED581", // light green 300
//    "#FFEB3B", // yellow 500
//    "#FF9800", // orange 500
//    "#FF8A65", // deep orange 300
//    "#A1887F", // brow 300
//    "#90A4AE", // blue grey 300
// ];

