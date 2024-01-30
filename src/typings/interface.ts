/**
 *        @file interface.ts
 *  @repository roadmapo-web-frontend
 * @application roadmapo-web-frontend
 *     @summary Interface Classes
 * @description Define various interfaces used accross Application
 *  @interfaces - ApiResponse
 */

export interface ApiResponse {
   success: boolean
   data: {
      message?: string
      result?: object[]
      id?: number
   }
   status?: number
}

interface OpenAIChoice {
   index: number
   message: {
      role: string
      content: string
   },
   finish_reason: string
}

export interface OpenAIApiResponse {
   id: string
   object: string
   created: number
   choices: OpenAIChoice[],
   usage: {
      prompt_tokens: number,
      completion_tokens: number,
      total_tokens: number
   }
   status?: number
}

export interface OpenAIInitiative {
   initiative_name: string
   objective_name: string
}
