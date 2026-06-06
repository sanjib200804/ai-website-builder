import dotenv from 'dotenv'
dotenv.config()

import { generateWithGemini } from './aiModel.js'

export const generateResponse = async (prompt, retryCount = 0) => {
  try {
    let code = await generateWithGemini(prompt)

    // Retry logic with a cap to prevent infinite recursion
    if ((!code || code.length < 500) && retryCount < 2) {
      console.log('Retrying AI...')
      return await generateResponse(prompt, retryCount + 1)
    }
    return code
  } catch (err) {
    console.error(err)
    throw new Error('AI build failed')
  }
}
