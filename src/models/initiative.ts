/**
 *        @file Initiative.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Initiative Class
 * @description Defines the structure for Initiative model
 */

import { shallowCopy } from "@/helpers";
import Objective from "@/models/objective";

export class Initiative {
   public id: number = 0
   public id_product: number = 0
   public id_parent_initiative: number | null = null
   public id_timeframe: number = 0
   public generation: number = 1
   public name: string = ''
   public description: string = ''
   public rank: string = '0|0i0000:'
   public objectives: Objective[] = []

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

}

export default Initiative
