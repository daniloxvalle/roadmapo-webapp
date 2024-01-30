import { Publication } from "@/models/publication"
import { AxiosResponse } from "axios"
import CommonService from "@/services/common_service"
import { ApiResponse } from '@/typings/interface'

import { handleQuotes, shallowCopy } from "@/helpers";

const route = '/publication'

export class PublicationService extends CommonService {

   public async getPublications(token: string, productId: number): Promise<Publication[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('/' + productId)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const publicationList: Publication[] = Object.assign(apiResponse.data.result)
            return publicationList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async getPublicationPublication(nanoid: string): Promise<Publication[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createPublicAxiosInstance(route + '/publication').get('/' + nanoid)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const publicationList: Publication[] = Object.assign(apiResponse.data.result)
            return publicationList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async addPublication(token: string, publication: Publication): Promise<number | string> {
      try {
         const newPublication: Publication = new Publication()
         shallowCopy(publication, newPublication)
         newPublication.name = handleQuotes(newPublication.name)
         newPublication.disclaimer = handleQuotes(newPublication.disclaimer)

         const data = JSON.stringify(newPublication)
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token, data).post('', data)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.id) {
            return apiResponse.data.id
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async updatePublication(token: string, publication: Publication): Promise<number | string> {
      try {
         const newPublication: Publication = new Publication()
         shallowCopy(publication, newPublication)
         newPublication.name = handleQuotes(newPublication.name)
         newPublication.disclaimer = handleQuotes(newPublication.disclaimer)

         const data = JSON.stringify(newPublication)
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token, data).put('', data)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.id) {
            return apiResponse.data.id
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async deletePublication(token: string, idPublication: number): Promise<number | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).delete('/' + idPublication)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.id) {
            return apiResponse.data.id
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

}

export default PublicationService
