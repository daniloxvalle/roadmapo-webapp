/**
 *        @file publication.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Publication Class
 * @description Defines the structure for Publication model
 */

import { shallowCopy } from "@/helpers";

export class Publication {
   public id: number = 0
   public id_product: number = 0
   public nanoid: string = ''
   public name: string = ''
   public disclaimer: string = ''
   public theme: string = 'dark'
   public is_name_visible: boolean = true
   public is_vision_visible: boolean = true
   public is_solution_visible: boolean = true
   public is_objective_visible: boolean = true
   public is_disclaimer_visible: boolean = true

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

}

export default Publication
