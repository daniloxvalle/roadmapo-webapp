/**
 *        @file app_user.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary AppUser Class
 * @description Defines the structure for AppUser model
 */

import { shallowCopy } from "@/helpers"

export class AppUser {
   public id: number = 0
   public username: string = ''
   public uid_firebase: string = ''

   constructor(model?: any) {
      if (model) {
         shallowCopy(model, this)
      }
   }

}

export default AppUser
