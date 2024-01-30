import { AppUser } from "@/models/app_user";
import axios, { AxiosResponse } from "axios";
import CommonService from "@/services/common_service";
import { ApiResponse } from '@/typings/interface'

const route = '/app-user'

export class AppUserService extends CommonService {

   public async addAppUser(appUser: AppUser, token: string): Promise<string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).post('/add', appUser)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.message)
            return apiResponse.data.message
         else if (!apiResponse.success && apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')
      } catch (error) {
         if (axios.isAxiosError(error) || error instanceof Error) {
            console.log('Error message: ', error.message)
            return error.message
         } else {
            console.log('Unexpected error: ' + error)
            return ('Unexpected error: ' + error)
         }
      }
   }

}

export default AppUserService
