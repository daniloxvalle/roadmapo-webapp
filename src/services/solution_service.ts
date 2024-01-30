import { Solution } from "@/models/solution";
import { AxiosResponse } from "axios";
import CommonService from "@/services/common_service";
import { ApiResponse } from '@/typings/interface'

import { handleQuotes, shallowCopy } from "@/helpers";

const route = '/solution'

export class SolutionService extends CommonService {

   public async getSolutions(token: string, idProduct: number): Promise<Solution[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('/' + idProduct)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const solutionList: Solution[] = Object.assign(apiResponse.data.result)
            return solutionList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async getSolutionsPublication(nanoid: string): Promise<Solution[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createPublicAxiosInstance(route + '/publication').get('/' + nanoid)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const solutionList: Solution[] = Object.assign(apiResponse.data.result)
            return solutionList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async addSolution(token: string, solution: Solution): Promise<number | string> {
      try {
         const newSolution: Solution = new Solution()
         shallowCopy(solution, newSolution)
         newSolution.name = handleQuotes(newSolution.name)
         newSolution.description = handleQuotes(newSolution.description)

         const data = JSON.stringify(newSolution)
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

   public async updateSolution(token: string, solution: Solution): Promise<number | string> {
      try {
         const newSolution: Solution = new Solution()
         shallowCopy(solution, newSolution)
         newSolution.name = handleQuotes(newSolution.name)
         newSolution.description = handleQuotes(newSolution.description)

         const data = JSON.stringify(newSolution)
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

   public async deleteSolution(token: string, idSolution: number): Promise<number | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).delete('/' + idSolution)
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

   public async generateNameAI(token: string, idInitiative: number): Promise<object | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route + '/gen-name-ai', token).get('/' + idInitiative)
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

   public async generateDescriptionAI(token: string, name: string): Promise<object | string> {
      try {
         const data = JSON.stringify({ "name": name })

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

export default SolutionService
