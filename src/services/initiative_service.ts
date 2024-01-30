import { Initiative } from "@/models/initiative";
import { AxiosResponse } from "axios";
import CommonService from "@/services/common_service";
import { ApiResponse } from '@/typings/interface'

import { handleQuotes, shallowCopy } from "@/helpers";

const route = '/initiative'

export class InitiativeService extends CommonService {

   public async getInitiatives(token: string, idProduct: number): Promise<Initiative[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('/' + idProduct)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const initiativeList: Initiative[] = Object.assign(apiResponse.data.result)
            return initiativeList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async getInitiativesPublication(nanoid: string): Promise<Initiative[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createPublicAxiosInstance(route + '/publication').get('/' + nanoid)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const initiativeList: Initiative[] = Object.assign(apiResponse.data.result)
            return initiativeList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async addInitiative(token: string, initiative: Initiative): Promise<number | string> {
      try {
         const newInitiative: Initiative = new Initiative()
         shallowCopy(initiative, newInitiative)
         newInitiative.name = handleQuotes(newInitiative.name)
         newInitiative.description = handleQuotes(newInitiative.description)

         const data = JSON.stringify(newInitiative)
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

   public async updateInitiative(token: string, initiative: Initiative): Promise<number | string> {
      try {
         const newInitiative: Initiative = new Initiative()
         shallowCopy(initiative, newInitiative)
         newInitiative.name = handleQuotes(newInitiative.name)
         newInitiative.description = handleQuotes(newInitiative.description)

         const data = JSON.stringify(newInitiative)
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

   public async deleteInitiative(token: string, idInitiative: number): Promise<number | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).delete('/' + idInitiative)
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

   public async generateNameAI(token: string, idProduct: number): Promise<object | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('/gen-name-ai/' + idProduct)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data) {
            return apiResponse.data
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async generateDescriptionAI(token: string, initiative: Initiative): Promise<object | string> {
      try {
         const newInitiative: Initiative = new Initiative()
         shallowCopy(initiative, newInitiative)
         newInitiative.name = handleQuotes(newInitiative.name)
         newInitiative.description = handleQuotes(newInitiative.description)

         const data = JSON.stringify(newInitiative)
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route + '/gen-description-ai', token).post('', data)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data) {
            return apiResponse.data
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

export default InitiativeService
