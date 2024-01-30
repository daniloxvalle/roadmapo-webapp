/**
 *        @file product.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Product Class
 * @description Defines the structure for product model
 */

import { shallowCopy } from "@/helpers";

export class Product {
   public id: number = 0
   public name: string = ''
   public description: string = ''
   public vision: string = ''
   public count_initiative: number = 0
   public count_solution: number = 0

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

   // constructor(id: number, name: string, description: string, vision: string) {
   //    this.id = id
   //    this.name = name
   //    this.description = description
   //    this.vision = vision
   // }
}

export default Product
