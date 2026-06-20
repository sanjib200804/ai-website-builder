import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
dotenv.config()

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})

// ===========================================================================Using OpenAi=============================================================================================
export async function generateWithOpenai(prompt) {
  const maxRetries = 3

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await openAi.responses.create({
        model: 'gpt-5.5',
        input: prompt
      })

      return response.output_text
    } catch (error) {
      if (error.status === 503 && i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }

      throw error
    }
  }
}

//================================================================================Gemini=================================================================================================

export async function generateWithGemini(prompt) {
  const maxRetries = 3

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      })

      return response.text
    } catch (error) {
      if (error.status === 503 && i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }

      throw error
    }
  }
}

/*=======================================================================================DeepSeek====================================================================================*/
export async function generateWithDeepSeek(prompt) {
  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert full-stack developer. Generate production-ready code.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 8000
  })

  return response.choices[0].message.content
}
