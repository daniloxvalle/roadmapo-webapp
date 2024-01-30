import { Timeframe } from "@/models/timeframe"
import { AxiosResponse } from "axios"
import CommonService from "@/services/common_service"
import { ApiResponse } from '@/typings/interface'

import { handleQuotes, shallowCopy } from "@/helpers";

const route = '/timeframe'

export class TimeframeService extends CommonService {

   public async getTimeframes(token: string, productId: number): Promise<Timeframe[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('/' + productId)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const timeframeList: Timeframe[] = Object.assign(apiResponse.data.result)
            return timeframeList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async getTimeframePublication(nanoid: string): Promise<Timeframe[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createPublicAxiosInstance(route + '/publication').get('/' + nanoid)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const timeframeList: Timeframe[] = Object.assign(apiResponse.data.result)
            return timeframeList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async addTimeframe(token: string, timeframe: Timeframe): Promise<number | string> {
      try {
         const newTimeframe: Timeframe = new Timeframe()
         shallowCopy(timeframe, newTimeframe)
         newTimeframe.name = handleQuotes(newTimeframe.name)
         newTimeframe.summary = handleQuotes(newTimeframe.summary)

         const data = JSON.stringify(newTimeframe)
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

   public async updateTimeframe(token: string, timeframe: Timeframe): Promise<number | string> {
      try {
         const newTimeframe: Timeframe = new Timeframe()
         shallowCopy(timeframe, newTimeframe)
         newTimeframe.name = handleQuotes(newTimeframe.name)
         newTimeframe.summary = handleQuotes(newTimeframe.summary)

         const data = JSON.stringify(newTimeframe)
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

   public async deleteTimeframe(token: string, idTimeframe: number): Promise<number | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).delete('/' + idTimeframe)
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

export default TimeframeService
