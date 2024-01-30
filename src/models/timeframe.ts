/**
 *        @file timeframe.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Timeframe Class
 * @description Defines the structure for Timeframe model
 */

import { shallowCopy } from "@/helpers";

export class Timeframe {
   public id: number = 0
   public id_product: number = 0
   public name: string = ''
   public summary: string = ''
   public is_archived: boolean = false

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

}

export default Timeframe
