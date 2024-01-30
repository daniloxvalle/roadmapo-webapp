import axios, { AxiosInstance } from "axios"
import * as config from '@/config'

class CommonService {

   public createAxiosInstance(route: string, token: string, data?: any) {
      const axiosInstance: AxiosInstance = axios.create({
         baseURL: config.apiBaseUrl + route,
         headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token,
         },
      })

      return axiosInstance
   }

   public createPublicAxiosInstance(route: string, data?: any) {
      const axiosInstance: AxiosInstance = axios.create({
         baseURL: config.apiBaseUrl + route,
         headers: {
            "Content-type": "application/json",
         },
      })

      return axiosInstance
   }

   public handleError(error: any): string {
      if (axios.isAxiosError(error) || error instanceof Error) {
         console.log('Error message: ', error.message)
         return error.message
      } else {
         console.log('Unexpected error: ' + error)
         return ('Unexpected error: ' + error)
      }
   }

}

export default CommonService
