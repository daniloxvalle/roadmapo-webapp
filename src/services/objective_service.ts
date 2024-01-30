import { Objective } from "@/models/objective";
import { AxiosResponse } from "axios";
import CommonService from "@/services/common_service";
import { ApiResponse } from '@/typings/interface'

import { handleQuotes, shallowCopy } from "@/helpers";

const route = '/objective'

export class ObjectiveService extends CommonService {

   public async getObjectives(token: string, idProduct: number): Promise<Objective[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('/' + idProduct)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const objectiveList: Objective[] = Object.assign(apiResponse.data.result)
            return objectiveList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async getObjectivesPublication(nanoid: string): Promise<Objective[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createPublicAxiosInstance(route + '/publication').get('/' + nanoid)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const objectiveList: Objective[] = Object.assign(apiResponse.data.result)
            return objectiveList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async addObjective(token: string, objective: Objective): Promise<number | string> {
      try {
         const newObjective: Objective = new Objective()
         shallowCopy(objective, newObjective)
         newObjective.name = handleQuotes(newObjective.name)

         const data = JSON.stringify(newObjective)
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

   public async updateObjective(token: string, objective: Objective): Promise<number | string> {
      try {
         const newObjective: Objective = new Objective()
         shallowCopy(objective, newObjective)
         newObjective.name = handleQuotes(newObjective.name)

         const data = JSON.stringify(newObjective)
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

   public async deleteObjective(token: string, idObjective: number): Promise<number | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).delete('/' + idObjective)
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

export default ObjectiveService
