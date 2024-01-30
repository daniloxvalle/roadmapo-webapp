/**
 *        @file Solution.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Solution Class
 * @description Defines the structure for Solution model
 */

import { shallowCopy } from "@/helpers";

export class Solution {
   public id: number = 0
   public id_product: number = 0
   public id_initiative: number = 0
   public id_solution_status: number = 1
   public id_parent_solution: number | null = null
   public name: string = ''
   public description: string = ''
   public is_parent: boolean = false
   public rank: string = '0|0i0000:'

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

}

export default Solution
