import { Product } from "@/models/product";
import { AxiosResponse } from "axios";
import CommonService from "@/services/common_service";
import { ApiResponse } from '@/typings/interface'

import { handleQuotes, shallowCopy } from "@/helpers";

const route = '/product'

export class ProductService extends CommonService {

   public async getProductPublication(nanoid: string): Promise<Product[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createPublicAxiosInstance(route + '/publication').get('/' + nanoid)
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const productList: Product[] = Object.assign(apiResponse.data.result)
            return productList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async getProducts(token: string): Promise<Product[] | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).get('')
         const apiResponse: ApiResponse = Object.assign(axiosResponse.data)

         if (apiResponse.success && apiResponse.data.result) {
            const productList: Product[] = Object.assign(apiResponse.data.result)
            return productList
         }
         else if (apiResponse.data.message)
            throw new Error(apiResponse.data.message)
         else
            throw new Error('The API response data is empty')

      } catch (error) {
         return this.handleError(error)
      }
   }

   public async addProduct(token: string, product: Product): Promise<number | string> {
      try {
         const newProduct: Product = new Product()
         shallowCopy(product, newProduct)
         newProduct.name = handleQuotes(newProduct.name)
         newProduct.vision = handleQuotes(newProduct.vision)
         newProduct.description = handleQuotes(newProduct.description)

         const data = JSON.stringify(newProduct)
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

   public async updateProduct(token: string, product: Product): Promise<number | string> {
      try {
         const newProduct: Product = new Product()
         shallowCopy(product, newProduct)
         newProduct.name = handleQuotes(newProduct.name)
         newProduct.vision = handleQuotes(newProduct.vision)
         newProduct.description = handleQuotes(newProduct.description)

         const data = JSON.stringify(newProduct)
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

   public async deleteProduct(token: string, idProduct: number): Promise<number | string> {
      try {
         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route, token).delete('/' + idProduct)
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

   public async generateVisionAI(token: string, product: Product): Promise<object | string> {
      try {
         const data = JSON.stringify(product)

         const axiosResponse: AxiosResponse = await this.createAxiosInstance(route + '/gen-vision-ai', token).post('', data)
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

   public async generateDescriptionAI(token: string, product: Product): Promise<object | string> {
      try {
         const data = JSON.stringify(product)

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

export default ProductService
